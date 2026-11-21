import { backendFetchJson } from "@/utils/backendFetch";

/**
 * Site-wide custom code from CRM → Settings → Custom Code, read on the server
 * for pages/_document.tsx.
 *
 * _document renders on every request, so the value is cached in memory and
 * refreshed in the background once a minute (stale-while-revalidate): pages
 * never wait for the backend except on the very first request after a
 * restart, and even then for at most FIRST_LOAD_TIMEOUT_MS. If the backend
 * is unreachable the last good copy keeps being served.
 */
export type SiteCode = { head: string; bodyStart: string; bodyEnd: string };

export const EMPTY_SITE_CODE: SiteCode = { head: "", bodyStart: "", bodyEnd: "" };

const TTL_MS = 60 * 1000;
const FIRST_LOAD_TIMEOUT_MS = 2500;

let cached: { at: number; value: SiteCode } | null = null;
let inFlight: Promise<SiteCode> | null = null;

const text = (v: unknown) => (typeof v === "string" ? v : "");

async function load(): Promise<SiteCode> {
  const json = await backendFetchJson("/api/v1/get_public_settings");
  const s = (json && json.settings) || {};
  return {
    head: text(s.site_head_code),
    bodyStart: text(s.site_body_start_code),
    bodyEnd: text(s.site_body_end_code),
  };
}

function refresh(): Promise<SiteCode> {
  if (!inFlight) {
    inFlight = load()
      .catch(() => (cached ? cached.value : EMPTY_SITE_CODE))
      .then((value) => {
        cached = { at: Date.now(), value };
        return value;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export async function getSiteCode(): Promise<SiteCode> {
  if (cached) {
    if (Date.now() - cached.at > TTL_MS) void refresh();
    return cached.value;
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<SiteCode>((resolve) => {
    timer = setTimeout(() => resolve(EMPTY_SITE_CODE), FIRST_LOAD_TIMEOUT_MS);
  });
  try {
    return await Promise.race([refresh(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}
