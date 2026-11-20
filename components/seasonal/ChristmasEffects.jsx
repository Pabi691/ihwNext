import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

/**
 * Christmas decorations: snowfall, a snowman who walks along the bottom and
 * stops to dance, Santa's sleigh flying past, swinging bells under the header
 * and a twinkling tree. Each part is switched from the CRM (see
 * SeasonalEffects.jsx).
 *
 * - Nothing here takes clicks (pointer-events: none) except the visitor's own
 *   on/off button, and it sits under the header, bottom nav and modals.
 * - Visitors can switch it off; that choice is remembered on their device.
 * - With "reduce motion" turned on in the OS, nothing moves: no snow, snowman
 *   or sleigh; the tree and bells stay still.
 *
 * Colours are fixed on purpose: these are illustrations (red Santa, green tree,
 * white snow), not brand surfaces, so they don't follow the --rb-* theme tokens.
 * All artwork is original.
 */

const OFF_KEY = "ihw:xmas-off";
const SNOW_COUNTS = { light: 40, medium: 80, heavy: 140 };

const CSS = `
.xm-root{position:fixed;inset:0;z-index:40;pointer-events:none;overflow:hidden;--xm-ground:0px;--xm-top:0px}
.xm-root svg{display:block;overflow:visible}
.xm-snow{position:absolute;inset:0;width:100%;height:100%}

.xm-walker{position:absolute;left:0;bottom:calc(var(--xm-ground) - 2px);width:64px;transform:translateX(-120px);animation:xm-walk 50s linear infinite}
.xm-face{animation:xm-face 50s linear infinite}
.xm-dance{animation:xm-dance 50s ease-in-out infinite}
.xm-waddle{transform-origin:50% 100%;animation:xm-waddle .5s ease-in-out infinite alternate}
.xm-arm-front{transform-box:fill-box;transform-origin:0% 100%;animation:xm-arm-front .5s ease-in-out infinite alternate}
.xm-arm-back{transform-box:fill-box;transform-origin:100% 100%;animation:xm-arm-back .5s ease-in-out infinite alternate}
.xm-scarf-tail{transform-box:fill-box;transform-origin:70% 0%;animation:xm-flutter .7s ease-in-out infinite alternate}

.xm-santa{position:absolute;left:0;top:calc(var(--xm-top) + 28px);width:190px;transform:translateX(-260px);animation:xm-fly 48s linear 3s infinite}
.xm-bob{animation:xm-bob 2.2s ease-in-out infinite alternate}
.xm-santa-arm{transform-box:fill-box;transform-origin:100% 100%;animation:xm-wave .6s ease-in-out infinite alternate}
.xm-spark{animation:xm-twinkle .9s ease-in-out infinite alternate}

.xm-bells{position:absolute;top:var(--xm-top);width:56px;transform-origin:50% 0;animation:xm-swing 2.4s ease-in-out infinite alternate}
.xm-bells-l{left:12px}
.xm-bells-r{right:12px;animation-delay:-1.2s}

.xm-tree{position:absolute;left:52px;bottom:var(--xm-ground);width:78px}
.xm-orn{animation:xm-twinkle 1.8s ease-in-out infinite alternate}
.xm-star{transform-box:fill-box;transform-origin:50% 50%;animation:xm-star 1.6s ease-in-out infinite alternate}

.xm-toggle{position:fixed;left:10px;bottom:12px;z-index:41;width:34px;height:34px;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.94);color:#2563eb;border:1px solid rgba(148,163,184,.45);box-shadow:0 2px 10px rgba(15,23,42,.18);cursor:pointer;padding:0}
.xm-toggle[aria-pressed="false"]{color:#94a3b8}
.xm-toggle:focus-visible{outline:2px solid #2563eb;outline-offset:2px}

@media (max-width:767px){
  .xm-root{--xm-ground:84px}
  .xm-walker{width:50px}
  .xm-santa{width:130px}
  .xm-bells{width:42px}
  .xm-tree{left:48px;width:56px}
  .xm-toggle{bottom:96px}
}
@media (prefers-reduced-motion:reduce){
  .xm-root *{animation:none!important}
}

@keyframes xm-walk{
  0%{transform:translateX(-90px)}
  11.5%,20.5%{transform:translateX(28vw)}
  50%{transform:translateX(calc(100vw + 20px))}
  65.6%,74.6%{transform:translateX(62vw)}
  100%{transform:translateX(-90px)}
}
@keyframes xm-face{0%,49.9%{transform:scaleX(1)}50%,100%{transform:scaleX(-1)}}
@keyframes xm-dance{
  0%,11.5%,20.5%,65.6%,74.6%,100%{transform:translateY(0) rotate(0deg) scaleX(1)}
  13%,67.1%{transform:translateY(-14px) rotate(-10deg) scaleX(1)}
  14.5%,68.6%{transform:translateY(0) rotate(0deg) scaleX(1)}
  16%,70.1%{transform:translateY(-14px) rotate(10deg) scaleX(1)}
  17.5%,71.6%{transform:translateY(0) rotate(0deg) scaleX(1)}
  19%,73.1%{transform:translateY(-10px) rotate(0deg) scaleX(-1)}
}
@keyframes xm-waddle{from{transform:rotate(-4deg) translateY(0)}to{transform:rotate(4deg) translateY(-1.5px)}}
@keyframes xm-arm-front{from{transform:rotate(0deg)}to{transform:rotate(-30deg)}}
@keyframes xm-arm-back{from{transform:rotate(0deg)}to{transform:rotate(18deg)}}
@keyframes xm-flutter{from{transform:rotate(-6deg)}to{transform:rotate(10deg)}}
@keyframes xm-fly{0%{transform:translateX(calc(100vw + 20px))}32%,100%{transform:translateX(-260px)}}
@keyframes xm-bob{from{transform:translateY(-8px) rotate(-2deg)}to{transform:translateY(8px) rotate(2deg)}}
@keyframes xm-wave{from{transform:rotate(-12deg)}to{transform:rotate(14deg)}}
@keyframes xm-swing{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
@keyframes xm-twinkle{from{opacity:1}to{opacity:.4}}
@keyframes xm-star{from{transform:scale(1)}to{transform:scale(1.15)}}
`;

