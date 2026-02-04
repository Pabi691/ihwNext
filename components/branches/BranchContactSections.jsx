// components/contact/BranchContactSections.jsx
import { MapPin, Phone } from "lucide-react";
import { branchData } from "../../content/branchData";

export default function BranchContactSections() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 space-y-24">
      {Object.entries(branchData).map(([slug, branch]) => (
        <div key={slug} className="space-y-10">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 border-b pb-3">
            {branch.name} Branch
          </h2>

          {/* Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Address */}
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
              <MapPin className="mx-auto mb-4 h-9 w-9 text-primary" />
              <h4 className="font-semibold mb-3 text-lg">Address</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {branch.address}
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
              <Phone className="mx-auto mb-4 h-9 w-9 text-primary" />
              <h4 className="font-semibold mb-3 text-lg">Phone</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {branch.phones.map((phone) => (
                  <p key={phone}>
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="hover:underline"
                    >
                      {phone}
                    </a>
                  </p>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border shadow-sm">
              <iframe
                src={branch.mapUrl}
                className="w-full h-[220px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
