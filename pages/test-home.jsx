import React, { useState, useEffect } from "react";
import Head from "next/head";

// Layout
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import TopBar from "@/components/home/TopBar";

// ── New UI components ──────────────────────────────────
import NHero             from "@/components/newui/NHero";
import NTrustBar         from "@/components/newui/NTrustBar";
import NTrendingVideos   from "@/components/newui/NTrendingVideos";
import NBookAppointment  from "@/components/newui/NBookAppointment";
import NShopBanner       from "@/components/newui/NShopBanner";
import NWomensCollections from "@/components/newui/NWomensCollections";
import NCategories       from "@/components/newui/NCategories";
import NProductSlider    from "@/components/newui/NProductSlider";
import NAbout            from "@/components/newui/NAbout";
import NServices         from "@/components/newui/NServices";
import NNonSurgical      from "@/components/newui/NNonSurgical";
import NAchievements     from "@/components/newui/NAchievements";
import NTransformations  from "@/components/newui/NTransformations";
import NBlogs            from "@/components/newui/NBlogs";
import NTeam             from "@/components/newui/NTeam";

// ── Password gate ──────────────────────────────────────
const PREVIEW_PASSWORD = process.env.NEXT_PUBLIC_PREVIEW_PASSWORD || "ihw@preview2026";
const STORAGE_KEY      = "ihw_preview_unlocked";

function PasswordGate({ onUnlock }) {
  const [value, setValue]     = useState("");
  const [error, setError]     = useState("");
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
          <h1 className="text-white text-2xl font-bold text-center mb-2">New Homepage Preview</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Enter the preview password to see the redesigned homepage.</p>

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

function PreviewBadge({ onLock }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-gray-900/90 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      Preview Mode — New UI
      <button onClick={onLock} className="ml-1 text-gray-400 hover:text-red-400 transition-colors" title="Lock">✕</button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────
export default function TestHome() {
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
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>New Homepage Preview — Indian Hair World</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Same header as live site */}
      <TopBar />

      <MainLayOut>
        <DesktopNav />

        {/* ── Hero ── */}
        <NHero />

        {/* ── Trust Bar ── */}
        <NTrustBar />

        {/* ── Shark Tank ── */}
        <div className="w-full py-6 bg-white flex justify-center">
          <div className="w-full max-w-7xl px-4 md:px-8">
            <img src="/images/sharkDesk.jpeg" alt="Featured on Shark Tank India Season 4"
              className="hidden md:block w-full h-auto object-contain rounded-2xl shadow-sm" />
            <img src="/images/sharkMobile.png" alt="Featured on Shark Tank India"
              className="block md:hidden w-full h-auto object-contain rounded-2xl" />
          </div>
        </div>

        {/* ── Trending Videos ── */}
        <NTrendingVideos />

        {/* ── Book Appointment (branches) ── */}
        <NBookAppointment />

        {/* ── Shop Online Banner ── */}
        <NShopBanner />

        {/* ── Women's Collections ── */}
        <NWomensCollections />

        {/* ── Shop Our Collection (categories grid) ── */}
        <NCategories />

        {/* ── Men's Products ── */}
        <NProductSlider
          slugName="get_slug_data/men-products"
          title="Men's Hair Products"
          subtitle="For Him"
          accentWord="Hair Products"
        />

        {/* ── Women's Products ── */}
        <NProductSlider
          slugName="get_slug_data/women-products"
          title="Women's Hair Products"
          subtitle="For Her"
          accentWord="Hair Products"
        />

        {/* ── About / Welcome ── */}
        <NAbout />

        {/* ── Services ── */}
        <NServices />

        {/* ── Non-Surgical + YouTube ── */}
        <NNonSurgical />

        {/* ── Achievements ── */}
        <NAchievements />

        {/* ── Transformations ── */}
        <NTransformations />

        {/* ── Blogs ── */}
        <NBlogs />

        {/* ── Team ── */}
        <NTeam />
      </MainLayOut>

      <PreviewBadge onLock={() => {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        setUnlocked(false);
      }} />
    </>
  );
}
