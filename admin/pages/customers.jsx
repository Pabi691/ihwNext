import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiChevronLeft, FiChevronRight, FiX, FiUser, FiPhone, FiMail, FiCalendar, FiShoppingBag } from "react-icons/fi";

const PER_PAGE = 15;

function CustomerPanel({ customerId, onClose, api }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api("get", `/getCustomerById/${customerId}`);
        setData(res.data?.customerData || res.data);
      } catch {}
      setLoading(false);
    })();
  }, [customerId, api]);

  const orders = data?.orders || [];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-gray-900 font-bold text-base">Customer Details</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <FiX size={16} />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : !data ? (
          <div className="p-6 text-center text-gray-400">Customer not found</div>
        ) : (
          <div className="flex-1 p-6 space-y-6">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">
                  {(data.first_name || data.name || "?")[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">
                  {data.first_name ? `${data.first_name} ${data.last_name || ""}` : data.name || "—"}
                </p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${data.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {data.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Contact</p>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <FiMail size={15} className="text-[#04A9FF] flex-shrink-0" />
                <span>{data.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <FiPhone size={15} className="text-[#04A9FF] flex-shrink-0" />
                <span>{data.mobile_number || data.phone || "—"}</span>
              </div>
              {data.alt_mob_number && (
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FiPhone size={15} className="text-gray-400 flex-shrink-0" />
                  <span>{data.alt_mob_number} (Alt)</span>
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Personal</p>
              {data.gender && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <FiUser size={15} className="text-[#04A9FF] flex-shrink-0" />
                  <span>{data.gender}</span>
                </div>
              )}
              {data.dob && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <FiCalendar size={15} className="text-[#04A9FF] flex-shrink-0" />
                  <span>{new Date(data.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              )}
              {data.created_at && (
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FiCalendar size={15} className="text-gray-400 flex-shrink-0" />
                  <span>Joined {new Date(data.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              )}
            </div>

            {/* Address */}
            {(data.address || data.city) && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">Address</p>
                {data.address && <p className="text-sm text-gray-700">{data.address}</p>}
                {(data.city || data.state) && (
                  <p className="text-sm text-gray-600">{[data.city, data.state, data.zip_code].filter(Boolean).join(", ")}</p>
                )}
                {data.country && <p className="text-sm text-gray-500">{data.country}</p>}
              </div>
            )}

            {/* Orders */}
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-3">
                <FiShoppingBag size={12} className="inline mr-1" />
                Orders ({orders.length})
              </p>
              {orders.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <span className="font-mono font-bold text-gray-700 text-sm">#{order.id}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        ₹{parseFloat(order.pay_amt || order.total_amount || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : ""}
                      </span>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <p className="text-xs text-center text-gray-400 mt-1">+{orders.length - 5} more orders</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Customers() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState(null);
  const [viewId, setViewId] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_customers");
      setCustomers(Array.isArray(res.data?.customers) ? res.data.customers : []);
    } catch {
      setCustomers([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchCustomers();
  }, [ready, fetchCustomers]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (c.first_name || c.name || c.full_name || "").toLowerCase().includes(q) ||
      (c.last_name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.mobile_number || c.phone || "").includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleStatus = async (customer) => {
    setToggling(customer.id);
    const newStatus = customer.is_active === 1 || customer.is_active === "1" || customer.is_active === true ? 0 : 1;
    try {
      await api("get", `/update_customer_status/${customer.id}/${newStatus}`);
      setCustomers((prev) => prev.map((c) => c.id === customer.id ? { ...c, is_active: newStatus } : c));
    } catch {}
    setToggling(null);
  };

  const isActive = (c) => c.is_active === 1 || c.is_active === "1" || c.is_active === true || c.status === 1 || c.status === "active";

  const initials = (c) => {
    const name = `${c.first_name || c.name || ""} ${c.last_name || ""}`.trim();
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "?";
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Customers">
      <Head><title>Customers — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email or phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm"
          />
        </div>
        <div className="text-sm text-gray-400 font-medium whitespace-nowrap">
          {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-5 py-3.5 text-left">Customer</th>
                  <th className="px-5 py-3.5 text-left">Phone</th>
                  <th className="px-5 py-3.5 text-left">Gender</th>
                  <th className="px-5 py-3.5 text-left">Joined</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((customer) => {
                  const active = isActive(customer);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{initials(customer)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {customer.first_name ? `${customer.first_name} ${customer.last_name || ""}` : customer.name || "—"}
                            </p>
                            <p className="text-xs text-gray-400">{customer.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{customer.mobile_number || customer.phone || "—"}</td>
                      <td className="px-5 py-3.5 text-gray-500 capitalize">{customer.gender || "—"}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewId(customer.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#04A9FF]/10 text-[#04A9FF] hover:bg-[#04A9FF]/20 transition-colors">
                            View
                          </button>
                          <button
                            onClick={() => toggleStatus(customer)}
                            disabled={toggling === customer.id}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${
                              active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {toggling === customer.id ? "..." : active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">Page {page} of {totalPages} — {filtered.length} customers</p>
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

      {viewId && (
        <CustomerPanel customerId={viewId} onClose={() => setViewId(null)} api={api} />
      )}
    </AdminLayout>
  );
}
