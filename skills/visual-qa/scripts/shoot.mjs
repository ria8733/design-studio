#!/usr/bin/env node
/**
 * Visual QA — captures réelles + audit du DOM rendu.
 *
 * Usage:
 *   node .claude/skills/visual-qa/scripts/shoot.mjs <url|fichier.html> [options]
 *
 * Options:
 *   --out <dir>        dossier de sortie          (défaut: design/qa/<horodatage>)
 *   --viewports a,b    mobile,tablet,desktop      (défaut: mobile,desktop)
 *   --wait <ms>        attente après chargement   (défaut: 600)
 *   --dark             force prefers-color-scheme: dark
 *   --selector <css>   attend ce sélecteur avant de capturer
 *
 * Sortie: PNG pleine page par viewport + report.json + résumé console.
 */

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, isAbsolute, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';

// --- résolution de Playwright (local au projet, sinon global) -----------------
function loadPlaywright() {
  const req = createRequire(import.meta.url);
  const candidates = [];
  try {
    candidates.push(execSync('npm root -g', { encoding: 'utf8' }).trim());
  } catch {}
  candidates.push('/opt/node22/lib/node_modules', '/usr/lib/node_modules');
  try {
    return req('playwright');
  } catch {}
  for (const root of candidates) {
    try {
      return req(join(root, 'playwright'));
    } catch {}
  }
  console.error(
    'Playwright introuvable.\n' +
      '  Projet : npm i -D playwright && npx playwright install chromium\n' +
      '  Global : npm i -g playwright'
  );
  process.exit(2);
}

// --- arguments ---------------------------------------------------------------
const argv = process.argv.slice(2);
if (!argv.length || argv[0].startsWith('--')) {
  console.error('Usage: shoot.mjs <url|fichier.html> [--out dir] [--viewports mobile,tablet,desktop] [--wait ms] [--dark] [--selector css]');
  process.exit(1);
}
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
};
const has = (name) => argv.includes(`--${name}`);

const target = argv[0];
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = resolve(flag('out', join('design', 'qa', stamp)));
const waitMs = Number(flag('wait', 600));
const selector = flag('selector', null);
const dark = has('dark');

const VIEWPORTS = {
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, label: 'mobile · 390×844' },
  tablet: { width: 834, height: 1112, deviceScaleFactor: 2, isMobile: true, label: 'tablet · 834×1112' },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, label: 'desktop · 1440×900' },
};
const chosen = flag('viewports', 'mobile,desktop')
  .split(',')
  .map((v) => v.trim())
  .filter((v) => VIEWPORTS[v]);
if (!chosen.length) {
  console.error('Aucun viewport valide. Valeurs possibles: mobile, tablet, desktop.');
  process.exit(1);
}

const url = /^https?:\/\//.test(target)
  ? target
  : pathToFileURL(isAbsolute(target) ? target : resolve(target)).href;
if (!/^https?:/.test(url) && !existsSync(resolve(target))) {
  console.error(`Fichier introuvable: ${target}`);
  process.exit(1);
}

