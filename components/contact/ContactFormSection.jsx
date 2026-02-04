// components/contact/ContactFormSection.jsx
import React from "react";
import ContactForm from "./ContactForm";

export default function ContactFormSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left: Contact Form */}
          <div className="bg-white p-8 shadow-sm">
            {/* Heading */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-[2px] w-6 bg-[#04A9FF]" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Contact Form
                </h1>
                <span className="h-[2px] w-6 bg-[#04A9FF]" />
              </div>

              <p className="text-sm text-gray-600">
                Drop us an e-mail using the form below.
              </p>
            </div>

            {/* Replace this with your actual form */}
            <ContactForm />
          </div>

          {/* Right: Text Content */}
          <div className="text-gray-700 text-sm space-y-4 leading-relaxed">
            <p className="text-justify">
              Thank you for your interest in Indian Hair World. Our team is always ready to assist you with any questions or concerns you may have regarding our hair replacement services.
            </p>

            <p className="text-justify">
              To contact us, you can fill out the form on our website or reach us directly through our phone number or email. Our team of experts, led by our founder and consultant, Soham Chakraborty, will be happy to assist you with any queries you may have.
            </p>

            <p className="text-justify">
              We take pride in our commitment to providing the best customer service possible. Our team is dedicated to ensuring that our clients are satisfied with our services. Whether you’re looking for information about our hair patch, hair weaving, or natural human hair wigs, we are here to help.
            </p>

            <p className="text-justify">
              At Indian Hair World, we understand that hair loss can be a difficult and emotional experience. That’s why we provide a personalized approach to hair replacement solutions. Our team will work with you to assess your needs, budget, and preferences to provide you with the perfect solution that restores your confidence and gives you a natural look.
            </p>

            <p className="text-justify">
              Don’t hesitate to reach out to us. We are excited to hear from you and help you achieve the best version of yourself with our hair replacement services.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
