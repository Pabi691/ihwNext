import React from 'react';
import MainLayOut from '../layout/MainLayOut';
import { DesktopNav } from '../components/Navigation';

const Privacy = () => {
  return (
    <>
      <MainLayOut>
        <DesktopNav />
        {/* start */}
        <div className="privacy-policy max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p><strong>Effective Date:</strong> 11-07-2024</p>

          <p>
            Welcome to Indian Hair World (“we”, “our”, “us”). We are committed to
            protecting your privacy and providing a safe online experience. This
            Privacy Policy explains how we collect, use, protect, and handle your
            Personally Identifiable Information (PII) in accordance with US privacy
            laws and regulations.
          </p>

          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p>We may collect the following types of PII from users who visit our website or use our services:</p>
            <ul className="list-disc ml-6">
              <li><strong>Personal Information:</strong> Name, email address, mailing address, phone number, payment information (such as credit card details).</li>
              <li><strong>Non-Personal Information:</strong> Browser type, IP address, demographic information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. How We Collect Information</h2>
            <ul className="list-disc ml-6">
              <li>When you register on our site, place an order, subscribe to our newsletter, or engage in other site activities.</li>
              <li>When you provide feedback or participate in surveys or contests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Use of Information</h2>
            <ul className="list-disc ml-6">
              <li>Personalize user experience and deliver tailored content.</li>
              <li>Improve our website based on user preferences and feedback.</li>
              <li>Process transactions quickly and securely.</li>
              <li>Administer promotions, surveys, and other site features.</li>
              <li>Follow up on inquiries made through live chat, email, or phone.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Protection of Information</h2>
            <ul className="list-disc ml-6">
              <li>Our website undergoes regular security scans to identify and address vulnerabilities.</li>
              <li>Personal information is stored behind secured networks and is accessible only to a limited number of authorized personnel who are required to keep the information confidential.</li>
              <li>We utilize Secure Socket Layer (SSL) technology to encrypt sensitive/credit information during transmission.</li>
              <li>Transactions are processed through a trusted third-party payment gateway provider; we do not store or process your credit card information on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Use of Cookies</h2>
            <ul className="list-disc ml-6">
              <li>Cookies are used to remember items in your shopping cart and user preferences.</li>
              <li>They help us understand and compile aggregate data about site traffic and interactions to improve our website in the future.</li>
              <li>You can choose to disable cookies through your browser settings; however, this may affect certain features and functionality of the site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Third-party Disclosure</h2>
            <p>
              We do not sell, trade, or transfer your PII to outside parties unless we provide users with advance notice.
              This excludes trusted third parties who assist us in operating our website, conducting our business, or servicing you,
              as long as these parties agree to keep this information confidential. We may also release information when it’s
              appropriate to comply with the law, enforce our site policies, or protect our or others’ rights, property, or safety.
              Non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Third-party Links and Advertising</h2>
            <p>
              We do not include or offer third-party products or services on our website. However, we use Google AdSense Advertising
              and other third-party services like Google Analytics that may use cookies to collect data for advertising purposes.
              You can opt-out of personalized advertising by visiting the Google Ad Settings page or using the Network Advertising Initiative Opt Out page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Compliance with Laws</h2>
            <p>We comply with the California Online Privacy Protection Act (CalOPPA) and honor Do Not Track signals.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Children’s Online Privacy Protection Act (COPPA)</h2>
            <p>We do not knowingly collect personal information from children under 13 years of age.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Fair Information Practices</h2>
            <p>In the event of a data breach, we will notify affected users via email within 7 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, Please contact us.
            </p>
          </section>

          <p>
            This updated privacy policy should provide a clear understanding of how you collect, use, protect, and handle users’ Personally Identifiable Information on your website.
            Always ensure to review and update your policy regularly to reflect any changes in your practices or legal requirements.
          </p>
        </div>
        {/* end */}
      </MainLayOut>
    </>
  );
};

export default Privacy;
