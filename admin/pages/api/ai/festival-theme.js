/**
 * POST { festival: string, date?: string }
 *   -> { name, palette, hero, promo, heroImageBase64, heroImageMime }
 *
 * Gemini generates (1) a 10-token colour palette matching the --rb-* CSS
 * variables in the storefront's index.css, (2) hero + promo copy, and
 * (3) a people-free decorative festival background image.
 *
 * The image comes back as base64 — the Settings page uploads it to the
 * Laravel backend via the existing POST /api/images endpoint and stores
 * only the returned URL in `festival_theme`.
 *
 * Env (admin/.env.local): GEMINI_API_KEY   (or GOOGLE_API_KEY)
 * Optional: GEMINI_TEXT_MODEL (default gemini-3.6-flash),
 *           GEMINI_IMAGE_MODEL (default gemini-2.5-flash-image)
 */

const PALETTE_KEYS = [
  "--rb-primary",
  "--rb-heading",
  "--rb-heading-dark",
  "--rb-primary-hover",
  "--rb-primary-mid",
  "--rb-primary-mid2",
  "--rb-dark",
  "--rb-accent",
  "--rb-accent-light",
  "--rb-accent-lighter",
  "--rb-cream",
  "--rb-cream-border",
];

// Current Raksha Bandhan values from the storefront index.css — used to
// backfill anything the model omits or returns malformed.
const FALLBACK_PALETTE = {
  "--rb-primary": "#7a1420",
  "--rb-heading": "#7a1420",
  "--rb-heading-dark": "#f0c96b",
  "--rb-primary-hover": "#8f1826",
  "--rb-primary-mid": "#6b0f16",
  "--rb-primary-mid2": "#5c0f16",
  "--rb-dark": "#4a0a10",
  "--rb-accent": "#d9932e",
  "--rb-accent-light": "#f0c96b",
  "--rb-accent-lighter": "#f5d98a",
  "--rb-cream": "#fdf3e4",
  "--rb-cream-border": "#f0e4cf",
};

const HEX = /^#[0-9a-fA-F]{6}$/;

function getApiKey() {
  const k = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!k) throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is required in admin/.env.local");
  return k;
}

function endpoint(model, apiKey) {
  const apiVersion = process.env.GEMINI_API_VERSION || "v1beta";
  return `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
}

function stripCodeFence(raw) {
  return String(raw || "")
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function firstText(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) if (typeof p?.text === "string" && p.text.trim()) return p.text;
  return "";
}

function firstInlineImage(payload) {
  for (const c of payload?.candidates || []) {
    for (const p of c?.content?.parts || []) {
      const data = p?.inlineData?.data;
      const mimeType = p?.inlineData?.mimeType || "image/png";
      if (data && String(mimeType).startsWith("image/")) return { data, mimeType };
    }
  }
  return null;
}

function sanitizePalette(input) {
  const out = { ...FALLBACK_PALETTE };
  if (input && typeof input === "object") {
    for (const key of PALETTE_KEYS) {
      const v = typeof input[key] === "string" ? input[key].trim() : "";
      if (HEX.test(v)) out[key] = v.toLowerCase();
    }
  }
  return out;
}

function clampStr(v, max, fallback) {
  const s = typeof v === "string" ? v.trim() : "";
  return (s || fallback).slice(0, max);
}

function sanitizeHero(input) {
  const lines = Array.isArray(input?.titleLines)
    ? input.titleLines.map((l) => String(l || "").trim()).filter(Boolean).slice(0, 2)
    : [];
  return {
    eyebrow: clampStr(input?.eyebrow, 24, "Celebrate"),
    titleLines: lines.length ? lines : ["Festive", "Season"],
    tagline: clampStr(input?.tagline, 60, "Instant Confidence, Instant Style"),
    trustedBy: "Vindu Dara Singh",
  };
}

function sanitizePromo(input) {
  return {
    label: clampStr(input?.label, 60, "FESTIVE OFFER").toUpperCase(),
    subtitle: clampStr(input?.subtitle, 80, "Celebrate the season with love & care."),
  };
}

async function generateThemeJson(festival, date, apiKey) {
  const model = process.env.GEMINI_TEXT_MODEL || "gemini-3.6-flash";
  const prompt = `You theme an Indian non-surgical hair-replacement brand's website for a festival.
Return ONLY a JSON object (no markdown) with this exact shape:
{
  "name": "proper display name of the festival",
  "palette": {
    "--rb-primary": "#rrggbb",        // deep saturated colour evoking the festival; button + bar FILLS only; white text must be readable on it
    "--rb-heading": "#rrggbb",        // heading TEXT on the light cream sections; dark enough to read on --rb-cream
    "--rb-heading-dark": "#rrggbb",   // heading TEXT on the dark sections; must be LIGHT enough to read on --rb-dark, never a dark shade
    "--rb-primary-hover": "#rrggbb",  // a touch lighter than --rb-primary
    "--rb-primary-mid": "#rrggbb",    // darker than --rb-primary, a gradient stop
    "--rb-primary-mid2": "#rrggbb",   // darker still, a gradient stop; white text must be readable on it
    "--rb-dark": "#rrggbb",           // darkest shade; dark section backgrounds; white text must be readable on it
    "--rb-accent": "#rrggbb",         // warm secondary highlight (gold / orange / etc) for badges + icons
    "--rb-accent-light": "#rrggbb",   // light tint of the accent, for small text on dark backgrounds
    "--rb-accent-lighter": "#rrggbb", // lightest tint of the accent, for gradient text
    "--rb-cream": "#rrggbb",          // very light, near-white section background (stay above #f4efe6 in lightness)
    "--rb-cream-border": "#rrggbb"    // slightly darker than --rb-cream, for card borders
  },
  "hero": {
    "eyebrow": "one short word or phrase, e.g. Celebrate",
    "titleLines": ["1 or 2 short lines that display the festival name"],
    "tagline": "max 6 words, upbeat, links the festival to confidence and style"
  },
  "promo": {
    "label": "UPPERCASE short line, include the date if the festival falls near the given date, e.g. DIWALI - 20 OCT, MONDAY",
    "subtitle": "max 8 words"
  }
}
All colours must be 6-digit hex. Festival: "${festival}". Today's date: ${date}.`;

  const res = await fetch(endpoint(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
    }),
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(payload?.error?.message || "Theme generation failed.");
    err.status = res.status;
    throw err;
  }

  let parsed = {};
  try {
    parsed = JSON.parse(stripCodeFence(firstText(payload) || "{}"));
  } catch {
    throw new Error("AI returned a non-JSON theme response.");
  }

  return {
    name: clampStr(parsed?.name, 40, festival),
    palette: sanitizePalette(parsed?.palette),
    hero: sanitizeHero(parsed?.hero),
    promo: sanitizePromo(parsed?.promo),
  };
}

