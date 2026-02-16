import { normalizeSeoFromApi, toAbsoluteUrlIfPresent } from "./seo";

export async function fetchPageSeo(path: string, slug: string = "home", userToken?: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = userToken || process.env.NEXT_PUBLIC_WEB_TOKEN;

    // console.log(`[SEO-Fetch] Path: ${path}, Slug: ${slug}, Token provided: ${!!userToken}`);

    let apiData = null;

    if (apiUrl) {
        try {
            // Allow slug override, default to path slug or 'home'
            const activeSlug = slug || "home";

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const res = await fetch(`${apiUrl}/api/v1/get_slug_data/${activeSlug}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data?.pageData || data?.product_details) {
                    apiData = data;
                }
            }
        } catch (e: any) {
            console.error(`[SEO-Fetch-Error] Failed for slug: ${slug}`, e.message || e);
            if (e.response) {
                console.error(`[SEO-Fetch-Error] Status: ${e.response.status}, Data:`, e.response.data);
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
