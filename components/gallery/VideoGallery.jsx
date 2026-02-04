import React from 'react';

const videos = [
  {
    title: "🏆 Premium Hair Patch in Kolkata | Custom Hair Patches Delivered Across India | Indian Hair World",
    src: "https://www.youtube.com/embed/NxjtJ97QT5A?feature=oembed",
  },
  {
    title: "Curly Hair Patch in Kolkata | 0 Down Payment EMI on Hair Patch | Indian Hair World",
    src: "https://www.youtube.com/embed/nBplYXKkinM?feature=oembed",
  },
  {
    title: "Is It Possible to Scuba Dive with a Hair Patch? | Hair Patch in Kolkata – Indian Hair World",
    src: "https://www.youtube.com/embed/4U0Ma0tPA4o?feature=oembed",
  },
];

const VideoGallery = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div key={index} className="relative aspect-video w-full rounded-md overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src={video.src}
              title={video.title}
              loading="lazy"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoGallery;
