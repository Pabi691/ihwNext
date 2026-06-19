import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiEye } from "react-icons/fi";

export default function ProcessOrders() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [phoneOverrides, setPhoneOverrides] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, vehiclesRes] = await Promise.all([
        api("get", "/get_new_orders"),
        api("get", "/delivery_active_vehicles"),
      ]);
      const list = ordersRes.data?.orderList || [];
      setOrders(Array.isArray(list) ? list : []);
      setStatusList(Array.isArray(ordersRes.data?.next_status_list) ? ordersRes.data.next_status_list : []);
      setVehicleList(Array.isArray(vehiclesRes.data?.vehicles) ? vehiclesRes.data.vehicles : []);
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchData();
  }, [ready, fetchData]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const name = `${o.first_name || ""} ${o.last_name || ""}`.trim().toLowerCase();
    return !q || String(o.id).includes(q) || name.includes(q);
  });

  const isShiprocket = vehicleList.find(v => String(v.id) === String(selectedVehicle))?.vehicle_name?.toLowerCase() === 'shiprocket';

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (!prev.includes(id)) {
        const order = orders.find((o) => o.id === id);
        setPhoneOverrides((p) => ({ ...p, [id]: order?.mobile_number || '' }));
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      const ids = filtered.map((o) => o.id);
      setSelected(ids);
      const overrides = {};
      filtered.forEach((o) => { overrides[o.id] = o.mobile_number || ''; });
      setPhoneOverrides((p) => ({ ...p, ...overrides }));
    }
  };

  const handleSubmit = async () => {
    if (!selected.length) return showToast("Please select at least one order", "error");
    if (!selectedVehicle) return showToast("Please select a delivery vehicle", "error");
    if (!selectedStatus) return showToast("Please select an order status", "error");

    setSubmitting(true);
    try {
      const order_list = selected.map((id, i) => {
        const o = orders.find((x) => x.id === id);
        return { id, sl_no: o?.sl_no || (i + 1) };
      });
      const payload = {
        order_list,
        delivery_vehicle_id: parseInt(selectedVehicle),
        order_status: parseInt(selectedStatus),
      };
      if (isShiprocket) {
        payload.phone_overrides = phoneOverrides;
      }
      const res = await api("post", "/order_assigned_for_delivery", payload);
      if (res.data?.status === false) {
        showToast(res.data?.message || "Failed to assign orders", "error");
      } else {
        showToast(res.data?.message || "Orders assigned for delivery");
        setSelected([]);
        fetchData();
      }
    } catch {
      showToast("Something went wrong", "error");
    }
    setSubmitting(false);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Process Orders">
      <Head><title>Process Orders — IHW Admin</title></Head>

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search + count */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative flex-1">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or customer..."
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white"
            />
          </div>
          <span className="text-sm text-gray-400 font-medium whitespace-nowrap">
            Total Order : {filtered.length}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No processing orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-5 py-3.5 text-center w-20">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        type="checkbox"
                        checked={filtered.length > 0 && selected.length === filtered.length}
                        onChange={toggleAll}
                        className="w-4 h-4 accent-[#04A9FF] cursor-pointer"
                      />
                      <span>Select</span>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-center">Order Details</th>
                  <th className="px-5 py-3.5 text-center">Qty</th>
                  <th className="px-5 py-3.5 text-center">Customer Details</th>
                  <th className="px-5 py-3.5 text-center">Order Status</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className={`transition-colors ${selected.includes(order.id) ? "bg-blue-50/50" : "hover:bg-gray-50/60"}`}>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selected.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="w-4 h-4 accent-[#04A9FF] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-600">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <p className="font-semibold text-gray-800">Order Id: {order.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-center text-gray-700 font-medium">
                      Qty: {order.total_quantity || 1}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <p className="font-medium text-gray-800">
                        Name: {[order.first_name, order.last_name].filter(Boolean).join(" ") || "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Mob No: {order.mobile_number || ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {order.order_status_name || "Processing"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
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
        )}

        {/* Shiprocket phone override panel */}
        {isShiprocket && selected.length > 0 && (
          <div className="px-5 py-3 border-t border-orange-100 bg-orange-50/40">
            <p className="text-xs font-semibold text-orange-700 mb-2">
              Shiprocket requires a valid 10-digit Indian mobile number (starting with 6/7/8/9). Edit if needed:
            </p>
            <div className="flex flex-wrap gap-3">
              {selected.map((id) => {
                const order = orders.find((o) => o.id === id);
                return (
                  <div key={id} className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-3 py-2 text-sm">
                    <span className="text-gray-500 font-medium">#{id}</span>
                    <input
                      type="tel"
                      value={phoneOverrides[id] ?? order?.mobile_number ?? ''}
                      onChange={(e) => setPhoneOverrides((p) => ({ ...p, [id]: e.target.value }))}
                      maxLength={13}
                      placeholder="10-digit mobile"
                      className="w-36 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-orange-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Select Delivery Vehicle / Partners</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-64 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#04A9FF] transition-colors"
            >
              <option value="">Select vehicle...</option>
              {vehicleList.map((v) => (
                <option key={v.id} value={v.id}>{v.vehicle_name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Select Order Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-52 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#04A9FF] transition-colors"
            >
              <option value="">Select status...</option>
              {statusList.map((s) => (
                <option key={s.id} value={s.id}>{s.status_description}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !selected.length || !selectedVehicle || !selectedStatus}
            className="px-6 py-2.5 bg-[#6B21A8] hover:bg-[#581C87] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 self-end"
          >
            {submitting ? "Processing..." : "Submit"}
          </button>

          {selected.length > 0 && (
            <span className="text-xs text-gray-500 self-end pb-2.5">{selected.length} order{selected.length !== 1 ? "s" : ""} selected</span>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
