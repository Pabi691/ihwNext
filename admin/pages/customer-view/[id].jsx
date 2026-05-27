import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import {
  FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin,
  FiShoppingBag, FiPackage, FiClock, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiRefreshCw, FiEye, FiShoppingCart,
} from "react-icons/fi";

const TABS = ["Overview", "Orders", "Cart", "Addresses", "Profile"];

const STATUS_STYLES = {
  Delivered:         { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400" },
  Pending:           { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  Processing:        { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  Shipped:           { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  "Order Cancelled ":{ bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
  "Payment Failed":  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
  "Refund Received": { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status || "Unknown"}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      {Icon && <Icon size={15} className="text-[#04A9FF] flex-shrink-0" />}
      <span className="text-sm text-gray-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function OverviewTab({ data }) {
  const name = data?.first_name
    ? `${data.first_name} ${data.last_name || ""}`.trim()
    : data?.name || "Customer";
  const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "?";
  const orders = data?.orders || [];

  const tiles = [
    { label: "Total Orders",   value: orders.length, icon: FiShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Delivered",      value: orders.filter((o) => o.shipping_status === "Delivered").length, icon: FiCheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Pending",        value: orders.filter((o) => o.shipping_status === "Pending").length, icon: FiClock, color: "bg-yellow-50 text-yellow-600" },
    { label: "Cancelled",      value: orders.filter((o) => (o.shipping_status || "").includes("Cancelled")).length, icon: FiXCircle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{data?.email || "—"}</p>
            {data?.mobile_number && <p className="text-sm text-gray-500">{data.mobile_number}</p>}
            <span className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold ${data?.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${data?.is_active ? "bg-green-400" : "bg-gray-400"}`} />
              {data?.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center mx-auto mb-3`}>
              <t.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{t.value}</p>
            <p className="text-xs text-gray-400 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <FiShoppingBag size={14} className="text-[#04A9FF]" /> Recent Orders
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-sm font-bold text-gray-700">#{order.id}</span>
                  <StatusBadge status={order.shipping_status} />
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-right">
                  <span className="text-sm font-semibold text-gray-800">
                    ₹{parseFloat(order.pay_amt || order.total_amount || order.net_amt || 0).toLocaleString("en-IN")}
                  </span>
                  {order.created_at && (
                    <span className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders, customerId, router }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <FiShoppingBag size={32} className="mx-auto text-gray-200 mb-3" />
        <p className="text-gray-400 text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-gray-700">#{order.id}</span>
              <StatusBadge status={order.shipping_status} />
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-800">
                ₹{parseFloat(order.pay_amt || order.total_amount || order.net_amt || 0).toLocaleString("en-IN")}
              </span>
              {order.order_date && (
                <span className="text-xs text-gray-400">{order.order_date}</span>
              )}
              <button
                onClick={() => router.push(`/customer-view/order/${order.id}?customerId=${customerId}`)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#04A9FF]/10 text-[#04A9FF] hover:bg-[#04A9FF]/20 transition-colors flex-shrink-0"
              >
                <FiEye size={12} /> View Details
              </button>
            </div>
          </div>

          {order.order_items && order.order_items.length > 0 && (
            <div className="divide-y divide-gray-50">
              {order.order_items.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <FiPackage size={14} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 truncate">{item.product_name || "Product"}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-800">₹{parseFloat(item.total_price || item.price || 0).toLocaleString("en-IN")}</p>
                    {item.price && item.quantity && (
                      <p className="text-xs text-gray-400">₹{parseFloat(item.price).toLocaleString("en-IN")} × {item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {order.net_amt && (
            <div className="px-5 py-3 bg-gray-50/50 flex justify-between text-sm">
              <span className="text-gray-500">Net Amount</span>
              <span className="font-bold text-gray-800">₹{parseFloat(order.net_amt).toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AddressesTab({ addresses, profileData }) {
  const hasAddresses = addresses && addresses.length > 0;
  const profileAddress = profileData?.address || profileData?.city;

  return (
    <div className="space-y-4">
      {hasAddresses ? (
        addresses.map((addr, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FiMapPin size={16} className="text-[#04A9FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800 text-sm">{addr.full_name || addr.address_label || `Address ${i + 1}`}</p>
                  {addr.address_label && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">{addr.address_label}</span>}
                </div>
                {addr.mobile_number && <p className="text-xs text-gray-500 mb-1">{addr.mobile_number}</p>}
                {addr.address_line_1 && <p className="text-sm text-gray-600">{addr.address_line_1}</p>}
                <p className="text-sm text-gray-600">
                  {[addr.city, addr.state, addr.zip_code].filter(Boolean).join(", ")}
                </p>
                {addr.country && <p className="text-sm text-gray-500">{addr.country}</p>}
              </div>
            </div>
          </div>
        ))
      ) : profileAddress ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FiMapPin size={16} className="text-[#04A9FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm mb-1">Profile Address</p>
              {profileData.address && <p className="text-sm text-gray-600">{profileData.address}</p>}
              <p className="text-sm text-gray-600">
                {[profileData.city, profileData.state, profileData.zip_code].filter(Boolean).join(", ")}
              </p>
              {profileData.country && <p className="text-sm text-gray-500">{profileData.country}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <FiMapPin size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No addresses saved</p>
        </div>
      )}
    </div>
  );
}

function CartTab({ customerId, api }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    api("get", `/get_customer_cart_admin/${customerId}`)
      .then((res) => setItems(Array.isArray(res.data?.cart_items) ? res.data.cart_items : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [customerId, api]);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!items.length) return (
    <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
      <FiShoppingCart size={32} className="mx-auto text-gray-200 mb-3" />
      <p className="text-gray-400 text-sm">Cart is empty</p>
    </div>
  );

  const total = items.reduce((sum, item) => sum + (parseFloat(item.price || item.sale_price || 0) * (item.quantity || 1)), 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <FiShoppingCart size={14} className="text-[#04A9FF]" />
            Cart Items ({items.length})
          </h3>
          <span className="text-sm font-bold text-gray-800">
            Total ≈ ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {items.map((item) => {
            const price = parseFloat(item.price || item.sale_price || 0);
            const mrp = parseFloat(item.regular_price || 0);
            const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
            return (
              <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  {item.primary_img ? (
                    <img src={item.primary_img} alt={item.prod_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.prod_name || "Product"}</p>
                  {item.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-800">₹{price.toLocaleString("en-IN")}</span>
                    {discount > 0 && (
                      <>
                        <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString("en-IN")}</span>
                        <span className="text-xs font-bold text-green-600">{discount}% off</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {item.is_cod == 1 && <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">COD</span>}
                    {item.is_returnable == 1 && <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded font-medium">Returnable</span>}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-500">Qty</p>
                  <p className="text-lg font-bold text-gray-800">{item.quantity}</p>
                  <p className="text-xs text-gray-400">= ₹{(price * (item.quantity || 1)).toLocaleString("en-IN")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ data }) {
  const name = data?.first_name
    ? `${data.first_name} ${data.last_name || ""}`.trim()
    : data?.name || "—";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-1">
      <InfoRow icon={FiUser}     label="Full Name"   value={name} />
      <InfoRow icon={FiMail}     label="Email"       value={data?.email} />
      <InfoRow icon={FiPhone}    label="Phone"       value={data?.mobile_number} />
      {data?.alt_mob_number && <InfoRow icon={FiPhone} label="Alt Phone" value={data.alt_mob_number} />}
      <InfoRow icon={FiUser}     label="Gender"      value={data?.gender} />
      <InfoRow icon={FiCalendar} label="Date of Birth" value={data?.dob ? new Date(data.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : null} />
      <InfoRow icon={FiCalendar} label="Member Since" value={data?.created_at ? new Date(data.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : null} />
      <InfoRow icon={FiMapPin}   label="Address"     value={data?.address} />
      <InfoRow icon={FiMapPin}   label="City"        value={data?.city} />
      <InfoRow icon={FiMapPin}   label="State"       value={data?.state} />
      <InfoRow icon={FiMapPin}   label="Pincode"     value={data?.zip_code} />
      <InfoRow icon={FiMapPin}   label="Country"     value={data?.country} />
    </div>
  );
}

export default function CustomerDashboardView() {
  const router = useRouter();
  const { id } = router.query;
  const { api } = useAdmin();
  const { ready } = useAuthGuard();
  const [data, setData]           = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState("Overview");

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api("get", `/getCustomerById/${id}`);
      setData(res.data?.customerData || res.data);
    } catch {}

    try {
      const addrRes = await api("get", `/get_customer_shipping_addresses/${id}`);
      const list = addrRes.data?.shipping_addresses || addrRes.data?.addresses || [];
      if (Array.isArray(list)) setAddresses(list);
    } catch {}

    setLoading(false);
  }, [id, api]);

  useEffect(() => {
    if (!ready || !id) return;
    fetchData();
  }, [ready, id, fetchData]);

  if (!ready) return null;

  const customerName = data?.first_name
    ? `${data.first_name} ${data.last_name || ""}`.trim()
    : data?.name || "Customer";

  return (
    <AdminLayout title="Customer Dashboard">
      <Head><title>Customer Dashboard — IHW Admin</title></Head>

      {/* Admin view banner */}
      <div className="mb-5 flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
        <div className="flex items-center gap-3">
          <FiAlertCircle size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-amber-800">
            Admin View — You are previewing the dashboard of{" "}
            <span className="font-bold">{loading ? "..." : customerName}</span>
            {data?.email && <span className="font-normal text-amber-700"> ({data.email})</span>}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors flex-shrink-0"
        >
          <FiArrowLeft size={14} /> Back
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !data ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <FiUser size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400">Customer not found</p>
        </div>
      ) : (
        <div>
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  tab === t
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={fetchData}
              className="ml-1 px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <FiRefreshCw size={14} />
            </button>
          </div>

          {/* Tab content */}
          {tab === "Overview"   && <OverviewTab  data={data} />}
          {tab === "Orders"     && <OrdersTab    orders={data.orders} customerId={id} router={router} />}
          {tab === "Cart"       && <CartTab      customerId={data?.id} api={api} />}
          {tab === "Addresses"  && <AddressesTab addresses={addresses} profileData={data} />}
          {tab === "Profile"    && <ProfileTab   data={data} />}
        </div>
      )}
    </AdminLayout>
  );
}