// --- audit exécuté dans la page ---------------------------------------------
/* eslint-disable no-undef */
function auditInPage() {
  const MIN_TAP = 44;
  const MIN_FONT = 12;

  const srgb = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const parse = (str) => {
    const m = String(str).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = (c) => 0.2126 * srgb(c.r) + 0.7152 * srgb(c.g) + 0.0722 * srgb(c.b);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const blend = (fg, bg) =>
    fg.a >= 1 ? fg : { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 };

  const effectiveBg = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0.95) return c;
      node = node.parentElement;
    }
    const body = parse(getComputedStyle(document.body).backgroundColor);
    return body && body.a > 0.5 ? body : { r: 255, g: 255, b: 255, a: 1 };
  };

  const path = (el) => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && parts.length < 4) {
      let s = n.tagName.toLowerCase();
      if (n.id) { parts.unshift(`${s}#${n.id}`); break; }
      const cls = (n.className && typeof n.className === 'string' ? n.className.trim().split(/\s+/)[0] : '');
      if (cls) s += `.${cls}`;
      parts.unshift(s);
      n = n.parentElement;
    }
    return parts.join(' > ');
  };

  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const docW = document.documentElement.clientWidth;
  const out = {
    overflowX: document.documentElement.scrollWidth > docW + 1,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: docW,
    overflowing: [],
    lowContrast: [],
    tinyText: [],
    smallTapTargets: [],
    missingAltText: [],
    unnamedControls: [],
    headingOrder: [],
    slop: {},
  };

  const all = Array.from(document.querySelectorAll('body *')).filter(visible);

  // débordements horizontaux
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > docW + 2 || r.left < -2)) {
      const p = el.parentElement;
      if (p && p.getBoundingClientRect().right > docW + 2) continue; // ne garder que la racine du débordement
      out.overflowing.push({ el: path(el), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) });
    }
  }

  const fontSizes = new Set(), colors = new Set(), radii = new Set(), shadows = new Set();
  let gradientCount = 0, cardish = 0, blurCount = 0;

  for (const el of all) {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();

    if (s.backgroundImage && s.backgroundImage.includes('gradient')) gradientCount++;
    if (s.backdropFilter && s.backdropFilter !== 'none') blurCount++;
    if (parseFloat(s.borderRadius) > 0) radii.add(s.borderTopLeftRadius);
    if (s.boxShadow && s.boxShadow !== 'none') shadows.add(s.boxShadow);
    if (parseFloat(s.borderRadius) >= 8 && (s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0) && r.width > 120 && r.height > 80) cardish++;

    // texte direct uniquement
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
    if (own) {
      const size = parseFloat(s.fontSize);
      fontSizes.add(`${Math.round(size)}/${s.fontWeight}`);
      colors.add(s.color);
      if (size < MIN_FONT) out.tinyText.push({ el: path(el), size: Math.round(size), text: el.textContent.trim().slice(0, 40) });
      const fg = parse(s.color);
      if (fg && fg.a > 0.05) {
        const bg = effectiveBg(el);
        const cr = ratio(blend(fg, bg), bg);
        const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
        const min = large ? 3 : 4.5;
        if (cr < min) {
          out.lowContrast.push({ el: path(el), ratio: Number(cr.toFixed(2)), required: min, size: Math.round(size), color: s.color, text: el.textContent.trim().slice(0, 40) });
        }
      }
    }
  }

  // cibles tactiles
  for (const el of document.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="link"], [role="tab"], [onclick]')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < MIN_TAP || r.height < MIN_TAP) {
      out.smallTapTargets.push({ el: path(el), w: Math.round(r.width), h: Math.round(r.height), text: (el.textContent || '').trim().slice(0, 30) });
    }
  }

  // accessibilité de base
  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) out.missingAltText.push({ el: path(img), src: (img.currentSrc || img.src || '').slice(-60) });
  }
  for (const el of document.querySelectorAll('a, button, [role="button"]')) {
    if (!visible(el)) continue;
    const name = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim();
    if (!name) out.unnamedControls.push({ el: path(el) });
  }

  let last = 0;
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    if (!visible(h)) continue;
    const lvl = Number(h.tagName[1]);
    if (last && lvl > last + 1) out.headingOrder.push({ el: path(h), from: `h${last}`, to: `h${lvl}`, text: h.textContent.trim().slice(0, 40) });
    last = lvl;
  }

  out.slop = {
    distinctFontSizes: fontSizes.size,
    distinctTextColors: colors.size,
    distinctRadii: radii.size,
    distinctShadows: shadows.size,
    gradientElements: gradientCount,
    backdropBlurElements: blurCount,
    cardLikeBlocks: cardish,
    h1Count: document.querySelectorAll('h1').length,
    textNodes: document.body.innerText.trim().length,
  };
  return out;
}
/* eslint-enable no-undef */

