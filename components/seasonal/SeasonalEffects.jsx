import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { fetchPublicSettings } from "@/utils/publicSettings";

/**
 * Seasonal decorations switched on from the CRM (Settings → Christmas effects).
 *
 * The switches live inside the `festival_theme` setting as `christmas: {...}`,
 * independent of that theme's own `active` flag, so no backend change was
 * needed. The settings read is the same cached request the festival theme
 * makes, and the effects' code is only downloaded when they are switched on.
 */
const ChristmasEffects = dynamic(() => import("./ChristmasEffects"), { ssr: false });

// Keep checkout and payment calm.
const HIDDEN_ON = /^\/(checkout|payment)(\/|$)/;
const SNOW_AMOUNTS = ["light", "medium", "heavy"];

export function parseChristmas(rawTheme) {
  let data = rawTheme;
  try {
    if (typeof data === "string") data = JSON.parse(data);
  } catch {
    return null;
  }
  const c = data && typeof data === "object" ? data.christmas : null;
  if (!c || typeof c !== "object" || !c.enabled) return null;
  return {
    snow: c.snow !== false,
    snowman: c.snowman !== false,
    santa: c.santa !== false,
    bells: c.bells !== false,
    tree: c.tree !== false,
    snowAmount: SNOW_AMOUNTS.includes(c.snowAmount) ? c.snowAmount : "medium",
  };
}

export default function SeasonalEffects() {
  const { pathname } = useRouter();
  const [christmas, setChristmas] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicSettings()
      .then((settings) => {
        if (!cancelled) setChristmas(parseChristmas(settings?.festival_theme));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!christmas || HIDDEN_ON.test(pathname)) return null;
  return <ChristmasEffects config={christmas} />;
}
