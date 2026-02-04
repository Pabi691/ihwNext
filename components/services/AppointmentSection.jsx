import React from "react";

const AppointmentSection = () => {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-black">

        <p className="text-[17px] leading-relaxed">
          <span className="block text-[20px] font-extrabold mb-4">
            Book an Appointment Today!
          </span>

          Ready to elevate your hair game with our stunning multi-coloured hair strands? 
          Don’t miss out on this opportunity to stand out without damaging your hair. 
          Embrace the latest trend and book an appointment with our skilled stylists today!
          <br /><br />

          To book your appointment, call us at{" "}
          <span className="text-black font-semibold">
            <a href="tel:+917980221032" className="underline">7980221032</a> |{" "}
            <a href="tel:+918910097668" className="underline">8910097668</a>
          </span>. Our team is eagerly waiting to assist you in achieving the hair transformation you’ve always dreamed of.
          <br /><br />

          <span className="block text-[20px] font-extrabold mb-2">Conclusion:</span>
          <br />
          Indian Hair World invites you to experience a whole new level of hair styling with our multi-coloured hair strands. 
          Say goodbye to conventional hair colouring methods and say hello to a world of vibrant possibilities without compromising your hair’s health. 
          Book an appointment today and let our expert stylists help you make a statement that’s uniquely you!
        </p>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <a
            href="https://indianhairworld.com/book-appointment"
            className="inline-block bg-black text-white px-8 py-3 font-medium rounded hover:bg-gray-800 transition"
          >
            Book An Appointment
          </a>
        </div>

      </div>
    </section>
  );
};

export default AppointmentSection;
