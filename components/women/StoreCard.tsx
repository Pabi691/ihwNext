import Image from "next/image"

interface StoreCardProps {
  name: string
  image: string
  time: string
  address: string
  phone: string
}

export default function StoreCard({
  name,
  image,
  time,
  address,
  phone,
}: StoreCardProps) {
  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-xl border shadow-md overflow-hidden transition hover:shadow-lg">
      {/* Image */}
      <div className="relative w-full h-[200px]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-5 space-y-4 text-left">
        <h3 className="text-xl sm:text-2xl font-bold">{name}</h3>

        <p className="flex items-center text-sm text-gray-700">
          <span className="w-3 h-3 rounded-full bg-[#04a9ff] mr-2" />
          Opening time –{" "}
          <span className="ml-1 font-semibold text-gray-900">{time}</span>
        </p>

        <p className="text-sm text-gray-600 leading-relaxed">
          <i className="fas fa-map-marker-alt text-[#04a9ff] mr-2" />
          {address}
        </p>

        <a
          href={`tel:${phone}`}
          className="flex items-center text-sm text-black"
        >
          <i className="fas fa-phone-alt text-[#04a9ff] mr-2" />
          {phone}
        </a>

        <a
          href={`tel:${phone}`}
          className="block text-center mt-4 px-4 py-2 text-sm font-medium text-black bg-white border border-[#04a9ff] rounded-full hover:bg-[#04a9ff] hover:text-white transition"
        >
          SCHEDULE BOOKING
        </a>
      </div>
    </div>
  )
}
