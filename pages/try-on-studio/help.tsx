import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLoginGate from "@/components/try-on/AdminLoginGate";
import { TRY_ON_SESSION_KEY } from "@/components/try-on/adminSession";

const HELP_CSS = `
  .tos-help, .tos-help * { box-sizing: border-box; }
  .tos-help {
    --bg: #F7F9FC;
    --surface: #FFFFFF;
    --surface-2: #EFF3FA;
    --border: #E1E7F0;
    --ink: #0F1729;
    --ink-muted: #57607A;
    --ink-faint: #8A93A8;
    --accent: #04A9FF;
    --accent-deep: #0070CC;
    --accent-soft: rgba(4,169,255,0.10);
    --good: #157F3C;
    --good-soft: rgba(21,127,60,0.10);
    --warn: #B45F06;
    --warn-soft: rgba(180,95,6,0.12);
    --critical: #C42B1C;
    --critical-soft: rgba(196,43,28,0.10);
    --shadow: 0 1px 2px rgba(15,23,41,0.04), 0 8px 24px rgba(15,23,41,0.06);
    --font-display: "Bahnschrift", "Segoe UI Semibold", "Segoe UI", ui-sans-serif, sans-serif;
    --font-body: "Segoe UI", "Calibri", ui-sans-serif, sans-serif;
    --font-mono: "Cascadia Code", "Consolas", ui-monospace, monospace;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 15.5px;
    line-height: 1.62;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  @media (prefers-color-scheme: dark) {
    .tos-help {
      --bg: #0B1220; --surface: #111A2C; --surface-2: #182234; --border: #263349;
      --ink: #EAF0FB; --ink-muted: #A6B1C7; --ink-faint: #6E7891;
      --accent: #3FBBFF; --accent-deep: #86D6FF; --accent-soft: rgba(63,187,255,0.14);
      --good: #4ADE80; --good-soft: rgba(74,222,128,0.14);
      --warn: #FBBF24; --warn-soft: rgba(251,191,36,0.14);
      --critical: #F87171; --critical-soft: rgba(248,113,113,0.14);
      --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 12px 28px rgba(0,0,0,0.35);
    }
  }
  .tos-help[data-theme="dark"] {
    --bg: #0B1220; --surface: #111A2C; --surface-2: #182234; --border: #263349;
    --ink: #EAF0FB; --ink-muted: #A6B1C7; --ink-faint: #6E7891;
    --accent: #3FBBFF; --accent-deep: #86D6FF; --accent-soft: rgba(63,187,255,0.14);
    --good: #4ADE80; --good-soft: rgba(74,222,128,0.14);
    --warn: #FBBF24; --warn-soft: rgba(251,191,36,0.14);
    --critical: #F87171; --critical-soft: rgba(248,113,113,0.14);
    --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 12px 28px rgba(0,0,0,0.35);
  }
  .tos-help[data-theme="light"] {
    --bg: #F7F9FC; --surface: #FFFFFF; --surface-2: #EFF3FA; --border: #E1E7F0;
    --ink: #0F1729; --ink-muted: #57607A; --ink-faint: #8A93A8;
    --accent: #04A9FF; --accent-deep: #0070CC; --accent-soft: rgba(4,169,255,0.10);
    --good: #157F3C; --good-soft: rgba(21,127,60,0.10);
    --warn: #B45F06; --warn-soft: rgba(180,95,6,0.12);
    --critical: #C42B1C; --critical-soft: rgba(196,43,28,0.10);
    --shadow: 0 1px 2px rgba(15,23,41,0.04), 0 8px 24px rgba(15,23,41,0.06);
  }

  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

  .tos-help h1, .tos-help h2, .tos-help h3, .tos-help h4 { font-family: var(--font-display); font-weight: 700; color: var(--ink); text-wrap: balance; margin: 0; }
  .tos-help p { margin: 0; }
  .tos-help a { color: var(--accent-deep); }
  @media (prefers-color-scheme: dark) { .tos-help a { color: var(--accent); } }
  .tos-help[data-theme="dark"] a { color: var(--accent); }

  .tos-help a:focus-visible, .tos-help button:focus-visible, .tos-help summary:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .tos-help code, .tos-help kbd, .tos-help .field { font-family: var(--font-mono); font-size: 0.86em; }
  .tos-help kbd, .tos-help .field {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0.1em 0.5em;
    color: var(--ink);
  }

  /* Masthead */
  .tos-help .masthead { background: linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%); color: #fff; padding: 28px 24px 40px; }
  .tos-help .masthead-inner { max-width: 1080px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
  .tos-help .masthead-nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .tos-help .masthead-actions { display: flex; gap: 8px; }
  .tos-help .masthead-actions a, .tos-help .masthead-actions button {
    font-size: 12px; font-weight: 600; color: #fff;
    background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px; padding: 6px 12px; text-decoration: none; cursor: pointer;
    transition: background 0.15s ease;
  }
  .tos-help .masthead-actions a:hover, .tos-help .masthead-actions button:hover { background: rgba(255,255,255,0.24); }
  .tos-help .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.85); width: fit-content;
    background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.28);
    border-radius: 100px; padding: 5px 12px 5px 10px;
  }
  .tos-help .eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; }
  .tos-help .masthead h1 { font-size: clamp(26px, 4vw, 38px); line-height: 1.12; }
  .tos-help .masthead .sub { font-size: 16px; color: rgba(255,255,255,0.92); max-width: 60ch; }
  .tos-help .masthead-meta { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 6px; font-size: 12.5px; color: rgba(255,255,255,0.85); }
  .tos-help .masthead-meta span { display: inline-flex; align-items: center; gap: 6px; }
  .tos-help .masthead-meta strong { color: #fff; font-weight: 600; }
  .tos-help .url-chip {
    font-family: var(--font-mono); background: rgba(0,0,0,0.18); border: 1px solid rgba(255,255,255,0.22);
    border-radius: 7px; padding: 6px 10px; color: #fff; display: inline-block; width: fit-content;
  }

  /* Shell */
  .tos-help .shell {
    max-width: 1080px; margin: 0 auto; padding: 40px 24px 100px;
    display: grid; grid-template-columns: 216px minmax(0,1fr); gap: 44px; align-items: start;
  }
  @media (max-width: 860px) { .tos-help .shell { grid-template-columns: 1fr; } }

  .tos-help .toc { position: sticky; top: 24px; display: flex; flex-direction: column; gap: 2px; }
  .tos-help .toc-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 10px; }
  .tos-help .toc a { text-decoration: none; color: var(--ink-muted); font-size: 13.5px; padding: 7px 10px; border-radius: 7px; border-left: 2px solid transparent; }
  .tos-help .toc a:hover { color: var(--ink); background: var(--surface-2); }
  .tos-help .toc .toc-sep { height: 1px; background: var(--border); margin: 10px 4px; }
  @media (max-width: 860px) {
    .tos-help .toc { position: static; flex-direction: row; flex-wrap: wrap; gap: 6px; padding-bottom: 8px; border-bottom: 1px solid var(--border); margin-bottom: 8px; }
    .tos-help .toc-label { display: none; }
    .tos-help .toc .toc-sep { display: none; }
    .tos-help .toc a { background: var(--surface-2); font-size: 12.5px; padding: 6px 10px; }
  }

  .tos-help main { min-width: 0; display: flex; flex-direction: column; gap: 56px; }

  .tos-help .quickfacts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: -66px; position: relative; z-index: 2; }
  @media (max-width: 860px) { .tos-help .quickfacts { grid-template-columns: repeat(2, 1fr); margin-top: 16px; } }
  .tos-help .qf { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; box-shadow: var(--shadow); }
  .tos-help .qf .k { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); }
  .tos-help .qf .v { font-family: var(--font-display); font-size: 16px; margin-top: 4px; color: var(--ink); }

  .tos-help section { scroll-margin-top: 20px; display: flex; flex-direction: column; gap: 16px; }
  .tos-help .step-head { display: flex; align-items: baseline; gap: 12px; }
  .tos-help .step-no { font-family: var(--font-mono); font-size: 13px; color: var(--accent-deep); background: var(--accent-soft); border-radius: 7px; padding: 3px 9px; flex-shrink: 0; }
  .tos-help h2 { font-size: 21px; }
  .tos-help h3 { font-size: 15.5px; margin-top: 2px; }
  .tos-help .lede { color: var(--ink-muted); font-size: 15px; max-width: 68ch; }

  .tos-help .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 22px; box-shadow: var(--shadow); }

  .tos-help ol.steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; counter-reset: s; }
  .tos-help ol.steps > li { counter-increment: s; position: relative; padding-left: 34px; font-size: 14.5px; color: var(--ink); }
  .tos-help ol.steps > li::before {
    content: counter(s); position: absolute; left: 0; top: -1px; width: 22px; height: 22px; border-radius: 50%;
    background: var(--accent-soft); color: var(--accent-deep); font-family: var(--font-mono); font-size: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .tos-help ol.steps > li b { font-weight: 600; }
  .tos-help ol.steps > li .note { display: block; color: var(--ink-muted); font-size: 13px; margin-top: 3px; }

  .tos-help ul.plain { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .tos-help ul.plain > li { padding-left: 18px; position: relative; font-size: 14.5px; }
  .tos-help ul.plain > li::before { content: ""; position: absolute; left: 0; top: 9px; width: 6px; height: 6px; border-radius: 1px; background: var(--accent); transform: rotate(45deg); }

  .tos-help .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 700px) { .tos-help .grid2 { grid-template-columns: 1fr; } }

  .tos-help .callout { border-radius: 12px; padding: 14px 16px; font-size: 13.5px; display: flex; gap: 10px; border: 1px solid var(--border); }
  .tos-help .callout .tag { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; flex-shrink: 0; padding-top: 1px; }
  .tos-help .callout.info { background: var(--accent-soft); border-color: var(--accent); }
  .tos-help .callout.info .tag { color: var(--accent-deep); }
  .tos-help .callout.good { background: var(--good-soft); border-color: var(--good); }
  .tos-help .callout.good .tag { color: var(--good); }
  .tos-help .callout.warn { background: var(--warn-soft); border-color: var(--warn); }
  .tos-help .callout.warn .tag { color: var(--warn); }
  .tos-help .callout.critical { background: var(--critical-soft); border-color: var(--critical); }
  .tos-help .callout.critical .tag { color: var(--critical); }
  .tos-help .callout p { color: var(--ink); }

  .tos-help .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; }
  .tos-help table { border-collapse: collapse; width: 100%; font-size: 13.5px; min-width: 480px; }
  .tos-help thead th {
    text-align: left; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink-faint); background: var(--surface-2); padding: 10px 14px; border-bottom: 1px solid var(--border);
  }
  .tos-help tbody td { padding: 11px 14px; border-bottom: 1px solid var(--border); color: var(--ink); vertical-align: top; }
  .tos-help tbody tr:last-child td { border-bottom: none; }
  .tos-help tbody td.muted { color: var(--ink-muted); }
  .tos-help .pill { display: inline-block; font-size: 11.5px; font-weight: 600; padding: 2px 9px; border-radius: 100px; }
  .tos-help .pill.blue { background: var(--accent-soft); color: var(--accent-deep); }
  .tos-help .pill.grey { background: var(--surface-2); color: var(--ink-muted); }

  .tos-help .mock-label { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 8px; }
  .tos-help .mock-frame { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface-2); }
  .tos-help .mock-body { padding: 16px; }

  .tos-help .mock-login { background: #0b1220; padding: 28px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .tos-help .mock-login .badge { height: 26px; width: auto; object-fit: contain; }
  .tos-help .mock-login h4 { color: #fff; font-size: 14px; }
  .tos-help .mock-login .field-mock { width: 100%; max-width: 220px; height: 30px; border-radius: 8px; background: #1b2740; border: 1px solid #2c3a58; }
  .tos-help .mock-login .btn-mock { width: 100%; max-width: 220px; height: 32px; border-radius: 8px; background: linear-gradient(90deg,#04A9FF,#0070cc); margin-top: 4px; }

  .tos-help .mock-topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface); }
  .tos-help .mock-topbar .left { display: flex; align-items: center; gap: 8px; }
  .tos-help .mock-topbar .icon { height: 18px; width: auto; object-fit: contain; }
  .tos-help .mock-topbar .title { font-family: var(--font-display); font-size: 12.5px; font-weight: 700; }
  .tos-help .mock-topbar .badge2 { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent-deep); }
  .tos-help .mock-topbar .signout { font-size: 10.5px; color: var(--critical); border: 1px solid var(--critical); border-radius: 7px; padding: 4px 8px; }

  .tos-help .mock-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  @media (max-width: 560px) { .tos-help .mock-grid { grid-template-columns: repeat(2,1fr); } }
  .tos-help .mock-tile { background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 6px; }
  .tos-help .mock-tile .thumb { aspect-ratio: 1; border-radius: 6px; background: var(--surface-2); margin-bottom: 6px; }
  .tos-help .mock-tile .label { font-size: 9.5px; color: var(--ink-muted); line-height: 1.3; }
  .tos-help .mock-tile.excluded { opacity: 0.45; }
  .tos-help .mock-tile.excluded .thumb { background: repeating-linear-gradient(135deg, var(--surface-2), var(--surface-2) 5px, var(--border) 5px, var(--border) 6px); }

  .tos-help .swatchrow { display: flex; gap: 8px; flex-wrap: wrap; }
  .tos-help .swatch { display: flex; align-items: center; gap: 6px; font-size: 10.5px; border: 1px solid var(--border); border-radius: 100px; padding: 4px 9px 4px 5px; background: var(--surface); }
  .tos-help .swatch .dot2 { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.15); flex-shrink: 0; }

  .tos-help details { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 0; overflow: hidden; }
  .tos-help details + details { margin-top: 10px; }
  .tos-help summary { cursor: pointer; list-style: none; padding: 14px 16px; font-weight: 600; font-size: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .tos-help summary::-webkit-details-marker { display: none; }
  .tos-help summary .chev { color: var(--ink-faint); transition: transform 0.15s ease; flex-shrink: 0; }
  .tos-help details[open] summary .chev { transform: rotate(90deg); }
  .tos-help .details-body { padding: 0 16px 16px; font-size: 13.5px; color: var(--ink-muted); border-top: 1px solid var(--border); padding-top: 12px; }
  .tos-help .details-body p + p { margin-top: 8px; }

  .tos-help footer { max-width: 1080px; margin: 0 auto; padding: 28px 24px 60px; border-top: 1px solid var(--border); font-size: 12.5px; color: var(--ink-faint); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
`;

