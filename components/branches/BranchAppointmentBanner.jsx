import { branchData } from "../../content/branchData";
import { FaPhone, FaWhatsapp, FaLocationDot } from "react-icons/fa6";

const branches = Object.values(branchData);

const BranchAppointmentBanner = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-[var(--site-light)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[var(--site-primary)] text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Visit Us
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--site-dark)]">
            Book an <span className="text-[var(--site-primary)]">Appointment</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
            Walk into any of our {branches.length} branches for a free consultation — no prior appointment needed.
          </p>
        </div>

        {/* Branch cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {branches.map((b, i) => {
            const phone = (b.phones?.[0] || "").replace(/\s+/g, "");
            const wa = (b.whatsapp || "").replace(/\D/g, "");
            return (
              <div
                key={i}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image / fallback */}
                <div className="relative h-32 md:h-36 overflow-hidden bg-gradient-to-br from-[var(--site-primary)] to-[var(--site-dark)]">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/85 gap-1">
                      <FaLocationDot className="w-7 h-7" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">{b.name.split(",")[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col p-3 md:p-4">
                  <h3 className="text-[var(--site-dark)] font-bold text-sm leading-tight">{b.name}</h3>
                  {b.landmark && (
                    <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-1">{b.landmark}</p>
                  )}
                  <p className="mt-2 text-[var(--site-primary)] font-black text-sm tracking-tight">
                    {b.phones?.[0]}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--site-primary)] hover:bg-[var(--site-primary-hover)] text-white text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      <FaPhone className="w-3 h-3" /> Call Now
                    </a>
                    {wa && (
                      <a
                        href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi Indian Hair World, I'd like to book an appointment at ${b.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${b.name}`}
                        className="w-8 h-8 flex-shrink-0 inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BranchAppointmentBanner;
