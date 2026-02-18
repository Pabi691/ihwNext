import { normalizeSeoFromApi, toAbsoluteUrlIfPresent } from "./seo";
import { ENV } from "@/config/env";

type CachedSeo = {
    expiresAt: number;
    value: ReturnType<typeof normalizeSeoFromApi>;
};

const seoCache = new Map<string, CachedSeo>();
const SEO_CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchPageSeo(
    path: string,
    slug: string | string[] = "home",
    userToken?: string
) {
    const apiUrl = ENV.API_URL;
    const token = userToken || ENV.WEB_TOKEN;
    const activeSlugs = Array.isArray(slug)
        ? slug.filter(Boolean)
        : [slug || "home"];
    const primarySlug = activeSlugs[0] || "home";
    const cacheKey = `${activeSlugs.join("|")}::${path}`;
    const isContactSeoDebug =
        path.includes("contact-us") ||
        activeSlugs.includes("contact") ||
        activeSlugs.includes("contact-us");

    const cached = seoCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        const seo = cached.value;
        if (isContactSeoDebug) {
            console.log(`[SEO-DEBUG][contact-us] cache hit | path=${path} | slug=${primarySlug}`);
        }
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
            if (isContactSeoDebug) {
                console.log(`[SEO-DEBUG][contact-us] fetch start | path=${path} | slug=${primarySlug} | api=${apiUrl}`);
            }
            const baseHeaders: HeadersInit = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            };

            const fetchSeo = async (candidateSlug: string, withAuth: boolean) => {
                const headers: HeadersInit = { ...baseHeaders };
                if (withAuth && token) {
                    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
                }
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);
                const response = await fetch(`${apiUrl}/api/v1/get_slug_data/${candidateSlug}`, {
                    headers,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                return response;
            };

            for (const candidateSlug of activeSlugs) {
                let res = await fetchSeo(candidateSlug, true);
                if (!res.ok && token) {
                    // Some hosts/envs reject auth header formats differently; retry public fetch.
                    res = await fetchSeo(candidateSlug, false);
                }
                if (isContactSeoDebug) {
                    console.log(
                        `[SEO-DEBUG][contact-us] api status=${res.status} ok=${res.ok} url=${apiUrl}/api/v1/get_slug_data/${candidateSlug}`
                    );
                }

                if (!res.ok) {
                    continue;
                }

                let data: unknown = null;
                try {
                    data = await res.json();
                } catch {
                    data = null;
                }
                const typedData = (data && typeof data === "object" ? data : null) as
                    | { pageData?: unknown; product_details?: unknown; category_data?: unknown }
                    | null;
                if (isContactSeoDebug) {
                    console.log(
                        `[SEO-DEBUG][contact-us] api data keys=${Object.keys(typedData || {}).join(",")} pageData=${Boolean(typedData?.pageData)} product_details=${Boolean(typedData?.product_details)} category_data=${Boolean(typedData?.category_data)}`
                    );
                }
                if (typedData?.pageData || typedData?.product_details || typedData?.category_data) {
                    apiData = typedData;
                    break;
                }
            }
        } catch (e: unknown) {
            if (isContactSeoDebug) {
                const message = e instanceof Error ? e.message : "unknown";
                console.log(`[SEO-DEBUG][contact-us] fetch error=${message}`);
            }
            apiData = null;
        }
    }

    const seo = normalizeSeoFromApi(apiData, path, primarySlug);
    if (isContactSeoDebug) {
        console.log(
            `[SEO-DEBUG][contact-us] normalized seo | title=${Boolean(seo.title)} desc=${Boolean(seo.description)} canonical=${Boolean(seo.canonicalUrl)} ogImage=${Boolean(seo.ogImage)}`
        );
    }
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