function Snowfall({ amount }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas && canvas.getContext("2d");
    if (!ctx) return undefined;

    const base = SNOW_COUNTS[amount] || SNOW_COUNTS.medium;
    const flakes = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    const spawn = (f, anywhere) => {
      f.x = Math.random() * w;
      f.y = anywhere ? Math.random() * h : -8 - Math.random() * 40;
      f.r = 1.2 + Math.random() * 3;
      f.vy = 22 + f.r * 12 + Math.random() * 18; // bigger flakes are nearer, so faster
      f.phase = Math.random() * Math.PI * 2;
      f.sway = 8 + Math.random() * 22;
      f.crystal = Math.random() < 0.18;
      f.rot = Math.random() * Math.PI;
      f.spin = (Math.random() - 0.5) * 1.2;
      return f;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(base * (w < 640 ? 0.55 : 1));
      while (flakes.length < target) flakes.push(spawn({}, true));
      flakes.length = target;
    };

    const frame = (t) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy * dt;
        f.phase += dt * 0.9;
        f.rot += f.spin * dt;
        if (f.y - f.r * 2.5 > h) spawn(f, false);
        const x = f.x + Math.sin(f.phase) * f.sway;
        ctx.beginPath();
        if (f.crystal) {
          // Icy blue six-point crystal, so it still reads on white sections.
          const len = f.r * 2.2;
          for (let k = 0; k < 3; k++) {
            const a = f.rot + (k * Math.PI) / 3;
            const dx = Math.cos(a) * len;
            const dy = Math.sin(a) * len;
            ctx.moveTo(x - dx, f.y - dy);
            ctx.lineTo(x + dx, f.y + dy);
          }
          ctx.strokeStyle = "rgba(147,197,253,0.95)";
          ctx.lineWidth = 1.1;
          ctx.stroke();
        } else {
          // White flake with a faint outline: visible on dark and white sections.
          ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.fill();
          ctx.strokeStyle = "rgba(100,130,170,0.4)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [amount]);

  return <canvas ref={ref} className="xm-snow" />;
}

function Snowman() {
  return (
    <svg viewBox="0 0 64 84" width="100%">
      <ellipse cx="32" cy="82" rx="18" ry="2.5" fill="rgba(15,23,42,0.18)" />
      <g className="xm-arm-back">
        <path d="M21 42 L6 32 M11 35.5 L7 39.5 M11 35.5 L9 29.5" stroke="#6b4423" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      <circle cx="32" cy="64" r="17" fill="#fff" stroke="#c7d6e8" strokeWidth="1.5" />
      <circle cx="32" cy="41" r="12.5" fill="#fff" stroke="#c7d6e8" strokeWidth="1.5" />
      <circle cx="32" cy="21" r="10" fill="#fff" stroke="#c7d6e8" strokeWidth="1.5" />
      <path d="M19 70 Q24 79 34 80.5" stroke="#e3ecf6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="33" cy="38" r="1.6" fill="#1f2937" />
      <circle cx="33" cy="45" r="1.6" fill="#1f2937" />
      <circle cx="33" cy="58" r="1.8" fill="#1f2937" />
      <circle cx="33" cy="65" r="1.8" fill="#1f2937" />
      <circle cx="31" cy="19" r="1.3" fill="#1f2937" />
      <circle cx="37" cy="19" r="1.3" fill="#1f2937" />
      <path d="M36 22 L47 24 L36 25.2 Z" fill="#f97316" />
      <path d="M29 26.5 Q33 29 37.5 27" stroke="#1f2937" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="39" cy="25" r="1.6" fill="#fca5a5" opacity="0.75" />
      <g className="xm-scarf-tail">
        <path d="M24 31 L19.5 45 L24.5 44.5 L27.5 32 Z" fill="#b91c1c" />
        <path d="M20 42 h4.5" stroke="#fde68a" strokeWidth="1.2" />
      </g>
      <path d="M22 28.5 Q32 33.5 42 28.5 L42 32.5 Q32 37.5 22 32.5 Z" fill="#dc2626" />
      <path d="M27 30.8 v4 M32 31.8 v4 M37 30.8 v4" stroke="#fde68a" strokeWidth="1.2" />
      <path d="M22.5 15 Q23 4 32 4 Q41 4 41.5 15 Z" fill="#16a34a" />
      <path d="M26 13 Q27 7 31 6 M33 6 Q37 7 38 13" stroke="#15803d" strokeWidth="1.2" fill="none" />
      <rect x="21" y="13" width="22" height="4.5" rx="2.25" fill="#f8fafc" stroke="#c7d6e8" strokeWidth="0.8" />
      <circle cx="32" cy="3.5" r="3.2" fill="#f8fafc" stroke="#c7d6e8" strokeWidth="0.8" />
      <g className="xm-arm-front">
        <path d="M43 40 L58 30 M53 33.5 L57.5 37.5 M53 33.5 L52 27.5" stroke="#6b4423" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

function Reindeer({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M14 34 L6 40 M18 35 L11 42" stroke="#6b4423" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 34 L41 39 M35 33 L44 36" stroke="#6b4423" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="24" cy="30" rx="15" ry="7" fill="#8b5a2b" />
      <ellipse cx="24" cy="33" rx="10" ry="2.5" fill="#c4a07a" opacity="0.6" />
      <path d="M38 27 l5 -3 l-1.5 4.5 z" fill="#f5f5f4" />
      <path d="M12 27 L5 16 L11 14.5 L18 26 Z" fill="#8b5a2b" />
      <ellipse cx="5.5" cy="15" rx="5.5" ry="3.8" fill="#8b5a2b" />
      <circle cx="0.8" cy="15.4" r="1.4" fill="#3f2a17" />
      <circle cx="6" cy="13.6" r="0.8" fill="#111827" />
      <path d="M10 12 l4.5 -2 l-1 3.2 z" fill="#6b4423" />
      <path d="M7.5 11 L10 3 L7 1 M10 6 L13 3.5 M11 11.5 L15 4 L18.5 3 M14 7 L17.5 8" stroke="#5b3a1a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
}

function SantaSleigh() {
  return (
    <svg viewBox="0 0 222 80" width="100%">
      <path d="M38 46 Q50 50 60 44 M88 44 Q104 52 124 50" stroke="#b91c1c" strokeWidth="1.5" fill="none" />
      <Reindeer x={2} y={12} />
      <Reindeer x={54} y={8} />
      {/* gift sack and Santa sit behind the sleigh's front edge */}
      <path d="M178 40 Q176 21 187 19 Q198 21 197 40 Z" fill="#15803d" />
      <path d="M183.5 21.5 L187 18 L190.5 21.5" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
      <rect x="187" y="27" width="9" height="9" rx="1" fill="#fbbf24" />
      <path d="M191.5 27 V36 M187 31.5 H196" stroke="#dc2626" strokeWidth="1.5" />
      <path d="M150 40 Q150 22 164 22 Q178 22 178 40 Z" fill="#dc2626" />
      <rect x="150" y="33" width="28" height="3.5" fill="#111827" />
      <rect x="161.5" y="32.3" width="5" height="4.9" rx="0.8" fill="#fbbf24" />
      <circle cx="163" cy="17" r="6.5" fill="#fcd9b8" />
      <path d="M156.5 17.5 Q157 28.5 163 29.5 Q169 28.5 169.5 17.5 Q163 21.5 156.5 17.5 Z" fill="#fff" />
      <circle cx="160.5" cy="16.2" r="0.85" fill="#111827" />
      <circle cx="158.2" cy="18.6" r="1.3" fill="#f4a6a0" />
      <path d="M156 13.5 Q158 3.5 168 5.5 L176.5 12 L169 12.8 Q163 9.8 156 13.5 Z" fill="#dc2626" />
      <rect x="155.5" y="11.6" width="15" height="3.6" rx="1.8" fill="#fff" />
      <circle cx="177" cy="12.5" r="2.4" fill="#fff" />
      <g className="xm-santa-arm">
        <path d="M155 30 L146 20" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
        <circle cx="145" cy="19" r="2.7" fill="#fff" />
      </g>
      {/* sleigh */}
      <path d="M126 40 Q113 35 117 27 Q120 22.5 124.5 26.5" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M126 38 H200 Q206 38 205 46 L201 56 H134 Q124 56 122 47 Q121 40 126 38 Z" fill="#dc2626" />
      <path d="M127 42.5 H201" stroke="#fbbf24" strokeWidth="1.6" />
      <path d="M140 56 V64 M190 56 V64" stroke="#f59e0b" strokeWidth="2" />
      <path d="M116 64 H200 Q209 64 209 58 M116 64 Q109 64 110 58 Q111 54.5 115 56" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle className="xm-spark" cx="211" cy="44" r="1.6" fill="#fde047" />
      <circle className="xm-spark" cx="217" cy="52" r="1.2" fill="#fde047" style={{ animationDelay: "-0.3s" }} />
      <circle className="xm-spark" cx="214" cy="35" r="1" fill="#fde047" style={{ animationDelay: "-0.6s" }} />
    </svg>
  );
}

function Bell({ x, rotate, gradientId }) {
  return (
    <g transform={`translate(${x} 20) rotate(${rotate})`}>
      <path d="M0 0 C-9 0 -11 10 -12 19 C-13 25 -16 27 -16 29 L16 29 C16 27 13 25 12 19 C11 10 9 0 0 0 Z" fill={`url(#${gradientId})`} stroke="#b45309" strokeWidth="1" />
      <rect x="-17" y="27.5" width="34" height="4" rx="2" fill="#d97706" />
      <circle cx="0" cy="34.5" r="3.4" fill="#b45309" />
      <path d="M-6 5 Q-9 12 -9 21" stroke="#fff7d6" strokeWidth="2" strokeLinecap="round" opacity="0.7" fill="none" />
    </g>
  );
}

function Bells({ side }) {
  const gradientId = `xm-bell-gold-${side}`;
  return (
    <svg viewBox="0 0 64 76" width="100%">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M32 0 V16" stroke="#b91c1c" strokeWidth="1.6" />
      <Bell x={22} rotate={18} gradientId={gradientId} />
      <Bell x={42} rotate={-18} gradientId={gradientId} />
      <path d="M32 15 q-9 -6 -15 -1 q5 1 6 5 q4 -3 9 -4 z" fill="#15803d" />
      <path d="M32 15 q9 -6 15 -1 q-5 1 -6 5 q-4 -3 -9 -4 z" fill="#166534" />
      <path d="M32 16 C24 8 18 12 22 18 C25 21 30 18 32 16 Z" fill="#dc2626" />
      <path d="M32 16 C40 8 46 12 42 18 C39 21 34 18 32 16 Z" fill="#dc2626" />
      <circle cx="32" cy="16" r="2.6" fill="#b91c1c" />
      <circle cx="29.5" cy="11.5" r="1.7" fill="#ef4444" />
      <circle cx="34.5" cy="11.5" r="1.7" fill="#ef4444" />
    </svg>
  );
}

const ORNAMENTS = [
  [33, 34, "#ef4444"], [47, 41, "#3b82f6"], [40, 26, "#fbbf24"],
  [24, 57, "#a855f7"], [56, 62, "#ef4444"], [40, 64, "#fbbf24"],
  [18, 84, "#3b82f6"], [36, 88, "#ef4444"], [60, 86, "#f472b6"], [48, 76, "#fbbf24"],
];

function ChristmasTree() {
  return (
    <svg viewBox="0 0 80 110" width="100%">
      <ellipse cx="40" cy="107" rx="34" ry="3" fill="rgba(15,23,42,0.18)" />
      <rect x="35" y="92" width="10" height="13" fill="#7c4a1e" />
      <path d="M40 52 L3 96 H77 Z" fill="#166534" />
      <path d="M40 32 L8 74 H72 Z" fill="#15803d" />
      <path d="M40 14 L12 52 H68 Z" fill="#16a34a" />
      <path d="M12 52 Q26 48 40 52 Q54 48 68 52 M8 74 Q24 70 40 74 Q56 70 72 74 M3 96 Q21 92 40 96 Q59 92 77 96" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M22 41 Q40 50 58 39 M15 63 Q40 74 65 61 M10 85 Q40 98 70 83" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
      {ORNAMENTS.map(([cx, cy, fill], i) => (
        <circle key={i} className="xm-orn" cx={cx} cy={cy} r="2.7" fill={fill} style={{ animationDelay: `${(i % 5) * -0.35}s` }} />
      ))}
      <rect x="50" y="96" width="15" height="11" rx="1" fill="#dc2626" />
      <path d="M57.5 96 V107 M50 101 H65" stroke="#fbbf24" strokeWidth="2.2" />
      <rect x="13" y="98" width="13" height="9" rx="1" fill="#2563eb" />
      <path d="M19.5 98 V107" stroke="#f8fafc" strokeWidth="2" />
      <g className="xm-star" style={{ filter: "drop-shadow(0 0 4px rgba(253,224,71,0.9))" }}>
        <polygon points="40,4 42.06,9.17 47.61,9.53 43.33,13.08 44.7,18.47 40,15.5 35.3,18.47 36.67,13.08 32.39,9.53 37.94,9.17" fill="#fde047" stroke="#f59e0b" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

function SnowflakeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2" />
      {off ? <path d="M4 4l16 16" stroke="#ef4444" /> : null}
    </svg>
  );
}

export default function ChristmasEffects({ config }) {
  const { asPath } = useRouter();
  const rootRef = useRef(null);
  const [off, setOff] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    try {
      setOff(localStorage.getItem(OFF_KEY) === "1");
    } catch {
      /* storage blocked: effects stay on */
    }
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (!mq) return undefined;
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Bells and the sleigh hang just under the sticky header, wherever it is.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const header = document.querySelector("header");
      const bottom = header ? header.getBoundingClientRect().bottom : 0;
      root.style.setProperty("--xm-top", `${Math.round(Math.min(Math.max(bottom, 0), 200))}px`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    const late = setTimeout(measure, 1500);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      clearTimeout(late);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [off, asPath]);

  const toggle = () => {
    const next = !off;
    setOff(next);
    try {
      if (next) localStorage.setItem(OFF_KEY, "1");
      else localStorage.removeItem(OFF_KEY);
    } catch {
      /* ignore */
    }
  };

  const moving = !reduceMotion;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {!off && (
        <div ref={rootRef} className="xm-root" aria-hidden="true">
          {config.snow && moving && <Snowfall amount={config.snowAmount} />}
          {config.bells && (
            <>
              <div className="xm-bells xm-bells-l"><Bells side="l" /></div>
              <div className="xm-bells xm-bells-r"><Bells side="r" /></div>
            </>
          )}
          {config.santa && moving && (
            <div className="xm-santa"><div className="xm-bob"><SantaSleigh /></div></div>
          )}
          {config.tree && <div className="xm-tree"><ChristmasTree /></div>}
          {config.snowman && moving && (
            <div className="xm-walker">
              <div className="xm-face">
                <div className="xm-dance">
                  <div className="xm-waddle"><Snowman /></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        className="xm-toggle"
        onClick={toggle}
        aria-pressed={!off}
        aria-label={off ? "Turn on Christmas effects" : "Turn off Christmas effects"}
        title={off ? "Turn on Christmas effects" : "Turn off Christmas effects"}
      >
        <SnowflakeIcon off={off} />
      </button>
    </>
  );
}
