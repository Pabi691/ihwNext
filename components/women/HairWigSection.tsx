// components/HairWigSection.tsx
import React from "react";

interface HairWigSectionProps {
  subtitle: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  videoUrl: string;
  videoThumbnail: string;
}

const HairWigSection: React.FC<HairWigSectionProps> = ({
  subtitle,
  title,
  description,
  ctaText,
  ctaLink,
  videoUrl,
  videoThumbnail,
}) => {
  return (
    <section className="relative py-16 px-4 md:px-8 lg:px-16 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Text Content */}
          <div className="w-full lg:w-1/2 lg:pr-8">
            <h3 className="text-1xl uppercase tracking-wider text-gray-600 mb-3 font-montserrat">
              {subtitle}
            </h3>
            <h2 className="text-3xl md:text-5xl font-light text-gray-800 mb-6 font-montserrat">
              {title}
            </h2>
            <p className="text-gray-600 mb-8 text-lg font-montserrat">
              {description}
            </p>
            <a
              href={ctaLink}
              className="inline-block px-8 py-4 bg-black text-white hover:bg-[#9F8B72] transition-colors duration-300 uppercase tracking-wider text-sm font-montserrat"
            >
              {ctaText}
            </a>
          </div>

          {/* Video Thumbnail */}
          <div className="w-full lg:w-1/2 relative">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group"
            >
              <img
                src={videoThumbnail}
                alt="Video Thumbnail"
                className="w-full h-[320px] object-cover rounded-lg shadow-lg"
              />

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300">
                <div className="bg-black/80 backdrop-blur-md p-5 rounded-full shadow-xl hover:bg-white transition-all duration-300">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Background Decorations */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-[#F4F1ED] rounded-full -z-10"></div>
            <div className="absolute -left-8 -top-8 w-48 h-48 bg-[#F4F1ED] rounded-full -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HairWigSection;
