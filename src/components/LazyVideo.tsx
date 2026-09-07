import React, { useEffect, useRef } from 'react';

interface LazyVideoProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * Video that only downloads (preload="none") and plays when scrolled into view,
 * pausing when off-screen. Saves tens of MB on first paint and cuts main-thread
 * contention vs eager autoPlay videos. Retries on `canplay` and resumes when the
 * tab becomes visible again (autoplay-policy resilience).
 */
export const LazyVideo: React.FC<LazyVideoProps> = ({ src, poster, className }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const kick = () => v.play().catch(() => {});
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) kick();
        else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(v);

    // If the browser blocked the initial play, retry once data arrives
    const onCanPlay = () => {
      if (!v.paused) return;
      const rect = v.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) kick();
    };
    v.addEventListener('canplay', onCanPlay);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        const rect = v.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) kick();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      io.disconnect();
      v.removeEventListener('canplay', onCanPlay);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return <video ref={ref} loop muted playsInline preload="none" poster={poster} src={src} className={className} />;
};

export default LazyVideo;
