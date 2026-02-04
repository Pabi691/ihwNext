import React from "react";

const MultiColorHairSection = () => {
  return (
    <section className="w-full bg-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left: YouTube Video */}
          <div className="w-full">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/vitgcYHwHLM?playlist=vitgcYHwHLM&loop=1&autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="text-white">
            <h5 className="text-3xl md:text-4xl font-semibold mb-6">
              Why Choose Multi-Coloured Hair Strands?
            </h5>

            <div className="space-y-6 pl-4">
              <div>
                <span className="font-bold text-lg">1. Protect Your Natural Hair:</span>
                <p className="pl-4 text-sm text-gray-300 mt-1">
                  Traditional hair dyeing methods involve harsh chemicals that can damage your hair’s health, 
                  leading to dryness, breakage, and split ends. Our multi-coloured hair strands, on the other 
                  hand, offer a non-invasive way to add colour without compromising your hair’s integrity.
                </p>
              </div>

              <div>
                <span className="font-bold text-lg">2. Experiment with Confidence:</span>
                <p className="pl-4 text-sm text-gray-300 mt-1">
                  Not sure if a specific colour will suit you? With our multi-coloured strands, you can experiment 
                  worry-free. Try out different shades and find the one that complements your skin tone and style 
                  the best.
                </p>
              </div>

              <div>
                <span className="font-bold text-lg">3. Versatility at Its Best:</span>
                <p className="pl-4 text-sm text-gray-300 mt-1">
                  Our hair strands are versatile and can be easily applied, removed, and reused, allowing you to switch 
                  up your look whenever you desire. Whether it’s a special occasion, a festival, or just a regular day, 
                  our multi-coloured strands will make you shine.
                </p>
              </div>

              <div>
                <span className="font-bold text-lg">4. Temporary and Safe:</span>
                <p className="pl-4 text-sm text-gray-300 mt-1">
                  Unlike traditional hair colouring, our strands are temporary and do not alter your natural hair. 
                  They are completely safe and won’t cause any long-term damage.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default MultiColorHairSection;
