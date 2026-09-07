import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'winf-cookies-accepted';

/** Koenigsegg-style clipped button (diagonal top-left / bottom-right corners) with a hairline border */
const clip = 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const allow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* private mode — just hide for this session */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Permissão de cookies"
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 110, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white text-zinc-900 shadow-[0_-8px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8 px-6 sm:px-12 md:px-16 py-6">
            <div className="flex items-center gap-5 sm:gap-8 min-w-0">
              <img
                src="/images/footer/simbolo.png" width={24} height={25}
                alt=""
                aria-hidden="true"
                className="h-6 w-auto brightness-0 shrink-0"
              />
              <p className="text-[13px] sm:text-[15px] leading-relaxed text-zinc-900 font-light">
                We use cookies on this website to enhance the experience,
                <br className="hidden sm:block" /> for more information read our{' '}
                <a
                  href="#politica-de-privacidade"
                  className="underline underline-offset-[3px] decoration-zinc-900/70 hover:decoration-zinc-900 transition-colors"
                >
                  privacy policy
                </a>
                .
              </p>
            </div>

            <button
              onClick={allow}
              aria-label="Allow Cookies"
              className="relative shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{ clipPath: clip }}
            >
              <span aria-hidden="true" className="absolute inset-0 bg-zinc-300" />
              <span
                aria-hidden="true"
                className="absolute inset-[1.5px] bg-white group-hover:bg-zinc-100 transition-colors duration-300"
                style={{ clipPath: clip }}
              />
              <span className="relative flex items-center gap-5 px-8 py-4 text-sm text-zinc-900 font-light">
                Allow Cookies
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
