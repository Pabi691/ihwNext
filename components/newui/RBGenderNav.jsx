import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Men / Women segmented control plus the gold alpona divider.
 *
 * Lifted out of RBHeaderNav so it can sit at the top of the hero instead of in
 * the header bar. Mobile-only — the desktop nav has its own Men/Women links.
 */

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

// Gold alpona divider: tapered rules, diamond accents, centred lotus. Drawn
// rather than shipped as an image so it inherits the festival accent colour and
// stays crisp at any density.
const GoldDivider = () => (
  <div className="mt-3 flex items-center justify-center gap-2" aria-hidden>
    <span
      className="h-px flex-1 max-w-[72px]"
      style={{ background: "linear-gradient(90deg, transparent, var(--rb-accent))" }}
    />
    <svg viewBox="0 0 8 8" className="w-[7px] h-[7px] flex-shrink-0" style={{ color: "var(--rb-accent)" }}>
      <rect x="1.2" y="1.2" width="5.6" height="5.6" transform="rotate(45 4 4)" fill="currentColor" />
    </svg>

    <svg viewBox="0 0 44 22" className="w-9 h-[18px] flex-shrink-0" fill="none" style={{ color: "var(--rb-accent)" }}>
      {/* outer petals */}
      <path d="M22 19C15.4 18.2 9.6 15 6.4 10.2c5.8-1.2 12.2 2 15.6 8.8Z" fill="currentColor" opacity=".45" />
      <path d="M22 19c6.6-.8 12.4-4 15.6-8.8-5.8-1.2-12.2 2-15.6 8.8Z" fill="currentColor" opacity=".45" />
      {/* mid petals */}
      <path d="M22 19c-4.4-1.4-7.8-5.2-8.6-9.8 4.4.9 7.8 4.6 8.6 9.8Z" fill="currentColor" opacity=".7" />
      <path d="M22 19c4.4-1.4 7.8-5.2 8.6-9.8-4.4.9-7.8 4.6-8.6 9.8Z" fill="currentColor" opacity=".7" />
      {/* centre petal */}
      <path d="M22 2.6c2.9 4.2 2.9 11.1 0 16.4-2.9-5.3-2.9-12.2 0-16.4Z" fill="currentColor" />
      {/* base line */}
      <path d="M14 19.6h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".55" />
    </svg>

    <svg viewBox="0 0 8 8" className="w-[7px] h-[7px] flex-shrink-0" style={{ color: "var(--rb-accent)" }}>
      <rect x="1.2" y="1.2" width="5.6" height="5.6" transform="rotate(45 4 4)" fill="currentColor" />
    </svg>
    <span
      className="h-px flex-1 max-w-[72px]"
      style={{ background: "linear-gradient(90deg, var(--rb-accent), transparent)" }}
    />
  </div>
);

const SEGMENTS = [
  { label: "Men", href: "/men", Icon: IconMan },
  { label: "Women", href: "/women", Icon: IconWoman },
];


export default function RBGenderNav() {
  const currentPath = useRouter().asPath.split("?")[0];

  return (
    <div className="lg:hidden px-3 pt-3">
<style>{`
  /* Lit half. The shades are computed from the palette in
     FestivalThemeContext and shipped as plain hex, so this needs no
     relative-colour support — an @supports fallback here previously
     left the pill on the unlit shade in browsers that lacked it.
     Vertical gradient with a bright top rim and an outward halo, per
     the reference. */
  .rb-seg-lit {
    background: linear-gradient(180deg,
      var(--rb-primary-lit-soft) 0%,
      var(--rb-primary-lit) 42%,
      var(--rb-primary-hover) 100%);
    box-shadow:
      0 0 30px -6px var(--rb-primary-lit),
      0 0 60px -10px var(--rb-primary-lit),
      0 4px 14px rgba(0,0,0,0.38),
      inset 0 1px 0 rgba(255,255,255,0.65),
      inset 0 0 0 1px rgba(255,255,255,0.22);
  }
`}</style>

{/* Men / Women — one segmented pill. Equal weight until you are actually
    inside one of the two sections, then that half lights. */}
<div
  className="relative mt-3 mx-auto max-w-[330px] rounded-full border border-white/20 bg-white/[0.07] backdrop-blur-md"
  style={{
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.28)",
  }}
>
  <div className="grid grid-cols-2 gap-1">
    {SEGMENTS.map(({ label, href, Icon }) => {
      // One half always carries the colour and the glow, the other stays
      // transparent — the control is never flat. Which half is lit
      // follows the route, defaulting to Men outside /women.
      const onThisPage = currentPath === href;
      const lit = currentPath === "/women" ? href === "/women" : href === "/men";
      return (
        <Link
          key={href}
          href={href}
          aria-current={onThisPage ? "page" : undefined}
          className={`h-10 rounded-full flex items-center justify-center gap-2 text-[15px] font-semibold tracking-wide transition-all ${
            lit ? "text-white rb-seg-lit" : "text-white/75 active:text-white"
          }`}
        >
          <Icon className="w-[19px] h-[19px]" />
          {label}
        </Link>
      );
    })}
  </div>
</div>

      <GoldDivider />
    </div>
  );
}
