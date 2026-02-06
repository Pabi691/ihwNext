import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  title: string
  price: string
  oldPrice?: string
  discount?: string
  image: string
  hoverImage?: string
  href: string
}

export default function ProductCard({
  title,
  price,
  oldPrice,
  discount,
  image,
  hoverImage,
  href,
}: ProductCardProps) {
  return (
    <Link href={href} className="group rounded-xl bg-white transition hover:shadow-xl">
      <div className="relative h-[180px] sm:h-[280px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-contain transition-opacity duration-300 ${
            hoverImage ? "group-hover:opacity-0" : ""
          }`}
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${title} hover`}
            fill
            className="object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2 text-sm mt-1">
          <span>{price}</span>
          {oldPrice && <span className="line-through text-gray-400">{oldPrice}</span>}
          {discount && <span className="text-primary">{discount}</span>}
        </div>
      </div>
    </Link>
  )
}
