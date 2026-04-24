import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";

const PER_PAGE = 15;

const STATUS_STYLES = {
  Pending:    { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  Processing: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  Shipped:    { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  Delivered:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400" },
  Cancelled:  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
  Returned:   { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function ReturnOrders() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_return_orders");
      setOrders(Array.isArray(res.data?.orderList) ? res.data.orderList : []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchOrders();
  }, [ready, fetchOrders]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const name = o.customer?.first_name ? `${o.customer.first_name} ${o.customer.last_name || ""}`.trim() : (o.customer_name || o.shipping_name || "");
    return !q || String(o.id).includes(q) || name.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (!ready) return null;

  return (
    <AdminLayout title="Return Orders">
      <Head><title>Return Orders — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order ID or customer..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm"
          />
        </div>
        <div className="text-sm text-gray-400 font-medium whitespace-nowrap">{filtered.length} return order{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No return orders found</div>
        ) : (
          <div>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                    <th className="px-5 py-3.5 text-left">Order</th>
                    <th className="px-5 py-3.5 text-left">Customer</th>
                    <th className="px-5 py-3.5 text-left">Amount</th>
                    <th className="px-5 py-3.5 text-left">Status</th>
                    <th className="px-5 py-3.5 text-left">Date</th>
                    <th className="px-5 py-3.5 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-gray-700">#{order.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800">{order.customer?.first_name ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim() : (order.customer_name || order.shipping_name || "—")}</p>
                        <p className="text-xs text-gray-400">{order.customer?.email || order.customer_email || ""}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">
                        ₹{parseFloat(order.pay_amt || order.total_amount || order.grand_total || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={order.order_status?.status_description || order.order_status_name || order.status || "Returned"} />
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => router.push(`/orders/${order.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#04A9FF]/10 text-[#04A9FF] text-xs font-semibold hover:bg-[#04A9FF]/20 transition-colors">
                          <FiEye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-gray-50">
              {paginated.map((order) => (
                <div key={order.id} className="px-4 py-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-gray-700 text-sm">#{order.id}</span>
                    <StatusBadge status={order.order_status?.status_description || order.order_status_name || order.status || "Returned"} />
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {order.customer?.first_name ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim() : (order.customer_name || order.shipping_name || "—")}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-gray-800 text-sm">
                      ₹{parseFloat(order.pay_amt || order.total_amount || order.grand_total || 0).toLocaleString("en-IN")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : ""}
                      </span>
                      <button onClick={() => router.push(`/orders/${order.id}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#04A9FF]/10 text-[#04A9FF] text-xs font-semibold">
                        <FiEye size={12} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">Page {page} of {totalPages} — {filtered.length} orders</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <FiChevronLeft size={15} />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <FiChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
