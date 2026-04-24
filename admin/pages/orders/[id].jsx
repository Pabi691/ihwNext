import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiCreditCard, FiSave, FiPrinter, FiX } from "react-icons/fi";

const STATUS_STYLES = {
  Pending:    { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  Processing: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  Shipped:    { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  Delivered:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400" },
  Cancelled:  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
  Returned:   { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
};

function StatusBadge({ status }) {
  const label = typeof status === "object" ? status?.status_description : status;
  const s = STATUS_STYLES[label] || { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {label || "Unknown"}
    </span>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function toWords(num) {
  if (!num) return "Zero Rupees Only";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
    if (n < 1000) return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " and "+convert(n%100) : "");
    return "";
  };
  const main = Math.floor(num);
  let res = "", n = main;
  const cr = Math.floor(n/10000000); n %= 10000000;
  const lk = Math.floor(n/100000); n %= 100000;
  const th = Math.floor(n/1000); n %= 1000;
  if (cr) res += convert(cr) + " Crore ";
  if (lk) res += convert(lk) + " Lakh ";
  if (th) res += convert(th) + " Thousand ";
  if (n) res += convert(n);
  return (res.trim() || "Zero") + " Rupees Only";
}

function InvoiceModal({ order, onClose }) {
  const printRef = useRef();
  const customer = order?.customer || {};
  const shipping = order?.shipping_info || order?.shippingInfo || {};
  const items = order?.order_items || order?.orderItems || [];
  const payMethod = order?.payment_method || order?.paymentMethod || {};

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Invoice #${order?.id}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #000; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 4px 6px; font-size: 11px; }
        th { background: #f2f2f2; font-weight: bold; }
        p { margin-bottom: 2px; }
        @page { size: A4 portrait; margin: 10mm; }
      </style></head>
      <body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-900">Invoice #{order?.id}</h3>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#04A9FF] text-white text-sm font-bold rounded-xl hover:bg-[#0070cc] transition-colors">
              <FiPrinter size={14} /> Print / Download
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              <FiX size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div ref={printRef} style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#000" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div><strong style={{ fontSize: "18px" }}>INDIANHAIRWORLD</strong></div>
              <div style={{ textAlign: "right" }}>
                <strong style={{ fontSize: "14px" }}>Tax Invoice / Bill of Supply</strong>
                <p style={{ fontSize: "11px" }}>(Original for Recipient)</p>
              </div>
            </div>
            {/* Addresses */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", gap: "20px" }}>
              <div style={{ width: "48%" }}>
                <p><strong>Sold By:</strong></p>
                <p>INDIANHAIRWORLD</p>
                <p>EC-20, Ground Floor Back Side. Opp. CC1,</p>
                <p>Sector-1, Salt Lake City, Kolkata, West Bengal 700064</p>
                <p>Phone: +918961194044</p>
                <p style={{ marginTop: "10px" }}><strong>PAN No:</strong> AAJFI1527P</p>
                <p><strong>GST Registration No:</strong> 19AAJFI1527P1ZV</p>
              </div>
              <div style={{ width: "48%", textAlign: "right" }}>
                <p><strong>Billing Address:</strong></p>
                <p>{customer.first_name} {customer.last_name}</p>
                <p>{customer.address_line_1}{customer.address_line_2 ? ", " + customer.address_line_2 : ""}</p>
                <p>{[customer.city, customer.state, customer.zip_code].filter(Boolean).join(", ")}</p>
                <p style={{ marginBottom: "10px" }}>{customer.country || "India"}</p>
                <p><strong>Shipping Address:</strong></p>
                <p>{shipping.full_name}</p>
                <p>{shipping.address_line_1}{shipping.address_line_2 ? ", " + shipping.address_line_2 : ""}</p>
                <p>{[shipping.city, shipping.state, shipping.zip_code].filter(Boolean).join(", ")}</p>
                <p>{shipping.country || "India"}</p>
              </div>
            </div>
            {/* Order Info */}
            <div style={{ marginBottom: "15px" }}>
              <p><strong>Order Number:</strong> {order?.id}</p>
              <p><strong>Order Date:</strong> {order?.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
            </div>
            {/* Items Table */}
            <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "0" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", textAlign: "center" }}>Sl.</th>
                  <th style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", textAlign: "left" }}>Description</th>
                  <th style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", textAlign: "right" }}>Unit Price</th>
                  <th style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", textAlign: "center" }}>Qty</th>
                  <th style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", textAlign: "right" }}>Net Amt</th>
                  <th style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", textAlign: "right" }}>Tax</th>
                  <th style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }}>{i + 1}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px" }}>{item.product_name}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "right" }}>₹{parseFloat(item.price || 0).toFixed(2)}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "right" }}>₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "right" }}>₹{(parseFloat(item.total_price || 0) * 0.18).toFixed(2)}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "right" }}>₹{parseFloat(item.total_price || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} style={{ border: "1px solid #000", padding: "4px 6px", background: "#f2f2f2", fontWeight: "bold" }}>TOTAL:</td>
                  <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "right", fontWeight: "bold" }}>₹{parseFloat(order?.tax_total || 0).toFixed(2)}</td>
                  <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "right", fontWeight: "bold" }}>₹{parseFloat(order?.pay_amt || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ border: "1px solid #000", borderTop: "none", padding: "6px" }}>
              <strong>Amount in Words: </strong>{toWords(order?.pay_amt)}
            </div>
            {/* Footer */}
            <div style={{ border: "1px solid #000", padding: "15px", display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <div>
                <p><strong>Mode of Payment:</strong> {payMethod?.method_name || "—"}</p>
                <p><strong>Date:</strong> {order?.created_at ? new Date(order.created_at).toLocaleString("en-IN") : "—"}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ marginBottom: "30px" }}><strong>For INDIANHAIRWORLD:</strong></p>
                <p>________________________</p>
                <p><strong>Authorized Signatory</strong></p>
              </div>
            </div>
            <p style={{ textAlign: "center", fontSize: "9px", marginTop: "10px", color: "#666" }}>
              Thank you for choosing IndianHairWorld. Please retain this invoice for your records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetails() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api("get", `/get_order_details/${id}`);
      const d = res.data;
      const orderData = d?.order_data || d?.order || d;
      setOrder(orderData);
      const currentStatus = orderData?.order_status || "";
      setSelectedStatus(String(currentStatus));
      const list = d?.order_status_list || d?.orderStatusList || [];
      setStatusList(Array.isArray(list) ? list : []);
    } catch {}
    setLoading(false);
  }, [id, api]);

  useEffect(() => {
    if (!ready || !id) return;
    fetchOrder();
  }, [ready, id, fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    setUpdating(true);
    try {
      await api("post", "/update_order_status", { id: order.id, order_status: parseInt(selectedStatus) });
      showToast("Order status updated successfully");
      fetchOrder();
    } catch {
      showToast("Failed to update status", "error");
    }
    setUpdating(false);
  };

  if (!ready) return null;

  const customer = order?.customer || {};
  const shipping = order?.shipping_info || order?.shippingInfo || {};
  const items = order?.order_items || order?.orderItems || [];
  const trackings = order?.order_trackings || order?.orderTrackings || [];
  const payments = order?.order_payments || order?.orderPayments || [];
  const payMethod = order?.payment_method || order?.paymentMethod || {};
  const allotments = order?.allotment_vehicle || order?.allotmentVehicle || [];
  const orderReturn = order?.order_return || order?.orderReturn || null;
  const currentStatusLabel = statusList.find(s => String(s.id) === String(order?.order_status))?.status_description
    || order?.orderStatus?.status_description || order?.order_status_name || order?.shipping_status || "";

  return (
    <AdminLayout title="Order Details">
      <Head><title>Order #{id} — IHW Admin</title></Head>

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {showInvoice && order && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm flex-shrink-0">
            <FiArrowLeft size={17} />
          </button>
          <div>
            <h2 className="text-gray-900 font-bold text-lg sm:text-xl">Order #{id}</h2>
            {currentStatusLabel && <StatusBadge status={currentStatusLabel} />}
          </div>
        </div>
        <button onClick={() => setShowInvoice(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm w-full sm:w-auto">
          <FiPrinter size={15} /> Download Invoice
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-48 animate-pulse" />)}
        </div>
      ) : !order ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center text-gray-400">Order not found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: items + billing + shipping + payment */}
          <div className="lg:col-span-2 space-y-5">

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <FiPackage size={16} className="text-[#04A9FF]" />
                <h3 className="font-bold text-gray-800 text-sm">All Items</h3>
                <span className="ml-auto text-xs text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
              </div>
              {items.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">No items found</div>
              ) : (
                <>
                  <div className="divide-y divide-gray-50">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 px-6 py-4">
                        {item.product_details?.primary_img ? (
                          <img src={item.product_details.primary_img} alt={item.product_name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <FiPackage size={20} className="text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{item.product_name || "—"}</p>
                          {item.product_valiation?.size && (
                            <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Size:</span> {item.product_valiation.size}</p>
                          )}
                          {item.product_details?.color_details?.color_name && (
                            <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Color:</span> {item.product_details.color_details.color_name}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity || 1}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-800">₹{parseFloat(item.total_price || 0).toLocaleString("en-IN")}</p>
                          <p className="text-xs text-gray-400">₹{parseFloat(item.price || 0).toLocaleString("en-IN")} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Summary rows */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>SubTotal</span>
                      <span>₹{parseFloat(order.bill_amt || 0).toFixed(2)}</span>
                    </div>
                    {parseFloat(order.tax_total) > 0 && <>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>CGST (9%)</span>
                        <span>+ ₹{(parseFloat(order.tax_total) / 2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>SGST (9%)</span>
                        <span>+ ₹{(parseFloat(order.tax_total) / 2).toFixed(2)}</span>
                      </div>
                    </>}
                    {parseFloat(order.discount_amt) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</span>
                        <span>− ₹{parseFloat(order.discount_amt).toFixed(2)}</span>
                      </div>
                    )}
                    {parseFloat(order.shipping_total) > 0 && (
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span>+ ₹{parseFloat(order.shipping_total).toFixed(2)}</span>
                      </div>
                    )}
                    {order.r_off != null && parseFloat(order.r_off) !== 0 && (
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Round Off</span>
                        <span>{parseFloat(order.r_off) < 0 ? "−" : "+"} ₹{Math.abs(parseFloat(order.r_off)).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                      <span>Payable Amount</span>
                      <span className="text-red-600">₹{parseFloat(order.pay_amt || order.net_amt || 0).toFixed(2)}</span>
                    </div>
                    {parseFloat(order.paid_amt) > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600 font-semibold">
                        <span>Paid Amount</span>
                        <span>₹{parseFloat(order.paid_amt).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Billing + Shipping side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Customer / Billing */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <FiUser size={15} className="text-[#04A9FF]" />
                  <h3 className="font-bold text-gray-800 text-sm">Customer / Billing</h3>
                </div>
                <div className="px-5 py-4 space-y-0.5">
                  <InfoRow label="Name" value={[customer.first_name, customer.last_name].filter(Boolean).join(" ") || null} />
                  <InfoRow label="Address 1" value={customer.address_line_1} />
                  <InfoRow label="Address 2" value={customer.address_line_2} />
                  <InfoRow label="City" value={customer.city} />
                  <InfoRow label="State" value={customer.state} />
                  <InfoRow label="Zip Code" value={customer.zip_code} />
                  <InfoRow label="Country" value={customer.country} />
                  <InfoRow label="Mob. No." value={customer.mobile_number} />
                  <InfoRow label="Alt. Mob." value={customer.alt_mob_number} />
                  <InfoRow label="Email" value={customer.email} />
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <FiMapPin size={15} className="text-[#04A9FF]" />
                  <h3 className="font-bold text-gray-800 text-sm">Shipping Details</h3>
                </div>
                <div className="px-5 py-4 space-y-0.5">
                  <InfoRow label="Name" value={shipping.full_name} />
                  <InfoRow label="Address 1" value={shipping.address_line_1} />
                  <InfoRow label="Address 2" value={shipping.address_line_2} />
                  <InfoRow label="City" value={shipping.city} />
                  <InfoRow label="State" value={shipping.state} />
                  <InfoRow label="Zip Code" value={shipping.zip_code} />
                  <InfoRow label="Country" value={shipping.country} />
                  <InfoRow label="Mob. No." value={shipping.mobile_number} />
                  <InfoRow label="Alt. Mob." value={shipping.alt_mob_number} />
                  <InfoRow label="Email" value={shipping.email} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <FiCreditCard size={15} className="text-[#04A9FF]" />
                <h3 className="font-bold text-gray-800 text-sm">Payment Method</h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-700 font-semibold mb-3">
                  {payMethod?.method_name || "—"}
                </p>
                {payments.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide font-semibold">
                          <th className="px-3 py-2 text-left">Method</th>
                          <th className="px-3 py-2 text-left">Reference</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {payments.map((p, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2">{p.payment_method}</td>
                            <td className="px-3 py-2 font-mono">{p.payment_reference || "—"}</td>
                            <td className="px-3 py-2 text-right font-semibold">₹{p.payment_amount}</td>
                            <td className="px-3 py-2">{p.payment_status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">

            {/* Order Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm">Order Info</h3>
              </div>
              <div className="px-5 py-4 space-y-0.5">
                <InfoRow label="Order Date" value={order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null} />
                <InfoRow label="Bill No" value={order.bill_no} />
                <InfoRow label="Coupon" value={order.coupon_code} />
                <InfoRow label="Note" value={order.note} />
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm">Update Status</h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#04A9FF] transition-colors">
                  <option value="">Select status...</option>
                  {statusList.length > 0
                    ? statusList.map((s) => <option key={s.id} value={s.id}>{s.status_description}</option>)
                    : ["Pending","Processing","Shipped","Delivered","Cancelled","Returned"].map((s) => <option key={s} value={s}>{s}</option>)
                  }
                </select>
                <button onClick={handleStatusUpdate} disabled={updating || !selectedStatus}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
                  <FiSave size={15} />{updating ? "Updating..." : "Update Product"}
                </button>
              </div>
            </div>

            {/* Order Tracking */}
            {trackings.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">Order Tracking</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide font-semibold">
                        <th className="px-4 py-2.5 text-left">Date</th>
                        <th className="px-4 py-2.5 text-left">Order Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {trackings.map((t, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2.5">
                            <p>{t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
                            {t.updated_by && <p className="text-gray-400">Updated By: {t.updated_by}</p>}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">{t.full_details || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shipping Tracking (Delhivery) */}
            {allotments.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">Shipping Tracking</h3>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {allotments.map((a, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <a href={`https://www.delhivery.com/track-v2/package/${a.ref_no}`} target="_blank" rel="noreferrer"
                        className="text-[#04A9FF] hover:underline font-mono">{a.ref_no}</a>
                      <span className="text-gray-500">{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Return Request */}
            {orderReturn && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">Return Request</h3>
                </div>
                <div className="px-5 py-4 space-y-0.5">
                  <InfoRow label="Reason" value={orderReturn.return_reason} />
                  <InfoRow label="Amount" value={orderReturn.refund_amount ? "₹" + orderReturn.refund_amount : null} />
                  <InfoRow label="Date" value={orderReturn.return_date ? new Date(orderReturn.return_date).toLocaleDateString("en-IN") : null} />
                  <InfoRow label="Status" value={orderReturn.return_status} />
                </div>
                {orderReturn.return_video && (
                  <div className="px-5 pb-4">
                    <video className="w-full rounded-xl" controls>
                      <source src={orderReturn.return_video} type="video/mp4" />
                    </video>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
