import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiShoppingBag, FiPackage, FiUsers, FiGift, FiTrendingUp } from "react-icons/fi";

const STATUS_STYLES = {
  Pending:    { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  Processing: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  Shipped:    { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  Delivered:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400" },
  Cancelled:  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
  Returned:   { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color, href, loading }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push(href)}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 text-left hover:shadow-md hover:scale-[1.02] transition-all w-full">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{label}</p>
        {loading
          ? <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-1" />
          : <p className="text-gray-900 text-2xl font-bold mt-0.5">{value ?? "—"}</p>
        }
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      setLoading(true);
      const [o, p, c, cp] = await Promise.allSettled([
        api("get", "/get_orders"),
        api("get", "/get_products"),
        api("get", "/get_all_customers"),
        api("get", "/get_all_coupons"),
      ]);
      const orders    = o.status  === "fulfilled" ? o.value.data  : null;
      const products  = p.status  === "fulfilled" ? p.value.data  : null;
      const customers = c.status  === "fulfilled" ? c.value.data  : null;
      const coupons   = cp.status === "fulfilled" ? cp.value.data : null;

      setStats({
        orders:    Array.isArray(orders?.orderList)    ? orders.orderList.length    : "—",
        products:  Array.isArray(products?.productList)? products.productList.length: "—",
        customers: Array.isArray(customers?.customers) ? customers.customers.length : "—",
        coupons:   Array.isArray(coupons?.coupons)     ? coupons.coupons.length     : "—",
      });
      if (Array.isArray(orders?.orderList)) setRecent(orders.orderList.slice(0, 8));
      setLoading(false);
    })();
  }, [ready, api]);

  if (!ready) return null;

  return (
    <AdminLayout title="Dashboard">
      <Head><title>Dashboard — IHW Admin</title></Head>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FiShoppingBag} label="Total Orders"   value={stats.orders}    color="bg-[#04A9FF]"  href="/orders"    loading={loading} />
        <StatCard icon={FiPackage}     label="Total Products" value={stats.products}  color="bg-purple-500" href="/products"  loading={loading} />
        <StatCard icon={FiUsers}       label="Customers"      value={stats.customers} color="bg-emerald-500"href="/customers" loading={loading} />
        <StatCard icon={FiGift}        label="Coupons"        value={stats.coupons}   color="bg-orange-500" href="/coupons"   loading={loading} />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiTrendingUp size={17} className="text-[#04A9FF]" />
            <h2 className="text-gray-800 font-bold text-sm">Recent Orders</h2>
          </div>
          <button onClick={() => router.push("/orders")}
            className="text-[#04A9FF] text-sm font-semibold hover:underline">
            View All →
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-11 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-5 py-3 text-left">Order</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Amount</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((order) => (
                  <tr key={order.id} onClick={() => router.push("/orders")}
                    className="hover:bg-gray-50/70 cursor-pointer transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-gray-700">#{order.id}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-700">{order.customer_name || order.shipping_name || "—"}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">
                      ₹{parseFloat(order.total_amount || order.grand_total || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.order_status_name || order.status || "Pending"} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
