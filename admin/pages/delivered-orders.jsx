import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiPackage, FiLink, FiCopy, FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function getStatus(o) {
  return o.shipping_status || o.order_status?.status_description || o.status || "";
}

function getCustomerName(o) {
  const c = o.customer || {};
  return [c.first_name, c.last_name].filter(Boolean).join(" ") || o.customer_name || "—";
}

function getCorrectPayable(o) {
  return Math.round(
    parseFloat(o.bill_amt || 0) - parseFloat(o.discount_amt || 0) + parseFloat(o.shipping_total || 0)
  );
}

export default function DeliveredOrders() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [linkState, setLinkState] = useState({});   // { [itemId]: { loading, token, copied } }

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_orders");
      const all = Array.isArray(res.data?.orders) ? res.data.orders
                : Array.isArray(res.data)          ? res.data
                : [];
      setOrders(all.filter((o) => getStatus(o) === "Delivered"));
    } catch { setOrders([]); }
    setLoading(false);
  }, [api]);

  useEffect(() => { if (ready) fetchOrders(); }, [ready, fetchOrders]);

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const generateLink = async (order, item) => {
    const key = item.id;
    setLinkState((p) => ({ ...p, [key]: { loading: true } }));
    try {
      const res = await api("post", "/generate_review_link", {
        order_id:      order.id,
        order_item_id: item.id,
        product_id:    item.product_id,
        product_name:  item.product_name,
      });
      if (res.data?.status && res.data?.token) {
        setLinkState((p) => ({ ...p, [key]: { loading: false, token: res.data.token } }));
      } else {
        setLinkState((p) => ({ ...p, [key]: { loading: false, error: "Failed to generate link." } }));
      }
    } catch {
      setLinkState((p) => ({ ...p, [key]: { loading: false, error: "Failed to generate link." } }));
    }
  };

  const copyLink = (itemId, token) => {
    const url = `${SITE_URL}/review/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkState((p) => ({ ...p, [itemId]: { ...p[itemId], copied: true } }));
      setTimeout(() => setLinkState((p) => ({ ...p, [itemId]: { ...p[itemId], copied: false } })), 2500);
    });
  };

  const q = search.toLowerCase();
  const filtered = orders.filter((o) =>
    !q ||
    String(o.id).includes(q) ||
    getCustomerName(o).toLowerCase().includes(q) ||
    (o.customer?.email || "").toLowerCase().includes(q)
  );

  if (!ready) return null;

  return (
    <AdminLayout title="Delivered Orders">
      <Head><title>Delivered Orders — IHW Admin</title></Head>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center text-gray-400 text-sm">
          No delivered orders found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const items = order.order_items || order.orderItems || [];
            const isOpen = !!expanded[order.id];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Order header */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="font-mono font-bold text-gray-700 text-sm flex-shrink-0">#{order.id}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{getCustomerName(order)}</p>
                      <p className="text-xs text-gray-400 truncate">{order.customer?.email || ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-800 text-sm">₹{getCorrectPayable(order).toLocaleString("en-IN")}</p>
                      <p className="text-xs text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Delivered
                    </span>
                    {isOpen ? <FiChevronUp size={16} className="text-gray-400" /> : <FiChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {/* Items */}
                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {items.length === 0 ? (
                      <p className="px-5 py-4 text-sm text-gray-400">No items found</p>
                    ) : (
                      items.map((item) => {
                        const ls = linkState[item.id] || {};
                        const reviewUrl = ls.token ? `${SITE_URL}/review/${ls.token}` : null;
                        return (
                          <div key={item.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                            {/* Product info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {item.product_details?.primary_img ? (
                                <img src={item.product_details.primary_img} alt={item.product_name}
                                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <FiPackage size={16} className="text-gray-300" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name || "—"}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity} · ₹{parseFloat(item.price || 0).toLocaleString("en-IN")}</p>
                              </div>
                            </div>

                            {/* Review link actions */}
                            <div className="flex-shrink-0 flex flex-col sm:items-end gap-1.5">
                              {!ls.token && !ls.loading && (
                                <button onClick={() => generateLink(order, item)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#04A9FF]/10 text-[#04A9FF] text-xs font-semibold hover:bg-[#04A9FF]/20 transition-colors">
                                  <FiLink size={12} /> Generate Review Link
                                </button>
                              )}
                              {ls.loading && (
                                <span className="text-xs text-gray-400 px-3 py-1.5">Generating...</span>
                              )}
                              {ls.error && (
                                <span className="text-xs text-red-500 px-3 py-1.5">{ls.error}</span>
                              )}
                              {reviewUrl && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 font-mono max-w-[200px] truncate" title={reviewUrl}>
                                    {reviewUrl}
                                  </span>
                                  <button onClick={() => copyLink(item.id, ls.token)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${ls.copied ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                    {ls.copied ? <><FiCheck size={11} /> Copied!</> : <><FiCopy size={11} /> Copy</>}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
