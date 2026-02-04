import React from "react";

const ChooseSection = () => {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left Content */}
          <div className="pt-4">
            <h3 className="text-4xl font-semibold mb-6">
              Regain Confidence with Indian Hair World’s Hair Solutions
            </h3>

            <p className="text-base text-gray-700 leading-relaxed">
              Indian Hair World offers a comprehensive range of services designed
              to help individuals manage hair loss and regain their confidence.
              Our expert solutions include non-surgical hair replacement, hair
              weaving, and specialized hair patch options tailored for both men
              and women. In addition, we provide high-quality hair wigs,
              extensions, and bonding services to meet a variety of needs and
              preferences.
              <br /><br />
              Our Monofilament and Front Lace Hair Patch options are meticulously
              crafted to ensure natural-looking results and comfort. Available
              for both men and women, our models include EKO, Unique Gold, BMW,
              Silk-Based Patches, Mirage Monofilament Patches, Australian Patch,
              Mirage French Lace, Australian Mirage, and Monofilament Front Lace.
              To ensure the best fit and longevity, we use various attachment
              methods such as glue, taping, clipping, and hair bonding, offering
              some of the most competitive hair patch prices in Kolkata.
              <br /><br />
              Understanding the emotional and physical challenges faced by
              individuals undergoing chemotherapy, we extend our compassionate
              services to provide suitable hair replacement solutions during
              their treatment. At Indian Hair World, we are dedicated to
              restoring not just hair, but also the confidence and well-being of
              our clients.
            </p>
          </div>

          {/* Right Video */}
          <div className="w-full pt-5">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/IMeQnD_snCQ?playlist=IMeQnD_snCQ&loop=1&autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChooseSection;