const IMAGE_COUNT = 3;

// Three focal variations so the fade slider has visibly different frames.
const IMAGE_VARIANTS = [
  "Wide symmetrical ornate rangoli mandala centred at the bottom, glowing oil lamps arced across the top.",
  "Tall decorative border of flowers, leaves and hanging lanterns down both edges, a soft radial light bloom in the middle.",
  "Scattered floating diyas and marigold petals with fine gold filigree patterns framing the corners.",
];

function imagePrompt(name, palette, variant) {
  return `Create a Studio Ghibli style illustration for a mobile website hero banner celebrating ${name}.
Soft hand-painted anime background art: painterly brushwork, warm diffused light, gentle gradients, dreamy whimsical festive atmosphere, delicate glow, visible brush texture.
Composition: ${variant}
Include an intricate rangoli / kolam geometric pattern worked into the design.
Hard rules: NO people, NO faces, NO hands, NO text, NO letters, NO numbers, NO logos, NO watermark.
Keep the upper-centre relatively calm so headline text can sit over it.
Colour palette built strictly around ${palette["--rb-primary"]}, ${palette["--rb-dark"]}, the section tone ${palette["--rb-primary-mid"]}, and the gold accent ${palette["--rb-accent"]}.
Portrait orientation, roughly 3:4, edge to edge, no border frame.`;
}

async function generateOneImage(model, prompt, apiKey) {
  const res = await fetch(endpoint(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"], temperature: 0.7 },
    }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(payload?.error?.message || `Image model HTTP ${res.status}`);
  }
  const img = firstInlineImage(payload);
  if (!img) throw new Error("Image model returned no image (possibly blocked by a safety filter).");
  return { base64: img.data, mime: img.mimeType };
}

// Returns { images: [{base64,mime}], error: string|null }. Never throws.
async function generateImages(name, palette, apiKey) {
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const results = await Promise.allSettled(
    Array.from({ length: IMAGE_COUNT }, (_, i) =>
      generateOneImage(model, imagePrompt(name, palette, IMAGE_VARIANTS[i % IMAGE_VARIANTS.length]), apiKey)
    )
  );
  const images = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  const firstErr = results.find((r) => r.status === "rejected");
  return {
    images,
    error: images.length ? null : (firstErr?.reason?.message || "Image generation failed."),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { festival, date } = req.body || {};
    const cleanFestival = String(festival || "").trim().slice(0, 60);
    if (!cleanFestival) return res.status(400).json({ message: "festival is required." });
    const cleanDate = String(date || new Date().toISOString().slice(0, 10)).slice(0, 10);

    const apiKey = getApiKey();
    const theme = await generateThemeJson(cleanFestival, cleanDate, apiKey);
    const { images, error: imageError } = await generateImages(theme.name, theme.palette, apiKey);

    return res.status(200).json({
      ...theme,
      images,        // [{ base64, mime }] — 0..3 entries
      imageError,    // string when 0 images came back, else null
    });
  } catch (error) {
    const status = typeof error?.status === "number" ? error.status : 500;
    return res.status(status).json({ message: error?.message || "Unknown error" });
  }
}
