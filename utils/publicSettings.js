import { ENV } from "@/config/env";

// Client-side read of /api/v1/get_public_settings, shared by everything that
// needs a CRM setting (festival theme, transformations gallery, ...). The whole
// settings object is cached for a minute in sessionStorage and one in-flight
// request is shared across mounts, so client navigations don't re-hit the
// backend.
const TTL_MS = 60 * 1000;
const CACHE_KEY = "ihw:get_public_settings:v2";
let inFlight = null;

export async function fetchPublicSettings() {
  // 1. fresh value stashed this session?
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.at < TTL_MS) return cached.settings;
  } catch {
    /* ignore */
  }
  // 2. a request already going out? ride it.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const res = await fetch(`${ENV.API_URL}/api/v1/get_public_settings`, {
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      const settings = json?.settings || {};
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), settings }));
      } catch {
        /* ignore quota */
      }
      return settings;
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}
