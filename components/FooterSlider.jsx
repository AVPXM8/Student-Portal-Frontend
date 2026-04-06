"use client";
import React from 'react';
import styles from './FooterSlider.module.css';
import { students } from '@/data/students';

const FooterSlider = () => {
  // Use a subset of students for the footer slider (e.g., top 15)
  const sliderStudents = students.slice(0, 15);
  // Duplicate for infinite scroll effect
  const allImages = [...sliderStudents, ...sliderStudents];

  return (
    <div className={styles.footerSliderSection}>
      <h4 className={styles.sliderTitle}>Our Top Achievers</h4>
      <div className={styles.scrollerContainer}>
        <div className={styles.scroller}>
          {allImages.map((student, index) => (
            <div className={styles.slide} key={`${student.id}-${index}`}>
              <div className={styles.imageWrapper}>
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className={styles.studentImage}
                  loading="lazy"
                />
                <div className={styles.overlay}>
                  <span className={styles.studentName}>{student.name}</span>
                  <span className={styles.studentRank}>{student.achievement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterSlider;
