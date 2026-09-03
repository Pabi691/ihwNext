import React from 'react';

const NonSurgicalHairReplacement = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          <div className="w-full">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/Jts9aabnkn4?si=mPM30aKJOKRa-pZI"
                title="Non-Surgical Hair Replacement Services"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#04A9FF]">
              Our Services
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900 leading-tight">
              Non-Surgical Hair <br />
              <span className="text-[#04A9FF]">Replacement Services</span>
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Established in 2015, Indian Hair World started its journey with the
              aim of putting smiles on people's faces suffering from baldness. Our
              founder, <strong className="text-gray-900">Soham Chakraborty</strong>, himself suffered from
              baldness and wanted to help others with the same problem.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Looking for a <strong className="text-gray-900">hair patch in Kolkata</strong>? Indian Hair
              World offers top-quality non-surgical hair replacement services. Our
              experienced team uses only the finest Indian hair to create
              natural-looking hair patches and wigs. Learn more about our{' '}
              <strong className="text-gray-900">hair patch services in Kolkata</strong> in our video clips.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NonSurgicalHairReplacement;
