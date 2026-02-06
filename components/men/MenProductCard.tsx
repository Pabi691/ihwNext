import Image from "next/image"
import Link from "next/link"

interface MenProductCardProps {
  title: string
  subtitle: string
  price: string
  oldPrice: string
  discount: string
  badge?: string
  image: string
  hoverImage?: string
  href: string
  imageFit?: "contain" | "cover"
}

export default function MenProductCard({
  title,
  subtitle,
  price,
  oldPrice,
  discount,
  badge,
  image,
  hoverImage,
  href,
  imageFit = "contain",
}: MenProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white transition duration-300 hover:shadow-xl cursor-pointer">
      <Link href={href}>
        <div className="relative w-full h-[160px] sm:h-[200px] md:h-[280px] 2xl:h-[470px] overflow-hidden flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            fill
            className={`object-${imageFit} transition-opacity duration-300 ${
              hoverImage ? "group-hover:opacity-0" : ""
            }`}
          />

          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${title} hover`}
              fill
              className={`object-${imageFit} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />
          )}

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300" />
        </div>

        <div className="p-1 sm:p-2 md:p-3 flex flex-col items-start 2xl:items-center">
          <h3 className="text-[14px] sm:text-lg 2xl:text-2xl font-semibold text-gray-800 font-montserrat 2xl:text-center">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{subtitle}</p>

          <div className="mt-1 flex flex-wrap items-start gap-1 sm:gap-2 2xl:items-center">
            <span className="text-xs sm:text-sm text-gray-900">{price}</span>
            <span className="text-[11px] sm:text-sm text-gray-500 line-through">
              {oldPrice}
            </span>

            <span className="text-[#04a9ff] text-[11px] sm:text-sm sm:hidden block">
              ({discount})
            </span>

            {badge && (
              <p className="text-[#04a9ff] text-[11px] sm:text-sm sm:hidden block">
                {badge}
              </p>
            )}
          </div>

          <div className="hidden sm:block">
            <span className="text-[#04a9ff] text-[11px] sm:text-sm">
              ({discount})
            </span>
            {badge && (
              <p className="text-[#04a9ff] text-[11px] sm:text-sm">
                {badge}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
