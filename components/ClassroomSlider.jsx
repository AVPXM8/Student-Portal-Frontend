"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ClassroomSlider.module.css';

const classroomImages = [
  { src: '/maarula_classroom1.jpg', alt: 'Maarula Classroom' },
  { src: '/maarula_classromm2.jpg', alt: 'Maarula Academic Success' },
];

export default function ClassroomSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % classroomImages.length);
    }, 2000); // 2 second interval
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % classroomImages.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + classroomImages.length) % classroomImages.length);

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.slider} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {classroomImages.map((img, idx) => (
          <div key={idx} className={styles.slide}>
            <Image 
              src={img.src} 
              alt={img.alt} 
              width={600} 
              height={450} 
              className={styles.image}
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      
      {classroomImages.length > 1 && (
        <>
          <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev} aria-label="Previous slide">
            <ChevronLeft size={24} />
          </button>
          <button className={`${styles.navBtn} ${styles.next}`} onClick={next} aria-label="Next slide">
            <ChevronRight size={24} />
          </button>
          <div className={styles.dots}>
            {classroomImages.map((_, idx) => (
              <button 
                key={idx} 
                className={`${styles.dot} ${currentIndex === idx ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
