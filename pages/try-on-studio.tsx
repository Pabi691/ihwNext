import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import HairPatchTryOnSectionJsx from "@/components/ai/HairPatchTryOnSection";
const HairPatchTryOnSection = HairPatchTryOnSectionJsx as unknown as React.ComponentType<Record<string, unknown>>;
import { GuestCheckProvider } from "@/global/GuestCheckContext";
import AdminLoginGate from "@/components/try-on/AdminLoginGate";
import { TRY_ON_SESSION_KEY as SESSION_KEY, TRY_ON_API_BASE as API_BASE } from "@/components/try-on/adminSession";

const TRY_ON_RE = /(patch|wig|toupee|topper|hair system|hair replacement|extension|frontal|closure)/i;
const TRY_ON_CATEGORY_RE = /(hair patch|hair wig|hair topper|toupee|hair system|hair replacement|frontal|closure)/i;

function detectTag(name: string, productTag?: string): string {
  const cleanTag = (productTag || "").trim();
  if (cleanTag && cleanTag.toLowerCase() !== "null") return cleanTag;

  const n = name.toLowerCase();
  if (n.includes("wig"))       return "wig";
  if (n.includes("patch"))     return "hair patch";
  if (n.includes("extension")) return "extension";
  if (n.includes("topper"))    return "topper";
  if (n.includes("frontal"))   return "frontal";
  if (n.includes("closure"))   return "closure";
  return "hair patch";
}

type Product = {
  id: number;
  prod_name?: string;
  name?: string;
  primary_img?: string;
  image?: string;
  thumbnail?: string;
  description?: string;
  product_tag?: string;
  product_categories?: { id: number; category_name: string }[];
  product_image_list?: { prod_img_url: string }[];
};

/* ── Product Picker ── */
function ProductPicker({ token, onSelect }: { token: string; onSelect: (p: Product) => void }) {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [search,   setSearch]     = useState("");
  const hasFetched                = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/v1/get_active_products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status && data.products) {
          const compatible = (data.products as Product[]).filter((p) => {
            const cats = p.product_categories || [];
            if (cats.length > 0) {
              return cats.some((c) => TRY_ON_CATEGORY_RE.test(c.category_name || ""));
            }
            const n = p.prod_name || p.name || "";
            return TRY_ON_RE.test(n);
          });
          setProducts(compatible);
        }
      } catch { /* network error — show empty */ }
      setLoading(false);
    })();
  }, [token]);

  const filtered = products.filter((p) => {
    const n = (p.prod_name || p.name || "").toLowerCase();
    return n.includes(search.toLowerCase());
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🛍️</span>
        <p className="text-sm font-semibold text-gray-700">Select a Product to Test</p>
        {!loading && (
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {products.length} compatible
          </span>
        )}
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search hair patches, wigs…"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors mb-4"
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="w-6 h-6 border-2 border-gray-200 border-t-[#04A9FF] rounded-full animate-spin" />
          <span className="ml-2.5 text-sm text-gray-400">Loading products…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No products found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
          {filtered.map((p) => {
            const name = p.prod_name || p.name || "—";
            const img  = p.primary_img || p.image || p.thumbnail;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="group text-left border border-gray-100 rounded-xl overflow-hidden hover:border-[#04A9FF] hover:shadow-md transition-all"
              >
                <div className="w-full aspect-square bg-gray-50 overflow-hidden">
                  {img ? (
                    <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-tight">{name}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Studio ── */
export default function TryOnStudio() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  const [productImageUrl,  setProductImageUrl]  = useState("");
  const [productImages,    setProductImages]     = useState<string[]>([]);
  const [productName,      setProductName]       = useState("");
  const [productTag,       setProductTag]        = useState("");
  const [productDesc,      setProductDesc]       = useState("");
  const [adminToken,       setAdminToken]        = useState("");

  const handleSelectProduct = (p: Product) => {
    const name  = p.prod_name || p.name || "";
    const img   = p.primary_img || p.image || p.thumbnail || "";
    const imgs  = [img, ...((p.product_image_list || []).map((i) => i.prod_img_url))].filter((s): s is string => !!s);
    setProductImageUrl(img);
    setProductImages(imgs);
    setProductName(name);
    setProductTag(detectTag(name, p.product_tag));
    setProductDesc(p.description || "");
  };

  useEffect(() => {
    const token = sessionStorage.getItem(SESSION_KEY);
    setIsAuthed(!!token);
    setAdminToken(token || "");
    setChecking(false);
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthed(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#04A9FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <>
        <Head><title>Try-On Studio — IHW Admin</title></Head>
        <AdminLoginGate onSuccess={() => setIsAuthed(true)} />
      </>
    );
  }

  return (
    <>
      <Head><title>Virtual Try-On Studio — IHW Admin</title></Head>
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Indian Hair World" className="h-7 w-auto object-contain" />
              <div>
                <h1 className="text-sm font-bold text-gray-900">Virtual Try-On Studio</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#04A9FF]">Admin — No Limits</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/try-on-studio/help"
                className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors">
                Help
              </Link>
              <button onClick={handleSignOut}
                className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {/* Selected product banner */}
          {productImageUrl && (
            <div className="bg-white rounded-2xl border border-[#04A9FF]/30 p-4 shadow-sm flex items-center gap-4">
              <img src={productImageUrl} alt={productName} className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm line-clamp-1">{productName}</p>
                <span className="inline-block mt-0.5 text-[10px] bg-[#04A9FF]/10 text-[#04A9FF] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">{productTag}</span>
              </div>
              <button
                onClick={() => { setProductImageUrl(""); setProductImages([]); setProductName(""); setProductTag(""); setProductDesc(""); }}
                className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Change
              </button>
            </div>
          )}

          {/* Product Picker — hidden once a product is selected */}
          {!productImageUrl && (
            <ProductPicker token={adminToken} onSelect={handleSelectProduct} />
          )}

          {/* Try-On */}
          {productImageUrl ? (
            <GuestCheckProvider>
              <HairPatchTryOnSection
                productImage={productImageUrl}
                productImages={productImages}
                productName={productName}
                productTag={productTag}
                productDescription={productDesc}
                isAdmin={true}
              />
            </GuestCheckProvider>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
              <span className="text-4xl block mb-3">👆</span>
              <p className="text-gray-500 text-sm font-medium">Select a product above to start testing</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
