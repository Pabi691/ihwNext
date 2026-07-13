import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLoginGate from "@/components/try-on/AdminLoginGate";
import { TRY_ON_SESSION_KEY } from "@/components/try-on/adminSession";

function StepCard({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-full bg-[#04A9FF]/10 text-[#04A9FF] text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      </div>
      <div className="text-sm text-gray-600 space-y-3 pl-10">{children}</div>
    </div>
  );
}

function Callout({ tone, label, children }: { tone: "info" | "good" | "warn" | "critical"; label: string; children: React.ReactNode }) {
  const styles = {
    info:     "bg-[#04A9FF]/5 border-[#04A9FF]/20 text-[#04A9FF]",
    good:     "bg-green-50 border-green-200 text-green-700",
    warn:     "bg-amber-50 border-amber-200 text-amber-700",
    critical: "bg-red-50 border-red-200 text-red-600",
  } as const;
  return (
    <div className={`rounded-xl border px-4 py-3 flex gap-3 ${styles[tone]}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0 pt-0.5">{label}</span>
      <p className="text-xs text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <code className="text-[11px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700">{children}</code>;
}

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
      <Head><title>Try-On Studio Help — IHW Admin</title></Head>
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📘</span>
              <div>
                <h1 className="text-sm font-bold text-gray-900">Try-On Studio — Help &amp; Manual</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#04A9FF]">Admin Documentation</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/try-on-studio"
                className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors">
                ← Back to Studio
              </Link>
              <button onClick={handleSignOut}
                className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

          {/* Intro */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-1.5">What this tool does</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Try-On Studio lets staff upload a reference photo — a customer&rsquo;s, or your own for testing — and generate
              an AI preview of what a specific hair patch, wig, or topper will look like once worn. It&rsquo;s the same
              engine customers use on the product page, opened here in an admin workspace that skips the daily try-on
              limits, so you can test freely, demo in-store, or troubleshoot a preview that didn&rsquo;t look right.
            </p>
          </div>

          {/* Access */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Who can use it</h2>
            <p className="text-sm text-gray-600">
              This page isn&rsquo;t linked from the public site, and it checks your account role on every sign-in. Sign
              in with the same email and password you already use for the main admin dashboard — any account whose
              role is <em>not</em> <Field>customer</Field> or <Field>guest</Field> gets in.
            </p>
            <Callout tone="warn" label="Handle with care">
              This link and your login are effectively a backstage pass — don&rsquo;t share the URL or your password
              outside the team. Anyone signed in here bypasses the daily try-on limits customers are held to.
            </Callout>
          </div>

          {/* Steps */}
          <StepCard n={1} title="Sign in">
            <p>Open <Field>/try-on-studio</Field>. Enter your staff email and password — the same login as the admin dashboard — and select <b>Enter Studio</b>.</p>
            <Callout tone="critical" label="If it fails">
              &ldquo;Access denied&rdquo; means the account is a customer/guest — use a staff account. &ldquo;Invalid credentials&rdquo; means the email or password is wrong. &ldquo;Cannot connect to server&rdquo; means the backend is unreachable — check your connection or ask the tech team.
            </Callout>
          </StepCard>

          <StepCard n={2} title="Choose a product">
            <p>
              The picker only lists items the studio can actually try on — hair patches, wigs, toppers, frontals,
              closures, and similar hair systems. General accessories (tape, glue, tools, clips) are filtered out
              automatically so you don&rsquo;t waste a generation on the wrong item.
            </p>
            <p>Use the search box to jump to a product by name, then select its tile — the image, name, and tag load into the studio automatically.</p>
            <p className="text-xs text-gray-400">Not seeing a product you expect? It&rsquo;s most likely miscategorised — see &ldquo;Making a product eligible&rdquo; below.</p>
          </StepCard>

          <StepCard n={3} title="Add a photo">
            <p>This is the face the AI places the hairpiece on — the customer&rsquo;s photo, or your own for a quick test.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><b>Upload a file</b> — JPG, PNG, or WEBP, up to 8MB.</li>
              <li><b>Use the camera</b> — allow browser camera access, then capture.</li>
            </ul>
            <Callout tone="good" label="For the cleanest result">
              Use a plain background, even lighting, and a front-facing shot with the face fully visible. Side angles, harsh shadows, or busy backgrounds noticeably reduce preview quality.
            </Callout>
          </StepCard>

          <StepCard n={4} title="Choose the look">
            <ul className="list-disc pl-4 space-y-1">
              <li><b>Haircut style</b> — Straight/Wavy or Curly, then a specific cut.</li>
              <li><b>Hair colour</b> — pick a shade, or leave on <Field>Match Product</Field> to follow the product&rsquo;s actual colour.</li>
              <li><b>Advanced options</b> (optional) — hairline, density, and styling/parting.</li>
            </ul>
            <p className="text-xs text-gray-400">Tip: leave Advanced Options collapsed for a fast, natural default — only open it when a customer asks for something specific.</p>
          </StepCard>

          <StepCard n={5} title="Generate the preview">
            <p>Pick a mode, then generate. As an admin this never counts against the customer daily-limit counters.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wide">
                    <th className="text-left px-3 py-2 font-semibold">Mode</th>
                    <th className="text-left px-3 py-2 font-semibold">Produces</th>
                    <th className="text-left px-3 py-2 font-semibold">Typical time</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-t border-gray-100">
                    <td className="px-3 py-2 font-medium text-gray-800">Single View</td>
                    <td className="px-3 py-2">One front-facing preview</td>
                    <td className="px-3 py-2">~15–20 sec</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-3 py-2 font-medium text-gray-800">4-View</td>
                    <td className="px-3 py-2">Front, left, right &amp; back</td>
                    <td className="px-3 py-2">~30–60 sec</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Select <b>Generate AI Preview</b> and wait for the loader to resolve — don&rsquo;t navigate away mid-generation.</p>
          </StepCard>

          <StepCard n={6} title="Compare and save">
            <ul className="list-disc pl-4 space-y-1">
              <li>Drag the before/after slider to compare the original photo against the AI preview.</li>
              <li>Select <b>View Image</b> to open it full-size, or <b>Download</b> to save the file.</li>
              <li>Not quite right? Select <b>Regenerate</b>, or adjust the style/colour and generate again.</li>
            </ul>
            <Callout tone="warn" label="Privacy">
              Uploaded photos are used only to produce the preview and are not stored afterwards — save any result you need before closing the tab.
            </Callout>
          </StepCard>

          <StepCard n={7} title="Sign out">
            <p>Select <b>Sign Out</b> in the top-right corner when you&rsquo;re done, especially on a shared or in-store device. Your session lives only in that browser tab and clears automatically on sign out or tab close.</p>
          </StepCard>

          {/* Limits table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Admin vs. customer limits</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wide">
                    <th className="text-left px-3 py-2 font-semibold">Account</th>
                    <th className="text-left px-3 py-2 font-semibold">Single View</th>
                    <th className="text-left px-3 py-2 font-semibold">4-View</th>
                    <th className="text-left px-3 py-2 font-semibold">Resets</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-t border-gray-100">
                    <td className="px-3 py-2"><span className="text-[10px] font-semibold bg-[#04A9FF]/10 text-[#04A9FF] px-2 py-0.5 rounded-full">Admin (this page)</span></td>
                    <td className="px-3 py-2">Unlimited</td>
                    <td className="px-3 py-2">Unlimited</td>
                    <td className="px-3 py-2">—</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-3 py-2"><span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Customer / guest</span></td>
                    <td className="px-3 py-2">4 per day</td>
                    <td className="px-3 py-2">1 per day</td>
                    <td className="px-3 py-2">Every 24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Making a product eligible</h2>
            <p className="text-sm text-gray-600">
              A product only appears in the picker if its <b>category</b> marks it as an actual wearable hair
              system — not by its name alone. If a product you expect is missing, fix its category or tag from the
              main admin panel, in <b>Edit Product</b>.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Hair Patch", "Hair Wig", "Hair Topper", "Toupee", "Frontal / Closure", "Hair System / Replacement"].map((t) => (
                <span key={t} className="text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">{t}</span>
              ))}
              {["Accessories", "Bangs / Bun / Strands"].map((t) => (
                <span key={t} className="text-[10px] font-semibold bg-gray-100 text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">{t} — excluded</span>
              ))}
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-sm text-gray-600">
              <li>Open the product in the main admin panel under Products → Edit Product.</li>
              <li>Set the <b>category</b> to one of the eligible types above.</li>
              <li>Set the <b>Product Tag</b> field to a short, accurate label — start typing to see suggestions, or type your own.</li>
              <li>Save. The product appears in the picker next time it loads.</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-2">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Troubleshooting</h2>
            {[
              {
                q: "“Cannot connect to server. Is the backend running?”",
                a: "The studio couldn’t reach the backend API. Check your internet connection, then confirm with the tech team that the server is up before retrying.",
              },
              {
                q: "The product I need isn’t in the picker",
                a: "The picker only lists products categorised as a hair patch, wig, topper, toupee, frontal, closure, hair system, or hair replacement. Update the product’s category and tag from the main admin panel — see “Making a product eligible” above.",
              },
              {
                q: "Generation failed or timed out",
                a: "Select Try Again under the error message. If it repeats, try a different reference photo — a clearer, front-facing shot with a plain background usually resolves it.",
              },
              {
                q: "Camera access denied",
                a: "Your browser blocked camera permission. Check the site permissions in your browser’s address bar, allow camera access, then select Use Camera again — or upload a photo file instead.",
              },
              {
                q: "The wrong tag or category shows on a product",
                a: "The badge reflects the product’s actual Product Tag field, not a guess from its name. Update it from Edit Product in the main admin panel.",
              },
            ].map((item) => (
              <details key={item.q} className="border border-gray-100 rounded-xl px-4 py-2.5 group">
                <summary className="text-sm font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-gray-300 group-open:rotate-90 transition-transform">›</span>
                </summary>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <p className="text-center text-[11px] text-gray-400 pt-2 pb-4">Indian Hair World — internal staff documentation</p>
        </div>
      </div>
    </>
  );
}
