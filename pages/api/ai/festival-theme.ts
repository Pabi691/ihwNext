import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Festival theme generator (preview / /test-home only).
 *
 * POST { festival: string, date?: string }
 *  -> { name, palette, hero, promo, backgroundImageDataUrl }
 *
 * Given a festival name, Gemini returns:
 *   1. a 10-token colour palette matching the --rb-* CSS variables in index.css
 *   2. hero + promo-strip copy
 *   3. a people-free decorative festival background image (best effort)
 *
 * If the image step fails the route still returns palette + copy with
 * backgroundImageDataUrl: null so the caller degrades gracefully.
 *
 * Place this file at: pages/api/ai/festival-theme.ts
 * Needs env: GEMINI_API_KEY (or GOOGLE_API_KEY) — same key the hair-try-on route uses.
 */

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};

type FestivalThemeBody = {
  festival?: string;
  date?: string;
};

const PALETTE_KEYS = [
  "--rb-primary",
  "--rb-primary-hover",
  "--rb-primary-mid",
  "--rb-primary-mid2",
  "--rb-dark",
  "--rb-accent",
  "--rb-accent-light",
  "--rb-accent-lighter",
  "--rb-cream",
  "--rb-cream-border",
] as const;

// Current Raksha Bandhan values from index.css — used to backfill anything
// the model omits or returns malformed.
const FALLBACK_PALETTE: Record<string, string> = {
  "--rb-primary": "#7a1420",
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
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is required.");
  return apiKey;
}

function endpoint(model: string, apiKey: string) {
  const apiVersion = process.env.GEMINI_API_VERSION || "v1beta";
  return `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
}

function stripCodeFence(raw: string) {
  return raw
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function firstText(payload: any): string {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) if (typeof p?.text === "string" && p.text.trim()) return p.text;
  return "";
}

function firstInlineImage(payload: any): { data: string; mimeType: string } | null {
  const candidates = payload?.candidates || [];
  for (const c of candidates) {
    for (const p of c?.content?.parts || []) {
      const data = p?.inlineData?.data;
      const mimeType = p?.inlineData?.mimeType || "image/png";
      if (data && String(mimeType).startsWith("image/")) return { data, mimeType };
    }
  }
  return null;
}

function sanitizePalette(input: any): Record<string, string> {
  const out: Record<string, string> = { ...FALLBACK_PALETTE };
  if (input && typeof input === "object") {
    for (const key of PALETTE_KEYS) {
      const v = typeof input[key] === "string" ? input[key].trim() : "";
      if (HEX.test(v)) out[key] = v.toLowerCase();
    }
  }
  return out;
}

function clampStr(v: unknown, max: number, fallback: string) {
  const s = typeof v === "string" ? v.trim() : "";
  return (s || fallback).slice(0, max);
}

function sanitizeHero(input: any) {
  const lines = Array.isArray(input?.titleLines)
    ? input.titleLines.map((l: unknown) => String(l || "").trim()).filter(Boolean).slice(0, 2)
    : [];
  return {
    eyebrow: clampStr(input?.eyebrow, 24, "Celebrate"),
    titleLines: lines.length ? lines : ["Festive", "Season"],
    tagline: clampStr(input?.tagline, 60, "Instant Confidence, Instant Style"),
    trustedBy: "Vindu Dara Singh",
  };
}

function sanitizePromo(input: any) {
  return {
    label: clampStr(input?.label, 60, "FESTIVE OFFER").toUpperCase(),
    subtitle: clampStr(input?.subtitle, 80, "Celebrate the season with love & care."),
  };
}

async function generateThemeJson(festival: string, date: string, apiKey: string) {
  const model = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
  const prompt = `You theme an Indian non-surgical hair-replacement brand's website for a festival.
Return ONLY a JSON object (no markdown) with this exact shape:
{
  "name": "proper display name of the festival",
  "palette": {
    "--rb-primary": "#rrggbb",        // deep saturated colour evoking the festival; used for buttons + headings; white text must be readable on it
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
    "label": "UPPERCASE short line, include the date if the festival falls near the given date, e.g. DIWALI – 20 OCT, MONDAY",
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
    const msg = payload?.error?.message || "Theme generation failed.";
    const e: any = new Error(msg);
    e.status = res.status;
    throw e;
  }

  let parsed: any = {};
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

async function generateBackground(
  name: string,
  palette: Record<string, string>,
  apiKey: string
): Promise<string | null> {
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const prompt = `Create a decorative vertical background graphic for a website hero banner celebrating ${name}.
Hard rules: NO people, NO faces, NO hands, NO text, NO letters, NO numbers, NO logos, NO watermark.
Ornamental festive motifs appropriate to ${name} (lamps, diyas, flowers, garlands, lights, rangoli-style patterns) arranged around the top and edges, with the centre and lower-centre kept clear and uncluttered so text can be overlaid.
Rich, premium, elegant. Colour palette built around ${palette["--rb-primary"]}, ${palette["--rb-dark"]} and the gold accent ${palette["--rb-accent"]}.
Portrait orientation, roughly 3:4.`;

  try {
    const res = await fetch(endpoint(model, apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"], temperature: 0.6 },
      }),
    });
    const payload = await res.json().catch(() => null);
    if (!res.ok) return null;
    const img = firstInlineImage(payload);
    return img ? `data:${img.mimeType};base64,${img.data}` : null;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { festival, date } = (req.body || {}) as FestivalThemeBody;
    const cleanFestival = (festival || "").trim().slice(0, 60);
    if (!cleanFestival) {
      return res.status(400).json({ message: "festival is required." });
    }
    const cleanDate = (date || new Date().toISOString().slice(0, 10)).slice(0, 10);

    const apiKey = getApiKey();
    const theme = await generateThemeJson(cleanFestival, cleanDate, apiKey);
    const backgroundImageDataUrl = await generateBackground(theme.name, theme.palette, apiKey);

    return res.status(200).json({ ...theme, backgroundImageDataUrl });
  } catch (error: any) {
    const status = typeof error?.status === "number" ? error.status : 500;
    return res.status(status).json({ message: error?.message || "Unknown error" });
  }
}
