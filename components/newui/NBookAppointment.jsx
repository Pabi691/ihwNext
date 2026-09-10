import React, { useRef, useState } from "react";
import { FaPhone, FaWhatsapp, FaLocationDot, FaClock, FaArrowRightLong } from "react-icons/fa6";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

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
  {
    name: "Sodepur",
    address: "Shesher Kabita Apartment, 83, RN Avenue, Sodepur Rd, Pansila, Khardaha, Kolkata – 700112",
    phones: ["+918910097668"],
    whatsapp: "+918910097668",
    hours: "Mon–Sun: 11 AM – 7 PM",
    image: "/images/sodepur-office.png",
  },
];

const EASE = [0.22, 1, 0.36, 1];
const pad = (n) => String(n).padStart(2, "0");

function BranchCard({ branch, dir }) {
  return (
    <motion.div
      custom={dir}
      initial={{ opacity: 0, y: dir * 70, scale: 0.94, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -dir * 70, scale: 0.94, filter: "blur(10px)" }}
      transition={{ duration: 0.55, ease: EASE }}
      className="absolute inset-0 flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-8 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3 md:p-6 shadow-2xl"
    >
      {/* image — compact banner on mobile, full column on desktop */}
      <div className="relative overflow-hidden rounded-2xl h-[38%] min-h-[130px] flex-shrink-0 md:h-auto md:min-h-full bg-white/5">
        <motion.img
          key={branch.image}
          src={branch.image}
          alt={branch.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          onError={(e) => { e.currentTarget.src = "/images/salt-lake-office.png"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--rb-dark)]/70 via-transparent to-transparent" />
      </div>

      {/* details */}
      <div className="flex-1 min-h-0 flex flex-col justify-center py-1 md:py-4">
        <motion.h3
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
          className="text-xl md:text-4xl font-black text-white leading-tight"
        >
          {branch.name}
        </motion.h3>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.22, duration: 0.5, ease: EASE }}
          className="mt-2 md:mt-3 block h-1 w-12 md:w-16 origin-left rounded-full bg-[var(--rb-accent)]"
        />

        <div className="mt-3 md:mt-5 space-y-2 md:space-y-3">
          <div className="flex items-start gap-2.5 md:gap-3 text-[12px] md:text-[15px] text-white/70">
            <FaLocationDot className="w-4 h-4 text-[var(--rb-heading-dark)] flex-shrink-0 mt-0.5" />
            <span className="leading-snug line-clamp-2 md:line-clamp-none">{branch.address}</span>
          </div>
          <div className="flex items-center gap-2.5 md:gap-3 text-[12px] md:text-[15px] text-white/70">
            <FaClock className="w-4 h-4 text-[var(--rb-accent)] flex-shrink-0" />
            <span>{branch.hours}</span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-4 md:mt-7">
          <a
            href={`tel:${branch.phones[0]}`}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[var(--rb-primary)] hover:bg-[var(--rb-primary-hover)] text-white text-xs md:text-sm font-bold px-4 md:px-5 py-2.5 md:py-3 rounded-xl transition-colors"
          >
            <FaPhone className="w-3.5 h-3.5" /> Call Now
          </a>
          <a
            href={`https://wa.me/${branch.whatsapp.replace(/\D/g, "")}?text=Hi%20Indian%20Hair%20World%2C%20I%20want%20to%20book%20an%20appointment.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-bold px-4 md:px-5 py-2.5 md:py-3 rounded-xl transition-colors"
          >
            <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function NBookAppointment() {
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.max(0, Math.min(branches.length - 1, Math.floor(v * branches.length * 0.999)));
    setIdx((prev) => {
      if (n !== prev) setDir(n > prev ? 1 : -1);
      return n;
    });
  });

  return (
    <section
      ref={wrapRef}
      className="relative bg-[var(--rb-dark)]"
      style={{ height: `${branches.length * 62}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-25"
          style={{ background: "var(--rb-primary)" }}
        />

        {/* header */}
        <div className="relative text-center pt-10 md:pt-14 px-4">
          <span className="text-[var(--rb-heading-dark)] text-xs font-bold uppercase tracking-[0.3em]">Visit Us</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
            Book an <span className="text-[var(--rb-heading-dark)]">Appointment</span>
          </h2>
          <p className="text-white/40 text-sm mt-3 max-w-lg mx-auto">
            Scroll through our branches — walk into any one for a free consultation.
          </p>
        </div>

        {/* body */}
        <div className="relative flex-1 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-[220px_1fr] gap-6 md:gap-10 items-center">

            {/* left rail — big counter + branch list */}
            <div className="hidden md:block">
              <div className="font-black tabular-nums leading-none">
                <span className="text-7xl text-white">{pad(idx + 1)}</span>
                <span className="text-2xl text-white/25"> / {pad(branches.length)}</span>
              </div>
              <ul className="mt-7 space-y-3.5">
                {branches.map((b, i) => (
                  <li key={b.name} className="flex items-center gap-3">
                    <motion.span
                      className="h-[2px] rounded-full"
                      animate={{
                        width: i === idx ? 40 : 16,
                        backgroundColor: i === idx ? "var(--rb-accent)" : "rgba(255,255,255,0.25)",
                      }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                    <motion.span
                      className="text-sm font-semibold"
                      animate={{ color: i === idx ? "#ffffff" : "rgba(255,255,255,0.35)" }}
                      transition={{ duration: 0.4 }}
                    >
                      {b.name}
                    </motion.span>
                  </li>
                ))}
              </ul>
            </div>

            {/* card stage */}
            <div className="relative h-[56vh] max-h-[430px] md:h-[420px] md:max-h-none">
              <AnimatePresence mode="popLayout" custom={dir}>
                <BranchCard key={idx} branch={branches[idx]} dir={dir} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* mobile progress dots */}
        <div className="md:hidden flex justify-center gap-1.5 pb-20">
          {branches.map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 rounded-full"
              animate={{
                width: i === idx ? 22 : 6,
                backgroundColor: i === idx ? "var(--rb-accent)" : "rgba(255,255,255,0.25)",
              }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          ))}
        </div>

        {/* scroll hint */}
        <div className="hidden md:flex items-center justify-center gap-2 pb-6 text-white/30 text-xs font-semibold">
          scroll <FaArrowRightLong className="w-3.5 h-3.5 rotate-90" />
        </div>
      </div>
    </section>
  );
}
