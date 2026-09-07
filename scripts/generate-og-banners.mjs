/**
 * Generates social-media banner covers (OG images, 1200x630) for every page.
 * Uses ffmpeg (drawtext + gradients) — run: node scripts/generate-og-banners.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'images', 'og');
mkdirSync(OUT, { recursive: true });

const FONTS = 'C:/Windows/Fonts';
const FONT_MONO = `${FONTS}/consolab.ttf`;
const FONT_DISPLAY = `${FONTS}/impact.ttf`;

// site-wide chrome drawn on every banner
const chrome = (accent) => [
  `drawbox=x=0:y=0:w=1200:h=630:color=0x09090B@1:t=fill`,
  // accent bar bottom-left
  `drawbox=x=80:y=556:w=220:h=6:color=${accent}:t=fill`,
  // hairline frame
  `drawbox=x=40:y=40:w=1120:h=550:color=0x3F3F46@0.6:t=2`,
  // top label
  `drawtext=${FONT_MONO_F}:text='WINF™ // ENGENHARIA INVISÍVEL':fontcolor=0xA1A1AA:fontsize=30:x=80:y=96`,
  // domain
  `drawtext=${FONT_MONO_F}:text='winf.com.br':fontcolor=0x71717A:fontsize=26:x=80:y=486`,
];

// ffmpeg filtergraph needs the drive-colon escaped inside option values
const ffpath = (p) => p.replace(':', '\\:');
const FONT_MONO_F = `fontfile='${ffpath(FONT_MONO)}'`;
const FONT_DISPLAY_F = `fontfile='${ffpath(FONT_DISPLAY)}'`;

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "\\'");

function drawTitle(text, y, size = 116, color = '0xFAFAFA') {
  return `drawtext=${FONT_DISPLAY_F}:text='${esc(text)}':fontcolor=${color}:fontsize=${size}:x=80:y=${y}`;
}
function drawSub(text, y, color = '0xD4D4D8') {
  return `drawtext=${FONT_MONO_F}:text='${esc(text)}':fontcolor=${color}:fontsize=36:x=80:y=${y}`;
}

const BANNERS = [
  { name: 'og-default', title: 'WINF™', sub: 'O ECOSSISTEMA COMPLETO DA ENGENHARIA DO VIDRO', accent: '0xFAFAFA' },
  { name: 'og-winf-select', title: 'WINF SELECT™', sub: 'THERMAL INTELLIGENCE PARA ARQUITETURA', accent: '0x60A5FA' },
  { name: 'og-winf-home', title: 'WINF HOME™', sub: 'TODAS AS LINHAS. UM SÓ PADRÃO.', accent: '0xE4E4E7' },
  { name: 'og-aerocore', title: 'AEROCORE™', sub: 'DEFESA TÉRMICA AUTOMOTIVA', accent: '0xEF4444' },
  { name: 'og-neoskin', title: 'NEOSKIN™', sub: 'PAINT PROTECTION FILM', accent: '0x2DD4BF' },
  { name: 'og-ceramic', title: 'CERAMIC ARMORING™', sub: 'BLINDAGEM MOLECULAR 9H', accent: '0xF59E0B' },
  { name: 'og-invisible', title: 'INVISIBLE™', sub: 'NANO CERÂMICA ARQUITETÔNICA', accent: '0x22D3EE' },
  { name: 'og-dual-reflect', title: 'DUAL REFLECT™', sub: 'CONTROLE SOLAR REFLETIVO', accent: '0x93C5FD' },
  { name: 'og-blackpro', title: 'BLACKPRO™', sub: 'PRIVACIDADE ARQUITETÔNICA', accent: '0xA1A1AA' },
  { name: 'og-securityblind', title: 'SECURITYBLINDER™', sub: 'SAFETY & SECURITY FILM', accent: '0xDC2626' },
  { name: 'og-miniblind-venetian', title: 'MINIBLIND & VENETIAN™', sub: 'PELÍCULA DECORATIVA', accent: '0x14B8A6' },
  { name: 'og-shop', title: 'WINF BLACKSHOP™', sub: 'MERCHANDISING OFICIAL', accent: '0xFAFAFA' },
  { name: 'og-blog', title: 'WINF JOURNAL™', sub: 'ENGENHARIA · TECNOLOGIA · DESIGN', accent: '0xFAFAFA' },
];

let fail = 0;
for (const b of BANNERS) {
  const filters = [
    `gradients=s=1200x630:c0=0x09090B:c1=0x1B1B20:x0=0:y0=0:x1=0:y1=630`,
    ...chrome(b.accent),
    drawTitle(b.title, 236, b.title.length > 15 ? 92 : 116),
    drawSub(b.sub, 400, b.accent === '0xFAFAFA' ? '0xD4D4D8' : b.accent),
  ].join(',');
  const out = join(OUT, `${b.name}.png`);
  const res = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', filters, '-frames:v', '1', out], { shell: false });
  if (res.status !== 0 || !existsSync(out)) { fail++; console.error(`FAIL ${b.name}:`, res.stderr?.toString().slice(0, 300)); }
  else console.log('ok', b.name);
}

// Article covers → center-crop to 1200x630 OG banners
const covers = [
  ['rejeicao-infravermelha', 'dualreflect-poster-1'],
  ['blindagem-transparente', 'securityblind/scene-07'],
  ['privacidade-arquitetonica', 'blackpro-poster-1'],
  ['ceramica-nanometrica', 'invisible-poster-1'],
  ['persianas-no-vidro', 'miniblind-venetian/scene-03'],
  ['ppf-armadura-invisivel', 'neoskin-hero'],
];
for (const [slug, img] of covers) {
  const src = join(ROOT, 'public', 'images', `${img}.png`);
  const out = join(OUT, `og-artigo-${slug}.png`);
  const res = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', src, '-vf', 'scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630', '-frames:v', '1', out], { shell: false });
  if (res.status !== 0 || !existsSync(out)) { fail++; console.error(`FAIL artigo ${slug}:`, res.stderr?.toString().slice(0, 300)); }
  else console.log('ok', `og-artigo-${slug}`);
}

console.log(fail ? `DONE with ${fail} failures` : 'DONE all banners');
