"use client";
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/autoplay';

const TrustedBy = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  // EXACT SAME logos as your original
  const logos = [
    { id: 1, name: "Google", image: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" },
    { id: 2, name: "Microsoft", image: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" },
    { id: 3, name: "Amazon", image: "https://companieslogo.com/img/orig/AMZN-e9f942e4.png?t=1632523695" },
    { id: 4, name: "Apple", image: "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png" },
    { id: 5, name: "Facebook", image: "https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" },
    { id: 6, name: "Tesla", image: "https://www.tesla.com/sites/all/themes/custom/tesla_theme/assets/img/icons/apple-touch-icon-152x152.png" },
    { id: 7, name: "Netflix", image: "https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png" },
    { id: 8, name: "Adobe", image: "https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg" },
  ];

  return (
    <div className="w-full bg-[#676767] py-12 md:py-16 lg:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - EXACT SAME */}
        <div 
          className="text-center mb-10 md:mb-12 lg:mb-16"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted By
          </h2>
          <p className="text-sm md:text-base text-gray-200 max-w-3xl mx-auto">
            Trusted by leading businesses who rely on us for fast, secure, and reliable transport solutions.
          </p>
        </div>

        {/* EXACT SAME Swiper slider as your original */}
        <div data-aos="fade-up" data-aos-delay="200">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={5}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="px-4 md:px-8"
          >
            {logos.map((logo) => (
              <SwiperSlide key={logo.id}>
                <div className="bg-white rounded-xl p-4 md:p-6 h-20 md:h-28 flex items-center justify-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;