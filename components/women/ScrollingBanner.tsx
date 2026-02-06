export default function ScrollingBanner() {
  const texts = [
    { text: "INDIAN HAIR WORLD – WHERE YOUR HAIR TRANSFORMATION BEGINS.", style: "outline" },
    { text: "100% PREMIUM INDIAN HUMAN HAIR EXTENSIONS", style: "bold" },
    { text: "EXPERIENCE LUXURY WITH EVERY STRAND", style: "outline" },
    { text: "ADD INSTANT VOLUME, LENGTH & GLAMOUR", style: "bold" },
    { text: "EFFORTLESS BEAUTY, EVERY SINGLE DAY", style: "outline" },
    { text: "TRUSTED BY THOUSANDS ACROSS INDIA", style: "bold" },
    { text: "DISCOVER YOUR BEST HAIR TODAY", style: "outline" },
    { text: "REAL INDIAN HAIR. REAL CONFIDENCE.", style: "bold" },
  ]

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="relative flex whitespace-nowrap">

        {/* Track */}
        <div className="flex animate-marquee gap-10 py-3">
          {[...texts, ...texts].map((item, index) => (
            <span
              key={index}
              className={`text-lg sm:text-xl md:text-2xl font-montserrat ${
                item.style === "bold"
                  ? "font-bold text-black"
                  : "font-semibold text-transparent stroke-text"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}
