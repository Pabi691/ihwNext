import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiChevronLeft, FiChevronRight, FiRefreshCw, FiCheckCircle, FiClock } from "react-icons/fi";

const PER_PAGE = 15;

function getOrderStatus(o) {
  return (o.order_status?.status_description || o.order_status_name || o.status || "").toLowerCase();
}

function isCancelled(o) {
  return getOrderStatus(o).includes("cancel");
}

function getOnlinePayment(o) {
  const pays = o.order_payments || o.orderPayments || o.payments || [];
  return pays.find((p) => {
    const m = (p.payment_method || "").toLowerCase();
    return (m.includes("razor") || m.includes("online") || m.includes("upi") || m.includes("card"))
      && p.payment_status === "completed";
  }) || null;
}

function getCustomerName(o) {
  if (o.customer?.first_name || o.customer?.last_name)
    return `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim();
  return o.customer_name || o.shipping_name || "—";
}

function getCustomerEmail(o) {
  return o.customer?.email || o.customer_email || o.email || "—";
}

export default function PendingRefunds() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [refundOrders, setRefundOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refundedIds, setRefundedIds] = useState({});
  const [marking, setMarking] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setEnriching(false);
    try {
      // Step 1: get all orders
      const res = await api("get", "/get_orders");
      const list = Array.isArray(res.data?.orderList) ? res.data.orderList : [];

      // Step 2: filter to cancelled orders only (status field IS in the list response)
      const cancelled = list.filter(isCancelled);

      if (cancelled.length === 0) {
        setRefundOrders([]);
        setLoading(false);
        return;
      }

      // Step 3: enrich each cancelled order with full details to get order_payments
      setEnriching(true);
      const enriched = await Promise.all(
        cancelled.map(async (o) => {
          try {
            const d = await api("get", `/get_order_details/${o.id}`);
            const detail = d.data?.order_data || d.data?.order || d.data || {};
            return { ...o, ...detail };
          } catch {
            return o;
          }
        })
      );

      // Step 4: keep only those with a completed online payment
      const needsRefund = enriched.filter((o) => getOnlinePayment(o) !== null);
      setRefundOrders(needsRefund);
    } catch {
      setRefundOrders([]);
    }
    setLoading(false);
    setEnriching(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchOrders();
  }, [ready, fetchOrders]);

  const filtered = refundOrders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const pay = getOnlinePayment(o);
    return (
      String(o.id).includes(q) ||
      getCustomerName(o).toLowerCase().includes(q) ||
      getCustomerEmail(o).toLowerCase().includes(q) ||
      (pay?.payment_reference || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const pendingCount = refundOrders.filter((o) => !refundedIds[o.id]).length;
  const pendingAmount = refundOrders
    .filter((o) => !refundedIds[o.id])
    .reduce((sum, o) => sum + parseFloat(getOnlinePayment(o)?.payment_amount || o.pay_amt || 0), 0);

  const markRefunded = async (orderId) => {
    setMarking(orderId);
    try {
      await api("post", `/mark_refund_completed/${orderId}`, {});
    } catch {
      // Endpoint may not exist yet — mark locally so admin can track within session
    } finally {
      setRefundedIds((prev) => ({ ...prev, [orderId]: true }));
      setMarking(null);
    }
  };

  if (!ready) return null;

  const isLoadingAny = loading || enriching;

  return (
    <>
      <Head><title>Pending Refunds — Admin</title></Head>
      <AdminLayout title="Pending Refunds">
        <div className="space-y-5">

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Pending Refunds</p>
              <p className="text-2xl font-bold text-red-600">{isLoadingAny ? "…" : pendingCount}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Amount to Refund</p>
              <p className="text-2xl font-bold text-gray-800">
                {isLoadingAny ? "…" : `₹${pendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Marked Refunded</p>
              <p className="text-2xl font-bold text-green-600">{Object.keys(refundedIds).length}</p>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-800">Cancelled Orders — Online Payment Received</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Use the Payment Reference to process refunds via the Razorpay dashboard, then mark each as refunded here.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search order / customer…"
                    className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04A9FF]/30 w-56"
                  />
                </div>
                <button
                  onClick={fetchOrders}
                  disabled={isLoadingAny}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  title="Refresh"
                >
                  <FiRefreshCw size={15} className={`text-gray-500 ${isLoadingAny ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {isLoadingAny ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <FiRefreshCw size={24} className="animate-spin" />
                <p className="text-sm">{enriching ? "Checking payment details for cancelled orders…" : "Loading orders…"}</p>
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <FiCheckCircle size={36} className="text-green-400" />
                <p className="text-sm font-medium">No pending refunds — all clear!</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Order ID", "Customer", "Amount Paid", "Payment Reference", "Order Date", "Refund Status", "Action"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginated.map((o) => {
                        const isRefunded = !!refundedIds[o.id];
                        const pay = getOnlinePayment(o);
                        const amount = parseFloat(pay?.payment_amount || o.pay_amt || 0);
                        const ref = pay?.payment_reference || "—";
                        return (
                          <tr key={o.id} className={`hover:bg-gray-50/50 transition-colors ${isRefunded ? "opacity-50" : ""}`}>
                            <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700">#{o.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">{getCustomerName(o)}</p>
                              <p className="text-xs text-gray-400">{getCustomerEmail(o)}</p>
                            </td>
                            <td className="px-4 py-3 font-semibold text-red-600">
                              ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[200px] truncate" title={ref}>
                              {ref}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {o.created_at
                                ? new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {isRefunded ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700">
                                  <FiCheckCircle size={11} /> Refunded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700">
                                  <FiClock size={11} /> Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {!isRefunded && (
                                <button
                                  onClick={() => markRefunded(o.id)}
                                  disabled={marking === o.id}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                                >
                                  {marking === o.id ? "Saving…" : "Mark Refunded"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {paginated.map((o) => {
                    const isRefunded = !!refundedIds[o.id];
                    const pay = getOnlinePayment(o);
                    const amount = parseFloat(pay?.payment_amount || o.pay_amt || 0);
                    const ref = pay?.payment_reference || "—";
                    return (
                      <div key={o.id} className={`p-4 space-y-2 ${isRefunded ? "opacity-50" : ""}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800">#{o.id}</p>
                            <p className="text-xs text-gray-500">{getCustomerName(o)}</p>
                          </div>
                          {isRefunded ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700">
                              <FiCheckCircle size={10} /> Refunded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700">
                              <FiClock size={10} /> Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-red-600">₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-gray-400 font-mono truncate">Ref: {ref}</p>
                        {!isRefunded && (
                          <button
                            onClick={() => markRefunded(o.id)}
                            disabled={marking === o.id}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                          >
                            {marking === o.id ? "Saving…" : "Mark Refunded"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        <FiChevronLeft size={14} />
                      </button>
                      <span className="text-xs text-gray-600 px-2">{page} / {totalPages}</span>
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        <FiChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
