import React from 'react';

const TimesBrandIcons2024 = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      
      {/* Heading */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className="w-10 h-[1px] bg-black"></span>
        <h2 className="text-3xl font-semibold text-center">
          Times Brand Icons 2024
        </h2>
        <span className="w-10 h-[1px] bg-black"></span>
      </div>

      {/* Image Gallery */}
      <div className="w-full">
        <div
          className="block overflow-hidden rounded-md"
        >
          <img
            src="/images/timesiconimage-min-1-scaled.jpg"
            alt="Times Brand Icons 2024 Award"
            loading="lazy"
            className="w-full h-auto transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

    </section>
  );
};

export default TimesBrandIcons2024;
