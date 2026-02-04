import React from "react";

const HairServiceSection = () => {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-semibold mb-4">
              Our Service
            </h2>

            <p className="text-sm font-medium text-gray-700 leading-relaxed mb-6">
              At Indian Hair World, we offer a range of top-notch hair replacement
              services in Kolkata. Our non-surgical hair transplant solutions,
              including hair weaving and hair patch, are tailored to meet the
              individual needs of our clients. Our experienced consultants will
              guide you through the process, keeping in mind your specific
              baldness pattern, budget, and personal style to offer the best
              solution.
              <br /><br />
              Our hair weaving services in Kolkata are designed to provide a
              natural and seamless look. We use only high-quality hair and the
              latest technology to ensure that the final result meets your
              expectations. Our hair weaving cost in Kolkata is affordable,
              making it a cost-effective solution for hair loss.
              <br /><br />
              If you are looking for the best hair patch in Kolkata, you have
              come to the right place. Our hair patch price in Kolkata is
              unbeatable, and our hair patch center in Kolkata is equipped with
              the latest tools and techniques to ensure a perfect fit and a
              natural look. We are committed to providing the best hair
              replacement services in Kolkata.
            </p>

            <h4 className="text-lg font-semibold mb-3">
              OUR POPULAR SERVICES
            </h4>

            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Hair Replacement</li>
              <li>Hair Bonding</li>
              <li>Hair Patches</li>
              <li>Hair Wigs & Extensions</li>
            </ul>
          </div>

          {/* Right Video */}
          <div className="w-full">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/xIwAvikE6X8?playlist=xIwAvikE6X8&loop=1&autoplay=1&mute=1"
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

export default HairServiceSection;
