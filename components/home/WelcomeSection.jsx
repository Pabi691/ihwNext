import React from "react";

const WelcomeSection = () => {
  return (
    <section className="w-full bg-cover bg-center bg-[#0f1a2c] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src="/images/welcome-image.jpg"
              alt="Indian Hair World"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* Text Content */}
          <div className="text-white space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold italic tracking-wide
              [-webkit-text-stroke:1.2px_white]">
              WELCOME TO
            </h2>

            <h3 className="text-2xl md:text-4xl font-semibold italic
              [-webkit-text-stroke:1.2px_white]">
              INDIAN HAIR WORLD
            </h3>

            <p className="text-base md:text-lg leading-relaxed">
              Are you looking for the best{" "}
              <span className="text-[#04a9ff] font-semibold">
                hair patch and hair wig in Kolkata?
              </span>{" "}
              Look no further than Indian Hair World, where we offer top-quality
              non-surgical hair replacement services. Our experienced team uses
              only the finest Indian hair to create natural-looking hair patches
              and wigs that enhance your appearance.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Don’t settle for anything less than the best. Contact us today at{" "}
              <a
                href="tel:+917980221032"
                className="text-[#04a9ff] font-semibold hover:underline"
              >
                +91-7980221032
              </a>{" "}
              to learn more about our hair patch and hair wig options in Kolkata.
              Our friendly and knowledgeable staff will be happy to assist you
              with a personalized consultation.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
