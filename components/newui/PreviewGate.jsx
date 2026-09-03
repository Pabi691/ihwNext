import React, { useState, useEffect } from "react";
import Head from "next/head";

// Shared password gate for the internal theme-preview routes.
// Extracted verbatim from the old pages/test-home.jsx.

const PREVIEW_PASSWORD = process.env.NEXT_PUBLIC_PREVIEW_PASSWORD || "ihw@preview2026";
const STORAGE_KEY = "ihw_preview_unlocked";

function PasswordForm({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === PREVIEW_PASSWORD) {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
      onUnlock();
    } else {
      setError("Incorrect password. Please try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setValue("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${shaking ? "animate-[shake_0.4s_ease]" : ""}`}>
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="IHW" className="h-14 mx-auto mb-4 object-contain"
            onError={e => { e.currentTarget.style.display = "none"; }} />
          <p className="text-gray-400 text-xs tracking-widest uppercase">Preview Access</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-white text-2xl font-bold text-center mb-2">Theme Preview</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Enter the preview password to see this theme.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={value}
                onChange={e => { setValue(e.target.value); setError(""); }}
                placeholder="Enter password"
                autoFocus
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#04A9FF] focus:ring-2 focus:ring-[#04A9FF]/20 text-sm"
              />
            </div>
            {error && <p className="text-red-400 text-sm">⚠ {error}</p>}
            <button type="submit"
              className="w-full bg-gradient-to-r from-[#04A9FF] to-[#0070cc] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
              Enter Preview
            </button>
          </form>
        </div>
        <p className="text-gray-600 text-xs text-center mt-6">Indian Hair World · Internal Preview · Not for public access</p>
      </div>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
}

function PreviewBadge({ label, onLock }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-gray-900/90 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      {label || "Preview Mode"}
      <button onClick={onLock} className="ml-1 text-gray-400 hover:text-red-400 transition-colors" title="Lock">✕</button>
    </div>
  );
}

/**
 * Wrap any preview subtree: renders the password gate until unlocked, then
 * the children plus a floating "Preview Mode" badge. `noindex` always.
 */
export default function PreviewGate({ children, badgeLabel }) {
  const [unlocked, setUnlocked] = useState(null);

  useEffect(() => {
    try { setUnlocked(localStorage.getItem(STORAGE_KEY) === "1"); }
    catch { setUnlocked(false); }
  }, []);

  if (unlocked === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#04A9FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <>
        <Head>
          <title>Preview — Indian Hair World</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <PasswordForm onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  return (
    <>
      {children}
      <PreviewBadge
        label={badgeLabel}
        onLock={() => {
          try { localStorage.removeItem(STORAGE_KEY); } catch {}
          setUnlocked(false);
        }}
      />
    </>
  );
}
