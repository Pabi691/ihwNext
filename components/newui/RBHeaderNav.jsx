import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaMagnifyingGlass, FaPhone, FaUser, FaHeart, FaCartShopping, FaChevronDown, FaHouse, FaBars, FaXmark } from "react-icons/fa6";
import { useGlobal } from "@/global/GlobalContext";
// Single source of truth — same menu as the live site's DesktopNav.
import { desktopNavItems } from "@/content/navItems";

// Head-and-shoulders marks for the Men / Women segments. Inline rather than
// pulled from react-icons so the pair is visually matched at 18px — the icon
// set has no equivalent female bust.
const IconMan = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20c0-3.7 3.2-6.2 7.2-6.2s7.2 2.5 7.2 6.2" />
  </svg>
);

const IconWoman = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M7.6 7.2C8.4 4.6 10 3.4 12 3.4s3.6 1.2 4.4 3.8" />
    <path d="M7.9 7.6v4.2M16.1 7.6v4.2" />
    <path d="M4.8 20c0-3.7 3.2-6.2 7.2-6.2s7.2 2.5 7.2 6.2" />
  </svg>
);

const SEGMENTS = [
  { label: "Men", href: "/men", Icon: IconMan },
  { label: "Women", href: "/women", Icon: IconWoman },
];

function MobileDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className={`lg:hidden fixed inset-0 z-[200] ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`absolute top-0 right-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 bg-[var(--rb-primary)]">
          <span className="text-white font-black tracking-tight">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="w-9 h-9 rounded-full flex items-center justify-center text-white">
            <FaXmark className="w-4.5 h-4.5" />
          </button>
        </div>
        <nav className="py-2 overflow-y-auto h-[calc(100%-3.5rem)]">
          {desktopNavItems.map((item) =>
            item.children ? (
              <div key={item.label} className="border-b border-gray-50">
                <button
                  onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-800"
                >
                  {item.label}
                  <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded === item.label ? "rotate-180" : ""}`} />
                </button>
                {expanded === item.label && (
                  <div className="pb-2">
                    {item.children.map((c) => (
                      <Link key={c.path} href={c.path} onClick={onClose}
                        className="block pl-8 pr-5 py-2.5 text-sm text-gray-600 hover:text-[var(--rb-heading)]">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.path} href={item.path} onClick={onClose}
                className="block px-5 py-3.5 text-sm font-semibold text-gray-800 hover:text-[var(--rb-heading)] border-b border-gray-50">
                {item.label}
              </Link>
            )
          )}
          <a href="tel:+918910097668" className="block px-5 py-3.5 text-sm font-bold text-[var(--rb-heading)]">
            📞 +91 89100 97668
          </a>
        </nav>
      </div>
    </div>
  );
}

export default function RBHeaderNav() {
  const { cartLength, wishlist } = useGlobal() || {};
  const wishlistLength = wishlist?.length || 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0];

  const submitSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="w-full bg-white">
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Mobile-only header — desktop rows below are untouched.
          Deep gradient ground with soft light sweeps, one gold "call" action
          that carries a glow, and Men/Women as a single segmented pill whose
          active half is filled — so the bar reads as one designed object rather
          than a row of separate controls. */}
      <div
        className="lg:hidden relative overflow-hidden px-3 py-3"
        style={{
          background:
            "linear-gradient(135deg, var(--rb-primary-mid2) 0%, var(--rb-primary-mid) 55%, var(--rb-primary-mid2) 100%)",
        }}
      >
        {/* ambient light sweeps */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-20 w-56 h-56 rounded-full blur-3xl opacity-40"
          style={{ background: "var(--rb-primary-hover)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-24 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--rb-primary-hover)" }}
        />

        <div className="relative flex items-center justify-between gap-3">
          <Link href="/" className="flex-shrink-0" aria-label="Indian Hair World — home">
            <img
              src="/images/IHW LOGO.png"
              alt="Indian Hair World"
              className="h-8 w-auto object-contain brightness-0 invert"
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/search"
              aria-label="Search"
              className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-white/10 border border-white/15 backdrop-blur-sm transition-colors active:bg-white/20"
            >
              <FaMagnifyingGlass className="w-[18px] h-[18px]" />
            </Link>

            {/* calling is the primary action: solid accent fill plus a glow */}
            <a
              href="tel:+918910097668"
              aria-label="Call us"
              className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in srgb, var(--rb-accent) 72%, white) 0%, var(--rb-accent) 100%)",
                color: "var(--rb-dark)",
                boxShadow:
                  "0 0 34px -2px var(--rb-accent), 0 0 16px -4px var(--rb-accent), 0 6px 16px rgba(0,0,0,0.4)",
              }}
            >
              <FaPhone className="w-[18px] h-[18px]" />
            </a>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-white/10 border border-white/15 backdrop-blur-sm transition-colors active:bg-white/20"
            >
              <FaBars className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Lit half. color-mix with white raised lightness but dragged saturation
            78 -> 58, which is what made it dusty pink instead of the vivid
            crimson in the reference. Relative colour keeps hue and saturation
            and lifts lightness alone. Plain gradient first for browsers without
            hsl(from ...), which simply get the flatter fill. */}
        <style>{`
          .rb-seg-lit {
            background: linear-gradient(135deg, var(--rb-primary-hover) 0%, var(--rb-primary) 100%);
            box-shadow: 0 0 26px -4px var(--rb-primary-hover),
                        0 6px 18px rgba(0,0,0,0.4),
                        inset 0 1px 0 rgba(255,255,255,0.5);
          }
          @supports (color: hsl(from red h s l)) {
            .rb-seg-lit {
              background: linear-gradient(135deg,
                hsl(from var(--rb-primary-hover) h calc(s + 6%) calc(l + 14%)) 0%,
                var(--rb-primary-hover) 58%,
                hsl(from var(--rb-primary-hover) h s calc(l - 7%)) 100%);
              box-shadow:
                0 0 36px -4px hsl(from var(--rb-primary-hover) h s calc(l + 10%)),
                0 0 18px -6px hsl(from var(--rb-primary-hover) h s calc(l + 20%)),
                0 6px 20px rgba(0,0,0,0.45),
                inset 0 1px 0 rgba(255,255,255,0.55);
            }
          }
        `}</style>

        {/* Men / Women — one segmented pill, active half filled. Highlights the
            section you are actually in rather than always looking the same. */}
        <div className="relative mt-3 rounded-full border border-white/25 bg-white/[0.06] p-2 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-2">
            {SEGMENTS.map(({ label, href, Icon }) => {
              // Two separate ideas: which page you are actually on (for
              // assistive tech) and which half is lit. Men stays lit anywhere
              // outside /women so the control never renders flat.
              const onThisPage = currentPath === href;
              const lit = currentPath === "/women" ? href === "/women" : href === "/men";
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={onThisPage ? "page" : undefined}
                  className={`h-[52px] rounded-full flex items-center justify-center gap-2.5 text-base font-semibold tracking-wide transition-all ${
                    lit ? "text-white rb-seg-lit" : "text-white/75 active:text-white"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 1 — logo, search, contact, account icons */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 md:px-8 h-20 items-center gap-6">
        <Link href="/" className="flex items-center flex-shrink-0" aria-label="Indian Hair World — home">
          <img
            src="/images/IHW LOGO.png"
            alt="Indian Hair World"
            className="h-9 md:h-10 w-auto object-contain"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
        </Link>

        {/* Men / Women shortcuts, in place of the old wordmark beside the logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {[["Men", "/men"], ["Women", "/women"]].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-1.5 rounded-full text-xs font-bold border border-[var(--rb-primary)]/25 text-[var(--rb-heading)] hover:bg-[var(--rb-primary)] hover:text-white hover:border-[var(--rb-primary)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <form
          onSubmit={submitSearch}
          className="hidden md:flex flex-1 items-center bg-gray-50 border border-gray-100 rounded-full px-4 py-2.5"
        >
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search for hair patch, hair system..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <button type="submit" aria-label="Search" className="flex-shrink-0">
            <FaMagnifyingGlass className="w-4 h-4 text-gray-400 hover:text-[var(--rb-heading)] transition-colors" />
          </button>
        </form>

        <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
          <a
            href="tel:+918910097668"
            className="hidden lg:flex items-center gap-2.5 flex-shrink-0 border-r border-gray-200 pr-5"
          >
            <span className="w-9 h-9 rounded-full border border-[var(--rb-primary)]/30 flex items-center justify-center text-[var(--rb-heading)]">
              <FaPhone className="w-3.5 h-3.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[10px] text-gray-400 font-semibold">Book Free Consultation</span>
              <span className="block text-sm font-black text-[var(--rb-heading)]">+91 89100 97668</span>
            </span>
          </a>

          <Link href="/login" className="hidden sm:flex flex-col items-center gap-1 text-gray-600 hover:text-[var(--rb-heading)] transition-colors">
            <FaUser className="w-4 h-4" />
            <span className="text-[10px] font-semibold whitespace-nowrap">Login / Signup</span>
          </Link>

          <Link href="/wishlist" aria-label="Wishlist" className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-[var(--rb-heading)] transition-colors border-l border-gray-200 pl-4 md:pl-5">
            <FaHeart className="w-4 h-4" />
            {wishlistLength > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[var(--rb-primary)] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistLength}
              </span>
            )}
            <span className="hidden md:block text-[10px] font-semibold">Wishlist</span>
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative flex flex-col items-center gap-1 text-[var(--rb-heading)] hover:text-[var(--rb-primary-hover)] transition-colors border-l border-gray-200 pl-4 md:pl-5">
            <FaCartShopping className="w-4 h-4" />
            {cartLength > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[var(--rb-primary)] text-white text-[9px] font-bold flex items-center justify-center">
                {cartLength}
              </span>
            )}
            <span className="hidden md:block text-[10px] font-semibold">Cart</span>
          </Link>
        </div>
      </div>

      {/* Row 2 — nav links — pulled down over the hero below via negative
          margin, so the pill sits half on the white header, half on the
          hero background (kept in front with a higher z-index). */}
      <div className="hidden lg:block relative z-30 max-w-7xl mx-auto px-4 md:px-8 pb-4 pt-1 -mb-10">
        <nav className="flex items-center justify-center gap-9 xl:gap-16 bg-gradient-to-r from-[var(--rb-primary-mid2)] to-[var(--rb-primary)] rounded-full py-3 px-10 xl:px-16">
          {desktopNavItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className="relative group">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 group-hover:text-[var(--rb-accent-light)] cursor-pointer transition-colors">
                    {item.label}
                    <FaChevronDown className="w-2.5 h-2.5 opacity-70" />
                  </span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block z-50">
                    <div className="bg-white shadow-xl border border-gray-100 rounded-xl min-w-[220px] overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--rb-cream)] hover:text-[var(--rb-heading)] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            const isHome = item.label === "Home";
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  isHome
                    ? "bg-[var(--rb-primary-hover)] text-white px-4 py-1.5 rounded-full"
                    : "text-white/85 hover:text-[var(--rb-accent-light)]"
                }`}
              >
                {isHome && <FaHouse className="w-3 h-3" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
