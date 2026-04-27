import React from 'react';
import Image from 'next/image';
import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.logoContainer}>
        <div className={styles.pulsingCircle} />
        <div className={styles.pulsingCircleDelayed} />
        <div className={styles.loaderLogo}>
          <Image 
            src="https://res.cloudinary.com/dwmj6up6j/image/upload/f_auto,q_auto,w_80/v1752683439/maarulalogo_lywhdo.png" 
            alt="Loading Mathem Solvex..." 
            width={80} 
            height={80}
            priority
          />
        </div>
      </div>
      
      <div className={styles.loadingText}>
        Preparing for Excellence
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
      </div>
      
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>
    </div>
  );
}
