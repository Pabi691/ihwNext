import React from 'react';
import { strokedHeading } from '../../styles/typography';

const NonSurgicalHairReplacement = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Video Section */}
        <div className="w-full">
          <div className="relative w-full aspect-video">
            <iframe
              loading="lazy"
              className="absolute inset-0 w-full h-full rounded-md"
              src="https://www.youtube.com/embed/Jts9aabnkn4?si=mPM30aKJOKRa-pZI"
              title="Non-Surgical Hair Replacement Services"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Content Section */}
        <div>
          <h2 className={strokedHeading}
          >
            NON-SURGICAL HAIR{' '}
            <span>REPLACEMENT SERVICES</span>
          </h2>

          <p className="text-[17px] mb-3 text-gray-700">
            Established in 2015, Indian Hair World started its journey with the
            aim of putting smiles on people’s faces suffering from baldness. Our
            founder, <strong>Soham Chakraborty</strong>, himself suffered from
            baldness and wanted to help others with the same problem.
          </p>

          <p className="text-[17px] text-gray-700">
            Looking for a <strong>hair patch in Kolkata</strong>? Indian Hair
            World offers top-quality non-surgical hair replacement services. Our
            experienced team uses only the finest Indian hair to create
            natural-looking hair patches and wigs that enhance your appearance.
            Learn more about our{' '}
            <strong>hair patch services in Kolkata</strong> in our video clips.
          </p>
        </div>

      </div>
    </section>
  );
};

export default NonSurgicalHairReplacement;
