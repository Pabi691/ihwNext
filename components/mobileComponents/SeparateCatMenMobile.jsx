import React, { useCallback, useEffect, useState } from "react";
import { Link } from "@/components/compat/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useGlobal } from "../../global/GlobalContext";
import axios from "axios";

const SeparateCatMenMobile = ({ slug }) => {
  const [getCategory, setGetCategory] = useState([]);
  const { token } = useGlobal();
  const [loading, setLoading] = useState(true);

  const fetchCategory = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const categoryData = response.data;
      setGetCategory(categoryData.category_data.child_categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-black text-lg font-semibold">Loading Men Products...</div>
      </div>
    );
  }

  if (!loading && getCategory.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No categories available. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={2000}
        spaceBetween={10}
        breakpoints={{
          360: { slidesPerView: 2.1 },
          640: { slidesPerView: 3.2 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 4 },
        }}
        // slidesPerView={3}
        className="inner_home owl_mobile"
      >
        {getCategory.map((bannercat) => (
          <SwiperSlide key={bannercat.id}>
            <Link
              to={`../${bannercat.slug}`}
              className="flex flex-col justify-end relative w-[375px] h-[350px] md:w-full md:h-[500px] md:rounded-none rounded-lg"
            >
              <img
                className="w-full absolute h-full object-cover top-0 left-0 rounded-lg md:rounded-none"
                src={bannercat.cat_img}
                alt={bannercat.category_name || "Category Image"} loading="lazy"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SeparateCatMenMobile;


