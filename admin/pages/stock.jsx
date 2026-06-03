import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiSave, FiChevronDown, FiChevronRight, FiAlertTriangle, FiPackage } from "react-icons/fi";

const LOW_STOCK_THRESHOLD = 5;

function StockBadge({ qty }) {
  if (qty <= 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-600">Out of Stock</span>;
  if (qty <= LOW_STOCK_THRESHOLD)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-orange-50 text-orange-600"><FiAlertTriangle size={11} />{qty}</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-green-50 text-green-700">{qty}</span>;
}

export default function Stock() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All | Low | Out
  const [expanded, setExpanded] = useState({});
  const [edits, setEdits] = useState({}); // { productId: newQty }
  const [varEdits, setVarEdits] = useState({}); // { varId: newQty }
  const [saving, setSaving] = useState({}); // { productId: bool }
  const [varSaving, setVarSaving] = useState({}); // { varId: bool }
  const [saved, setSaved] = useState({}); // flash success

  const fetchStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_stock_report");
      const list = Array.isArray(res.data?.products) ? res.data.products : [];
      setProducts(list);
      // Pre-populate edits with current values
      const initEdits = {};
      const initVarEdits = {};
      list.forEach((p) => {
        initEdits[p.id] = String(p.stock_qty ?? 0);
        (p.product_variations || []).forEach((v) => {
          initVarEdits[v.id] = String(v.stock_qty ?? 0);
        });
      });
      setEdits(initEdits);
      setVarEdits(initVarEdits);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchStock();
  }, [ready, fetchStock]);

  const flashSaved = (key, type) => {
    setSaved((p) => ({ ...p, [key + type]: true }));
    setTimeout(() => setSaved((p) => { const n = { ...p }; delete n[key + type]; return n; }), 2000);
  };

  const saveProductStock = async (productId) => {
    const newQty = parseInt(edits[productId]);
    if (isNaN(newQty) || newQty < 0) return;
    setSaving((p) => ({ ...p, [productId]: true }));
    try {
      const res = await api("post", `/update_product_stock/${productId}`, { stock_qty: newQty });
      if (res.data?.status) {
        setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, stock_qty: newQty } : p));
        flashSaved(productId, "p");
      }
    } catch {}
    setSaving((p) => ({ ...p, [productId]: false }));
  };

  const saveVariationStock = async (varId) => {
    const newQty = parseInt(varEdits[varId]);
    if (isNaN(newQty) || newQty < 0) return;
    setVarSaving((p) => ({ ...p, [varId]: true }));
    try {
      const res = await api("post", `/update_product_variation/${varId}`, { stock_qty: newQty });
      if (res.data?.status) {
        setProducts((prev) =>
          prev.map((p) => ({
            ...p,
            product_variations: (p.product_variations || []).map((v) =>
              v.id === varId ? { ...v, stock_qty: newQty } : v
            ),
          }))
        );
        flashSaved(varId, "v");
      }
    } catch {}
    setVarSaving((p) => ({ ...p, [varId]: false }));
  };

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (p.prod_name || "").toLowerCase().includes(q) || String(p.id).includes(q) || (p.sku || "").toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === "Out") return (p.stock_qty ?? 0) <= 0;
    if (filter === "Low") return (p.stock_qty ?? 0) > 0 && (p.stock_qty ?? 0) <= LOW_STOCK_THRESHOLD;
    return true;
  });

  const counts = {
    All: products.length,
    Low: products.filter((p) => (p.stock_qty ?? 0) > 0 && (p.stock_qty ?? 0) <= LOW_STOCK_THRESHOLD).length,
    Out: products.filter((p) => (p.stock_qty ?? 0) <= 0).length,
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Stock Management">
      <Head><title>Stock — IHW Admin</title></Head>

      {/* Header row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm"
          />
        </div>
        <button
          onClick={fetchStock}
          className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
        >
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
        {["All", "Low", "Out"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filter === tab ? "bg-[#04A9FF] text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab === "Low" ? `Low Stock` : tab === "Out" ? "Out of Stock" : "All"}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-md ${filter === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No products found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((product) => {
              const hasVariations = (product.product_variations || []).length > 0;
              const isExpanded = expanded[product.id];
              const isSaving = saving[product.id];
              const wasSaved = saved[product.id + "p"];
              const currentQty = parseInt(edits[product.id] ?? product.stock_qty ?? 0);

              return (
                <div key={product.id}>
                  {/* Product row */}
                  <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                    {/* Expand toggle */}
                    <button
                      type="button"
                      onClick={() => hasVariations && toggleExpand(product.id)}
                      className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors flex-shrink-0 ${hasVariations ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "text-transparent cursor-default"}`}
                    >
                      {hasVariations && (isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />)}
                    </button>

                    {/* Image */}
                    {product.primary_img ? (
                      <img src={product.primary_img} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <FiPackage size={14} className="text-gray-300" />
                      </div>
                    )}

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.prod_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 font-mono">#{product.id}</span>
                        {product.sku && <span className="text-xs text-gray-400">• {product.sku}</span>}
                        {hasVariations && (
                          <span className="text-xs text-[#04A9FF] font-medium">
                            {product.product_variations.length} variations
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Current badge */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">Current:</span>
                      <StockBadge qty={product.stock_qty ?? 0} />
                    </div>

                    {/* Inline stock edit */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        type="number"
                        min="0"
                        value={edits[product.id] ?? ""}
                        onChange={(e) => setEdits((p) => ({ ...p, [product.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && saveProductStock(product.id)}
                        className="w-20 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-center outline-none focus:border-[#04A9FF] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => saveProductStock(product.id)}
                        disabled={isSaving || String(currentQty) === String(product.stock_qty)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                          wasSaved
                            ? "bg-green-100 text-green-600"
                            : "bg-[#04A9FF]/10 text-[#04A9FF] hover:bg-[#04A9FF] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        }`}
                      >
                        <FiSave size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Variation rows */}
                  {hasVariations && isExpanded && (
                    <div className="bg-gray-50/60 border-t border-gray-100">
                      {product.product_variations.map((v) => {
                        const vSaving = varSaving[v.id];
                        const vSaved = saved[v.id + "v"];
                        const vCurrentQty = parseInt(varEdits[v.id] ?? v.stock_qty ?? 0);
                        const label = [v.size, v.color].filter(Boolean).join(" / ") || v.variations_name || `Variation #${v.id}`;

                        return (
                          <div key={v.id} className="flex items-center gap-3 pl-16 pr-5 py-2.5 border-b border-gray-100 last:border-0 hover:bg-white/60 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-700 truncate">{label}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <StockBadge qty={v.stock_qty ?? 0} />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <input
                                type="number"
                                min="0"
                                value={varEdits[v.id] ?? ""}
                                onChange={(e) => setVarEdits((p) => ({ ...p, [v.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && saveVariationStock(v.id)}
                                className="w-20 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-center outline-none focus:border-[#04A9FF] bg-white transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => saveVariationStock(v.id)}
                                disabled={vSaving || String(vCurrentQty) === String(v.stock_qty)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                                  vSaved
                                    ? "bg-green-100 text-green-600"
                                    : "bg-[#04A9FF]/10 text-[#04A9FF] hover:bg-[#04A9FF] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                }`}
                              >
                                <FiSave size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-400" /> In Stock ({`> ${LOW_STOCK_THRESHOLD}`})</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> Low Stock (1–{LOW_STOCK_THRESHOLD})</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Out of Stock (0)</div>
      </div>
    </AdminLayout>
  );
}
