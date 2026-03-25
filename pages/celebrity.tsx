import React, { useState } from "react";
import MainLayOut from "@/layout/MainLayOut";
// import Head from "next/head";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { DesktopNav } from "@/components/Navigation";

const CelebrityPage = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const openModal = (id: string) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    return (
        <MainLayOut>
            <DesktopNav />
            {/* <Head>
                <title>Celebrity | Indian Hair World</title>
            </Head> */}

            <main>
                {/* ================= Banner Section ================= */}
                <Swiper
                    modules={[Autoplay]}
                    loop
                    autoplay={{ delay: 3000 }}
                    spaceBetween={30}
                >
                    {[
                        {
                            img: "/images/cele_1.jpg",
                            title:
                                "Indian Hair World wins International Excellence Award from Kiara Advani for hair replacement.",
                            text:
                                "We are honored to announce that Indian Hair World has been awarded the prestigious International Excellence Award for Best Hair Replacement Center of the East Zone. This esteemed accolade was presented by Kiara Advani, recognizing our commitment to excellence in non-surgical hair restoration.",
                        },
                        {
                            img: "/images/c-6.jpg",
                            title:
                                "Indian Hair World Receives National Pride Award 2022 for Best Hair Replacement, Presented by Neha Dhupia",
                            text:
                                "Indian Hair World is delighted to announce that we have received the National Pride Awards 2022 for Best Hair Replacement Center of West Bengal. Presented by Neha Dhupia, recognizing our commitment to excellence.",
                        },
                        {
                            img: "/images/c-4.jpg",
                            title:
                                "Indian Hair World Celebrated at Global Fame Awards 2024, Featuring Malaika Arora.",
                            text:
                                "Discover Indian Hair World, Kolkata's premier hair replacement center in West Bengal, honored with the Global Fame Awards 2024 featuring Malaika Arora.",
                        },
                    ].map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="pt-12 pb-20 bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url('/images/backkkkkCe.jpg')",
                                }}
                            >
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
                                        <div className="w-full lg:w-7/12">
                                            <div className="h-[385px] overflow-hidden">
                                                <img
                                                    src={slide.img}
                                                    alt="Celebrity"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-5/12 text-center lg:text-left">
                                            <h1 className="text-3xl lg:text-4xl font-bold capitalize text-black">
                                                {slide.title}
                                            </h1>
                                            <p className="text-lg text-gray-900 mt-8">
                                                {slide.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* ================= Trusted Section ================= */}
                <section className="bg-[#16202a] text-white py-4">
                    <div className="max-w-7xl mx-auto px-4">
                        <h4 className="text-lg text-center text-gray-300">
                            <span className="text-white font-bold">
                                Indian Hair World
                            </span>{" "}
                            trusted by Celebrities for the Best Non-Surgical Hair Replacement
                            Solutions in Kolkata.
                        </h4>
                    </div>
                </section>

                {/* ================= Gallery Section ================= */}
                <section className="py-16">
                    <div className="text-center mb-12 px-4">
                        <h2 className="text-3xl font-bold italic">
                            The Faces Behind the Fame – Trusted by Celebrities
                        </h2>
                        <p className="mt-6 text-lg text-gray-900 max-w-3xl mx-auto">
                            Celebrities trust us for flawless hair transformations —
                            experience premium hair replacement solutions.
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 flex flex-wrap">
                        {[
                            "/images/celeb_2.jpg",
                            "/images/c-8.jpg",
                            "/images/c-3.jpg",
                            "/images/celibrity1compress.JPG",
                        ].map((img, i) => (
                            <div
                                key={i}
                                className="w-full md:w-1/2 lg:w-1/3 p-2 relative"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={img}
                                        alt="Celebrity"
                                        className="w-full h-[400px] object-cover object-top"
                                    />
                                </div>

                                <button
                                    onClick={() => openModal(img)}
                                    className="absolute inset-0"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ================= Darshana Section ================= */}
                <section className="bg-[#eae8ed] py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
                            <div className="w-full lg:w-5/12">
                                <img
                                    src="/images/celeb_darshana_img.png"
                                    alt="Darshana"
                                    className="w-full"
                                />
                            </div>

                            <div className="w-full lg:w-7/12 text-center lg:text-left">
                                <h3 className="text-2xl font-semibold">
                                    Elevate Your Look with Professional Hair Extensions
                                </h3>
                                <p className="mt-6 text-gray-900">
                                    Explore our professional hair extensions service trusted by
                                    renowned actress and model Darshana Banik.
                                </p>
                                <button
                                    onClick={() => (window.location.href = "/contact-us")}
                                    className="bg-gray-800 text-white px-6 py-2 mt-6"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= Top Rated Slider ================= */}
                <section className="py-16">
                    <div className="text-center mb-12 px-4">
                        <h2 className="text-3xl font-bold">TOP RATED CELEBRITIES</h2>
                        <p className="mt-6 text-gray-900 max-w-3xl mx-auto">
                            Top-rated celebrities trust Indian Hair World for their hair
                            replacement needs.
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto px-4">
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={20}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                1024: { slidesPerView: 3 },
                            }}
                        >
                            {[
                                "/images/cele_1.jpg",
                                "/images/c-6.jpg",
                                "/images/c-4.jpg",
                                "/images/celeb_2.jpg",
                                "/images/c-3.jpg",
                                "/images/c-5.jpg",
                                "/images/c-7.jpg",
                                "/images/c-8.jpg",
                            ].map((img, i) => (
                                <SwiperSlide key={i}>
                                    <div className="relative">
                                        <div className="h-[256px] overflow-hidden">
                                            <img
                                                src={img}
                                                alt="Celebrity"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            onClick={() => openModal(img)}
                                            className="absolute inset-0"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            </main>

            {/* ================= Modal ================= */}
            {activeModal && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-[90%] max-h-[90%]"
                    >
                        <button
                            onClick={closeModal}
                            className="absolute -top-10 right-0 text-white text-3xl"
                        >
                            &times;
                        </button>
                        <img
                            src={activeModal}
                            alt="Celebrity"
                            className="max-h-[80vh] rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </MainLayOut>
    );
};

export default CelebrityPage;
