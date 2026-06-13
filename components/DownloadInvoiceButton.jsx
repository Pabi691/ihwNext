import React from "react";

function toWords(num) {
  if (!num) return "Zero Rupees Only";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + convert(n % 100) : "");
    return "";
  };
  const main = Math.floor(num);
  let res = "", n = main;
  const cr = Math.floor(n / 10000000); n %= 10000000;
  const lk = Math.floor(n / 100000); n %= 100000;
  const th = Math.floor(n / 1000); n %= 1000;
  if (cr) res += convert(cr) + " Crore ";
  if (lk) res += convert(lk) + " Lakh ";
  if (th) res += convert(th) + " Thousand ";
  if (n) res += convert(n);
  return (res.trim() || "Zero") + " Rupees Only";
}

const DownloadInvoiceButton = ({ order }) => {
  const handlePrint = () => {
    const customer = order?.customer || {};
    const shipping = order?.shipping_info || {};
    const items = order?.order_items || [];
    const payMethod = order?.payment_method || {};
    const rawPaymentMethod = (order?.order_payments?.[0]?.payment_method || '').toLowerCase();
    const paymentLabel = rawPaymentMethod.includes('razor') || rawPaymentMethod.includes('online') || rawPaymentMethod.includes('upi') || rawPaymentMethod.includes('card')
      ? 'Online (Razorpay)'
      : rawPaymentMethod.includes('cod')
      ? 'COD'
      : payMethod?.method_name || rawPaymentMethod || '—';
    const logoUrl = `${window.location.origin}/logo.png`;
    const logoWhiteUrl = `${window.location.origin}/logo-white.png`;

    // Intra-state (West Bengal) → CGST + SGST; Inter-state → IGST
    const shippingState = (shipping.state || '').toLowerCase().replace(/\s+/g, '');
    const isWB = shippingState === 'westbengal' || shippingState === 'wb';
    const taxCols = isWB ? 8 : 7; // number of table columns

    const itemRows = items.map((item, i) => {
      // item.price is GST-inclusive; extract base price for GST breakdown
      const inclusiveUnit = parseFloat(item.price || 0);
      const baseUnit = inclusiveUnit / 1.18;
      const netAmt   = baseUnit * item.quantity;
      const tax      = netAmt * 0.18; // total 18% GST
      const cgst     = tax / 2;
      const sgst     = tax / 2;
      const total    = inclusiveUnit * item.quantity;
      const taxCell  = isWB
        ? `<td style="border:1px solid #000;padding:4px 6px;text-align:right;">&#8377;${cgst.toFixed(2)}</td>
           <td style="border:1px solid #000;padding:4px 6px;text-align:right;">&#8377;${sgst.toFixed(2)}</td>`
        : `<td style="border:1px solid #000;padding:4px 6px;text-align:right;">&#8377;${tax.toFixed(2)}</td>`;
      return `
        <tr>
          <td style="border:1px solid #000;padding:4px 6px;text-align:center;">${i + 1}</td>
          <td style="border:1px solid #000;padding:4px 6px;">${item.product_name}</td>
          <td style="border:1px solid #000;padding:4px 6px;text-align:right;">&#8377;${baseUnit.toFixed(2)}</td>
          <td style="border:1px solid #000;padding:4px 6px;text-align:center;">${item.quantity}</td>
          <td style="border:1px solid #000;padding:4px 6px;text-align:right;">&#8377;${netAmt.toFixed(2)}</td>
          ${taxCell}
          <td style="border:1px solid #000;padding:4px 6px;text-align:right;">&#8377;${total.toFixed(2)}</td>
        </tr>`;
    }).join("");

    const couponLabel = order?.coupon_code ? " (" + order.coupon_code + ")" : "";
    const couponRow = parseFloat(order?.discount_amt) > 0 ? `
      <tr>
        <td colspan="${taxCols - 1}" style="border:1px solid #000;padding:4px 6px;text-align:right;color:#16a34a;">Coupon Discount${couponLabel}:</td>
        <td style="border:1px solid #000;padding:4px 6px;text-align:right;color:#16a34a;">&#8722;&#8377;${parseFloat(order.discount_amt).toFixed(2)}</td>
      </tr>` : "";

    const codRow = parseFloat(order?.shipping_total) > 0 ? `
      <tr>
        <td colspan="${taxCols - 1}" style="border:1px solid #000;padding:4px 6px;text-align:right;">COD Charge:</td>
        <td style="border:1px solid #000;padding:4px 6px;text-align:right;">&#8377;${parseFloat(order.shipping_total).toFixed(2)}</td>
      </tr>` : "";

    const rOffRow = order?.r_off != null && parseFloat(order?.r_off) !== 0 ? `
      <tr>
        <td colspan="${taxCols - 1}" style="border:1px solid #000;padding:4px 6px;text-align:right;">Round Off:</td>
        <td style="border:1px solid #000;padding:4px 6px;text-align:right;">
          ${parseFloat(order.r_off) < 0 ? "−" : "+"}&#8377;${Math.abs(parseFloat(order.r_off)).toFixed(2)}
        </td>
      </tr>` : "";

    const totalTax = parseFloat(order?.tax_total || 0);
    const totalTaxCell = isWB
      ? `<td style="text-align:right;font-weight:bold;">&#8377;${(totalTax / 2).toFixed(2)}</td>
         <td style="text-align:right;font-weight:bold;">&#8377;${(totalTax / 2).toFixed(2)}</td>`
      : `<td style="text-align:right;font-weight:bold;">&#8377;${totalTax.toFixed(2)}</td>`;

    const html = `
      <html>
      <head>
        <title>Invoice #${order?.id}</title>
        <base href="${window.location.origin}" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; font-size: 11px; color: #000; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 4px 6px; font-size: 11px; }
          th { background: #f2f2f2; font-weight: bold; }
          p { margin-bottom: 2px; }
          @page { size: A4 portrait; margin: 10mm; }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <div><img src="${logoUrl}" alt="IndianHairWorld" style="height:55px;width:auto;" /></div>
          <div style="text-align:right;">
            <strong style="font-size:14px;">Tax Invoice / Bill of Supply</strong>
            <p style="font-size:11px;">(Original for Recipient)</p>
          </div>
        </div>

        <!-- Addresses -->
        <div style="display:flex;justify-content:space-between;margin-bottom:15px;gap:20px;">
          <div style="width:48%;">
            <p><strong>Sold By:</strong></p>
            <p>INDIAN HAIR WORLD</p>
            <p>EC-20, Ground Floor Back Side. Opp. CC1,</p>
            <p>Sector-1, Salt Lake City, Kolkata, West Bengal 700064</p>
            <p>Phone: +918961194044</p>
            <p style="margin-top:10px;"><strong>PAN No:</strong> AAJFI1527P</p>
            <p><strong>GST Registration No:</strong> 19AAJFI1527P1ZV</p>
          </div>
          <div style="width:48%;text-align:right;">
            <p><strong>Billing Address:</strong></p>
            <p>${customer.first_name || ""} ${customer.last_name || ""}</p>
            <p>${customer.address_line_1 || ""}${customer.address_line_2 ? ", " + customer.address_line_2 : ""}</p>
            <p>${[customer.city, customer.state, customer.zip_code].filter(Boolean).join(", ")}</p>
            <p style="margin-bottom:10px;">${customer.country || "India"}</p>
            <p><strong>Shipping Address:</strong></p>
            <p>${shipping.full_name || ""}</p>
            <p>${shipping.address_line_1 || ""}${shipping.address_line_2 ? ", " + shipping.address_line_2 : ""}</p>
            <p>${[shipping.city, shipping.state, shipping.zip_code].filter(Boolean).join(", ")}</p>
            <p>${shipping.country || "India"}</p>
          </div>
        </div>

        <!-- Order Info -->
        <div style="margin-bottom:15px;">
          <p><strong>Order Number:</strong> ${order?.id}</p>
          <p><strong>Order Date:</strong> ${order?.order_date ? new Date(order.order_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
        </div>

        <!-- Items Table -->
        <table style="margin-bottom:0;">
          <thead>
            <tr>
              <th style="text-align:center;">Sl.</th>
              <th style="text-align:left;">Description</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Net Amt</th>
              ${isWB
                ? `<th style="text-align:right;">CGST (9%)</th><th style="text-align:right;">SGST (9%)</th>`
                : `<th style="text-align:right;">IGST (18%)</th>`}
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
            ${couponRow}
            ${codRow}
            ${rOffRow}
            <tr>
              <td colspan="${taxCols - (isWB ? 3 : 2)}" style="background:#f2f2f2;font-weight:bold;">TOTAL:</td>
              ${totalTaxCell}
              <td style="text-align:right;font-weight:bold;">&#8377;${parseFloat(order?.pay_amt || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div style="border:1px solid #000;border-top:none;padding:6px;">
          <strong>Amount in Words: </strong>${toWords(order?.pay_amt)}
        </div>

        <!-- Footer -->
        <div style="border:1px solid #000;padding:15px;display:flex;justify-content:space-between;margin-top:10px;">
          <div>
            <p><strong>Mode of Payment:</strong> ${paymentLabel}</p>
            <p><strong>Date:</strong> ${order?.order_date ? new Date(order.order_date).toLocaleString("en-IN") : "—"}</p>
          </div>
          <div style="text-align:right;">
            <div style="background-color:#111;display:inline-block;padding:6px 12px;border-radius:4px;margin-bottom:28px;">
              <img src="${logoWhiteUrl}" alt="IndianHairWorld" style="height:30px;width:auto;" />
            </div>
            <p>________________________</p>
            <p><strong>Authorized Signatory</strong></p>
          </div>
        </div>

        <p style="text-align:center;font-size:9px;margin-top:10px;color:#666;">
          Thank you for choosing IndianHairWorld. Please retain this invoice for your records.
        </p>
      </body>
      </html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition mt-4"
    >
      Download Invoice
    </button>
  );
};

export default DownloadInvoiceButton;