const ELIGIBLE_TAGS = ["Hair Patch", "Hair Wig", "Hair Topper", "Toupee", "Frontal / Closure", "Hair System / Replacement"];
const EXCLUDED_TAGS = ["Accessories — excluded", "Bangs / Bun / Strands — excluded"];

const TROUBLESHOOTING = [
  {
    q: `"Cannot connect to server. Is the backend running?"`,
    a: "The studio couldn't reach the backend API. Check your internet connection first, then confirm with the tech team that the server is up before retrying.",
  },
  {
    q: "The product I need isn't in the picker",
    a: (
      <>
        The picker only lists products categorised as a hair patch, wig, topper, toupee, frontal, closure, hair
        system or hair replacement. Accessories and general items are hidden on purpose.
        <br />
        Fix: update the product&rsquo;s category and tag from the main admin panel — see &ldquo;Making a product
        eligible&rdquo; above.
      </>
    ),
  },
  {
    q: "Generation failed or timed out",
    a: "Select Try Again under the error message. If it repeats, try a different reference photo — a clearer, front-facing shot with plain background usually resolves it.",
  },
  {
    q: "Camera access denied",
    a: "Your browser blocked camera permission. Check the site permissions in your browser's address bar and allow camera access, then select Use Camera again — or upload a photo file instead.",
  },
  {
    q: "The wrong tag or category shows on a product",
    a: "The badge reflects the product's actual Product Tag field, not a guess from the product name. Update it from Edit Product in the main admin panel — see “Making a product eligible” above.",
  },
];

