import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiEye } from "react-icons/fi";

export default function AssignedForDelivery() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();

  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [orders, setOrders] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!ready) return;
    api("get", "/delivery_active_vehicles")
      .then((res) => {
        const vehicles = Array.isArray(res.data?.vehicles) ? res.data.vehicles : [];
        setVehicleList(vehicles);
        if (vehicles.length > 0) setSelectedVehicle(String(vehicles[0].id));
      })
      .catch(() => {})
      .finally(() => setLoadingVehicles(false));
  }, [ready, api]);

  const fetchOrders = useCallback(async (vehicleId) => {
    if (!vehicleId) return;
    setLoadingOrders(true);
    setSelected([]);
    try {
      const res = await api("get", `/get_delivery_orders/${vehicleId}`);
      setOrders(Array.isArray(res.data?.orders) ? res.data.orders : []);
      setStatusList(Array.isArray(res.data?.next_status_list) ? res.data.next_status_list : []);
      setSelectedStatus("");
    } catch {}
    setLoadingOrders(false);
  }, [api]);

  useEffect(() => {
    if (selectedVehicle) fetchOrders(selectedVehicle);
  }, [selectedVehicle, fetchOrders]);

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === orders.length ? [] : orders.map((o) => o.id));

  const handleSubmit = async () => {
    if (!selected.length) return showToast("Please select at least one order", "error");
    if (!selectedStatus) return showToast("Please select an order status", "error");

    setSubmitting(true);
    try {
      const order_list = selected.map((id) => {
        const o = orders.find((x) => x.id === id);
        return { id, order_id: o?.order_id };
      });
      const res = await api("post", "/order_shipped", {
        order_list,
        order_status: parseInt(selectedStatus),
      });
      if (res.data?.status === false) {
        showToast(res.data?.message || "Failed to update", "error");
      } else {
        showToast(res.data?.message || "Status updated successfully");
        fetchOrders(selectedVehicle);
      }
    } catch {
      showToast("Something went wrong", "error");
    }
    setSubmitting(false);
  };

  if (!ready) return null;

  const selectedVehicleName = vehicleList.find((v) => String(v.id) === String(selectedVehicle))?.vehicle_name || "";

  return (
    <AdminLayout title="Assigned For Delivery">
      <Head><title>Assigned For Delivery — IHW Admin</title></Head>

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Vehicle selector header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-1 max-w-xs">
            <label className="text-xs text-gray-500 font-medium">Select Delivery Vehicle / Partners</label>
            {loadingVehicles ? (
              <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-64" />
            ) : (
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
            )}
          </div>
        </div>

        {/* Table */}
        {loadingOrders ? (
          <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : !selectedVehicle ? (
          <div className="py-16 text-center text-gray-400 text-sm">Select a delivery vehicle to view orders</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No assigned orders for <span className="font-semibold">{selectedVehicleName}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-5 py-3.5 text-center w-20">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        type="checkbox"
                        checked={orders.length > 0 && selected.length === orders.length}
                        onChange={toggleAll}
                        className="w-4 h-4 accent-[#04A9FF] cursor-pointer"
                      />
                      <span>Select</span>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-center">TrackingNo</th>
                  <th className="px-5 py-3.5 text-center">Assignment Date</th>
                  <th className="px-5 py-3.5 text-center">CustomerName</th>
                  <th className="px-5 py-3.5 text-center">Mobile</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className={`transition-colors ${selected.includes(order.id) ? "bg-purple-50/50" : "hover:bg-gray-50/60"}`}>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selected.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="w-4 h-4 accent-[#04A9FF] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-600">{order.order_id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-gray-700 font-semibold">
                      {order.ref_no || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center text-gray-600">
                      {order.assignment_date
                        ? new Date(order.assignment_date).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          }) + " " + new Date(order.assignment_date).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center font-medium text-gray-800">
                      {[order.first_name, order.last_name].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center text-gray-600">
                      {order.mobile_number || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => router.push(`/orders/${order.order_id}`)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-[#6B21A8]/10 text-[#6B21A8] hover:bg-[#6B21A8]/20 transition-colors"
                      >
                        <FiEye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom bar */}
        {orders.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-end gap-3">
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
              disabled={submitting || !selected.length || !selectedStatus}
              className="px-6 py-2.5 bg-[#6B21A8] hover:bg-[#581C87] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 self-end"
            >
              {submitting ? "Updating..." : "Submit"}
            </button>

            {selected.length > 0 && (
              <span className="text-xs text-gray-500 self-end pb-2.5">{selected.length} selected</span>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
