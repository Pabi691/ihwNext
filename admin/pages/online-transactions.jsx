import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import {
  FiSearch, FiChevronLeft, FiChevronRight, FiEye,
  FiCreditCard, FiCheckCircle, FiXCircle, FiClock,
} from "react-icons/fi";

const PER_PAGE = 15;

/* ── helpers ──
   The order detail endpoint returns:
     d.data.order_data  (or d.data.order)
   with payments at:
     order.order_payments  (or order.orderPayments)
   and top-level payment info at:
     order.payment_method  (string or object)
*/

function getOrderPayments(o) {
  return o.order_payments || o.orderPayments || o.payments || [];
}

function getPaymentMethodStr(o) {
  // Top-level string
  if (typeof o.payment_method === "string" && o.payment_method) return o.payment_method;
  // Top-level object (e.g. { method: "razorpay" })
  if (typeof o.payment_method === "object" && o.payment_method)
    return o.payment_method.method || o.payment_method.name || "";
  if (typeof o.paymentMethod === "string" && o.paymentMethod) return o.paymentMethod;
  // order_payments array — prefer any non-COD entry
  const pays = getOrderPayments(o);
  if (pays.length > 0) {
    const online = pays.find((p) => {
      const m = (p.payment_method || "").toLowerCase();
      return m && !m.includes("cod") && !m.includes("cash");
    });
    return online?.payment_method || pays[0]?.payment_method || "";
  }
  return "";
}

function getTransactionRef(o) {
  if (o.transaction_id) return o.transaction_id;
  if (o.payment_reference) return o.payment_reference;
  if (o.razorpay_payment_id) return o.razorpay_payment_id;
  const pays = getOrderPayments(o);
  const p = pays.find(
    (p) => p.payment_reference && p.payment_reference !== "–" && p.payment_reference !== "-"
  );
  return p?.payment_reference || null;
}

function getPaymentStatus(o) {
  const pays = getOrderPayments(o);
  if (pays.length > 0) {
    const online = pays.find((p) => {
      const m = (p.payment_method || "").toLowerCase();
      return !m.includes("cod") && !m.includes("cash");
    }) || pays[0];
    const status = (online?.payment_status || "").toLowerCase();
    if (status === "success" || status === "paid") return "Success";
    if (status === "failed" || status === "failure") return "Failed";
    return "Pending";
  }
  const s = (o.payment_status || "").toLowerCase();
  if (s === "success" || s === "paid") return "Success";
  if (s === "failed" || s === "failure") return "Failed";
  return "Pending";
}

const isOnlineOrder = (o) => {
  // 1. order_payments array — most reliable (field confirmed from order detail page)
  const pays = getOrderPayments(o);
  if (pays.length > 0) {
    return pays.some((p) => {
      const m = (p.payment_method || "").toLowerCase();
      return m && !m.includes("cod") && !m.includes("cash");
    });
  }
  // 2. is_cod flag
  if (o.is_cod === 1 || o.is_cod === "1" || o.is_cod === true) return false;
  if (o.is_cod === 0 || o.is_cod === "0" || o.is_cod === false) return true;
  // 3. Top-level method string
  const method = getPaymentMethodStr(o).toLowerCase();
  if (method.includes("cod") || method.includes("cash")) return false;
  if (method.includes("razor") || method.includes("upi") || method.includes("online") ||
      method.includes("net") || method.includes("card") || method.includes("wallet") ||
      method.includes("paytm") || method.includes("phonepe")) return true;
  // 4. Transaction reference
  return !!(o.transaction_id || o.payment_reference || o.razorpay_payment_id);
};

function getCustomerName(o) {
  if (o.customer?.first_name || o.customer?.last_name)
    return `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim();
  return o.customer_name || o.shipping_name || "—";
}

function getCustomerEmail(o) {
  return o.customer?.email || o.customer_email || o.email || "";
}

function PayStatusBadge({ status }) {
  if (status === "Success")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700">
        <FiCheckCircle size={11} /> Success
      </span>
    );
  if (status === "Failed")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600">
        <FiXCircle size={11} /> Failed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-yellow-50 text-yellow-700">
      <FiClock size={11} /> Pending
    </span>
  );
}

function MethodBadge({ method }) {
  const m = method.toLowerCase();
  let label = method || "Online";
  let cls = "bg-blue-50 text-blue-700";
  if (m.includes("razor")) { label = "Razorpay"; cls = "bg-indigo-50 text-indigo-700"; }
  else if (m.includes("upi")) { label = "UPI"; cls = "bg-purple-50 text-purple-700"; }
  else if (m.includes("card")) { label = "Card"; cls = "bg-cyan-50 text-cyan-700"; }
  else if (m.includes("net")) { label = "Net Banking"; cls = "bg-teal-50 text-teal-700"; }
  else if (m.includes("wallet") || m.includes("paytm") || m.includes("phone")) { label = method; cls = "bg-orange-50 text-orange-700"; }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${cls}`}>
      <FiCreditCard size={10} /> {label}
    </span>
  );
}

