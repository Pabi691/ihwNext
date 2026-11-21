import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiFileText, FiInfo } from "react-icons/fi";

const SITE_URL = "https://www.indianhairworld.com";

const L = "text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5";
const I = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors";
const CODE = "w-full border border-gray-200 rounded-xl px-4 py-3 text-xs leading-relaxed outline-none focus:border-[#04A9FF] transition-colors resize-y font-mono bg-gray-50/60";

const TABS = [
  ["content", "Content"],
  ["seo", "SEO & Social"],
  ["head", "Head Code"],
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const clean = (v) => (v == null || v === "null" ? "" : String(v));

// The page's SEO record (ecom_seo_metadata, entity_type "page"), as edited here.
function seoFromPage(page) {
  const s = page?.seo_metadata || {};
  return {
    meta_title: clean(s.meta_title),
    meta_description: clean(s.meta_description),
    meta_keywords: clean(s.meta_keywords),
    canonical_url: clean(s.canonical_url),
    meta_index: s.meta_index === "noindex" ? "noindex" : "index",
    meta_follow: s.meta_follow === "nofollow" ? "nofollow" : "follow",
    og_title: clean(s.og_title),
    og_description: clean(s.og_description),
    og_image: clean(s.og_image),
    og_url: clean(s.og_url),
    og_type: clean(s.og_type) || "website",
    head_code: clean(s.head_code),
  };
}

function seoForSave(seo) {
  const out = {};
  for (const [k, v] of Object.entries(seo)) out[k] = typeof v === "string" ? v.trim() : v;
  return out;
}

const pagePath = (slug) => (!slug || slug === "home" ? "/" : `/${slug}`);

function Counter({ value, ideal }) {
  const n = value.length;
  return (
    <span className={`text-xs tabular-nums ${n > ideal ? "text-amber-600" : "text-gray-400"}`}>
      {n} / {ideal}
    </span>
  );
}

function FieldLabel({ children, right }) {
  return (
    <div className="flex items-baseline justify-between mb-1.5">
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{children}</span>
      {right}
    </div>
  );
}

function SearchPreview({ title, description, url }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Search result preview</p>
      <p className="text-xs text-gray-500 truncate">{url}</p>
      <p className="text-[17px] leading-snug text-[#1a0dab] truncate">{title || "Page title"}</p>
      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
        {description || "Add a meta description — search engines show it under the title."}
      </p>
    </div>
  );
}

