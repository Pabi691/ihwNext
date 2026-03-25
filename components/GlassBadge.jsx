const GlassBadge = ({ icon, text, img }) => {
    return (
        <div
            className="
        group flex items-center gap-2 whitespace-nowrap
        px-4 py-2 rounded-full flex-shrink-0

        bg-white
        border border-gray-200

        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        transition-all duration-300

        hover:-translate-y-[2px]
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)]
        hover:border-gray-300
      "
        >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition" />
            {/* Icon / Image */}
            {img ? (
                <img src={img} alt="" className="h-5 object-contain rounded-full" />
            ) : (
                <span className="flex items-center justify-center">
                    {icon}
                </span>
            )}

            {/* Text */}
            <span className="text-md font-semibold text-gray-800">
                {text}
            </span>
        </div>
    );
};

export default GlassBadge;