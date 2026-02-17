import { normalizeSeoFromApi, toAbsoluteUrlIfPresent } from "./seo";
import { ENV } from "@/config/env";

type CachedSeo = {
    expiresAt: number;
    value: ReturnType<typeof normalizeSeoFromApi>;
};

const seoCache = new Map<string, CachedSeo>();
const SEO_CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchPageSeo(path: string, slug: string = "home", userToken?: string) {
    const apiUrl = ENV.API_URL;
    const token = userToken || ENV.WEB_TOKEN;
    const activeSlug = slug || "home";
    const cacheKey = `${activeSlug}::${path}`;

    const cached = seoCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        const seo = cached.value;
        return {
            ...seo,
            canonicalUrl: toAbsoluteUrlIfPresent(seo.canonicalUrl),
            ogUrl: toAbsoluteUrlIfPresent(seo.ogUrl),
            ogImage: toAbsoluteUrlIfPresent(seo.ogImage),
        };
    }

    // console.log(`[SEO-Fetch] Path: ${path}, Slug: ${slug}, Token provided: ${!!userToken}`);

    let apiData = null;

    if (apiUrl) {
        try {
            const baseHeaders: HeadersInit = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            };

            const fetchSeo = async (withAuth: boolean) => {
                const headers: HeadersInit = { ...baseHeaders };
                if (withAuth && token) {
                    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
                }
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);
                const response = await fetch(`${apiUrl}/api/v1/get_slug_data/${activeSlug}`, {
                    headers,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                return response;
            };

            let res = await fetchSeo(true);
            if ((res.status === 401 || res.status === 403) && token) {
                // Some hosts/envs reject auth header formats differently; retry public fetch.
                res = await fetchSeo(false);
            }

            if (res.ok) {
                const data = await res.json();
                if (data?.pageData || data?.product_details) {
                    apiData = data;
                }
            } else {
                // Keep silent in normal runtime; fallback SEO will be used.
            }
        } catch (e: any) {
            apiData = null;
        }
    }

    const seo = normalizeSeoFromApi(apiData, path, slug);
    if (apiData) {
        seoCache.set(cacheKey, {
            value: seo,
            expiresAt: Date.now() + SEO_CACHE_TTL_MS,
        });
    }

    return {
        ...seo,
        canonicalUrl: toAbsoluteUrlIfPresent(seo.canonicalUrl),
        ogUrl: toAbsoluteUrlIfPresent(seo.ogUrl),
        ogImage: toAbsoluteUrlIfPresent(seo.ogImage),
    };
}
