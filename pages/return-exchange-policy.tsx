import React from 'react';
import MainLayOut from '../layout/MainLayOut';
import { DesktopNav } from '../components/Navigation';

const ReturnPolicy = () => {
  return (
    <>
      <MainLayOut>
        <DesktopNav />
        <div className="return-exchange-policy max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold">Indian Hair World – Return & Exchange Policy</h1>

          <p><strong>Branches:</strong> Salt Lake, Kolkata | Lake Gardens, Kolkata | Durgapur</p>
          <p><strong>Contact:</strong> Phone: +91 8240561627 | Email: support@indianhairworld.com</p>

          <section>
            <h2 className="text-xl font-semibold">Overview</h2>
            <p>
              At Indian Hair World, we do not offer refunds under any circumstances.
              Exchanges are allowed only for specific eligible products and only when the item received is defective, damaged, or incorrect.
              Please read the policy carefully before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Exchange Conditions & Shipping Notice</h2>
            <p>
              Please Note: During festivals, sales, adverse weather conditions (such as heavy rain or natural calamities),
              political crises, or curfews, your shipment may take up to 20 days to be delivered.
              We assure you that we will make every effort to deliver your order as soon as possible.
              However, such delays will not be considered a valid reason for order cancellation, exchange, or refund.
            </p>
            <ul className="list-disc ml-6">
              <li>Exchanges are accepted only within 6 days of delivery.</li>
              <li>To qualify for an exchange, the product must be defective, damaged, or incorrectly delivered.</li>
              <li>Products purchased during sales, promotional offers, or discounts are not eligible for exchange.</li>
              <li>A detailed reason for exchange along with valid photo or video proof must be submitted via email to <a href="mailto:support@indianhairworld.com" className="text-blue-600">support@indianhairworld.com</a></li>
              <li>Exchanges are subject to product availability and approval.</li>
              <li>No exchanges will be accepted beyond the 6-day window.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Products Not Eligible for Return or Exchange</h2>
            <p>The following items are final sale and cannot be returned or exchanged under any circumstance:</p>
            <ul className="list-disc ml-6">
              <li>Hair Strands</li>
              <li>Hair Buns</li>
              <li>Hair Extensions</li>
              <li>Sale Orders / Discounted Products</li>
              <li>Orders purchased using a coupon code</li>
              <li>Accessories such as All Hair Patch Accessories (Glue, tape etc.), Hair clips, Hair Combs, Hair Serum, Etc.</li>
              <li>Products purchased from pop-ups/exhibitions or in-studio trials</li>
              <li>Products that have been coloured, chemically treated, or damaged due to styling post-purchase</li>
            </ul>
            <p>Please ensure you select the correct color, size, and length before completing your purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Cancellations</h2>
            <ul className="list-disc ml-6">
              <li>Order cancellations must be requested within 24 hours of placing the order by emailing <a href="mailto:support@indianhairworld.com" className="text-blue-600">support@indianhairworld.com</a></li>
              <li>Cancellations are not guaranteed and are subject to order processing status.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Exchange Process – Domestic Orders (India)</h2>
            <ol className="list-decimal ml-6">
              <li>Email <a href="mailto:support@indianhairworld.com" className="text-blue-600">support@indianhairworld.com</a> within 6 days of delivery with your order number, reason for exchange, and supporting photo/video evidence.</li>
              <li>Once approved, we will initiate a reverse pickup.</li>
              <li>Returned items must be unused, unwashed, unaltered, and in original packaging.</li>
              <li>After inspection, an exchange will be processed within 7–10 business days.</li>
              <li>A handling fee of Rs. 200 will apply before the replacement is dispatched.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Exchange Process – International Orders</h2>
            <ol className="list-decimal ml-6">
              <li>Email <a href="mailto:support@indianhairworld.com" className="text-blue-600">support@indianhairworld.com</a> with order details, exchange reason, and photo/video evidence.</li>
              <li>If approved, the product must be shipped back to our India address at the customer’s cost.</li>
              <li>Upon receipt and verification, a replacement will be arranged if the item is in original condition.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Important Guidelines</h2>
            <ul className="list-disc ml-6">
              <li>All exchanged items must be in original condition with tags and packaging intact.</li>
              <li>Any item that has been combed, cut, dyed, washed, chemically treated, or altered will not be accepted.</li>
              <li>An unboxing video is mandatory for claims related to missing or damaged items.</li>
              <li>Include your order number and contact details in the return parcel.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Disclaimer</h2>
            <p>
              This policy applies only to purchases made through Indian Hair World’s official branches or authorized platforms.
              Items bought from third-party or unauthorized sellers are not eligible for support, exchange, or claims.
              We are not responsible for delays caused by festivals, adverse weather, political events, or courier issues.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Indian Hair World Reserves the Right to Refuse or Cancel Customer Orders</h2>
            <p>At Indian Hair World, we reserve the right to refuse or cancel any order at our discretion. This may include:</p>
            <ul className="list-disc ml-6">
              <li><strong>Unconfirmed COD Orders:</strong> Orders placed via WhatsApp, email, or website that remain unconfirmed despite our attempts to contact you will be cancelled automatically.</li>
              <li><strong>Inactive or Unresponsive Customers:</strong> If we cannot reach you for confirmation, your order will not be processed.</li>
              <li><strong>Suspicious or Fraudulent Activity:</strong> Orders with incomplete details, suspicious behavior, or a history of failed deliveries may be cancelled.</li>
              <li><strong>Policy Violations:</strong> Any order that risks our operations or violates our terms may be refused without notice.</li>
            </ul>
            <p>We appreciate your understanding as we strive to ensure secure and reliable service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <p>📧 Email: <a href="mailto:support@indianhairworld.com" className="text-blue-600">support@indianhairworld.com</a></p>
            <p>📱 WhatsApp: +91 8240561627</p>
          </section>
        </div>
      </MainLayOut>
    </>
  );
};

export default ReturnPolicy;
