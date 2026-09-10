import React from "react";

const WelcomeSection = () => {
  return (
    <section className="w-full bg-[var(--site-dark)] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          <div className="flex justify-center">
            <img
              src="/images/welcome-image.jpg"
              alt="Indian Hair World"
              className="rounded-xl shadow-xl w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          <div className="text-white space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--site-heading-dark)]">
              About Us
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-tight">
              Welcome to <br />
              <span className="text-[var(--site-heading-dark)]">Indian Hair World</span>
            </h2>
            <p className="text-base text-white/80 leading-relaxed">
              Are you looking for the best{" "}
              <span className="text-[var(--site-heading-dark)] font-semibold">
                hair patch and hair wig in Kolkata?
              </span>{" "}
              Look no further than Indian Hair World, where we offer top-quality
              non-surgical hair replacement services. Our experienced team uses
              only the finest Indian hair to create natural-looking hair patches
              and wigs that enhance your appearance.
            </p>
            <p className="text-base text-white/80 leading-relaxed">
              Don't settle for anything less than the best. Contact us today at{" "}
              <a
                href="tel:+917980221032"
                className="text-[var(--site-heading-dark)] font-semibold hover:underline"
              >
                +91-7980221032
              </a>{" "}
              to learn more about our hair patch and wig options. Our friendly
              staff will be happy to assist you with a personalised consultation.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
