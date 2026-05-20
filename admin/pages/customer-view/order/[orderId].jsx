import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import {
  FiArrowLeft, FiPackage, FiMapPin, FiCreditCard,
  FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp,
} from "react-icons/fi";

const STATUS_STYLES = {
  Delivered:          { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400" },
  Pending:            { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  "New Order":        { bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400" },
  Processing:         { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  "Ready For Ship":   { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  Shipped:            { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  "Out for Delivery": { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  "Order Cancelled ": { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
  "Payment Failed":   { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
  "Refund Received":  { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status?.trim()] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status || "Unknown"}
    </span>
  );
}

function cleanTrackingStatus(raw) {
  const status = raw?.split("=>")?.[1]?.trim() || raw || "";
  const map = {
    "New Order":       "Order Confirmed",
    "Processing":      "Seller has processed your order.",
    "Ready For Ship":  "Your item has been picked up by delivery partner.",
    "Shipped":         "Shipped.",
    "Out for Delivery":"Out For Delivery.",
    "Delivered":       "Delivered.",
    "Return Requested":"Return Requested.",
    "Return Accepted": "Return Approved.",
    "Return Collected":"Return Collected.",
    "Return Received": "Return Received.",
  };
  return map[status] || status || "Status Updated";
}

function formatTrackingDate(dateString) {
  const date = new Date(dateString);
  const day = date.toLocaleString("en-US", { weekday: "short" });
  const dateNum = date.getDate();
  const suffix =
    dateNum % 10 === 1 && dateNum !== 11 ? "st"
    : dateNum % 10 === 2 && dateNum !== 12 ? "nd"
    : dateNum % 10 === 3 && dateNum !== 13 ? "rd"
    : "th";
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = `'${String(date.getFullYear()).slice(-2)}`;
  const time = date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase().replace(":", ".");
  return `${day}, ${dateNum}${suffix} ${month} ${year} - ${time}`;
}

export default function CustomerOrderDetail() {
  const router = useRouter();
  const { orderId, customerId } = router.query;
  const { api } = useAdmin();
  const { ready } = useAuthGuard();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBreakup, setShowBreakup] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await api("get", `/get_order_details/${orderId}`);
      const d = res.data;
      setOrder(d?.order_data || d?.order || d);
    } catch {}
    setLoading(false);
  }, [orderId, api]);

  useEffect(() => {
    if (!ready || !orderId) return;
    fetchOrder();
  }, [ready, orderId, fetchOrder]);

  if (!ready) return null;

  const shipping  = order?.shipping_info  || order?.shippingInfo  || {};
  const items     = order?.order_items    || order?.orderItems    || [];
  const trackings = order?.order_trackings || order?.orderTrackings || [];
  const payments  = order?.order_payments || order?.orderPayments || [];
  const payMethod = order?.payment_method || order?.paymentMethod || {};
  const allotments = order?.allotment_vehicle || order?.allotmentVehicle || [];
  const trackingRef = allotments[0]?.ref_no;
  const gst = order?.gst_summary || {};

  const statusLabel = order?.orderStatus?.status_description
    || order?.order_status_name
    || order?.shipping_status
    || "";

  const formattedOrderDate = order?.order_date || order?.created_at
    ? new Date(order?.order_date || order?.created_at).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

  const payStatus = payments?.[0]?.payment_status;
  const showPayment = ["pending", "completed", "cancelled"].includes(payStatus);

  return (
    <AdminLayout title="Order Details">
      <Head><title>Order #{orderId} — Customer View — IHW Admin</title></Head>

      {/* Admin banner */}
      <div className="mb-5 flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
        <div className="flex items-center gap-2">
          <FiAlertCircle size={15} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-amber-800">
            Admin View — Customer order details (read-only)
          </p>
        </div>
        <button
          onClick={() => customerId ? router.push(`/customer-view/${customerId}?tab=Orders`) : router.back()}
          className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors flex-shrink-0"
        >
          <FiArrowLeft size={14} /> Back to Orders
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !order ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <FiPackage size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400">Order not found</p>
        </div>
      ) : (
        <div className="max-w-3xl space-y-4">

          {/* Order header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order Number</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Placed On</p>
              <p className="text-base font-semibold text-gray-700 mt-0.5">{formattedOrderDate}</p>
            </div>
          </div>

          {/* Order items */}
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-300 rounded-2xl p-4 flex gap-4">
              {item.product_details?.primary_img ? (
                <img
                  alt={item.product_name}
                  loading="lazy"
                  className="h-40 w-auto rounded-xl object-cover flex-shrink-0"
                  src={item.product_details.primary_img}
                />
              ) : (
                <div className="h-40 w-32 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FiPackage size={28} className="text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0 py-1">
                {item.product_details?.brand_details?.brand_name && (
                  <p className="text-gray-900 font-bold mb-1.5">
                    {item.product_details.brand_details.brand_name}
                  </p>
                )}
                <p className="text-gray-800 font-medium text-sm mb-1.5">{item.product_name}</p>
                <p className="text-gray-600 text-sm mb-1">Quantity: {item.quantity}</p>
                <p className="text-gray-600 text-sm mb-1">Price: ₹{parseFloat(item.price || 0).toLocaleString("en-IN")}</p>
                <p className="text-gray-800 font-semibold text-sm">
                  Total: ₹{parseFloat(item.total_price || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}

          {/* Status */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Status:</span>
              <StatusBadge status={statusLabel} />
            </div>
          </div>

          {/* Shipping address */}
          {(shipping.full_name || shipping.address_line_1) && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FiMapPin size={15} className="text-[#04A9FF]" />
                <h3 className="text-sm font-bold text-gray-800">Shipping Address</h3>
              </div>
              <p className="text-gray-900 text-sm font-semibold">{shipping.full_name}</p>
              {shipping.address_line_1 && (
                <p className="text-gray-700 text-sm mt-0.5">
                  {shipping.address_line_1}{shipping.city ? `, ${shipping.city}` : ""}
                </p>
              )}
              <p className="text-gray-600 text-sm">
                {[shipping.state, shipping.zip_code, shipping.country].filter(Boolean).join(", ")}
              </p>
              {shipping.mobile_number && (
                <p className="text-gray-600 text-sm mt-1">Phone: {shipping.mobile_number}</p>
              )}
            </div>
          )}

          {/* Tracking */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-gray-800 mb-4">Tracking Details</h3>

            {trackingRef && (
              <div className="flex justify-between items-center mb-5">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Tracking No.</p>
                  <p className="text-base font-bold text-gray-800 mt-0.5">#{trackingRef}</p>
                </div>
                <div className="bg-[#e31837] px-3 py-1 rounded">
                  <span className="text-white text-xs font-bold tracking-wide">DELHIVERY</span>
                </div>
              </div>
            )}

            {trackings.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No tracking updates yet</p>
            ) : (
              <div className="relative border-l-2 border-dashed border-gray-200 ml-3">
                {trackings.map((item, index) => {
                  const isLast = index === trackings.length - 1;
                  const status = cleanTrackingStatus(item.full_details);
                  return (
                    <div key={item.id} className="pl-6 relative mb-6 last:mb-0">
                      <div className={`absolute left-[-11px] top-0 w-5 h-5 rounded-full flex items-center justify-center bg-white z-10`}>
                        <FiCheckCircle size={18} className="text-green-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">{status}</span>
                        <span className="text-xs text-gray-400 mt-0.5">
                          {item.created_at ? formatTrackingDate(item.created_at) : ""}
                        </span>
                      </div>
                      {!isLast && (
                        <div className="absolute left-[-2px] top-5 h-full border-l-2 border-green-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment summary */}
          {showPayment && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard size={15} className="text-[#04A9FF]" />
                <h3 className="text-sm font-bold text-gray-800">Payment Summary</h3>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    GST @ {gst.gst_rate}%
                    {gst.cgst && gst.sgst ? ` (CGST ₹${gst.cgst} + SGST ₹${gst.sgst})` : ""}
                  </p>
                  <div className="flex justify-between gap-8 font-semibold text-sm">
                    <span>Total (incl. GST)</span>
                    <span>
                      ₹{parseFloat(
                        gst.total_with_gst
                          ? (order.shipping_total ? gst.total_with_gst + order.shipping_total : gst.total_with_gst)
                          : order.pay_amt || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {payStatus === "completed" ? (
                    <p className="text-green-600 text-sm font-semibold">
                      Paid via {payMethod?.method_name}
                    </p>
                  ) : payMethod?.method_name === "COD" ? (
                    <p className="text-green-600 text-sm font-semibold">
                      To be paid by COD
                    </p>
                  ) : payMethod?.method_name === "Razorpay" ? (
                    <p className="text-red-500 text-sm font-semibold flex items-center gap-1.5">
                      <span className="w-5 h-5 bg-gray-200 text-gray-700 flex items-center justify-center rounded-full text-xs">✕</span>
                      Payment failed
                    </p>
                  ) : (
                    <p className="text-yellow-600 text-sm font-semibold">{payMethod?.method_name}</p>
                  )}

                  <button
                    onClick={() => setShowBreakup((v) => !v)}
                    className="text-[#04A9FF] text-xs underline mt-1 flex items-center gap-1 ml-auto"
                  >
                    {showBreakup ? <><FiChevronUp size={12} /> Hide Breakup</> : <><FiChevronDown size={12} /> View Breakup</>}
                  </button>
                </div>
              </div>

              {showBreakup && (
                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                      <span className="text-gray-700 truncate max-w-[50%]">{item.product_name}</span>
                      <span className="text-gray-500 text-xs">₹{parseFloat(item.price || 0).toLocaleString("en-IN")} × {item.quantity}</span>
                      <span className="font-semibold text-gray-800">₹{parseFloat(item.total_price || 0).toLocaleString("en-IN")}</span>
                    </div>
                  ))}

                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Total Price</span>
                      <span>₹{parseFloat(order.net_amt || 0).toFixed(2)}</span>
                    </div>
                    {gst.cgst !== undefined && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>CGST (9%)</span>
                        <span>₹{gst.cgst}</span>
                      </div>
                    )}
                    {gst.sgst !== undefined && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>SGST (9%)</span>
                        <span>₹{gst.sgst}</span>
                      </div>
                    )}
                    {order.shipping_total !== undefined && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>COD Fee</span>
                        <span>₹{parseFloat(order.shipping_total || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                      <span>Total to be paid</span>
                      <span>₹{parseFloat(order.pay_amt || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </AdminLayout>
  );
}
