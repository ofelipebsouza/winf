/**
 * Central SEO/AEO metadata for every page.
 * Consumed by the `usePageMeta` hook (document head) and JSON-LD builders.
 */
export const SITE_URL = 'https://winf.com.br';
export const SITE_NAME = 'WINF™';
export const DEFAULT_OG = '/images/og/og-default.png';

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Resources to <link rel=preload> for this page (e.g. hero poster) */
  preloadImages?: string[];
  /** JSON-LD graph injected as <script type="application/ld+json"> for this page */
  jsonLd?: object[];
}

/** FAQPage schema (AEO) — makes questions eligible for rich answers */
export const faqJsonLd = (faqs: FaqEntry[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

/** BreadcrumbList schema — helps engines understand site depth */
export const breadcrumbJsonLd = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: `${SITE_URL}${t.path}`,
  })),
});

/** Product schema for each brand page */
export const productJsonLd = (name: string, description: string, image: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  image: `${SITE_URL}${image}`,
  brand: { '@type': 'Brand', name: SITE_NAME },
  manufacturer: { '@type': 'Organization', name: 'WINF Partners™' },
});

export const PAGE_META: Record<string, PageMeta> = {
  home: {
    title: 'WINF™ — Engenharia Invisível em Vidro | Películas Arquitetônicas e Automotivas',
    description:
      'Ecossistema WINF™ de tecnologia aplicada ao vidro: controle térmico, proteção UV, privacidade, blindagem e segurança. Conheça AeroCore™, Invisible™, BlackPro™, SecurityBlinder™ e mais.',
    path: '/',
    image: '/images/og/og-winf-select.png',
    jsonLd: [
      breadcrumbJsonLd([{ name: 'Início', path: '/' }]),
    ],
  },
  'winf-home': {
    title: 'WINF Home™ — Todas as Linhas WINF em Um Só Lugar',
    description:
      'Compare todas as linhas WINF™: película arquitetônica, automotiva, decorativa e de segurança. Encontre a solução ideal para o seu projeto de vidro.',
    path: '/winf-home',
    image: '/images/og/og-winf-home.png',
    jsonLd: [breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'WINF Home', path: '/winf-home' }])],
  },
  aerocore: {
    title: 'AeroCore™ — Defesa Térmica Automotiva | Película Automotiva Premium',
    description:
      'AeroCore™: defesa térmica automotiva de alta performance. Rejeição infravermelha extrema, proteção UV 99,9% e claridade óptica total para o seu veículo.',
    path: '/aerocore',
    image: '/images/og/og-aerocore.png',
    jsonLd: [productJsonLd('AeroCore™', 'Defesa térmica automotiva de alta performance.', '/images/og/og-aerocore.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'AeroCore™', path: '/aerocore' }])],
  },
  neoskin: {
    title: 'NeoSkin™ — Paint Protection Film | Armadura Invisível para o Pintado',
    description:
      'NeoSkin™ PPF: película de poliuretano autorregenerável que protege o pintado contra pedrisco, riscos e desgaste — sem alterar a aparência original.',
    path: '/neoskin',
    image: '/images/og/og-neoskin.png',
    jsonLd: [productJsonLd('NeoSkin™', 'Paint Protection Film autorregenerável.', '/images/og/og-neoskin.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'NeoSkin™', path: '/neoskin' }])],
  },
  ceramic: {
    title: 'Ceramic Armoring™ — Blindagem Molecular 9H para Vidros e Superfícies',
    description:
      'Ceramic Armoring™: blindagem molecular 9H que protege vidros e superfícies premium contra riscos, química e desgaste — com acabamento invisível.',
    path: '/ceramic',
    image: '/images/og/og-ceramic.png',
    jsonLd: [productJsonLd('Ceramic Armoring™', 'Blindagem molecular 9H.', '/images/og/og-ceramic.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'Ceramic Armoring™', path: '/ceramic' }])],
  },
  invisible: {
    title: 'WINF SELECT Invisible™ — Nano Cerâmica Arquitetônica Invisível',
    description:
      'Invisible™: película de nano cerâmica com rejeição térmica de até 99% e proteção UV 99,9% — sem escurecer o vidro. A favorita dos arquitetos.',
    path: '/invisible',
    preloadImages: ['/images/invisible-poster-1.webp'],
    image: '/images/og/og-invisible.png',
    jsonLd: [productJsonLd('WINF SELECT Invisible™', 'Nano cerâmica arquitetônica invisível.', '/images/og/og-invisible.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'Invisible™', path: '/invisible' }])],
  },
  'dual-reflect': {
    title: 'Dual Reflect™ — Controle Solar Refletivo para Fachadas',
    description:
      'Dual Reflect™: película refletiva de controle solar para fachadas envidraçadas. Rejeição térmica alta, privacidade diurna e leitura arquitetônica preservada.',
    path: '/dual-reflect',
    image: '/images/og/og-dual-reflect.png',
    jsonLd: [productJsonLd('Dual Reflect™', 'Controle solar refletivo.', '/images/og/og-dual-reflect.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'Dual Reflect™', path: '/dual-reflect' }])],
  },
  blackpro: {
    title: 'BlackPro™ — Privacidade Arquitetônica no Vidro',
    description:
      'BlackPro™: película de privacidade arquitetônica. Espelho diurno, controle térmico e discrição total — sem cortinas e sem abrir mão da luz.',
    path: '/blackpro',
    image: '/images/og/og-blackpro.png',
    jsonLd: [productJsonLd('BlackPro™', 'Privacidade arquitetônica.', '/images/og/og-blackpro.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'BlackPro™', path: '/blackpro' }])],
  },
  securityblind: {
    title: 'SecurityBlinder™ — Película de Segurança e Blindagem de Vidro',
    description:
      'SecurityBlinder™: película de segurança que retém estilhaços, resiste a impactos e arrombamentos — blindagem transparente sem trocar o vidro.',
    path: '/securityblind',
    preloadImages: ['/images/securityblind/scene-01.webp'],
    image: '/images/og/og-securityblind.png',
    jsonLd: [productJsonLd('SecurityBlinder™', 'Película de segurança e blindagem de vidro.', '/images/og/og-securityblind.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'SecurityBlinder™', path: '/securityblind' }])],
  },
  'miniblind-venetian': {
    title: 'Miniblind & Venetian™ — Película Decorativa de Persiana no Vidro',
    description:
      'Miniblind & Venetian™: película decorativa com desenho de persiana horizontal. Privacidade suave, controle de luz e design arquitetônico sem manutenção.',
    path: '/miniblind-venetian',
    image: '/images/og/og-miniblind-venetian.png',
    jsonLd: [productJsonLd('Miniblind & Venetian™', 'Película decorativa de persiana no vidro.', '/images/og/og-miniblind-venetian.png'), breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'Miniblind & Venetian™', path: '/miniblind-venetian' }])],
  },
  shop: {
    title: 'WINF™ BlackShop — Merchandising Oficial do Ecossistema WINF',
    description:
      'BlackShop WINF™: merchandising oficial. Bonés, moletons, camisetas e acessórios do universo WINF — engenharia invisível que você veste.',
    path: '/shop',
    image: '/images/og/og-shop.png',
    jsonLd: [breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'BlackShop', path: '/shop' }])],
  },
  partners: {
    title: 'WINF Partners™ — Tecnologia Invisível. Domínio Absoluto.',
    description:
      'WINF Partners™: ecossistema B2B de expansão global. Planos de licenciamento Asset Light Select, Kiosk Arquitetônico e Flagship Studio, garantia rastreável em blockchain e portal do especificador. Acesso sob análise de board.',
    path: '/partners',
    jsonLd: [breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'WINF Partners™', path: '/partners' }])],
  },
  blog: {
    title: 'WINF Journal™ — Artigos sobre Tecnologia e Engenharia do Vidro',
    description:
      'WINF Journal™: artigos técnicos sobre controle térmico, segurança, privacidade e design no vidro. Engenharia, tecnologia e design aplicados ao vidro.',
    path: '/blog',
    image: '/images/og/og-blog.png',
    jsonLd: [breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'WINF Journal™', path: '/blog' }])],
  },
};
