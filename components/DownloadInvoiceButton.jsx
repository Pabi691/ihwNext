import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Montserrat from "../fonts/Montserrat"; // base64 string
import { toWords } from "number-to-words";

const DownloadInvoiceButton = ({ order }) => {
  const generateInvoice = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // ===== Font =====
    doc.addFileToVFS("Montserrat-Regular.ttf", Montserrat);
    doc.addFont("Montserrat-Regular.ttf", "Montserrat", "normal");
    doc.setFont("Montserrat");

    // ===== Header =====
    doc.setFontSize(18);
    doc.text("TAX INVOICE OF INDIAN HAIR WORLD", 14, 20);

    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(
      `Order Date: ${new Date(order.order_date).toLocaleDateString("en-GB")}`,
      14,
      36
    );
    doc.text(`Payment Method: ${order.payment_method?.method_name}`, 14, 42);

    // ===== Shipping Info =====
    doc.setFontSize(12);
    doc.text("Shipping Address", 14, 55);

    doc.setFontSize(10);
    doc.text(order.shipping_info.full_name, 14, 62);
    doc.text(
      `${order.shipping_info.address_line_1}, ${order.shipping_info.city}`,
      14,
      68
    );
    doc.text(
      `${order.shipping_info.state} - ${order.shipping_info.zip_code}, ${order.shipping_info.country}`,
      14,
      74
    );
    doc.text(`Phone: ${order.shipping_info.mobile_number}`, 14, 80);

    // ===== Table 1: Order Items =====
    const itemsColumns = ["Product", "Unit Price", "Qty", "Net Amount"];
    const itemsRows = order.order_items.map((item) => [
      item.product_name,
      `₹${Number(item.price).toFixed(2)}`,
      item.quantity,
      `₹${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [itemsColumns],
      body: itemsRows,
      theme: "grid",
      styles: { font: "Montserrat", fontSize: 9 },
      headStyles: { fillColor: [240, 240, 240], textColor: 0 },
    });

    const afterItemsY = doc.lastAutoTable.finalY + 8;

    // ===== Table 2: Totals =====
    const totalsColumns = ["Description", "Amount"];
    const payableAmountInWords = `${toWords(order.pay_amt)} Rupees Only`;
    const totalsRows = [
      ["Subtotal", `₹${order.net_amt.toFixed(2)}`],
      ["CGST (9%)", `₹${order.gst_summary.cgst.toFixed(2)}`],
      ["SGST (9%)", `₹${order.gst_summary.sgst.toFixed(2)}`],
    ];

    if (order.shipping_total > 0) {
      totalsRows.push(["COD Fee", `₹${order.shipping_total.toFixed(2)}`]);
    }

    totalsRows.push(["Total Payable", `₹${order.pay_amt.toFixed(2)}`]);
    totalsRows.push(["Amount in Words", payableAmountInWords]);

    autoTable(doc, {
      startY: afterItemsY,
      head: [totalsColumns],
      body: totalsRows,
      theme: "grid",
      styles: { font: "Montserrat", fontSize: 9 },
      headStyles: { fillColor: [240, 240, 240], textColor: 0 },
    });

    // ===== Footer =====
    doc.setFontSize(9);
    doc.text(
      "This is a system generated invoice and does not require signature.",
      14,
      280
    );

    doc.save(`Invoice_Order_${order.id}.pdf`);
  };

  return (
    <button
      onClick={generateInvoice}
      className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition"
    >
      Download Invoice
    </button>
  );
};

export default DownloadInvoiceButton;
