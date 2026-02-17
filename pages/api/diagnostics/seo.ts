import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const WEB_TOKEN = process.env.NEXT_PUBLIC_WEB_TOKEN || "";

const check = async (url: string, includeAuth: boolean) => {
  const headers: Record<string, string> = {};
  if (includeAuth && WEB_TOKEN) {
    headers.Authorization = `Bearer ${WEB_TOKEN}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);
    return { ok: res.ok, status: res.status };
  } catch (error: any) {
    return { ok: false, status: 0, error: error?.message || "fetch_failed" };
  }
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!API_URL) {
    return res.status(500).json({
      ok: false,
      error: "NEXT_PUBLIC_API_URL_missing",
    });
  }

  const categoriesUrl = `${API_URL}/api/v1/categories`;
  const productsUrl = `${API_URL}/api/v1/get_active_products`;
  const slugUrl = `${API_URL}/api/v1/get_slug_data/home`;

  const [categoriesAuth, categoriesPublic, productsAuth, productsPublic, slugAuth, slugPublic] =
    await Promise.all([
      check(categoriesUrl, true),
      check(categoriesUrl, false),
      check(productsUrl, true),
      check(productsUrl, false),
      check(slugUrl, true),
      check(slugUrl, false),
    ]);

  return res.status(200).json({
    ok: true,
    env: {
      apiUrlPresent: Boolean(API_URL),
      webTokenPresent: Boolean(WEB_TOKEN),
    },
    checks: {
      categoriesAuth,
      categoriesPublic,
      productsAuth,
      productsPublic,
      slugAuth,
      slugPublic,
    },
  });
}
