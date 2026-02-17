import { normalizeSeoFromApi, toAbsoluteUrlIfPresent } from "./seo";
import { ENV } from "@/config/env";

export async function fetchPageSeo(path: string, slug: string = "home", userToken?: string) {
    const apiUrl = ENV.API_URL;
    const token = userToken || ENV.WEB_TOKEN;

    // console.log(`[SEO-Fetch] Path: ${path}, Slug: ${slug}, Token provided: ${!!userToken}`);

    let apiData = null;

    if (apiUrl) {
        try {
            // Allow slug override, default to path slug or 'home'
            const activeSlug = slug || "home";

            console.log(`[SEO-Fetch] Starting fetch for slug: ${activeSlug} at ${apiUrl}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased to 8 seconds

            const headers: HeadersInit = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const res = await fetch(`${apiUrl}/api/v1/get_slug_data/${activeSlug}`, {
                headers,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            console.log(`[SEO-Fetch] Response status: ${res.status}`);

            if (res.ok) {
                const data = await res.json();
                if (data?.pageData || data?.product_details) {
                    apiData = data;
                }
            } else {
                console.error(`[SEO-Fetch-Error] API returned status: ${res.status}`);
            }
        } catch (e: any) {
            console.error(`[SEO-Fetch-Error] Failed for slug: ${slug}. Message: ${e.message}`);
            if (e.name === 'AbortError') {
                console.error('[SEO-Fetch-Error] Request timed out after 8000ms');
            }
            apiData = null;
        }
    }

    const seo = normalizeSeoFromApi(apiData, path, slug);

    return {
        ...seo,
        canonicalUrl: toAbsoluteUrlIfPresent(seo.canonicalUrl),
        ogUrl: toAbsoluteUrlIfPresent(seo.ogUrl),
        ogImage: toAbsoluteUrlIfPresent(seo.ogImage),
    };
}
