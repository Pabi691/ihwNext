import React from "react";
import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { ENV } from "@/config/env";
import { slugifyName } from "@/utils/slugUtils";

type Item = { name: string; slug: string; active: boolean; palette: Record<string, string> | null };
type Props = { items: Item[] };

export default function ThemePreviewIndex({ items }: Props) {
  return (
    <>
      <Head>
        <title>Theme Previews — Indian Hair World</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Festival theme previews</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Internal preview of every saved festival theme. Opening one shows the redesigned
            homepage with that theme forced on — it does not change what is live.
          </p>

          {items.length === 0 ? (
            <p className="text-sm text-gray-400">
              No saved themes yet. Build one in the CRM (Settings → Festival Theme → Save current to library).
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.slug}>
                  <Link
                    href={`/theme-preview/${it.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-[#04A9FF] transition-colors"
                  >
                    <span className="flex gap-1">
                      {(it.palette
                        ? ["--rb-primary", "--rb-accent", "--rb-dark"].map((k) => it.palette?.[k]).filter(Boolean)
                        : []
                      ).map((c, i) => (
                        <span key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ background: c as string }} />
                      ))}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">{it.name}</span>
                    {it.active && (
                      <span className="ml-auto text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        LIVE
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let library: any[] = [];
  let active: any = null;
  try {
    const res = await fetch(`${ENV.API_URL}/api/v1/get_public_settings`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    } as any);
    const json = await res.json();
    const rawLib = json?.settings?.festival_theme_library;
    const parsed = typeof rawLib === "string" ? JSON.parse(rawLib || "[]") : rawLib;
    if (Array.isArray(parsed)) library = parsed;

    const rawActive = json?.settings?.festival_theme;
    active = typeof rawActive === "string" ? JSON.parse(rawActive || "{}") : rawActive;
  } catch {
    // render empty
  }

  const activeSlug = active?.name ? slugifyName(active.name) : "";

  const items: Item[] = library
    .filter((e) => e && e.name)
    .map((e) => ({
      name: String(e.name),
      slug: slugifyName(e.name),
      active: !!activeSlug && activeSlug === slugifyName(e.name),
      palette: e.palette && typeof e.palette === "object" ? e.palette : null,
    }));

  // Include the active theme if it isn't also saved in the library.
  if (active?.name && !items.some((it) => it.slug === activeSlug)) {
    items.unshift({
      name: String(active.name),
      slug: activeSlug,
      active: !!active.active,
      palette: active.palette && typeof active.palette === "object" ? active.palette : null,
    });
  }

  return { props: { items } };
};
