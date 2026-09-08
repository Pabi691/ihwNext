import React from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { backendFetchJson } from "@/utils/backendFetch";
import { slugifyName } from "@/utils/slugUtils";
import PreviewGate from "@/components/newui/PreviewGate";
import NewUIPreview from "@/components/newui/NewUIPreview";
import { FestivalThemeProvider } from "@/components/newui/FestivalThemeContext";

type Props = { entry: any; slug: string };

export default function ThemePreviewSlug({ entry, slug }: Props) {
  return (
    <>
      <Head>
        <title>{`${entry?.name || slug} — Theme Preview`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PreviewGate badgeLabel={`Preview — ${entry?.name || slug}`}>
        <FestivalThemeProvider forcedTheme={entry}>
          <NewUIPreview />
        </FestivalThemeProvider>
      </PreviewGate>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = String(params?.slug || "");
  if (!slug) return { notFound: true };

  let library: any[] = [];
  let active: any = null;
  try {
    const json = await backendFetchJson("/api/v1/get_public_settings");
    const rawLib = json?.settings?.festival_theme_library;
    const parsedLib = typeof rawLib === "string" ? JSON.parse(rawLib || "[]") : rawLib;
    if (Array.isArray(parsedLib)) library = parsedLib;

    const rawActive = json?.settings?.festival_theme;
    active = typeof rawActive === "string" ? JSON.parse(rawActive || "{}") : rawActive;
  } catch {
    // fall through to notFound
  }

  // Match a saved library entry first; fall back to the currently-active theme
  // so every theme (saved or live) is previewable by its name-slug.
  const entry =
    library.find((e) => e && e.name && slugifyName(e.name) === slug) ||
    (active && active.name && slugifyName(active.name) === slug ? active : null);
  if (!entry) return { notFound: true };

  return { props: { entry, slug } };
};
