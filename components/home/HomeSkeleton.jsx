import React from "react";

const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DarkPulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-800 rounded ${className}`} />
);

/* ─── Slider (Men's / Women's products) ─────────────────────────── */
export function SliderSkeleton({ title }) {
  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {title && <Pulse className="h-6 w-48 mx-auto mb-5" />}
        <div className="flex gap-3 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36 sm:w-44 space-y-2">
              <Pulse className="w-full h-[260px] sm:h-[300px] rounded-xl" />
              <Pulse className="h-3 w-3/4 mx-auto" />
              <Pulse className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── OurCollections featured (dark bg, 2 large cards) ──────────── */
export function CollectionSkeleton() {
  return (
    <section className="w-full bg-gray-950 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <DarkPulse className="h-5 w-28 mx-auto mb-3" />
        <DarkPulse className="h-9 w-64 mx-auto mb-10" />
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {[...Array(2)].map((_, i) => (
            <DarkPulse key={i} className="rounded-2xl aspect-[3/5] md:aspect-[2/3] w-full" />
          ))}
        </div>
        <DarkPulse className="h-11 w-52 mx-auto mt-8 rounded-full" />
      </div>
    </section>
  );
}

/* ─── WelcomeSection (dark bg, text + image) ─────────────────────── */
export function WelcomeSkeleton() {
  return (
    <section className="bg-[var(--site-dark)] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <DarkPulse className="h-8 w-3/4" />
          <DarkPulse className="h-4 w-full" />
          <DarkPulse className="h-4 w-5/6" />
          <DarkPulse className="h-4 w-4/6" />
          <DarkPulse className="h-10 w-36 rounded-full mt-2" />
        </div>
        <DarkPulse className="w-full h-64 md:h-80 rounded-2xl" />
      </div>
    </section>
  );
}

/* ─── ServiceSlider ──────────────────────────────────────────────── */
export function ServiceSkeleton() {
  return (
    <section className="py-10 md:py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <Pulse className="h-7 w-56 mx-auto mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-60 space-y-3">
              <Pulse className="w-full h-48 rounded-2xl" />
              <Pulse className="h-4 w-3/4 mx-auto" />
              <Pulse className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── NonSurgicalHairReplacement (text + video) ──────────────────── */
export function NonSurgicalSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <Pulse className="h-8 w-3/4" />
          <Pulse className="h-4 w-full" />
          <Pulse className="h-4 w-5/6" />
          <Pulse className="h-4 w-4/6" />
          <Pulse className="h-10 w-36 rounded-full mt-2" />
        </div>
        <Pulse className="w-full aspect-video rounded-2xl" />
      </div>
    </section>
  );
}

/* ─── AchievementsSlider ─────────────────────────────────────────── */
export function AchievementsSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <Pulse className="h-7 w-56 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 p-6 space-y-3">
              <Pulse className="h-12 w-12 rounded-full" />
              <Pulse className="h-6 w-24" />
              <Pulse className="h-4 w-full" />
              <Pulse className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BlogSection ────────────────────────────────────────────────── */
export function BlogSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-[var(--site-light)]">
      <div className="max-w-7xl mx-auto px-4">
        <Pulse className="h-7 w-40 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Pulse className="w-full h-48 rounded-xl" />
              <Pulse className="h-4 w-3/4" />
              <Pulse className="h-3 w-1/2" />
              <Pulse className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WhoWeAre (team grid) ───────────────────────────────────────── */
export function WhoWeAreSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <Pulse className="h-7 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Pulse className="w-full h-[300px] md:h-[360px] rounded-xl" />
              <Pulse className="h-4 w-3/4 mx-auto" />
              <Pulse className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── OurWorks image grid ────────────────────────────────────────── */
export function OurWorksSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Pulse className="h-7 w-40 mx-auto mb-8" />
        <div className="hidden md:grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Pulse key={i} className="w-full h-[380px] rounded-xl" />
          ))}
        </div>
        <div className="md:hidden grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <Pulse key={i} className="w-full h-[240px] rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ShopOnlineBanner ───────────────────────────────────────────── */
export function ShopOnlineSkeleton() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <Pulse className="h-8 w-3/4" />
          <Pulse className="h-4 w-full" />
          <Pulse className="h-4 w-2/3" />
          <Pulse className="h-10 w-36 rounded-full" />
        </div>
        <Pulse className="w-[260px] h-[220px] rounded-2xl flex-shrink-0" />
      </div>
    </section>
  );
}

/* ─── BranchAppointmentBanner ────────────────────────────────────── */
export function BranchBannerSkeleton() {
  return (
    <section className="h-[300px] bg-gray-100 animate-pulse" />
  );
}
