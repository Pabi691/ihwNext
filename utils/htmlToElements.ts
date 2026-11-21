import React from "react";
import parse from "html-react-parser";

/**
 * Turn admin-entered HTML (CRM "Custom Code" / page "Head Code") into React
 * elements that can sit directly in <head> or <body>, with no wrapper element.
 *
 * Whitespace between tags is dropped and every element gets a stable key.
 * Scripts come back as <script> elements whose code is set through
 * dangerouslySetInnerHTML, so in server-rendered HTML they run exactly like a
 * hand-written tag. Malformed input never throws; it just yields nothing.
 */
export function htmlToElements(html: string | null | undefined, keyPrefix: string): React.ReactElement[] {
  const source = (html || "").trim();
  if (!source) return [];

  let parsed: ReturnType<typeof parse>;
  try {
    parsed = parse(source);
  } catch {
    return [];
  }

  const nodes = Array.isArray(parsed) ? parsed : [parsed];
  return nodes
    .filter((node): node is React.ReactElement => React.isValidElement(node))
    .map((el, i) => React.cloneElement(el, { key: `${keyPrefix}-${i}` }));
}
