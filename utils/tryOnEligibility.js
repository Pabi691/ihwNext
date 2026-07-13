const TRY_ON_CATEGORY_RE = /(hair patch|hair wig|hair topper|toupee|hair system|hair replacement|frontal|closure)/i;
const TRY_ON_TEXT_RE = /(patch|wig|toupee|topper|hair system|hair replacement|extension|frontal|closure)/i;

export function isTryOnEligible({ categories, tag, name, description } = {}) {
  const cats = Array.isArray(categories) ? categories : [];
  if (cats.length > 0) {
    return cats.some((c) => TRY_ON_CATEGORY_RE.test(c?.category_name || ""));
  }

  const cleanTag = (tag || "").trim();
  if (cleanTag && cleanTag.toLowerCase() !== "null") {
    return TRY_ON_CATEGORY_RE.test(cleanTag);
  }

  return TRY_ON_TEXT_RE.test(`${name || ""} ${description || ""}`);
}