/* ── page ── */
export default function OnlineTransactions() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_orders");
      const list = Array.isArray(res.data?.orderList) ? res.data.orderList : [];

      // Log the raw order shape so we can see what fields are available
      if (list.length > 0) {
        console.log("[OnlineTransactions] order keys:", Object.keys(list[0]));
        console.log("[OnlineTransactions] first order:", list[0]);
      }

      // Try client-side filter first
      let online = list.filter(isOnlineOrder);

      // If no orders detected — payment fields are not in the list response.
      // Fetch full details for every order to get the payments array.
      if (online.length === 0 && list.length > 0) {
        console.log("[OnlineTransactions] No payment fields on list. Fetching details for", list.length, "orders…");
        const detailed = await Promise.all(
          list.map(async (o) => {
            try {
              const d = await api("get", `/get_order_details/${o.id}`);
              // Detail response wraps the order in order_data (see orders/[id].jsx line 251)
              const order = d.data?.order_data || d.data?.order || d.data || o;
              return { ...o, ...order };
            } catch {
              return o;
            }
          })
        );
        if (detailed.length > 0) {
          console.log("[OnlineTransactions] enriched order keys:", Object.keys(detailed[0]));
          console.log("[OnlineTransactions] enriched first order:", detailed[0]);
        }
        online = detailed.filter(isOnlineOrder);
      }

      setOrders(online);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchOrders();
  }, [ready, fetchOrders]);

  const statuses = ["All", "Success", "Failed", "Pending"];

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || getPaymentStatus(o) === statusFilter;
    const q = search.toLowerCase();
    const ref = (getTransactionRef(o) || "").toLowerCase();
    const matchSearch = !q ||
      String(o.id).includes(q) ||
      ref.includes(q) ||
      getCustomerName(o).toLowerCase().includes(q) ||
      getCustomerEmail(o).toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    total: orders.length,
    success: orders.filter((o) => getPaymentStatus(o) === "Success").length,
    failed:  orders.filter((o) => getPaymentStatus(o) === "Failed").length,
    pending: orders.filter((o) => getPaymentStatus(o) === "Pending").length,
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Online Transactions">
      <Head><title>Online Transactions — IHW Admin</title></Head>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Online",    value: counts.total,   color: "text-[#04A9FF]", bg: "bg-blue-50" },
          { label: "Successful",      value: counts.success, color: "text-green-600", bg: "bg-green-50" },
          { label: "Failed",          value: counts.failed,  color: "text-red-500",   bg: "bg-red-50" },
          { label: "Pending",         value: counts.pending, color: "text-yellow-600",bg: "bg-yellow-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <FiCreditCard size={18} className={s.color} />
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order ID, transaction ID or customer..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm"
          />
        </div>
        <div className="text-sm text-gray-400 font-medium whitespace-nowrap">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto mb-5 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        {statuses.map((s) => {
          const cnt = s === "All" ? orders.length : orders.filter((o) => getPaymentStatus(o) === s).length;
          return (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === s ? "bg-[#04A9FF] text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              {s}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${statusFilter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm space-y-1">
            <p>No online transactions found</p>
            <p className="text-xs text-gray-300">Open browser console (F12) and search for <span className="font-mono">[OnlineTransactions]</span> to see the order field structure</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                    <th className="px-5 py-3.5 text-left">Order</th>
                    <th className="px-5 py-3.5 text-left">Transaction ID</th>
                    <th className="px-5 py-3.5 text-left">Customer</th>
                    <th className="px-5 py-3.5 text-left">Method</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                    <th className="px-5 py-3.5 text-left">Status</th>
                    <th className="px-5 py-3.5 text-left">Date</th>
                    <th className="px-5 py-3.5 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((order) => {
                    const ref = getTransactionRef(order);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-gray-700">#{order.id}</td>
                        <td className="px-5 py-3.5">
                          {ref ? (
                            <span className="font-mono text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-lg border border-gray-100 select-all">
                              {ref}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-gray-800">{getCustomerName(order)}</p>
                          <p className="text-xs text-gray-400">{getCustomerEmail(order)}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <MethodBadge method={getPaymentMethodStr(order)} />
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                          ₹{parseFloat(order.pay_amt || order.total_amount || order.grand_total || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-5 py-3.5">
                          <PayStatusBadge status={getPaymentStatus(order)} />
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => router.push(`/orders/${order.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#04A9FF]/10 text-[#04A9FF] text-xs font-semibold hover:bg-[#04A9FF]/20 transition-colors">
                            <FiEye size={13} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-gray-50">
              {paginated.map((order) => {
                const ref = getTransactionRef(order);
                return (
                  <div key={order.id} className="px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-gray-700 text-sm">#{order.id}</span>
                      <PayStatusBadge status={getPaymentStatus(order)} />
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <MethodBadge method={getPaymentMethodStr(order)} />
                    </div>
                    {ref && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 mb-0.5 font-medium">Transaction ID</p>
                        <p className="font-mono text-xs bg-gray-50 text-gray-700 px-2 py-1.5 rounded-lg border border-gray-100 break-all select-all">
                          {ref}
                        </p>
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-800 truncate">{getCustomerName(order)}</p>
                    {getCustomerEmail(order) && <p className="text-xs text-gray-400 truncate">{getCustomerEmail(order)}</p>}
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-bold text-gray-800 text-sm">
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
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">Page {page} of {totalPages} — {filtered.length} transactions</p>
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
