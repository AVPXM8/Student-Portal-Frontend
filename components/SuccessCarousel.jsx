import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { summaryBanners } from '@/data/students';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from './SuccessCarousel.module.css';

const SuccessCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    swipeToSlide: true,
    arrows: false
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {summaryBanners.map((banner, index) => (
          <div key={banner.id}>
            <div className={styles.aspectBox}>
              <Image
                src={banner.imageUrl}
                alt={banner.altText}
                className={styles.bannerImage}
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                width={1200}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SuccessCarousel;
