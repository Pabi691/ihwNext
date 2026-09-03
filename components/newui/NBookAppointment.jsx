import React from "react";
import { FaPhone, FaWhatsapp, FaLocationDot, FaClock } from "react-icons/fa6";

const branches = [
  {
    name: "Lake Gardens, Kolkata",
    address: "1A, Sultan Alam Rd, Lake Gardens, Kolkata – 700033",
    phones: ["+917980221032"],
    whatsapp: "+917980221032",
    hours: "Mon–Sun: 11 AM – 7 PM",
    image: "/images/lake-garden-office.png",
  },
  {
    name: "Salt Lake, Kolkata",
    address: "EC-20, Ground Floor, Opp. CC1, Sector-1, Salt Lake, Kolkata – 700064",
    phones: ["+918961194044"],
    whatsapp: "+918961194044",
    hours: "Mon–Sun: 11 AM – 7 PM",
    image: "/images/salt-lake-office.png",
  },
  {
    name: "Durgapur",
    address: "2nd Floor, Above PNB, City Center, Durgapur – 713216",
    phones: ["+919875517402"],
    whatsapp: "+919875517402",
    hours: "Mon–Sun: 11 AM – 7 PM",
    image: "/images/durgapur-office.png",
  },
  {
    name: "Siliguri",
    address: "City Plaza, 2nd Floor, Shop No 3, Sevoke Road, Siliguri – 734001",
    phones: ["+917439436698"],
    whatsapp: "+917439436698",
    hours: "Mon–Sun: 11 AM – 7 PM",
    image: "/images/siliguri-office.png",
  },
];

function BranchCard({ branch }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={branch.image}
          alt={branch.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.currentTarget.src = "/images/salt-lake-office.png"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2c]/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="bg-[#04A9FF] text-white text-xs font-bold px-3 py-1 rounded-full">
            {branch.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-2.5 text-sm text-gray-600">
          <FaLocationDot className="w-4 h-4 text-[#04A9FF] flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{branch.address}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <FaClock className="w-4 h-4 text-[#ef7f1a] flex-shrink-0" />
          <span>{branch.hours}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-1">
          <a
            href={`tel:${branch.phones[0]}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#04A9FF] hover:bg-[#0090dd] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            <FaPhone className="w-3 h-3" /> Call Now
          </a>
          <a
            href={`https://wa.me/${branch.whatsapp.replace(/\D/g, "")}?text=Hi%20Indian%20Hair%20World%2C%20I%20want%20to%20book%20an%20appointment.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            <FaWhatsapp className="w-3 h-3" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function NBookAppointment() {
  return (
    <section className="py-16 md:py-24 bg-[#0f1a2c]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#04A9FF] text-xs font-bold uppercase tracking-widest">Visit Us</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-1">
            Book an <span className="text-[#04A9FF]">Appointment</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto">
            Walk into any of our branches for a free consultation. Our experts will recommend the perfect solution for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {branches.map((b, i) => <BranchCard key={i} branch={b} />)}
        </div>
      </div>
    </section>
  );
}
