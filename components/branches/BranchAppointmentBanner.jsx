import { branchData } from "../../content/branchData";
import { strokedHeading } from "../../styles/typography";

const BranchAppointmentBanner = () => {
  return (
    <section className="w-full relative mt-10">

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden min-[1300px]:block relative w-full h-[300px]">
        <h4 className={`${strokedHeading} z-10 relative text-right`}>Book an <span>appointment</span></h4>
        {/* Background Banner */}
        <div
          className="absolute inset-0 bg-no-repeat bg-top bg-contain"
          style={{
            backgroundImage:
              "url(/images/banner.jpeg)",
          }}
        />

        {/* Cards Overlay */}
        <div className="absolute left-[31%] top-20 flex z-10">
          {Object.values(branchData).map((branch, index) => (
            <div
              key={index}
              className="bg-white min-w-[250px] min-h-[160px] mr-[-30px]"
              style={{
                clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
              }}
            >
              <img
                src={branch.image}
                alt={branch.name}
                className="w-full h-[80px] object-cover"
              />

              <div className="bg-[#04A9FF] h-[30px] flex items-center px-10 text-white font-bold">
                📞 {branch.name}
              </div>

              <a
                href={`tel:${branch.phones[0].replace(/\s+/g, "")}`}
                className="block text-black font-bold text-lg px-10 py-2"
              >
                {branch.phones[0]}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MOBILE / TABLET VIEW ================= */}
      <div className="block min-[1300px]:hidden max-w-7xl mx-auto px-4 mt-[-40px]">
        <h3 className="text-center text-2xl font-bold mb-6">
          Book An <span className="stroke-text">Appointment</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Object.values(branchData).map((branch, index) => (
            <div
              key={index}
              className="bg-white shadow-lg hover:-translate-y-1 transition rounded-md overflow-hidden"
            >
              <img
                src={branch.image}
                alt={branch.name}
                className="w-full h-[160px] object-cover"
              />

              <div className="bg-[#04A9FF] text-white font-bold px-3 py-2">
                {branch.name}
              </div>

              <a
                href={`tel:${branch.phones[0].replace(/\s+/g, "")}`}
                className="block px-3 py-3 font-semibold text-lg text-black hover:text-[#04A9FF]"
              >
                {branch.phones[0]}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchAppointmentBanner;
