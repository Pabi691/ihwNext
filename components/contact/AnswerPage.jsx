import React from "react";
import { Link, useLocation } from "@/components/compat/router";
import MainLayOut from "../../layout/MainLayOut";
import { BiChevronLeft } from "react-icons/bi";

const answers = {
  "/contact-us/appointment-payment/how-do-i-know-if-my-appointment-is-successfully-booked":
    "Once your appointment is booked, you will receive a confirmation call or message from our team. You may also receive a WhatsApp or SMS confirmation.",

  "/contact-us/appointment-payment/what-charges-apply-for-consultation-or-hair-patch-services":
    "Consultation charges and hair patch costs vary depending on the type of service selected. Our team will explain all charges transparently before starting.",

  "/contact-us/appointment-payment/why-is-cash-on-delivery-not-available":
    "Since our services are consultation-based and customized, COD is not applicable. We accept online payments and in-clinic payments.",

  "/contact-us/appointment-payment/i-am-unable-to-book-an-appointment":
    "Please refresh the page and try again. If the issue persists, contact our support team and we will assist you immediately.",

  "/contact-us/appointment-payment/i-tried-to-make-a-payment-but-it-failed":
    "If the amount was deducted, it will be automatically refunded within 3–5 business days. You may try again using another payment method.",

  "/contact-us/appointment-payment/will-any-indian-hair-world-employee-ask-for-confidential-information":
    "No. We will never ask for your OTP, card details, or passwords. Please report any such requests immediately.",

  "/contact-us/cancellations/can-i-cancel-my-appointment":
    "Yes, appointments can be canceled or rescheduled by informing us at least 24 hours in advance.",

  "/contact-us/cancellations/how-do-i-cancel-an-appointment-already-scheduled":
    "You can call or WhatsApp our support number with your booking details to cancel or reschedule.",

  "/contact-us/cancellations/can-i-reschedule-instead-of-canceling":
    "Absolutely! We encourage rescheduling if you are unable to attend on the chosen date.",

  "/contact-us/refunds/how-do-refunds-work":
    "Refunds are processed only for advance payments in case of service cancellation as per our policy.",

  "/contact-us/refunds/when-will-i-receive-my-refund":
    "Approved refunds are processed within 5–7 working days to the original payment method.",

  "/contact-us/membership/what-is-indian-hair-world-membership":
    "Indian Hair World Membership provides exclusive discounts, priority appointments, and special package offers.",

  "/contact-us/membership/what-are-the-benefits-of-membership":
    "Members enjoy cost savings, faster service, and personalized hair care solutions."
};

const AnswerPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageIdRaw = decodeURIComponent(params.get("pageId") || "");
  const pageId = pageIdRaw.replace(/\?$/, "");

  const answer =
    answers[pageId] || "Please contact Indian Hair World support for more details.";

  return (
    <MainLayOut>
      <div className="max-w-2xl mx-auto p-6 space-y-4 h-lvh">
        <Link
          className="text-blue-700 font-medium flex items-center gap-1 text-xs"
          to="/contact-us"
        >
          <BiChevronLeft /> Back
        </Link>
        <h2 className="text-2xl font-bold">Answer</h2>
        <p className="text-gray-700">{answer}</p>
      </div>
    </MainLayOut>
  );
};

export default AnswerPage;

