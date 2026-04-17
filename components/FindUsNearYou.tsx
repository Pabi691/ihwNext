import React from "react";
import { MapPin, Navigation2 } from "lucide-react";

const branches = [
  {
    name: "Lake Gardens, Kolkata",
    address: "1A, Sultan Alam Rd, Lake Gardens, Kolkata, West Bengal 700033",
    landmark: "Near Tollygunge Metro Station",
    areas: "Lake Gardens · Tollygunge · Gariahat · Behala · New Alipore",
    phone: "+917980221032",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14743.793822821972!2d88.34616800000002!3d22.506117000000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271ee3d777485%3A0xb3e1a11acb3b0e44!2sIndian%20Hair%20World!5e0!3m2!1sen!2sin!4v1769174791072!5m2!1sen!2sin",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=1A%2C+Sultan+Alam+Rd%2C+Lake+Gardens%2C+Kolkata%2C+West+Bengal+700033",
  },
  {
    name: "Salt Lake, Kolkata",
    address: "HD-53, Sector 1, Salt Lake City, Kolkata, West Bengal 700064",
    landmark: "Opp. CC1, Sector-1",
    areas: "Salt Lake · New Town · Rajarhat · surrounding areas",
    phone: "+918961194044",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14735.131250655555!2d88.408487!3d22.587225!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027536b38aad3b%3A0x2fcf6656de9f0225!2sIndian%20Hair%20World%20Salt%20Lake%20%7C%20Non-Surgical%20Hair%20Replacement%20Services%20for%20Best%20Hair%20Patch%20and%20Hair%20Wigs%20In%20Kolkata!5e0!3m2!1sen!2sin!4v1769174890975!5m2!1sen!2sin",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=HD-53%2C+Sector+1%2C+Salt+Lake+City%2C+Kolkata%2C+West+Bengal+700064",
  },
];

const FindUsNearYou = () => {
  return (
    <section className="w-full py-16 px-4 md:px-10 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Find Us Near You
          </h2>
          <p className="text-gray-500 mt-3">
            2 branches across Kolkata — Salt Lake, New Town, Rajarhat, Lake Gardens, Tollygunge & south Kolkata
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {branches.map((branch, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div className="h-[260px]">
                <iframe
                  src={branch.mapUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${branch.name} Location Map`}
                />
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#ef7f1a] flex-shrink-0 mt-0.5" />
                  <span>{branch.address}<br /><span className="text-gray-400">Landmark: {branch.landmark}</span></span>
                </div>

                <p className="text-sm text-gray-500">Serving: {branch.areas}</p>

                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 bg-[#ef7f1a] hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow transition"
                >
                  <Navigation2 className="w-4 h-4" /> Get Directions
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FindUsNearYou;
