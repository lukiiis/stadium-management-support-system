import React, { useState, useEffect } from 'react';
import styles from './LoadingSpinner.module.scss'

const LoadingSpinner: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return shouldRender ? (
    <div className={`${styles.spinner} ${isLoading ? styles.fadeIn : styles.fadeOut}`} />
  ) : null;
};

export default LoadingSpinner;
