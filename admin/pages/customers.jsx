import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiChevronLeft, FiChevronRight, FiX, FiUser, FiPhone, FiMail, FiCalendar, FiShoppingBag, FiSend, FiArrowLeft, FiMessageSquare, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const PER_PAGE = 15;

const EMAIL_TEMPLATES = [
  { label: "Custom Message", subject: "", body: "" },
  {
    label: "Order Update",
    subject: "Update on Your Order — IndianHairWorld",
    body: "We wanted to inform you about the latest update on your recent order with IndianHairWorld.\n\nYour order is currently being processed and will be dispatched shortly. You will receive a tracking number once the shipment is on its way.\n\nIf you have any questions, feel free to reach out to us anytime.",
  },
  {
    label: "Welcome Message",
    subject: "Welcome to IndianHairWorld! 🎉",
    body: "Thank you for joining IndianHairWorld! We're thrilled to have you as part of our family.\n\nAt IndianHairWorld, we offer premium quality hair products including hair patches, wigs, and extensions. Browse our collection at indianhairworld.com and discover the perfect look for you.\n\nAs a new member, feel free to reach out if you need any assistance choosing the right product. Our team is here to help!",
  },
  {
    label: "Promotion / Offer",
    subject: "Exclusive Offer Just for You! — IndianHairWorld",
    body: "We have an exciting offer exclusively for you!\n\n🎁 Get a special discount on your next purchase at IndianHairWorld. Use the code at checkout and enjoy premium hair solutions at unbeatable prices.\n\nHurry, this offer is valid for a limited time only!\n\nVisit indianhairworld.com to shop now.",
  },
  {
    label: "Follow-Up",
    subject: "How's Your Experience? — IndianHairWorld",
    body: "We hope you're enjoying your recent purchase from IndianHairWorld!\n\nYour feedback is incredibly valuable to us. If you have a moment, we'd love to hear about your experience. You can also leave a review on our website.\n\nIf you need any assistance with your product or have any questions, our team is always here to help.",
  },
];

function EmailComposer({ customer, onClose, onSuccess }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success' | 'error', msg }

  const customerName = customer.first_name
    ? `${customer.first_name} ${customer.last_name || ""}`.trim()
    : customer.name || "Customer";
  const customerEmail = customer.email;

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject);
    setBody(tpl.body);
    setResult(null);
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setResult({ type: "error", msg: "Please fill in both subject and message." });
      return;
    }
    setSending(true);
    setResult(null);
    try {
      await axios.post("/api/send-email", {
        to: customerEmail,
        subject: subject.trim(),
        message: body.trim(),
        customerName,
      });
      setResult({ type: "success", msg: "Email sent successfully!" });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setResult({ type: "error", msg: err.response?.data?.error || "Failed to send email. Please try again." });
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Compose Email</h3>
              <p className="text-xs text-gray-400">To: {customerEmail}</p>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend size={14} />
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Result Toast */}
          {result && (
            <div className={`mx-5 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${
              result.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {result.type === "success" ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
              {result.msg}
            </div>
          )}

          {/* Quick Templates */}
          <div className="px-5 pt-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">Quick Templates</p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {EMAIL_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(tpl)}
                  className="flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 hover:bg-[#04A9FF]/10 hover:text-[#04A9FF] hover:border-[#04A9FF]/20 transition-colors whitespace-nowrap"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient info */}
          <div className="px-5 pt-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {(customer.first_name || customer.name || "?")[0]?.toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{customerName}</p>
                <p className="text-xs text-gray-400 truncate">{customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="px-5 pt-4">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wide block mb-1.5">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] transition-colors bg-white"
            />
          </div>

          {/* Message Body */}
          <div className="px-5 pt-4 pb-6">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wide block mb-1.5">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] transition-colors bg-white resize-none leading-relaxed"
            />
            <p className="text-xs text-gray-400 mt-2">
              📧 Email will be sent from <span className="font-semibold">indianhairworld1@gmail.com</span> with professional branding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerPanel({ customerId, onClose, api }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [emailToast, setEmailToast] = useState(null);

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
  const customerName = data?.first_name
    ? `${data.first_name} ${data.last_name || ""}`.trim()
    : data?.name || "Customer";
  const customerPhone = data?.mobile_number || data?.phone || "";
  const customerEmail = data?.email || "";

  const handleCall = () => {
    if (customerPhone) {
      window.open(`tel:${customerPhone}`, "_self");
    }
  };

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

        {/* Email sent toast */}
        {emailToast && (
          <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <FiCheckCircle size={16} /> Email sent successfully!
          </div>
        )}

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
                <p className="font-bold text-gray-800 text-lg">{customerName}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${data.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {data.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Quick Actions — Call & Email */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCall}
                disabled={!customerPhone}
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-sm shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <FiPhone size={16} />
                Call Now
              </button>
              <button
                onClick={() => setShowEmail(true)}
                disabled={!customerEmail}
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-[#04A9FF] hover:bg-[#0070cc] text-white font-bold text-sm transition-all shadow-sm shadow-[#04A9FF]/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <FiMail size={16} />
                Send Email
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Contact</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <FiMail size={15} className="text-[#04A9FF] flex-shrink-0" />
                  <span className="truncate">{customerEmail || "—"}</span>
                </div>
                {customerEmail && (
                  <button
                    onClick={() => setShowEmail(true)}
                    className="text-xs font-semibold text-[#04A9FF] hover:underline flex-shrink-0 ml-2"
                  >
                    Compose
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <FiPhone size={15} className="text-[#04A9FF] flex-shrink-0" />
                  <span>{customerPhone || "—"}</span>
                </div>
                {customerPhone && (
                  <a
                    href={`tel:${customerPhone}`}
                    className="text-xs font-semibold text-emerald-600 hover:underline flex-shrink-0 ml-2"
                  >
                    Call
                  </a>
                )}
              </div>
              {data.alt_mob_number && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <FiPhone size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{data.alt_mob_number} (Alt)</span>
                  </div>
                  <a
                    href={`tel:${data.alt_mob_number}`}
                    className="text-xs font-semibold text-emerald-600 hover:underline flex-shrink-0 ml-2"
                  >
                    Call
                  </a>
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

        {/* Email Compose Modal */}
        {showEmail && data && (
          <EmailComposer
            customer={data}
            onClose={() => setShowEmail(false)}
            onSuccess={() => {
              setEmailToast(true);
              setTimeout(() => setEmailToast(null), 3000);
            }}
          />
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
          <div>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
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

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-gray-50">
              {paginated.map((customer) => {
                const active = isActive(customer);
                return (
                  <div key={customer.id} className="px-4 py-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{initials(customer)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {customer.first_name ? `${customer.first_name} ${customer.last_name || ""}` : customer.name || "—"}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold flex-shrink-0 ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            <span className={`w-1 h-1 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                            {active ? "Active" : "Off"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{customer.email || "—"}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{customer.mobile_number || customer.phone || "—"}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => setViewId(customer.id)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#04A9FF]/10 text-[#04A9FF]">
                            View
                          </button>
                          <button
                            onClick={() => toggleStatus(customer)}
                            disabled={toggling === customer.id}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg disabled:opacity-60 ${
                              active ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                            }`}
                          >
                            {toggling === customer.id ? "..." : active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </div>
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
