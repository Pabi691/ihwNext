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
  const response = await fetch(resolvedUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not fetch product image.");
  }
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();
  return { mimeType: contentType, imageBytes: toBase64(arrayBuffer) };
}

async function fetchProductReferenceImages(
  primaryUrl: string,
  additionalUrls: string[] | undefined,
  req: NextApiRequest
) {
  const urls = [primaryUrl, ...(additionalUrls || [])]
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter(Boolean);

  const uniqueUrls = Array.from(new Set(urls)).slice(0, 4);
  const images = await Promise.all(uniqueUrls.map((url) => fetchImageAsBase64(url, req)));
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

function buildHairPrompt(
  productName: string,
  productTag: string,
  productDescription: string,
  hairStatus: string
) {
  const cleanName = stripHtml(productName || "").trim();
  const cleanTag = stripHtml(productTag || "").trim();
  const cleanDescription = stripHtml(productDescription || "").slice(0, 500);
  const productType = inferProductType(cleanName, cleanTag, cleanDescription);
  const normalizedHairStatus = hairStatus === "bald_or_thinning" ? "bald or thinning" : "already has hair";

  const productContext = [
    cleanName ? `Product name: ${cleanName}` : "",
    cleanTag && cleanTag !== "null" ? `Product tag: ${cleanTag}` : "",
    cleanDescription ? `Product details: ${cleanDescription}` : "",
    `Detected product type: ${productType}`,
    `User hair situation: ${normalizedHairStatus}`,
  ]
    .filter(Boolean)
    .join("\n");

  const userHairInstructions =
    hairStatus === "bald_or_thinning"
      ? `The user says they are bald or thinning. Focus on realistic coverage for sparse or missing top hair. Do not preserve empty scalp where the product should provide coverage.`
      : `The user says they already have hair. If the product is a wig or hair patch, hide, flatten, or replace the conflicting top hair where necessary so the final fitting looks natural and professionally installed.`;

  const typeSpecificInstructions = {
    extension: `If IMAGE 2 is a hair extension, integrate it into the person's existing hair instead of placing it like a wig. Match the extension to the natural hair flow, root direction, density, curl pattern, and length. Blend the join points invisibly so it looks professionally fitted and naturally attached to the person's own hair.`,
    wig: `If IMAGE 2 is a wig, place the wig cap and hairline naturally on the person's head. If the person already has hair, hide, flatten, or replace the existing top hair underneath the wig so the wig sits correctly and the original hair does not stick through. Match the wig to the skull shape, temple area, and forehead, and make the final result look like the person is fully wearing that exact wig in real life.`,
    "hair patch": `If IMAGE 2 is a hair patch / toupee / topper, place it only on the top, front, or crown area where such a product would realistically be installed. Preserve the person's side hair and back hair. If existing top hair conflicts with the product, reduce or replace only the necessary top area so the patch blends in naturally without double hair or unrealistic bulk.`,
    "hair replacement": `Apply the product in the most realistic wearable way based on IMAGE 2. If the person already has hair that conflicts with the product, replace or suppress only the required hair area so the final fitting looks natural. Do not float the hair above the head and do not invent a random hairstyle unrelated to the product.`,
  }[productType];

  return `You are a professional hair replacement stylist, wig fitter, and photorealistic ecommerce compositor.

TASK:
Use IMAGE 1 as the person's photo and IMAGES 2+ as product reference images. Add the actual product onto the person in IMAGE 1 so it looks naturally worn in real life.

PRODUCT CONTEXT:
${productContext}

STRICT REQUIREMENTS:
1. Use the product reference images as the design reference for exact color, density, hairline style, texture, curl pattern, direction, volume, and coverage.
2. Preserve the person's identity, face, skin tone, beard, expression, neck, clothing, pose, camera angle, and background.
3. Change only the hair area needed for the try-on.
4. The final result must be a realistic photo, not an illustration, collage, split image, mannequin, or product mockup.
5. Keep the result believable for a real salon fitting or before/after consultation photo.
6. Match lighting, shadows, perspective, and scale to the person's head.
7. Blend edges seamlessly and avoid helmet-like shape, floating hair, duplicated hair, or obvious cut lines.
8. If the person already has hair and the product is a wig or hair patch, the original top hair may be covered, flattened, or replaced where necessary so the final result looks professionally fitted and realistic.
9. Never leave two conflicting hairstyles visible at once.
10. If one reference image shows the product already worn on a mannequin or model, strongly follow that visible hairstyle shape and silhouette.
11. If another reference image shows the underside, base, mono, lace, or inner construction, use it only to understand coverage and installation area, not as the visible hairstyle output.
12. For curly products, preserve the exact curl family, curl tightness, frizz level, density, and natural uneven curl fall from the best worn reference image.

FITTING INSTRUCTIONS:
${typeSpecificInstructions}
${userHairInstructions}

OUTPUT RULES:
- Output only one finished portrait image of the person wearing the product.
- Do not show the reference image separately.
- Do not add text, labels, frames, or extra objects.
- Make it look premium, natural, and convincing enough for ecommerce try-on preview.
- The result should look like the person is genuinely wearing this exact product after professional fitting, not using a generic hair filter.`;
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
    } = body;
    const faceImageMimeType = body.faceImageMimeType || "image/jpeg";

    if (!faceImageBase64 || !productImageUrl) {
      return res.status(400).json({ message: "faceImageBase64 and productImageUrl are required." });
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

    const productImageParts = productImages.map((productImage) => ({
      inlineData: { data: productImage.imageBytes, mimeType: productImage.mimeType },
    }));

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
              {
                text: buildHairPrompt(
                  productName || "",
                  productTag || "",
                  productDescription || "",
                  hairStatus || "has_hair"
                ),
              },
              { inlineData: { data: faceImageBase64, mimeType: faceImageMimeType } },
              ...productImageParts,
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
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
      return res.status(502).json({
        message:
          "AI did not return an image. Try a clearer face photo with good front lighting and plain background.",
      });
    }

    return res.status(200).json({
      generatedImageDataUrl: `data:${generated.mimeType};base64,${generated.data}`,
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return res.status(500).json({ message });
  }
}
