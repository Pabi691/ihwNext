import React from "react";

const AboveFooterSection = () => {
  return (
    <section className="w-full bg-black py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">

          <h3 className="text-sm uppercase tracking-wide text-white mb-2">
            Toppers & Streaks
          </h3>

          <h4 className="text-2xl md:text-3xl font-semibold text-white leading-snug mb-6">
            Vibrant Multi-Coloured <br />
            Hair Strands at Indian Hair World – Stand Out <br />
            Without Damaging Your Hair
          </h4>

          <a
            href="https://indianhairworld.com/book-appointment"
            className="inline-block bg-white text-black px-6 py-3 text-sm font-medium rounded hover:bg-gray-200 transition"
          >
            Book An Appointment
          </a>

        </div>
      </div>
    </section>
  );
};

export default AboveFooterSection;
