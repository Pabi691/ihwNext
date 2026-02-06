import StoreCard from "./StoreCard"

export default function OurStoresSection() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-100 py-4 sm:py-8 md:py-16">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="w-full flex justify-center items-center">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-4xl font-bold text-gray-900">
              OUR <span className="outline-text font-semibold">STORES</span>
            </h3>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-8xl mx-auto mb-12">

          <StoreCard
            name="Durgapur Store"
            image="/images/durgapur-office.jpg"
            time="11AM - 7PM"
            address="2nd Floor, Above Punjab National Bank, City Center, Durgapur, WB - 713216"
            phone="+919875517402"
          />

          <StoreCard
            name="Kolkata Salt Lake Store"
            image="/images/salt-lake-office.jpg"
            time="11AM - 7PM"
            address="EC-20, Ground Floor Back Side, Opp. CC1, Sector - 1, Salt Lake City, Kolkata - 700064"
            phone="+918961194044"
          />

          <StoreCard
            name="Kolkata Lake Garden Store"
            image="/images/lakegardenimage.jpg"
            time="11AM - 7PM"
            address="1A, Sultan Alam Rd, Lake Gardens, Kolkata, West Bengal 700033"
            phone="+918910097668"
          />

          <StoreCard
            name="Siliguri Store"
            image="/images/siliguri.png"
            time="11AM - 7PM"
            address="Sevoke Road, Siliguri City Plaza, 2nd Floor, Shop No. 3, Jalpaiguri, WB - 734001"
            phone="+917439436698"
          />

        </div>
      </div>
    </section>
  )
}
