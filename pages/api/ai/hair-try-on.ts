import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb",
    },
  },
};

type HairTryOnRequestBody = {
  faceImageBase64?: string;
  faceImageMimeType?: string;
  productImageUrl?: string;
  productImageUrls?: string[];
  productName?: string;
  productTag?: string;
  productDescription?: string;
  hairStatus?: string;
  haircutStyle?: string;
  hairlineStyle?: string;
  hairDensity?: string;
  hairStyling?: string;
  hairColor?: string;
  viewAngle?: string;
};

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is required.");
  }
  return apiKey;
}

function getBaseUrl(req: NextApiRequest) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || "http";
  const host = req.headers.host || "localhost:3000";
  return `${protocol}://${host}`;
}

function resolveImageUrl(url: string, req: NextApiRequest) {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error("productImageUrl is required.");
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  return new URL(trimmed, getBaseUrl(req)).toString();
}

async function fetchImageAsBase64(url: string, req: NextApiRequest) {
  const resolvedUrl = resolveImageUrl(url, req);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response: Response;

  try {
    response = await fetch(resolvedUrl, {
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err) {
    throw new Error("Failed to fetch product image.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error("Could not fetch product image.");
  }
  const rawType = response.headers.get("content-type") || "";
  const contentType = rawType.startsWith("image/") ? rawType : "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();
  return { mimeType: contentType, imageBytes: toBase64(arrayBuffer) };
}

function prioritizeReferenceImages(urls: string[]) {
  return [...urls].sort((a, b) => {
    const score = (url: string) => {
      const u = url.toLowerCase();

      if (/(model|mannequin|front|angle|look|style)/.test(u)) return 4;

      // filenames like 1.jpg / img1 often primary
      if (/(^|\/)(1|img1|primary|main)(\.|_|-)/.test(u)) return 3;

      // deprioritize bad ones harder
      if (/(base|lace|inside|cap|back|bottom)/.test(u)) return 0;

      return 2;
    };

    return score(b) - score(a);
  });
}

async function fetchProductReferenceImages(
  primaryUrl: string,
  additionalUrls: string[] | undefined,
  req: NextApiRequest
) {
  const urls = [primaryUrl, ...(additionalUrls || [])]
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter(Boolean);

  const prioritized = prioritizeReferenceImages(Array.from(new Set(urls)));

  // ✅ LIMIT TO 2 (reduces AI confusion massively)
  const finalUrls = prioritized.slice(0, 2);
  if (finalUrls.length === 0) {
    throw new Error("No valid product images found.");
  }

  const images = await Promise.all(finalUrls.map((url) => fetchImageAsBase64(url, req)));
  return images;
}

function extractInlineImage(response: any) {
  const candidates = response?.candidates || [];
  for (const candidate of candidates) {
    for (const part of candidate?.content?.parts || []) {
      const data = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || "image/png";
      if (data && String(mimeType).startsWith("image/")) {
        return { data, mimeType };
      }
    }
  }
  return null;
}

async function parseJsonSafely(response: Response) {
  const raw = await response.text();
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("AI provider returned a non-JSON response.");
  }
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function inferProductType(productName: string, productTag: string, productDescription: string) {
  const text = `${productName} ${productTag} ${productDescription}`.toLowerCase();

  if (/(extension|extensions|clip[- ]?in|clip in|tape[- ]?in|weft|volumizer)/.test(text)) {
    return "extension";
  }

  if (/(wig|frontal|closure|full cap|full wig)/.test(text)) {
    return "wig";
  }

  if (/(patch|hair patch|toupee|topper|system|hair system)/.test(text)) {
    return "hair patch";
  }

  return "hair replacement";
}

function describeCutStyle(haircutStyle: string): string {
  const map: Record<string, string> = {
    // Legacy IDs (kept for backward compatibility)
    default:         "Keep the hair style exactly as shown in the product reference image.",
    short_clean:     "Show hair trimmed very short (1–3 cm), neat and clean.",
    crew_cut:        "Classic crew cut: short on sides and back, slightly longer on top, very uniform.",
    medium_natural:  "Medium-length natural style (4–6 cm), flowing naturally with the head shape.",
    textured_layers: "Textured layered style — visible layers, natural volume, defined texture.",
    slick_back:      "All hair swept smoothly back from the forehead — polished, formal look.",
    side_part:       "Classic side-parted style — combed neatly to one side with a visible part line.",
    // New haircut styles
    classic_crew_cut:
      "Apply a CLASSIC CREW CUT: uniform short length all over (1–3 cm), slightly more length on top (2–3 cm). Very clean, neat, and conservative. Sides and back closely clipped and blended smoothly.",
    mid_fade_side_part:
      "Apply a MID FADE WITH SIDE PART: the hair fades from skin/very short at the lower sides up to medium length on top (4–6 cm). A clean, defined part line combs the top hair neatly to one side. The fade is at mid-ear level.",
    textured_crop:
      "Apply a TEXTURED CROP: short sides (faded or clipped), with the top cut to 3–4 cm and styled with natural texture and slight forward fringe direction. The top has visible texture and movement rather than being slick.",
    slicked_back_undercut:
      "Apply a SLICKED-BACK UNDERCUT: a clearly disconnected undercut on the sides (skin fade or closely clipped), with the top hair — of medium-long length — swept fully backward and slicked smooth. Formal and polished appearance.",
    side_brushed_pompadour:
      "Apply a SIDE-BRUSHED POMPADOUR: significant height and volume at the front, with all hair swept and brushed to one side in a classic pompadour shape. The sides are shorter, the top is voluminous and swept laterally.",
    modern_quiff:
      "Apply a MODERN QUIFF: substantial volume and height at the front of the head, swept upward and slightly backward. Short to medium sides. The quiff should be clearly voluminous and three-dimensional — a contemporary, stylish look.",
    taper_fade_natural:
      "Apply a TAPER FADE WITH NATURAL TEXTURE: a gradual taper fade on the sides (longest at the temples, fading to shorter at the nape). The top hair is kept at medium length showing its natural texture and flow — no product styling, just natural hair movement.",
    hard_part_combover:
      "Apply a HARD PART COMB-OVER: a razor-sharp, deeply defined part line etched precisely into the hair on one side. The longer top hair (4–6 cm) is combed over to the opposite side with clean definition. Sharp, precise, and modern.",
    buzz_cut_minimalist:
      "Apply a BUZZ CUT: uniformly very short hair (1–3 mm) all over the head. Clean, minimal, structured silhouette. No tapering or fading — consistent very short length from front to back and sides.",
    curly_short:
      "Apply SHORT CURLY HAIR: natural tight-to-medium curls cut short (5–8 cm). The curls spring close to the head with a clearly defined curl pattern — coils or loose spirals. Sides slightly tapered; the top and front show bouncy, defined, voluminous short curls. Do NOT straighten or flatten — the texture must be visibly curly throughout.",
    curly_long:
      "Apply LONG CURLY HAIR: natural flowing curls at medium-to-long length (14–20 cm). Curls cascade from the crown down the sides and front with full volume and a clearly visible curl pattern. The hair should look bouncy, lush, and naturally textured — loose spirals or big waves. Do NOT straighten — preserve the curl definition and length throughout.",
  };
  return map[haircutStyle] || map["classic_crew_cut"];
}

function describeHairline(hairlineStyle: string): string {
  const map: Record<string, string> = {
    natural: "Hairline should be soft and graduated — a natural-looking gradual transition, not a hard edge.",
    sharp:   "Hairline should be crisp and sharply defined — a very clean, precise front edge, like a freshly groomed patch.",
    m_shape: "Hairline should have a slight M-shape — minimal recession at the temples giving a mature, realistic look.",
  };
  return map[hairlineStyle] || map["natural"];
}

function describeDensity(hairDensity: string): string {
  const map: Record<string, string> = {
    light:  "Hair density should appear light and sparse — thin coverage, some scalp may subtly show through.",
    medium: "Hair density should appear natural and medium — balanced coverage, looks like healthy natural hair.",
    full:   "Hair density should appear full and thick — maximum coverage, lush and dense throughout.",
  };
  return map[hairDensity] || map["medium"];
}

function describeStyling(hairStyling: string): string {
  const map: Record<string, string> = {
    natural_flow: "Hair should flow naturally following the head's contour — no strong part or directional styling.",
    left_part:    "Hair should be clearly parted on the LEFT side — combed from a left-side part line.",
    right_part:   "Hair should be clearly parted on the RIGHT side — combed from a right-side part line.",
    center_part:  "Hair should be parted directly in the CENTER — flowing symmetrically to both sides.",
    combed_back:  "All hair should be swept straight back — no part line, hair goes from forehead toward the back of the head.",
    messy:        "Hair should appear casual and tousled — slightly messy, textured, relaxed everyday look.",
  };
  return map[hairStyling] || map["natural_flow"];
}

function describeViewAngle(viewAngle: string): string {
  const map: Record<string, string> = {
    front:      "FRONT VIEW: Show the person looking straight at the camera. Standard portrait angle.",
    left_side:  "LEFT SIDE PROFILE VIEW: The person is turned so they face to the LEFT. Show the complete left-side profile of the head, face, and hair. The right side of the face should not be visible. Infer the left-side appearance from the front photo provided.",
    right_side: "RIGHT SIDE PROFILE VIEW: The person is turned so they face to the RIGHT. Show the complete right-side profile of the head, face, and hair. The left side of the face should not be visible. Infer the right-side appearance from the front photo provided.",
    back:       "BACK VIEW (REAR): Show the BACK of the person's head. The face is NOT visible — only the back and top of the head with the hair product applied. Focus on how the hair looks from behind — the neckline, the back of the patch, and the overall shape.",
  };
  return map[viewAngle] || map["front"];
}

function describeHairColor(hairColor: string): string {
  const map: Record<string, string> = {
    natural_black: "The hair color MUST be NATURAL BLACK (#0D0D0D) — deep, dark black throughout. No brown, no warm tones.",
    dark_brown:    "The hair color MUST be DARK BROWN — very deep brown, almost black but with visible warm brown undertones.",
    medium_brown:  "The hair color MUST be MEDIUM BROWN — a classic rich brown, clearly brown not black.",
    light_brown:   "The hair color MUST be LIGHT BROWN — a warm, lighter shade of brown with golden undertones.",
    blonde:        "The hair color MUST be BLONDE — a warm golden-blonde shade throughout.",
    grey:          "The hair color MUST be GREY / SALT & PEPPER — a mix of white and grey strands, mature look.",
    auto:          "",
  };
  return map[hairColor] || "";
}

function buildHairPrompt(
  productName: string,
  productTag: string,
  productDescription: string,
  hairStatus: string,
  haircutStyle: string = "default",
  hairlineStyle: string = "natural",
  hairDensity: string = "medium",
  hairStyling: string = "natural_flow",
  hairColor: string = "auto",
  viewAngle: string = "front"
) {
  const cleanName = stripHtml(productName || "").trim();
  const cleanTag = stripHtml(productTag || "").trim();
  const cleanDescription = stripHtml(productDescription || "").slice(0, 500);
  const productType = inferProductType(cleanName, cleanTag, cleanDescription);
  const normalizedHairStatus =
    hairStatus === "bald_or_thinning" ? "bald or thinning" : "already has hair";

  const productContext = [
    cleanName ? `Product name: ${cleanName}` : "",
    cleanTag && cleanTag !== "null" ? `Product tag: ${cleanTag}` : "",
    cleanDescription ? `Product details: ${cleanDescription}` : "",
    `Detected product type: ${productType}`,
    `User hair situation: ${normalizedHairStatus}`,
  ]
    .filter(Boolean)
    .join("\n");

  const isExtension = productType === "extension";

  const userHairInstructions = isExtension
    ? hairStatus === "bald_or_thinning"
      ? `The user has sparse hair. Clip the extension onto the existing hair strands as highlights/streaks. Do NOT replace all hair — only add the extension color as visible highlighted sections.`
      : `The user already has hair. KEEP all original hair intact. ADD the extension as highlighted streaks or sections blended into the existing hair. The extension should be visible as a partial color accent — NOT a full replacement. Original hair must still be visible alongside the extension color.`
    : hairStatus === "bald_or_thinning"
      ? `The user is bald or thinning. Fully cover the scalp with the product hair.`
      : `The user has hair. AGGRESSIVELY REMOVE the existing top hair and fully replace it. No blending. No original top hair visible.`;

  const typeSpecificInstructions = {
    extension: `This is a CLIP-IN HAIR EXTENSION. Rules:
- DO NOT replace all the person's hair with the extension color.
- ADD the extension as highlighted streaks/sections on top of or alongside the existing hair.
- The extension should appear clipped into specific sections — typically the sides, underneath layers, or tips — matching how clip-in extensions are actually worn.
- Keep the person's original hair visible. The result should look like natural hair with colored highlight sections added.
- Match the extension's exact color (e.g. purple, blonde, red) in the highlighted sections only.
- The extension should look naturally blended where it meets the existing hair, not like a separate wig or overlay.`,
    wig: `Fully replace all hair with the wig. No original hair visible.`,
    "hair patch": `Apply patch ONLY on top/crown. Replace top completely. Keep sides.`,
    "hair replacement": `Replace top area fully with product style.`,
  }[productType];

  const hasSpecificCutStyle = haircutStyle && haircutStyle !== "default";

  const baseTransformationRules = isExtension
    ? `MANDATORY TRANSFORMATION RULES (EXTENSION):
1. KEEP the person's original hair completely intact.
2. ADD the extension color as highlighted streaks/sections in specific parts of the hair (sides, underneath, tips).
3. The extension color from IMAGE 2 MUST be clearly visible as highlights — if it's purple, there MUST be obvious purple streaks in the hair.
4. Do NOT color the entire hair — only the extension sections should show the new color.
5. The highlighted sections should follow the natural flow/direction of the person's hair.
6. Blend the extension edges naturally so they look clipped in, not pasted on.
7. Result must look REAL — like the person just had clip-in extensions professionally applied.`
    : hasSpecificCutStyle
    ? `MANDATORY TRANSFORMATION RULES:
1. COMPLETELY REMOVE the user's original top hair.
2. APPLY the haircut style described in the HAIRCUT STYLE section below — this is the ONLY style guide you must follow.
3. USE IMAGE 2 ONLY FOR: hair color/shade, texture quality, and density — NOT for shape or silhouette.
4. The final shape, length, and structure MUST match the HAIRCUT STYLE text description — ignore the shape shown in IMAGE 2.
5. REMOVE all visible black/dark original hair from the top area.
6. Ensure natural blending at the edges where new hair meets the sides.
7. Result must look REAL and professionally fitted.`
    : `MANDATORY TRANSFORMATION RULES:
1. COMPLETELY REMOVE the user's original top hair.
2. APPLY the EXACT hairstyle from IMAGE 2.
3. EXACT STYLE TRANSFER:
- Copy the hairstyle shape from IMAGE 2 precisely
- Match the front hairline, lift, direction, and silhouette
- The outline of the hair must match the reference
- Replicate the hairstyle shape as closely as possible while adapting it naturally to the person's head.
4. REMOVE all visible black/dark original hair from top area.
5. Do not leave original top hair visible, but ensure natural blending at edges with new hair.
6. The transition into the sides/back must look natural and seamless.
7. Result must look REAL and professionally fitted.`;

  const selectedColorDesc = describeHairColor(hairColor);
  const colorRule = isExtension
    ? `CRITICAL COLOR RULE:
- Extension color MUST match IMAGE 2 exactly (e.g. purple → clearly purple streaks in the hair)
- Only the extension sections change color — original hair keeps its natural color`
    : selectedColorDesc
    ? `CRITICAL COLOR RULE — USER SELECTED COLOR (HIGHEST PRIORITY):
⚠️ ${selectedColorDesc}
- IGNORE the color visible in IMAGE 2 — the user has explicitly chosen a color.
- The entire hair must render in the chosen color. No exceptions.`
    : `CRITICAL COLOR RULE:
- Match the hair color EXACTLY as shown in IMAGE 2.
- NEVER substitute a different color — if the product is black, output must be black; if brown, output must be brown.`;

  const cutDesc     = describeCutStyle(haircutStyle);
  const lineDesc    = describeHairline(hairlineStyle);
  const densityDesc = describeDensity(hairDensity);
  const stylingDesc = describeStyling(hairStyling);
  const angleDesc   = describeViewAngle(viewAngle);

  return `You are a professional AI hair try-on system.

⚠️ ABSOLUTE RULE — FACE IDENTITY LOCK:
The person's face in the output MUST be IDENTICAL to IMAGE 1.
- Same facial features: eyes, nose, lips, ears, jaw, chin, cheekbones — pixel-for-pixel match
- Same skin tone and complexion — no lightening, darkening, or color shift
- Same age appearance — do not make the person look younger or older
- Same face shape — do not reshape, slim, or alter the face geometry
- ONLY the hair region changes — everything below the hairline stays completely untouched
- If you cannot keep the face identical, output nothing rather than altering the face

⚠️ HARD RULE: The output MUST show a CLEAR and OBVIOUS hairstyle transformation.

IMAGE ROLES:
- IMAGE 1 = USER FACE (identity source — face must not change at all)
- IMAGE 2 = HAIR PRODUCT REFERENCE (color, texture, density only)
- Any additional images = structure/reference only (ignore for style)

PRODUCT:
${productContext}

${baseTransformationRules}

${colorRule}

FITTING:
${typeSpecificInstructions}
${userHairInstructions}

HAIRCUT STYLE (⚠️ HIGHEST PRIORITY — follow this exactly, override IMAGE 2 shape):
${cutDesc}

HAIRLINE STYLE:
${lineDesc}

HAIR DENSITY:
${densityDesc}

HAIR STYLING / PARTING DIRECTION:
${stylingDesc}

VIEW ANGLE (CRITICAL — follow exactly):
${angleDesc}

OUTPUT:
- ONE realistic final image showing the requested VIEW ANGLE
- NO text, NO watermark
- MUST look like real person wearing product
- Face must be indistinguishable from IMAGE 1 — only the hair is different

FINAL CHECK:
1. Is the face 100% identical to IMAGE 1? If not, regenerate.
2. Is the haircut style clearly visible and matching the description? If not, regenerate.`;
}

const DEFAULT_GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
const LEGACY_GEMINI_IMAGE_MODELS = new Set(["gemini-2.0-flash-exp"]);

function resolveImageModel() {
  const configuredModel = (process.env.GEMINI_IMAGE_MODEL || "").trim().replace(/^models\//, "");
  if (!configuredModel || LEGACY_GEMINI_IMAGE_MODELS.has(configuredModel)) {
    return DEFAULT_GEMINI_IMAGE_MODEL;
  }
  return configuredModel;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message || "Unknown AI generation error";
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  return "Unknown AI generation error";
}

function mapProviderMessage(providerMessage: string, imageModel: string) {
  const normalized = providerMessage.toLowerCase();

  if (imageModel.startsWith("imagen-")) {
    return {
      status: 400,
      message:
        "This route performs a two-image try-on edit. Imagen generate models are text-to-image only here, so they cannot be used as a drop-in replacement. Use a billed Gemini image model or move this feature to Vertex AI image editing / virtual try-on.",
    };
  }

  if (normalized.includes("quota exceeded") || normalized.includes("current quota")) {
    return {
      status: 429,
      message:
        "Virtual Hair Try-On is unavailable right now because this project has no Gemini image-editing quota. Please enable billing or add paid quota.",
    };
  }

  if (normalized.includes("not found for api version") || normalized.includes("not supported for generatecontent")) {
    return {
      status: 400,
      message:
        `The configured model "${imageModel}" is not available for this Gemini generateContent image-edit request. Use a supported billed Gemini image model, or move this feature to Vertex AI.`,
    };
  }

  if (
    normalized.includes("unable to process input image") ||
    normalized.includes("process input image") ||
    normalized.includes("invalid image") ||
    normalized.includes("image_url") ||
    normalized.includes("could not process")
  ) {
    return {
      status: 422,
      message:
        "AI could not process your photo. Tips: use a well-lit, front-facing photo with a plain background, avoid sunglasses or hats, and make sure your face is clearly visible. Then try again.",
    };
  }

  if (normalized.includes("safety") || normalized.includes("blocked") || normalized.includes("harm")) {
    return {
      status: 422,
      message: "The image was blocked by the AI safety filter. Please use a different, clearly visible face photo and try again.",
    };
  }

  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body = (req.body || {}) as HairTryOnRequestBody;
    const {
      faceImageBase64,
      productImageUrl,
      productImageUrls,
      productName,
      productTag,
      productDescription,
      hairStatus,
      haircutStyle,
      hairlineStyle,
      hairDensity,
      hairStyling,
      hairColor,
      viewAngle,
    } = body;
    const faceImageMimeType = body.faceImageMimeType || "image/jpeg";

    if (!faceImageBase64 || !productImageUrl) {
      return res.status(400).json({ message: "faceImageBase64 and productImageUrl are required." });
    }

    const approxBytes = Math.ceil((faceImageBase64.length * 3) / 4);
    if (approxBytes > 6_000_000) {
      throw new Error("Face image too large.");
    }

    const productImages = await fetchProductReferenceImages(productImageUrl, productImageUrls, req);
    const apiKey = getApiKey();
    const imageModel = resolveImageModel();
    const modelGuard = mapProviderMessage("", imageModel);
    if (modelGuard) {
      return res.status(modelGuard.status).json({ message: modelGuard.message });
    }
    const apiVersion = process.env.GEMINI_API_VERSION || "v1beta";
    const endpoint =
      `https://generativelanguage.googleapis.com/${apiVersion}/models/${imageModel}:generateContent?key=${apiKey}`;
    const [primary, secondary] = productImages;

    const aiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
            { text: "IMAGE 1 (USER FACE):" },
            { inlineData: { data: faceImageBase64, mimeType: faceImageMimeType } },

            { text: "IMAGE 2 (PRIMARY HAIR STYLE):" },
            {
              inlineData: {
                data: primary.imageBytes,
                mimeType: primary.mimeType,
              },
            },

            ...(secondary
              ? [
                  { text: "IMAGE 3 (REFERENCE STRUCTURE ONLY):" },
                  {
                    inlineData: {
                      data: secondary.imageBytes,
                      mimeType: secondary.mimeType,
                    },
                  },
                ]
              : []),

            { text: buildHairPrompt(
                productName || "",
                productTag || "",
                productDescription || "",
                hairStatus || "has_hair",
                haircutStyle || "default",
                hairlineStyle || "natural",
                hairDensity || "medium",
                hairStyling || "natural_flow",
                hairColor || "auto",
                viewAngle || "front"
              ) },
          ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          temperature: 0.4,
        },
      }),
    });

    const payload = await parseJsonSafely(aiResponse);

    if (!aiResponse.ok) {
      const providerMessage =
        payload?.error?.message ||
        payload?.message ||
        "AI generation failed. Please try again.";
      const mapped = mapProviderMessage(providerMessage, imageModel);
      return res.status(mapped?.status || aiResponse.status || 502).json({
        message: mapped?.message || providerMessage,
      });
    }

    const generated = extractInlineImage(payload);
    if (!generated) {
      // Check if Gemini returned a text explanation of failure
      const textParts: string[] = (payload?.candidates?.[0]?.content?.parts || [])
        .filter((p: any) => typeof p.text === "string")
        .map((p: any) => p.text as string);
      const textContent = textParts.join(" ").toLowerCase();
      if (
        textContent.includes("unable") ||
        textContent.includes("cannot") ||
        textContent.includes("can't") ||
        textContent.includes("process") ||
        textContent.includes("sorry")
      ) {
        return res.status(422).json({
          message:
            "AI could not generate the preview. Tips: use a well-lit, front-facing photo with a plain background, no sunglasses or hats, and make sure your full face is visible. Then try again.",
        });
      }
      console.error("No image returned:", JSON.stringify(payload, null, 2));
      return res.status(502).json({ message: "AI did not return an image. Please try again." });
    }

    return res.status(200).json({
      generatedImageDataUrl: `data:${generated.mimeType};base64,${generated.data}`,
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return res.status(500).json({ message });
  }
}
