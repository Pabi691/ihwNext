import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const ReviewSlider = ({ data }) => {
    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4">

                <h2 className="text-3xl font-bold text-center mb-10">
                    {data.title}
                </h2>

                <Swiper
                    loop
                    centeredSlides
                    spaceBetween={30}
                    speed={5000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    modules={[Autoplay]}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {data.reviews.map((review, i) => (
                        <SwiperSlide key={i}>
                            <div
                                className="
                bg-white p-6 rounded-lg h-full
                transition-all duration-500
                scale-90 opacity-60
                swiper-slide-active:scale-100
                swiper-slide-active:opacity-100
              "
                            >
                                {/* Text */}
                                <p className="text-gray-600 mb-4">
                                    {review.text}
                                </p>

                                {/* User */}
                                <div className="flex items-center gap-4">
                                    {review.image &&
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    }
                                    <div>
                                        <h4 className="font-semibold">
                                            {review.name}
                                        </h4>

                                        {/* ⭐ Animated Stars */}
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <svg
                                                    key={star}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill={star <= review.rating ? 'currentColor' : 'none'}
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                    />
                                                </svg>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Google Button */}
                <div className="text-center mt-10">
                    <a
                        href={data.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full"
                    >
                        ⭐ Get More Reviews
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ReviewSlider;