function PageModal({ page, onClose, onSave, saving }) {
  const [tab, setTab] = useState("content");
  const [form, setForm] = useState({
    id: page?.id || null,
    title: page?.title || "",
    content: page?.content || "",
  });
  const [initialSeo] = useState(() => seoFromPage(page));
  const [seo, setSeo] = useState(initialSeo);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSeoField = (k, v) => setSeo((s) => ({ ...s, [k]: v }));

  const slug = page ? page.slug : slugify(form.title);
  const titleChanged = !!page && form.title.trim() !== (page.title || "").trim();
  const url = `${SITE_URL}${pagePath(slug)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setTab("content"); return setError("Title is required."); }
    if (!form.content.trim()) { setTab("content"); return setError("Content is required."); }
    const seoDirty = JSON.stringify(seo) !== JSON.stringify(initialSeo);
    const message = await onSave({ page: form, seo: seoForSave(seo), seoDirty });
    if (message) setError(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-4 flex-shrink-0">
          <h3 className="font-bold text-gray-900">{page ? `Edit Page — ${page.title}` : "New Page"}</h3>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <FiX size={16} />
          </button>
        </div>

        <div role="tablist" className="flex gap-1 px-6 mt-3 border-b border-gray-100 flex-shrink-0">
          {TABS.map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`px-3.5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === key ? "border-[#04A9FF] text-[#04A9FF]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                <FiAlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}

            {tab === "content" && (
              <>
                <div>
                  <label className={L}>Title *</label>
                  <input value={form.title} onChange={(e) => set("title", e.target.value)}
                    placeholder="Page title..." className={I} />
                  {titleChanged && (
                    <p className="flex items-start gap-1.5 text-xs text-amber-700 mt-1.5">
                      <FiAlertCircle size={13} className="mt-px flex-shrink-0" />
                      Changing the title also changes this page&apos;s address. Links to {pagePath(page.slug)} may stop working.
                    </p>
                  )}
                </div>
                <div>
                  <label className={L}>Address</label>
                  <p className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-600 truncate">
                    {pagePath(slug)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {page ? "Set by the server from the title." : "The server creates this from the title when you save."}
                  </p>
                </div>
                <div>
                  <label className={L}>Content *</label>
                  <textarea rows={12} value={form.content} onChange={(e) => set("content", e.target.value)}
                    placeholder="Page content (HTML supported)..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none font-mono" />
                </div>
              </>
            )}

            {tab === "seo" && (
              <>
                <SearchPreview
                  title={seo.meta_title || form.title}
                  description={seo.meta_description}
                  url={seo.canonical_url || url}
                />

                <section className="space-y-4">
                  <div>
                    <FieldLabel right={<Counter value={seo.meta_title} ideal={60} />}>Meta title</FieldLabel>
                    <input value={seo.meta_title} onChange={(e) => setSeoField("meta_title", e.target.value)}
                      placeholder={form.title || "Shown as the page title in search results"} className={I} />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to use the page title.</p>
                  </div>
                  <div>
                    <FieldLabel right={<Counter value={seo.meta_description} ideal={160} />}>Meta description</FieldLabel>
                    <textarea rows={3} value={seo.meta_description} onChange={(e) => setSeoField("meta_description", e.target.value)}
                      placeholder="One or two sentences that make people want to click."
                      className={`${I} resize-none`} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={L}>Meta keywords</label>
                      <input value={seo.meta_keywords} onChange={(e) => setSeoField("meta_keywords", e.target.value)}
                        placeholder="hair patch, hair wig kolkata" className={I} />
                    </div>
                    <div>
                      <label className={L}>Canonical URL</label>
                      <input value={seo.canonical_url} onChange={(e) => setSeoField("canonical_url", e.target.value)}
                        placeholder={url} className={`${I} font-mono text-xs`} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={L}>Search engines</label>
                      <select value={seo.meta_index} onChange={(e) => setSeoField("meta_index", e.target.value)} className={`${I} bg-white`}>
                        <option value="index">Index — show in search results</option>
                        <option value="noindex">Noindex — keep out of search results</option>
                      </select>
                    </div>
                    <div>
                      <label className={L}>Links on this page</label>
                      <select value={seo.meta_follow} onChange={(e) => setSeoField("meta_follow", e.target.value)} className={`${I} bg-white`}>
                        <option value="follow">Follow</option>
                        <option value="nofollow">Nofollow</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-5 border-t border-gray-100">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">Social sharing (Open Graph)</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      How the page looks when shared on WhatsApp, Facebook or LinkedIn. Blank fields fall back to the meta title and description.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={L}>OG title</label>
                      <input value={seo.og_title} onChange={(e) => setSeoField("og_title", e.target.value)}
                        placeholder={seo.meta_title || form.title} className={I} />
                    </div>
                    <div>
                      <label className={L}>OG type</label>
                      <select value={seo.og_type} onChange={(e) => setSeoField("og_type", e.target.value)} className={`${I} bg-white`}>
                        <option value="website">website</option>
                        <option value="article">article</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={L}>OG description</label>
                    <textarea rows={2} value={seo.og_description} onChange={(e) => setSeoField("og_description", e.target.value)}
                      placeholder={seo.meta_description || "Description shown on the share card"}
                      className={`${I} resize-none`} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div className="space-y-4">
                      <div>
                        <label className={L}>OG image URL</label>
                        <input value={seo.og_image} onChange={(e) => setSeoField("og_image", e.target.value)}
                          placeholder="https://cdn.indianhairworld.com/page-images/…  (1200 × 630)"
                          className={`${I} font-mono text-xs`} />
                      </div>
                      <div>
                        <label className={L}>OG URL</label>
                        <input value={seo.og_url} onChange={(e) => setSeoField("og_url", e.target.value)}
                          placeholder="Blank = canonical URL" className={`${I} font-mono text-xs`} />
                      </div>
                    </div>
                    {seo.og_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={seo.og_image} alt="" className="w-40 h-[84px] object-cover rounded-lg border border-gray-100 bg-gray-50" />
                    ) : (
                      <div className="w-40 h-[84px] rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {tab === "head" && (
              <>
                <div className="flex gap-2.5 rounded-xl bg-[#04A9FF]/5 border border-[#04A9FF]/15 px-4 py-3 text-xs text-gray-600 leading-relaxed">
                  <FiInfo size={15} className="text-[#04A9FF] flex-shrink-0 mt-0.5" />
                  <div>
                    Added inside the <code className="font-mono">&lt;head&gt;</code> of <b>{pagePath(slug)}</b> only, for page-specific
                    tags such as structured data (JSON-LD), verification meta tags or hreflang links.
                    Code every page needs (analytics, chat widgets) belongs in <b>Settings → Custom Code</b>.
                  </div>
                </div>
                <div>
                  <FieldLabel right={<span className="text-xs text-gray-400 tabular-nums">{seo.head_code.length.toLocaleString()} chars</span>}>
                    Head code
                  </FieldLabel>
                  <textarea rows={14} value={seo.head_code} onChange={(e) => setSeoField("head_code", e.target.value)}
                    spellCheck={false}
                    placeholder={'<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "…"\n}\n</script>'}
                    className={CODE} />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Only paste code from a source you trust: it runs on the live site. Google Tag Manager, Google Analytics and
                    the Meta Pixel are already on every page, so don&apos;t add them again.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button type="submit" disabled={saving}
              className="w-full py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
              {saving ? "Saving..." : page ? "Update Page" : "Create Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Laravel answers some failures with HTTP 200 and status:false (or, on older
// builds, status:true plus "Data validation Error").
function failed(res) {
  const d = res?.data;
  return d?.status === false || /validation/i.test(d?.message || "");
}

function errorText(err, fallback) {
  const d = err?.response?.data;
  const firstFieldError = d?.response && Object.values(d.response).flat()[0];
  return firstFieldError || d?.message || d?.error_message || err?.message || fallback;
}

export default function Pages() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [notice, setNotice] = useState("");

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_pages");
      const data = res.data;
      setPages(Array.isArray(data?.pages) ? data.pages : Array.isArray(data) ? data : []);
    } catch {
      setPages([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchPages();
  }, [ready, fetchPages]);

  const filtered = pages.filter((p) => {
    const q = search.toLowerCase();
    return !q || (p.title || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q);
  });

  // Saves the page, then its SEO record. Returns an error message, or null.
  const handleSave = async ({ page, seo, seoDirty }) => {
    setSaving(true);
    try {
      let id = page.id;
      const payload = { title: page.title.trim(), content: page.content };
      try {
        const res = id
          ? await api("post", `/update_page/${id}`, payload)
          : await api("post", "/create_page", payload);
        if (failed(res)) return errorText({ response: res }, "The page could not be saved.");
        if (!id) id = res.data?.data?.id;
      } catch (err) {
        return errorText(err, "The page could not be saved.");
      }

      // The page itself is saved from here on, so the dialog always closes
      // (re-submitting a "New Page" would create a duplicate).
      let seoError = "";
      if (id && seoDirty) {
        try {
          const res = await api("post", "/update_seo_metadata", { entity_type: "page", entity_id: id, ...seo });
          if (failed(res)) seoError = errorText({ response: res }, "unknown error");
        } catch (err) {
          seoError = errorText(err, "unknown error");
        }
      }

      await fetchPages();
      setModal(null);
      setNotice(seoError ? `“${page.title.trim()}” was saved, but its SEO settings were not: ${seoError}` : "");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (page) => {
    setToggling(page.id);
    const newStatus = page.status === 1 || page.status === "1" || page.status === true ? 0 : 1;
    try {
      await api("get", `/update_page_status/${page.id}/${newStatus}`);
      setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, status: newStatus } : p));
    } catch {}
    setToggling(null);
  };

  const handleDelete = async (page) => {
    if (!window.confirm(`Delete page "${page.title}"? This cannot be undone.`)) return;
    setDeleting(page.id);
    try {
      await api("delete", `/delete_page/${page.id}`);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
    } catch {}
    setDeleting(null);
  };

  const isActive = (p) => p.status === 1 || p.status === "1" || p.status === true;
  const hasSeo = (p) => !!(p.seo_metadata && p.seo_metadata.id && clean(p.seo_metadata.meta_title || p.seo_metadata.meta_description));

  if (!ready) return null;

  return (
    <AdminLayout title="Pages">
      <Head><title>Pages — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Page
        </button>
      </div>

      {notice && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl px-4 py-3 mb-4">
          <FiAlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span className="flex-1">{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss" className="text-amber-700 hover:text-amber-900">
            <FiX size={15} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No pages found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((page) => {
              const active = isActive(page);
              return (
                <div key={page.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#04A9FF]/10 flex items-center justify-center flex-shrink-0">
                    <FiFileText size={18} className="text-[#04A9FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{page.title}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {active ? "Active" : "Inactive"}
                      </span>
                      {!hasSeo(page) && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">No SEO</span>
                      )}
                      {page.seo_metadata?.meta_index === "noindex" && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">Noindex</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{pagePath(page.slug)}</p>
                  </div>
                  <p className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">
                    {page.created_at ? new Date(page.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setModal(page)} aria-label={`Edit ${page.title}`}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => toggleStatus(page)} disabled={toggling === page.id}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${active ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                      {toggling === page.id ? "..." : active ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => handleDelete(page)} disabled={deleting === page.id} aria-label={`Delete ${page.title}`}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60">
                      {deleting === page.id ? <span className="text-xs">...</span> : <FiTrash2 size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <PageModal page={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} saving={saving} />
      )}
    </AdminLayout>
  );
}
