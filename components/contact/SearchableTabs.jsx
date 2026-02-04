import React, { useState } from "react";
import { Link, useNavigate } from "@/components/compat/router";

const tabs = [
  {
    label: "Appointments, Payment & Consultation",
    questions: [
      "How do I know if my appointment is successfully booked?",
      "What charges apply for consultation or hair patch services?",
      "Why is Cash on Delivery not available?",
      "I am unable to book an appointment",
      "My appointment is booked but I did not receive confirmation",
      "I want to change my phone number for the appointment",
      "I missed my appointment, what should I do?",
      "I tried to make a payment but it failed",
      "Will any Indian Hair World employee ask for confidential information?"
    ],
    slug: "appointment-payment",
  },
  {
    label: "Cancellations",
    questions: [
      "Can I cancel my appointment?",
      "How do I cancel an appointment already scheduled?",
      "Can I reschedule instead of canceling?"
    ],
    slug: "cancellations",
  },
  {
    label: "Refunds & Adjustments",
    questions: [
      "How do refunds work?",
      "When will I receive my refund?",
      "Can I adjust my payment for another service?"
    ],
    slug: "refunds",
  },
  {
    label: "My Appointment",
    questions: [
      "My appointment is not yet confirmed",
      "How do I check my appointment status?"
    ],
    slug: "appointment",
  },
  {
    label: "My Account",
    questions: [
      "How do I change my password?",
      "How do I update my contact details?"
    ],
    slug: "account",
  },
  {
    label: "Offers & Packages",
    questions: [
      "How do I apply offers or packages?",
      "Terms & conditions for hair packages"
    ],
    slug: "offers",
  },
  {
    label: "Membership",
    questions: [
      "What is Indian Hair World Membership?",
      "What are the benefits of membership?"
    ],
    slug: "membership",
  },
];

const SearchableTabs = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(tabs[0].slug);
  const navigate = useNavigate();

  const filteredTabs = tabs.map((tab) => ({
    ...tab,
    questions: tab.questions.filter((q) =>
      q.toLowerCase().replace(/\s+/g, " ").includes(
        search.toLowerCase().replace(/\s+/g, " ")
      )
    ),
  }));

  const searchResults = filteredTabs.flatMap((tab) =>
    tab.questions.map((question) => ({
      question,
      slug: tab.slug,
    }))
  );

  return (
      <div className="max-w-7xl p-4 space-y-4 mx-auto py-10">
        <div className="p-1 md:p-8 text-center md:text-left">
          <p className="font-semibold">What’s your query about?</p>
          <div className="relative mt-5 mb-10 w-fit mx-auto md:mx-0">
            <span className="absolute left-3 top-1 z-10 text-3xl rotate-[270deg] text-gray-500">⌕‍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your query here"
              className="w-72 border border-gray-500 rounded-full pl-10 pr-4 py-2 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full flex md:block md:w-1/4 border-r border-gray-200 pr-4 overflow-scroll scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => {
                  setActiveTab(tab.slug);
                  setSearch("");
                }}
                className={`block md:w-full w-fit text-nowrap text-xs md:text-base text-left px-4 py-2 rounded-lg ${
                  activeTab === tab.slug
                    ? "font-bold text-black"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-3/4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(search ? searchResults : tabs.find(t => t.slug === activeTab)?.questions.map(q => ({ question: q, slug: activeTab })))
                ?.map(({ question, slug }, idx) => {
                  const pageId = `/contact-us/${slug}/${question
                    .toLowerCase()
                    .replace(/'/g, "")
                    .replace(/[.,?/]/g, "")
                    .replace(/\s+/g, "-")}`;
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        navigate(`/contact-us/page?pageId=${encodeURIComponent(pageId)}`)
                      }
                      className="cursor-pointer border border-gray-300 rounded-lg p-4 hover:shadow-md"
                    >
                      {question}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="cp_address pt-20">
          <h3 className="my-5 font-semibold">Corporate Address:</h3>
          <p>Indian Hair World</p>
          <p>Registered Address: Kolkata, West Bengal, India</p>
          <p className="mt-5">
            You can reach us at{" "}
            <span className="font-medium">support@indianhairworld.com</span> or call{" "}
            <Link
              className="font-medium text-blue-600"
              to="https://wa.me/8910652352"
              target="_blank"
              rel="noopener noreferrer"
            >
              8910652352
            </Link>
          </p>
        </div>
      </div>
  );
};

export default SearchableTabs;