export default function TryOnHelp() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setIsAuthed(!!sessionStorage.getItem(TRY_ON_SESSION_KEY));
    setChecking(false);
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem(TRY_ON_SESSION_KEY);
    setIsAuthed(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#04A9FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <>
        <Head><title>Try-On Studio Help — IHW Admin</title></Head>
        <AdminLoginGate onSuccess={() => setIsAuthed(true)} />
      </>
    );
  }

  return (
    <>
      <Head><title>Virtual Try-On Studio — Admin Manual</title></Head>
      <style>{HELP_CSS}</style>

      <div className="tos-help">
        <div className="masthead">
          <div className="masthead-inner">
            <div className="masthead-nav">
              <span className="eyebrow"><span className="dot" />Internal Documentation</span>
              <div className="masthead-actions">
                <Link href="/try-on-studio">← Back to Studio</Link>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
            <h1>Virtual Try-On Studio</h1>
            <p className="sub">Operating manual for Indian Hair World staff — how to preview any hair patch or wig on a customer&rsquo;s photo using the AI studio, from sign-in to saving the final image.</p>
            <div className="url-chip">indianhairworld.com/try-on-studio</div>
            <div className="masthead-meta">
              <span>Audience: <strong>Admin &amp; staff accounts only</strong></span>
              <span>Last updated: <strong>13 July 2026</strong></span>
              <span>Reading time: <strong>~6 min</strong></span>
            </div>
          </div>
        </div>

        <div className="shell">
          <nav className="toc" aria-label="Table of contents">
            <span className="toc-label">On this page</span>
            <a href="#overview">Overview</a>
            <a href="#access">Who can use it</a>
            <div className="toc-sep" />
            <a href="#step-1">1. Sign in</a>
            <a href="#step-2">2. Choose a product</a>
            <a href="#step-3">3. Add a photo</a>
            <a href="#step-4">4. Choose the look</a>
            <a href="#step-5">5. Generate the preview</a>
            <a href="#step-6">6. Compare &amp; save</a>
            <a href="#step-7">7. Sign out</a>
            <div className="toc-sep" />
            <a href="#limits">Admin vs. customer limits</a>
            <a href="#eligibility">Making a product eligible</a>
            <a href="#troubleshooting">Troubleshooting</a>
          </nav>

          <main>
            <div className="quickfacts">
              <div className="qf"><div className="k">Location</div><div className="v">/try-on-studio</div></div>
              <div className="qf"><div className="k">Access</div><div className="v">Staff login required</div></div>
              <div className="qf"><div className="k">Generation time</div><div className="v">15–60 sec</div></div>
              <div className="qf"><div className="k">Usage cap</div><div className="v">None for admins</div></div>
            </div>

            <section id="overview">
              <h2>What this tool does</h2>
              <p className="lede">Try-On Studio lets staff upload a reference photo — a customer&rsquo;s, or your own for testing — and generate an AI preview of what a specific hair patch, wig, or topper will look like once worn. It&rsquo;s the same engine customers use on the product page, opened in a dedicated admin workspace that skips the daily try-on limits so you can test freely, demo for customers in-store, or troubleshoot why a preview didn&rsquo;t look right.</p>
              <div className="callout info">
                <span className="tag">Use it for</span>
                <p>In-store demos, verifying new products render correctly before launch, and generating preview images for marketing — without eating into the customer-facing free-try quota.</p>
              </div>
            </section>

            <section id="access">
              <h2>Who can use it</h2>
              <p className="lede">The page is not linked from the public site — it&rsquo;s reached only by URL, and it re-checks your account role on every sign-in.</p>
              <div className="grid2">
                <div className="card">
                  <h3>Allowed</h3>
                  <ul className="plain">
                    <li>Any account whose backend role is <b>not</b> <span className="field">customer</span> or <span className="field">guest</span> — i.e. staff/admin accounts.</li>
                    <li>Sign in with the same email and password you already use for the main admin dashboard.</li>
                  </ul>
                </div>
                <div className="card">
                  <h3>Blocked</h3>
                  <ul className="plain">
                    <li>Customer and guest accounts — they&rsquo;ll see &ldquo;Access denied. Admin accounts only.&rdquo;</li>
                    <li>Anyone without a valid staff login credential.</li>
                  </ul>
                </div>
              </div>
              <div className="callout warn">
                <span className="tag">Handle with care</span>
                <p>This link and your login are effectively a backstage pass — don&rsquo;t share the URL or your password outside the team. Anyone signed in here bypasses the daily try-on limits customers are held to.</p>
              </div>
            </section>

            <section id="step-1">
              <div className="step-head"><span className="step-no">01</span><h2>Sign in</h2></div>
              <p className="lede">Open the URL above. If your browser doesn&rsquo;t already have a saved session, you&rsquo;ll land on the sign-in screen.</p>
              <div className="grid2">
                <ol className="steps">
                  <li><b>Enter your work email</b> — the same one used for the admin dashboard.<span className="note">Not a separate account: it&rsquo;s your existing staff login.</span></li>
                  <li><b>Enter your password</b> and use the eye icon to double-check it before submitting.</li>
                  <li><b>Select &ldquo;Enter Studio.&rdquo;</b> You&rsquo;ll be dropped straight into the product picker on success.</li>
                </ol>
                <div>
                  <div className="mock-label">Sign-in screen</div>
                  <div className="mock-frame">
                    <div className="mock-login">
                      <img className="badge" src="/logo-white.png" alt="" />
                      <h4>Try-On Studio</h4>
                      <div className="field-mock" />
                      <div className="field-mock" />
                      <div className="btn-mock" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="callout critical">
                <span className="tag">If it fails</span>
                <p>&ldquo;Access denied. Admin accounts only&rdquo; means the account is registered as a customer/guest — sign in with a staff account instead. &ldquo;Invalid credentials&rdquo; means the email or password is wrong. See <a href="#troubleshooting">Troubleshooting</a> for connection errors.</p>
              </div>
            </section>

            <section id="step-2">
              <div className="step-head"><span className="step-no">02</span><h2>Choose a product</h2></div>
              <p className="lede">The picker only lists products the studio can actually try on — hair patches, wigs, toppers, frontals, closures and similar hair systems. General accessories (tape, glue, tools, clips) are filtered out automatically so you won&rsquo;t waste a generation on the wrong item.</p>
              <div className="mock-label">Product picker</div>
              <div className="mock-frame">
                <div className="mock-body">
                  <div className="mock-grid">
                    <div className="mock-tile"><div className="thumb" /><div className="label">Men&rsquo;s Hair Patch — Natural</div></div>
                    <div className="mock-tile"><div className="thumb" /><div className="label">Women&rsquo;s Full Wig — Wavy</div></div>
                    <div className="mock-tile"><div className="thumb" /><div className="label">Hair Topper — Silk Base</div></div>
                    <div className="mock-tile excluded"><div className="thumb" /><div className="label">Hair Patch Tape — 25m Roll<br /><span className="pill grey">not shown</span></div></div>
                  </div>
                </div>
              </div>
              <ol className="steps">
                <li><b>Use the search box</b> to jump to a product by name if the grid is long.</li>
                <li><b>Select the product tile.</b> Its image, name and tag load automatically into the studio below.</li>
                <li><b>Not seeing a product you expect?</b> It&rsquo;s most likely miscategorised — see <a href="#eligibility">Making a product eligible</a>.</li>
              </ol>
            </section>

            <section id="step-3">
              <div className="step-head"><span className="step-no">03</span><h2>Add a photo</h2></div>
              <p className="lede">This is the face the AI will place the hairpiece on — the customer&rsquo;s photo, or your own for a quick test.</p>
              <div className="grid2">
                <div className="card">
                  <h3>Upload a file</h3>
                  <p style={{ color: "var(--ink-muted)", fontSize: "13.5px" }}>JPG, PNG or WEBP, up to 8 MB. Pick <span className="field">Upload Photo</span> and choose the image.</p>
                </div>
                <div className="card">
                  <h3>Use the camera</h3>
                  <p style={{ color: "var(--ink-muted)", fontSize: "13.5px" }}>Pick <span className="field">Use Camera</span>, allow browser camera access, then <span className="field">Capture Photo</span>.</p>
                </div>
              </div>
              <div className="callout good">
                <span className="tag">For the cleanest result</span>
                <p>Use a plain background, even lighting, and a front-facing shot with the face fully visible. Side angles, harsh shadows, or busy backgrounds noticeably reduce preview quality.</p>
              </div>
            </section>

            <section id="step-4">
              <div className="step-head"><span className="step-no">04</span><h2>Choose the look</h2></div>
              <p className="lede">Set how the hair should appear once the piece is on — every option here feeds directly into the AI&rsquo;s instructions.</p>
              <ul className="plain">
                <li><b>Haircut style</b> — pick Straight/Wavy or Curly, then a specific cut (Crew Cut, Mid Fade, Pompadour, and others).</li>
                <li><b>Hair colour</b> — choose a shade, or leave it on <span className="field">Match Product</span> to follow the actual product colour.</li>
                <li><b>Advanced options</b> (optional) — expand this panel to fine-tune <b>hairline</b> (natural / sharp / M-shape), <b>density</b> (light / medium / full), and <b>styling/parting</b>.</li>
              </ul>
              <div className="callout info">
                <span className="tag">Tip</span>
                <p>Leave Advanced Options collapsed for a fast, natural-looking default — only open it when a customer asks for a specific hairline or parting.</p>
              </div>
            </section>

            <section id="step-5">
              <div className="step-head"><span className="step-no">05</span><h2>Generate the preview</h2></div>
              <p className="lede">Pick a preview mode, then generate. As an admin, this never counts against the customer daily-limit counters.</p>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Mode</th><th>Produces</th><th>Typical time</th></tr></thead>
                  <tbody>
                    <tr><td><b>Single View</b></td><td className="muted">One front-facing preview</td><td>~15–20 sec</td></tr>
                    <tr><td><b>4-View</b></td><td className="muted">Front, left, right and back, generated together</td><td>~30–60 sec</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="lede">Select <span className="field">Generate AI Preview</span> and wait for the shimmer loader to resolve — do not navigate away mid-generation.</p>
            </section>

            <section id="step-6">
              <div className="step-head"><span className="step-no">06</span><h2>Compare and save</h2></div>
              <ul className="plain">
                <li><b>Drag the before/after slider</b> across the result to compare the original photo against the AI preview.</li>
                <li><b>Select &ldquo;View Image&rdquo;</b> to open it full-size, or <b>&ldquo;Download&rdquo;</b> to save the file locally.</li>
                <li><b>Not quite right?</b> Select <b>&ldquo;Regenerate&rdquo;</b> to re-run with the same photo and settings, or adjust the style/colour first and generate again.</li>
              </ul>
              <div className="callout warn">
                <span className="tag">Privacy</span>
                <p>Uploaded photos are used only to produce the preview and are not stored afterwards — there&rsquo;s no gallery of past customer photos to review later, so save any result you need before closing the tab.</p>
              </div>
            </section>

            <section id="step-7">
              <div className="step-head"><span className="step-no">07</span><h2>Sign out</h2></div>
              <div className="mock-label">Studio header</div>
              <div className="mock-frame">
                <div className="mock-topbar">
                  <div className="left">
                    <img className="icon" src="/logo.png" alt="" />
                    <div>
                      <div className="title">Virtual Try-On Studio</div>
                      <div className="badge2">Admin — No Limits</div>
                    </div>
                  </div>
                  <div className="signout">Sign Out</div>
                </div>
              </div>
              <p className="lede">Select <b>Sign Out</b> in the top-right corner when you&rsquo;re done, especially on a shared or in-store device. Your session lives only in that browser tab and clears automatically once you sign out or close the tab.</p>
            </section>

            <section id="limits">
              <h2>Admin vs. customer limits</h2>
              <p className="lede">The same studio powers the product page for customers, with one difference: your account has no cap.</p>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Account</th><th>Single View</th><th>4-View</th><th>Resets</th></tr></thead>
                  <tbody>
                    <tr><td><span className="pill blue">Admin (this page)</span></td><td>Unlimited</td><td>Unlimited</td><td>—</td></tr>
                    <tr><td><span className="pill grey">Customer / guest</span></td><td>4 per day</td><td>1 per day</td><td>Every 24 hours</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="eligibility">
              <h2>Making a product eligible</h2>
              <p className="lede">A product only appears in the Try-On Studio picker if its <b>category</b> marks it as an actual wearable hair system — not by its name alone. If a product you expect is missing, fix its category or tag from the main admin panel, in <b>Edit Product</b>.</p>
              <div className="swatchrow">
                {ELIGIBLE_TAGS.map((t) => (
                  <span key={t} className="swatch"><span className="dot2" style={{ background: "var(--good)" }} />{t}</span>
                ))}
                {EXCLUDED_TAGS.map((t) => (
                  <span key={t} className="swatch"><span className="dot2" style={{ background: "var(--ink-faint)" }} />{t}</span>
                ))}
              </div>
              <ol className="steps">
                <li><b>Open the product</b> in the main admin panel under Products, then Edit Product.</li>
                <li><b>Set the category</b> to one of the eligible types above — this is what the picker checks first.</li>
                <li><b>Set the Product Tag field</b> to a short, accurate label (e.g. &ldquo;Hair Patch&rdquo;). Start typing to see suggestions, or type your own — this is the label shown on the product badge inside the studio.</li>
                <li><b>Save.</b> The product will appear in the picker the next time it loads.</li>
              </ol>
            </section>

            <section id="troubleshooting">
              <h2>Troubleshooting</h2>
              {TROUBLESHOOTING.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}<span className="chev">›</span></summary>
                  <div className="details-body"><p>{item.a}</p></div>
                </details>
              ))}
            </section>
          </main>
        </div>

        <footer>
          <span>Virtual Try-On Studio — internal staff documentation</span>
          <span>Indian Hair World</span>
        </footer>
      </div>
    </>
  );
}
