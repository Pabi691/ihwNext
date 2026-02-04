import React from "react";
import MainLayOut from "../layout/MainLayOut";
import { DesktopNav } from "../components/Navigation";

const ShippingDeliveryPolicy = () => {
  return (
    <MainLayOut>
        <DesktopNav />
        <div className="shipping-delivery-policy max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Hello and Welcome!</h1>
      <p>
        At Indian Hair World, we take pride in delivering your selected products with love, care, and complete transparency. 
        Please take a moment to review our Delivery & Shipping Policy so you know exactly what to expect when placing your order.
      </p>

      <section>
        <h2 className="text-xl font-semibold">📦 Delivery & Shipping Information</h2>
        <p>We have partnered with Delhivery for all domestic and international shipments.</p>
        <ul className="list-disc ml-6">
          <li><strong>Domestic Shipping (Within India):</strong> Completely free of charge.</li>
          <li>
            <strong>International Shipping:</strong> Charges vary based on your country. 
            Please note that customs duties and import taxes are not included and must be paid separately by the customer as per local regulations.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">🚚 Estimated Delivery Time</h2>
        
        <h3 className="text-lg font-semibold">For Domestic Orders (India):</h3>
        <ul className="list-disc ml-6">
          <li>Orders are processed and dispatched within 1 business day.</li>
          <li>Standard delivery time is 5–7 business days across India.</li>
        </ul>
        <p>Delays may occur in the following situations:</p>
        <ul className="list-disc ml-6">
          <li>Incorrect address, pin code, or contact number</li>
          <li>Unserviceable pin code</li>
          <li>Time required for hair color matching</li>
        </ul>
        <p>
          In such cases, we may reach out to you for further assistance before dispatching your order.
        </p>
        <p>
          <strong>Important:</strong> During festivals, extreme weather, natural calamities, or political disturbances, delivery times may be affected. 
          We appreciate your understanding and patience during such events.
        </p>

        <h3 className="text-lg font-semibold mt-4">For International Orders:</h3>
        <ul className="list-disc ml-6">
          <li>Orders are shipped via Delhivery.</li>
          <li>Standard delivery time: 7–10 business days.</li>
          <li>Custom orders may require an additional 2 business days for KYC and customs clearance, which must be completed by the customer.</li>
        </ul>
        <p>
          <strong>Note:</strong> International shipping charges vary by destination. Custom duties and taxes are not included in the shipping fee and must be paid by the customer at the time of delivery, as per local laws.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions or need help with your order, please contact us at 
          <a href="mailto:support@indianhairworld.com" className="text-blue-600"> support@indianhairworld.com</a>. 
          We’re always happy to assist you!
        </p>
      </section>
    </div>
    </MainLayOut>
  );
};

export default ShippingDeliveryPolicy;
