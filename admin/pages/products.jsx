import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiChevronLeft, FiChevronRight, FiPlus, FiEdit2 } from "react-icons/fi";

const PER_PAGE = 15;
const STATUS_TABS = ["All", "Active", "Inactive"];

export default function Products() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState("All");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_products");
      setProducts(Array.isArray(res.data?.productList) ? res.data.productList : []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchProducts();
  }, [ready, fetchProducts]);

  const isActive = (p) => p.status === 1 || p.status === "1" || p.status === true || p.status === "active" || p.status === "Active";

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (p.prod_name || p.name || "").toLowerCase().includes(q) || String(p.id).includes(q) || (p.sku || "").toLowerCase().includes(q);
    const matchStatus = statusTab === "All" || (statusTab === "Active" && isActive(p)) || (statusTab === "Inactive" && !isActive(p));
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    All: products.length,
    Active: products.filter(isActive).length,
    Inactive: products.filter((p) => !isActive(p)).length,
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Products">
      <Head><title>Products — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products by name or SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <Link href="/products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Product
        </Link>
      </div>

      <div className="flex gap-1 mb-4 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
        {STATUS_TABS.map((tab) => (
          <button key={tab} onClick={() => { setStatusTab(tab); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${statusTab === tab ? "bg-[#04A9FF] text-white" : "text-gray-500 hover:text-gray-700"}`}>
            {tab}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-md ${statusTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
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
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No products found</div>
        ) : (
          <div>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                    <th className="px-5 py-3.5 text-left">Product</th>
                    <th className="px-5 py-3.5 text-left">SKU</th>
                    <th className="px-5 py-3.5 text-left">Price</th>
                    <th className="px-5 py-3.5 text-left">Stock</th>
                    <th className="px-5 py-3.5 text-left">Status</th>
                    <th className="px-5 py-3.5 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((product) => {
                    const active = isActive(product);
                    const name = product.prod_name || product.name || "—";
                    const img = product.primary_img || product.image || product.thumbnail;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {img ? (
                              <img src={img} alt={name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-300 text-xs">IMG</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 line-clamp-1">{name}</p>
                              <p className="text-xs text-gray-400 font-mono">#{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-gray-500 text-xs">{product.sku || "—"}</td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800">₹{parseFloat(product.sale_price || product.regular_price || 0).toLocaleString("en-IN")}</p>
                          {product.regular_price && product.sale_price && product.regular_price !== product.sale_price && (
                            <p className="text-xs text-gray-400 line-through">₹{parseFloat(product.regular_price).toLocaleString("en-IN")}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 font-medium">
                          {product.stock_qty ?? product.stock ?? "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Link href={`/products/${product.id}`}
                            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <FiEdit2 size={13} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-gray-50">
              {paginated.map((product) => {
                const active = isActive(product);
                const name = product.prod_name || product.name || "—";
                const img = product.primary_img || product.image || product.thumbnail;
                return (
                  <div key={product.id} className="px-4 py-3.5">
                    <div className="flex items-start gap-3">
                      {img ? (
                        <img src={img} alt={name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-300 text-xs">IMG</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm line-clamp-1">{name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400 font-mono">#{product.id}</span>
                          {product.sku && <span className="text-xs text-gray-400">• {product.sku}</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="font-semibold text-gray-800 text-sm">
                            ₹{parseFloat(product.sale_price || product.regular_price || 0).toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-gray-500">Stock: {product.stock_qty ?? product.stock ?? "—"}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            <span className={`w-1 h-1 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                            {active ? "Active" : "Off"}
                          </span>
                        </div>
                      </div>
                      <Link href={`/products/${product.id}`}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                        <FiEdit2 size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">Page {page} of {totalPages} — {filtered.length} products</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <FiChevronLeft size={15} />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <FiChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
