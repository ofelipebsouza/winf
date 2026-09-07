import React, { useState, useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { KoenigseggMenu } from './components/KoenigseggMenu';
const LandingWinfHome = React.lazy(() => import('./components/LandingWinfHome'));
const LandingWinfSelect = React.lazy(() => import('./components/LandingWinfSelect'));
const LandingAeroCore = React.lazy(() => import('./components/LandingAeroCore'));
const LandingNeoskin = React.lazy(() => import('./components/LandingNeoskin'));
const LandingCeramicArmoring = React.lazy(() => import('./components/LandingCeramicArmoring'));
const LandingInvisible = React.lazy(() => import('./components/LandingInvisible'));
const LandingMiniblindVenetian = React.lazy(() => import('./components/LandingMiniblindVenetian'));
const LandingDualReflect = React.lazy(() => import('./components/LandingDualReflect'));
const LandingBlackPro = React.lazy(() => import('./components/LandingBlackPro'));
const LandingSecurityBlind = React.lazy(() => import('./components/LandingSecurityBlind'));
const AeroCoreCatalog = React.lazy(() => import('./components/AeroCoreCatalog'));
const NeoSkinCatalog = React.lazy(() => import('./components/NeoSkinCatalog'));
const LandingShop = React.lazy(() => import('./components/LandingShop'));
const LandingBlog = React.lazy(() => import('./components/LandingBlog'));
import CookieBanner from './components/CookieBanner';

export type BrandPage =
  | 'winf-select'
  | 'winf-home'
  | 'aerocore'
  | 'neoskin'
  | 'ceramic'
  | 'invisible'
  | 'miniblind-venetian'
  | 'dual-reflect'
  | 'blackpro'
  | 'securityblind'
  | 'aerocore-ghost'
  | 'aerocore-phantom'
  | 'aerocore-spectre'
  | 'aerocore-wraith'
  | 'neoskin-bunker'
  | 'neoskin-apocalypse'
  | 'blog'
  | 'shop';

type AeroCoreProduct = 'ghost' | 'phantom' | 'spectre' | 'wraith';
type NeoSkinProduct = 'bunker' | 'apocalypse';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<BrandPage>('winf-select');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const [aerocoreProduct, setAerocoreProduct] = useState<AeroCoreProduct>('ghost');
  const [neoskinProduct, setNeoskinProduct] = useState<NeoSkinProduct>('bunker');

  // Global Smooth Scroll (Lenis Engine)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    (window as any).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  // Sync route on initial load & popstate (browser back/forward)
  useEffect(() => {
    const syncRouteFromPath = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/aerocore/ghost' || path.startsWith('/aerocore/ghost')) {
        setCurrentPage('aerocore-ghost');
        setAerocoreProduct('ghost');
      } else if (path === '/aerocore/phantom' || path.startsWith('/aerocore/phantom')) {
        setCurrentPage('aerocore-phantom');
        setAerocoreProduct('phantom');
      } else if (path === '/aerocore/spectre' || path.startsWith('/aerocore/spectre')) {
        setCurrentPage('aerocore-spectre');
        setAerocoreProduct('spectre');
      } else if (path === '/aerocore/wraith' || path.startsWith('/aerocore/wraith')) {
        setCurrentPage('aerocore-wraith');
        setAerocoreProduct('wraith');
      } else if (path === '/aerocore' || path.startsWith('/aerocore')) {
        setCurrentPage('aerocore');
      } else if (path === '/neoskin/bunker' || path.startsWith('/neoskin/bunker')) {
        setCurrentPage('neoskin-bunker');
        setNeoskinProduct('bunker');
      } else if (path === '/neoskin/apocalypse' || path.startsWith('/neoskin/apocalypse')) {
        setCurrentPage('neoskin-apocalypse');
        setNeoskinProduct('apocalypse');
      } else if (path === '/neoskin' || path.startsWith('/neoskin')) {
        setCurrentPage('neoskin');
      } else if (path === '/ceramic' || path.startsWith('/ceramic') || path.startsWith('/ceramic-armoring')) {
        setCurrentPage('ceramic');
      } else if (path === '/invisible' || path.startsWith('/invisible')) {
        setCurrentPage('invisible');
      } else if (path === '/miniblind-venetian' || path.startsWith('/miniblind-venetian')) {
        setCurrentPage('miniblind-venetian');
      } else if (path === '/dual-reflect' || path.startsWith('/dual-reflect')) {
        setCurrentPage('dual-reflect');
      } else if (path === '/blackpro' || path.startsWith('/blackpro')) {
        setCurrentPage('blackpro');
      } else if (path === '/securityblind' || path.startsWith('/securityblind')) {
        setCurrentPage('securityblind');
      } else if (path === '/blog' || path.startsWith('/blog')) {
        setCurrentPage('blog');
      } else if (path === '/shop') {
        setCurrentPage('shop');
      } else if (path === '/winf-home') {
        setCurrentPage('winf-home');
      } else {
        setCurrentPage('winf-select');
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, []);

  // Navigate to a page and update the URL
  const navigateTo = (page: BrandPage) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    // Set the AeroCore product when navigating to catalog pages
    if (page === 'aerocore-ghost') setAerocoreProduct('ghost');
    else if (page === 'aerocore-phantom') setAerocoreProduct('phantom');
    else if (page === 'aerocore-spectre') setAerocoreProduct('spectre');
    else if (page === 'aerocore-wraith') setAerocoreProduct('wraith');
    if (page === 'neoskin-bunker') setNeoskinProduct('bunker');
    else if (page === 'neoskin-apocalypse') setNeoskinProduct('apocalypse');
    const pathMap: Record<BrandPage, string> = {
      'winf-select': '/',
      'winf-home': '/winf-home',
      'aerocore': '/aerocore',
      'aerocore-ghost': '/aerocore/ghost',
      'aerocore-phantom': '/aerocore/phantom',
      'aerocore-spectre': '/aerocore/spectre',
      'aerocore-wraith': '/aerocore/wraith',
      'neoskin': '/neoskin',
      'neoskin-bunker': '/neoskin/bunker',
      'neoskin-apocalypse': '/neoskin/apocalypse',
      'ceramic': '/ceramic',
      'invisible': '/invisible',
      'miniblind-venetian': '/miniblind-venetian',
      'dual-reflect': '/dual-reflect',
      'blackpro': '/blackpro',
      'securityblind': '/securityblind',
      'blog': '/blog',
      'shop': '/shop',
    };
    window.history.pushState({}, '', pathMap[page]);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Close menu on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Global open menu handler for all pages
  const handleOpenMenu = () => setIsMenuOpen(true);

  return (
    <main id="conteudo" className="w-full min-h-screen bg-black text-white">
      {/* ── Global KoenigseggMenu (shared across ALL pages) ── */}
      <KoenigseggMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateToWinf={() => navigateTo('winf-select')}
        onNavigateToAeroCore={() => navigateTo('aerocore')}
        onNavigateToNeoskin={() => navigateTo('neoskin')}
        onNavigateToCeramic={() => navigateTo('ceramic')}
        onNavigateToInvisible={() => navigateTo('invisible')}
        onNavigateToMiniblindVenetian={() => navigateTo('miniblind-venetian')}
        onNavigateToDualReflect={() => navigateTo('dual-reflect')}
        onNavigateToBlackPro={() => navigateTo('blackpro')}
        onNavigateToSecurityBlind={() => navigateTo('securityblind')}
        onNavigateToShop={() => navigateTo('shop')}
        onNavigateToBlog={() => { setBlogSlug(null); navigateTo('blog'); }}
        onNavigateToHome={() => navigateTo('winf-select')}
        onOpenContact={() => {}}
        onScrollToSection={scrollToSection}
      />

      <Suspense fallback={<div className="min-h-screen bg-black" />}>

      {/* ── Root page: WINF SELECT ── */}
      {currentPage === 'winf-select' && (
        <LandingWinfSelect
          onNavigateToAerocore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToCeramic={() => navigateTo('ceramic')}
          onNavigateToInvisible={() => navigateTo('invisible')}
          onNavigateToDualReflect={() => navigateTo('dual-reflect')}
          onNavigateToBlackPro={() => navigateTo('blackpro')}
          onNavigateToSecurityBlind={() => navigateTo('securityblind')}
          onNavigateToMiniblindVenetian={() => navigateTo('miniblind-venetian')}
          onNavigateToBlog={(slug) => { setBlogSlug(slug ?? null); navigateTo('blog'); }}
          onBack={() => navigateTo('winf-home')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── WINF Journal (blog) ── */}
      {currentPage === 'blog' && (
        <LandingBlog
          initialSlug={blogSlug}
          onBack={() => navigateTo('winf-select')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── WINF Home (comparison / overview) ── */}
      {currentPage === 'winf-home' && (
        <LandingWinfHome
          onNavigateToWinfSelect={() => navigateTo('winf-select')}
          onNavigateToAeroCore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToCeramic={() => navigateTo('ceramic')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── AeroCore ── */}
      {currentPage === 'aerocore' && (
        <LandingAeroCore
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToCeramic={() => navigateTo('ceramic')}
          onBack={() => navigateTo('winf-select')}
          onOpenMenu={handleOpenMenu}
          onNavigateToGhost={() => navigateTo('aerocore-ghost')}
          onNavigateToPhantom={() => navigateTo('aerocore-phantom')}
          onNavigateToSpectre={() => navigateTo('aerocore-spectre')}
          onNavigateToWraith={() => navigateTo('aerocore-wraith')}
        />
      )}

      {/* ── AeroCore Catalog ── */}
      {(currentPage === 'aerocore-ghost' || currentPage === 'aerocore-phantom' || currentPage === 'aerocore-spectre' || currentPage === 'aerocore-wraith') && (
        <AeroCoreCatalog
          product={aerocoreProduct}
          onBack={() => navigateTo('aerocore')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── NeoSkin ── */}
      {currentPage === 'neoskin' && (
        <LandingNeoskin
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToAerocore={() => navigateTo('aerocore')}
          onNavigateToCeramic={() => navigateTo('ceramic')}
          onBack={() => navigateTo('winf-select')}
          onOpenMenu={handleOpenMenu}
          onNavigateToBunker={() => navigateTo('neoskin-bunker')}
          onNavigateToApocalypse={() => navigateTo('neoskin-apocalypse')}
        />
      )}

      {/* ── NeoSkin Catalog ── */}
      {(currentPage === 'neoskin-bunker' || currentPage === 'neoskin-apocalypse') && (
        <NeoSkinCatalog
          product={neoskinProduct}
          onBack={() => navigateTo('neoskin')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── Ceramic Armoring ── */}
      {currentPage === 'ceramic' && (
        <LandingCeramicArmoring
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToAerocore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onBack={() => navigateTo('winf-select')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── SecurityBlind ── */}
      {currentPage === 'securityblind' && (
        <LandingSecurityBlind
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToAerocore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToCeramic={() => navigateTo('ceramic')}
          onNavigateToInvisible={() => navigateTo('invisible')}
          onNavigateToDualReflect={() => navigateTo('dual-reflect')}
          onNavigateToBlackPro={() => navigateTo('blackpro')}
          onBack={() => navigateTo('winf-select')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── WINF SELECT Sub-lines ── */}
      {currentPage === 'invisible' && (
        <LandingInvisible
          onBack={() => navigateTo('winf-select')}
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToDualReflect={() => navigateTo('dual-reflect')}
          onNavigateToBlackPro={() => navigateTo('blackpro')}
          onNavigateToAeroCore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToSecurityBlind={() => navigateTo('securityblind')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── Miniblind & Venetian ── */}
      {currentPage === 'miniblind-venetian' && (
        <LandingMiniblindVenetian
          onBack={() => navigateTo('winf-select')}
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToInvisible={() => navigateTo('invisible')}
          onNavigateToDualReflect={() => navigateTo('dual-reflect')}
          onNavigateToBlackPro={() => navigateTo('blackpro')}
          onNavigateToAeroCore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToSecurityBlind={() => navigateTo('securityblind')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {currentPage === 'dual-reflect' && (
        <LandingDualReflect
          onBack={() => navigateTo('winf-select')}
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToInvisible={() => navigateTo('invisible')}
          onNavigateToBlackPro={() => navigateTo('blackpro')}
          onNavigateToAeroCore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToSecurityBlind={() => navigateTo('securityblind')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {currentPage === 'blackpro' && (
        <LandingBlackPro
          onBack={() => navigateTo('winf-select')}
          onNavigateToWinf={() => navigateTo('winf-select')}
          onNavigateToInvisible={() => navigateTo('invisible')}
          onNavigateToDualReflect={() => navigateTo('dual-reflect')}
          onNavigateToAeroCore={() => navigateTo('aerocore')}
          onNavigateToNeoskin={() => navigateTo('neoskin')}
          onNavigateToSecurityBlind={() => navigateTo('securityblind')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* ── Shop ── */}
      {currentPage === 'shop' && (
        <LandingShop
          onBack={() => navigateTo('winf-select')}
          onOpenMenu={handleOpenMenu}
        />
      )}

      </Suspense>

      {/* ── Cookie consent banner (global, Koenigsegg-style) ── */}
      <CookieBanner />
    </main>
  );
};

export default App;
