import React, { useState, useEffect } from 'react';
import { PAGE_META, SITE_URL } from '../data/siteMeta';
import { usePageMeta } from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import WinfFooter from './WinfFooter';
import { ARTICLES, getArticle, type Article } from '../data/articles';

interface LandingBlogProps {
  onBack?: () => void;
  onOpenMenu?: () => void;
  /** Opens the reader directly on this article slug (deep-link from home cards) */
  initialSlug?: string | null;
}

// Reusable cinematic animation variants (same engine as the rest of the site)
const fadeInUp = {
  initial: { opacity: 0, y: 45, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: false, amount: 0.25, margin: '-60px' },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

const fadeInLabel = {
  initial: { opacity: 0, y: 15, letterSpacing: '0.2em' },
  whileInView: { opacity: 1, y: 0, letterSpacing: '0.35em' },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

export const LandingBlog: React.FC<LandingBlogProps> = ({ onBack, onOpenMenu, initialSlug }) => {
  const [selected, setSelected] = useState<Article | null>(() => getArticle(initialSlug ?? null));

  // SEO/AEO: article meta while reading, journal meta on the listing
  usePageMeta(selected ? {
    title: `${selected.title} | WINF Journal™`,
    description: selected.excerpt,
    path: '/blog',
    image: `/images/og/og-artigo-${selected.slug}.png`,
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: selected.title,
      description: selected.excerpt,
      image: `${SITE_URL}/images/og/og-artigo-${selected.slug}.png`,
      author: { '@type': 'Organization', name: 'WINF Partners™' },
      publisher: { '@type': 'Organization', name: 'WINF Partners™' },
      mainEntityOfPage: `${SITE_URL}/blog`,
      inLanguage: 'pt-BR',
    }],
  } : PAGE_META.blog);

  // Deep-link: open the reader when remounted with a slug from the home cards
  useEffect(() => {
    if (initialSlug) {
      const a = getArticle(initialSlug);
      if (a) setSelected(a);
    }
  }, [initialSlug]);

  const openArticle = (a: Article) => {
    setSelected(a);
    if ((window as any).lenis) (window as any).lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  };

  const closeArticle = () => {
    setSelected(null);
    if ((window as any).lenis) (window as any).lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  };

  const [featured, ...rest] = ARTICLES;

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
      {/* ── Fixed cinematic background video ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/blackpro-poster-2.webp"
          src="/videos/blackpro-hero.mp4"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
      </div>

      {selected ? (
          /* ──────────────────────── ARTICLE READER ──────────────────────── */
          <motion.article
            key={`reader-${selected.slug}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            {/* Cover */}
            <div className="relative h-[52vh] min-h-[380px] w-full overflow-hidden">
              <img src={selected.cover} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black" />
              <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-12 md:px-20 pb-10 max-w-5xl mx-auto">
                <span className="inline-block text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-300 border border-white/30 bg-black/50 backdrop-blur-sm px-3 py-1.5 mb-5">
                  {selected.tag}
                </span>
                <h1 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  {selected.title}
                </h1>
              </div>
            </div>

            {/* Meta + body */}
            <div className="relative z-10 px-6 sm:px-12 md:px-20 py-16 sm:py-20">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap items-center gap-5 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10 pb-6 mb-10">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> {selected.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> {selected.readTime} DE LEITURA
                  </span>
                  <span className="text-zinc-400">WINF™ JOURNAL</span>
                </div>

                {selected.content.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-zinc-300 font-light leading-relaxed text-base sm:text-lg ${
                      i === 0 ? 'text-lg sm:text-xl text-zinc-100 mb-8' : 'mb-7'
                    }`}
                  >
                    {paragraph}
                  </motion.p>
                ))}

                {/* Back + next */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-10 mt-14">
                  <button
                    onClick={closeArticle}
                    className="flex items-center gap-2 px-6 py-4 border border-white/30 bg-black/40 hover:bg-black/70 text-zinc-200 hover:text-white font-mono text-xs uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Journal
                  </button>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
                    WINF™ — O VIDRO PERMANECE. O AMBIENTE MUDA.
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        ) : (
          /* ──────────────────────── JOURNAL LISTING ──────────────────────── */
          <motion.div
            key="listing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {/* HERO */}
            <section className="relative min-h-[62vh] flex flex-col px-6 sm:px-10 md:p-14 pt-8">
              <header className="w-full flex items-center justify-between z-30 relative">
                <div onClick={onBack} className={`flex items-center ${onBack ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
                  <img src="/winf-logo.svg" width={128} height={32} alt="WINF™" className="h-6 sm:h-7 md:h-8 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" />
                </div>
                <button
                  onClick={() => onOpenMenu?.()}
                  className="group flex flex-col items-end justify-center gap-2 p-2.5 focus:outline-none cursor-pointer z-50 relative hover:opacity-80 transition-opacity"
                  aria-label="Abrir Menu"
                >
                  <span className="block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-7 group-hover:w-8" />
                  <span className="block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-5 group-hover:w-8" />
                </button>
              </header>

              <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full py-16">
                <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6">
                  CONHECIMENTO // WINF JOURNAL
                </motion.div>
                <motion.h1 {...fadeInUp} className="text-5xl sm:text-7xl md:text-8xl font-light text-white uppercase tracking-tight leading-[0.95] mb-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                  WINF<br />
                  <span className="text-zinc-300 font-extralight">Journal™</span>
                </motion.h1>
                <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.15 }} className="text-sm sm:text-base text-zinc-300 font-light max-w-2xl leading-relaxed">
                  Engenharia, tecnologia e design aplicados ao vidro. Artigos técnicos do ecossistema WINF™ — do controle térmico à blindagem transparente.
                </motion.p>
              </div>
            </section>

            {/* FEATURED ARTICLE */}
            <section className="relative z-10 px-6 sm:px-12 md:px-20 pb-8 border-t border-white/10 bg-black/30 backdrop-blur-[1px]">
              <div className="max-w-6xl mx-auto pt-16">
                <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-8">
                  DESTAQUE // LEITURA PRINCIPAL
                </motion.div>
                <motion.div
                  {...fadeInUp}
                  onClick={() => openArticle(featured)}
                  className="group relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden border border-white/15 hover:border-white/50 bg-black/50 shadow-2xl cursor-pointer transition-all duration-300"
                >
                  <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden">
                    <img
                      src={featured.cover}
                      alt={featured.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-12">
                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-5">
                      <span className="border border-white/30 px-2.5 py-1 text-zinc-200">{featured.tag}</span>
                      <span>{featured.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white uppercase tracking-tight leading-tight mb-5 group-hover:translate-x-1 transition-transform duration-500">
                      {featured.title}
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-8">{featured.excerpt}</p>
                    <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-200 group-hover:text-white">
                      <span>Ler artigo</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* GRID */}
            <section className="relative z-10 px-6 sm:px-12 md:px-20 py-24 border-t border-white/10 bg-black/30 backdrop-blur-[1px]">
              <div className="max-w-6xl mx-auto">
                <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-10">
                  ARQUIVO // TODOS OS ARTIGOS
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article, idx) => (
                    <motion.div
                      key={article.slug}
                      initial={{ opacity: 0, y: 50, scale: 0.97, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => openArticle(article)}
                      className="relative group overflow-hidden border border-white/15 hover:border-white/50 bg-black/50 shadow-2xl cursor-pointer transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={article.cover}
                          alt={article.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
                        <span className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-200 border border-white/30 bg-black/60 backdrop-blur-sm px-2.5 py-1">
                          {article.tag}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {article.date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {article.readTime}</span>
                        </div>
                        <h3 className="text-lg font-light text-white uppercase tracking-tight leading-snug mb-3 group-hover:translate-x-1 transition-transform duration-500">
                          {article.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-5 line-clamp-3">{article.excerpt}</p>
                        <span className="mt-auto flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-300 group-hover:text-white">
                          <span>Ler</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <WinfFooter brandName="WINF JOURNAL" />
          </motion.div>
        )}
    </div>
  );
};

export default LandingBlog;