// --- exécution ---------------------------------------------------------------
const { chromium } = loadPlaywright();
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const report = { target: url, generatedAt: new Date().toISOString(), outDir, viewports: {} };
const consoleErrors = [];

for (const key of chosen) {
  const vp = VIEWPORTS[key];
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    colorScheme: dark ? 'dark' : 'light',
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[${key}] ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => consoleErrors.push(`[${key}] ${String(e).slice(0, 200)}`));

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  }
  if (selector) await page.waitForSelector(selector, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(waitMs);

  const shot = join(outDir, `${key}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const fold = join(outDir, `${key}-fold.png`);
  await page.screenshot({ path: fold, fullPage: false });

  const audit = await page.evaluate(auditInPage);
  report.viewports[key] = { ...vp, screenshot: shot, aboveFold: fold, audit };
  await ctx.close();
}
report.consoleErrors = consoleErrors;
await browser.close();

writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));

// --- résumé console ----------------------------------------------------------
const line = (n, s) => console.log(`  ${n.toString().padStart(3)}  ${s}`);
console.log(`\n▸ Visual QA — ${url}`);
console.log(`  sortie: ${outDir}\n`);
let blocking = 0;
for (const key of chosen) {
  const { audit, label, screenshot } = report.viewports[key];
  console.log(`── ${label}`);
  console.log(`  capture: ${screenshot}`);
  if (audit.overflowX) {
    blocking++;
    console.log(`  ⛔ DÉBORDEMENT HORIZONTAL : scrollWidth ${audit.scrollWidth} > viewport ${audit.clientWidth}`);
  }
  const issues = [
    ['éléments hors viewport', audit.overflowing],
    ['contraste insuffisant', audit.lowContrast],
    ['texte < 12px', audit.tinyText],
    ['cibles tactiles < 44px', audit.smallTapTargets],
    ['images sans alt', audit.missingAltText],
    ['contrôles sans nom accessible', audit.unnamedControls],
    ['sauts de niveau de titre', audit.headingOrder],
  ];
  for (const [label2, arr] of issues) {
    if (!arr.length) continue;
    blocking += arr.length;
    line(arr.length, label2);
    for (const it of arr.slice(0, 4)) console.log(`         ${JSON.stringify(it)}`);
    if (arr.length > 4) console.log(`         … +${arr.length - 4}`);
  }
  const s = audit.slop;
  console.log(`  signaux: ${s.distinctFontSizes} tailles de texte · ${s.distinctTextColors} couleurs de texte · ${s.distinctRadii} radius · ${s.distinctShadows} ombres · ${s.gradientElements} gradients · ${s.cardLikeBlocks} blocs type card · h1×${s.h1Count}`);
  const warn = [];
  if (s.distinctFontSizes > 10) warn.push(`échelle typo dispersée (${s.distinctFontSizes})`);
  if (s.distinctRadii > 4) warn.push(`radius incohérents (${s.distinctRadii})`);
  if (s.distinctShadows > 4) warn.push(`ombres incohérentes (${s.distinctShadows})`);
  if (s.gradientElements > 6) warn.push(`gradients en excès (${s.gradientElements})`);
  if (s.cardLikeBlocks > 12) warn.push(`mur de cards (${s.cardLikeBlocks})`);
  if (s.h1Count !== 1) warn.push(`h1 × ${s.h1Count} (attendu : 1)`);
  if (warn.length) console.log(`  ⚠ anti-slop: ${warn.join(' · ')}`);
  console.log('');
}
if (consoleErrors.length) {
  console.log(`── erreurs console (${consoleErrors.length})`);
  consoleErrors.slice(0, 8).forEach((e) => console.log(`  ${e}`));
  console.log('');
}
console.log(blocking ? `▸ ${blocking} problème(s) à traiter. Lis les PNG avant de conclure.` : '▸ Aucun problème automatique détecté — le jugement visuel reste à faire sur les PNG.');
