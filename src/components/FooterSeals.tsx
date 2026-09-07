import React from "react";

interface FooterSealsProps {
  className?: string;
}

/**
 * Tiny, subtle footer row: WINF mini-lockup + product/certification seals.
 * Decorative (aria-hidden) — meant to sit discreetly above the copyright line.
 */
export const FooterSeals: React.FC<FooterSealsProps> = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-3 opacity-60 hover:opacity-100 transition-opacity select-none ${className}`}
    >
      <img src="/images/footer/nome.png" alt="" className="h-[7px] w-auto" />
      <img src="/images/footer/group-5429.png" width={22} height={11} alt="" className="h-[11px] w-auto" />
      <img src="/images/footer/group-5691.png" width={32} height={16} alt="" className="h-[16px] w-auto" />
      <img src="/images/footer/group-5692.png" width={32} height={16} alt="" className="h-[16px] w-auto" />
      <img src="/images/footer/group-5693.png" width={32} height={16} alt="" className="h-[16px] w-auto" />
      <img src="/images/footer/selo-pelicula-1.png" width={32} height={16} alt="" className="h-[16px] w-auto" />
      <img src="/images/footer/selo-pelicula-2.png" width={32} height={16} alt="" className="h-[16px] w-auto" />
      <img src="/images/footer/image-405.png" width={32} height={16} alt="" className="h-[16px] w-auto" />
    </div>
  );
};

export default FooterSeals;
