#!/usr/bin/env node
/* ===============================================================
 * build-cases.js
 *   读取 data/cases.json + case-template.html
 *   生成：
 *     · case-{slug}.html   — 每个案例独立详情页（SEO 主战场）
 *     · cases.html         — 列表页（注入卡片网格 + 时间轴 + JSON-LD ItemList）
 *     · sitemap.xml        — 追加案例页 URL
 *     · services.html      — 注入"代表案例"反向引用
 *     · team-*.html        — 注入"主办案例"反向引用（按 lawyers 字段）
 *
 *   用法：    node build-cases.js
 *   零依赖（仅使用 Node.js 内置模块）。
 * =============================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'cases.json');
const TEMPLATE_FILE = path.join(ROOT, 'case-template.html');
const CASES_LIST_FILE = path.join(ROOT, 'cases.html');
const SERVICES_FILE = path.join(ROOT, 'services.html');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');
const SITE_BASE = 'https://www.kangruilaw.com';

// ----------- maps ------------
const AREA_NAMES = {
  '01': '确权争议',
  '02': '诉讼维权',
  '03': '调查取证',
  '04': '风控布局',
  '05': '许可交易',
  '06': '战略咨询',
};
const RIGHT_NAMES = {
  patent: '专利',
  trademark: '商标',
  copyright: '著作权',
  'trade-secret': '商业秘密',
  competition: '反不正当竞争',
  domain: '域名',
};
const OUTCOME_BADGE_CLASS = {
  '胜诉': 'case-badge--win',
  '部分胜诉': 'case-badge--win',
  '和解': 'case-badge--settle',
  '全部无效': 'case-badge--invalidate',
  '维持有效': 'case-badge--invalidate',
  '驳回起诉': 'case-badge--win',
  '仲裁支持': 'case-badge--win',
  '刑事查处': 'case-badge--win',
  '全面化解': 'case-badge--win',
};

// ----------- helpers ------------
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function paragraphs(arr) {
  if (!Array.isArray(arr)) return '';
  return arr.map(p => p.startsWith('<p') ? p : `<p>${p}</p>`).join('\n          ');
}
function issuesHtml(issues) {
  if (!Array.isArray(issues)) return '';
  return issues.map(it => `<li><h4>${esc(it.title)}</h4><p>${it.body}</p></li>`).join('\n          ');
}
function injectBlock(text, marker, content) {
  const re = new RegExp(`<!-- BUILD:${marker} -->[\\s\\S]*?<!-- /BUILD:${marker} -->`, 'g');
  return text.replace(re, `<!-- BUILD:${marker} -->\n${content}\n      <!-- /BUILD:${marker} -->`);
}

function badge(html, cls = '') {
  return `<span class="case-badge ${cls}">${html}</span>`;
}

function lawyerInitial(slug) {
  // pinyin slugs like "ren-xiaodong" → "任"
  const map = {
    'ren-xiaodong': '任', 'wu-qiong': '吴', 'wu-mengqiu': '吴',
    'wang-chun': '王', 'tong-yanyan': '佟', 'sun-xiaobin': '孙',
    'guo-chao': '郭', 'rong-yifei': '荣', 'xue-yupu': '薛',
    'yan-shengqi': '严', 'wu-guiming': '吴',
  };
  return map[slug] || slug.charAt(0).toUpperCase();
}
function lawyerName(slug) {
  const map = {
    'ren-xiaodong': '任晓东', 'wu-qiong': '吴琼', 'wu-mengqiu': '吴梦秋',
    'wang-chun': '王春', 'tong-yanyan': '佟燕燕', 'sun-xiaobin': '孙晓斌',
    'guo-chao': '郭超', 'rong-yifei': '荣逸菲', 'xue-yupu': '薛玉璞',
    'yan-shengqi': '严晟齐', 'wu-guiming': '吴桂明',
  };
  return map[slug] || slug;
}

// ----------- card renderer (used in list, related) ------------
function caseCard(c, opts = {}) {
  const areas = (c.practice_areas || []).map(a => `<span class="tag area-${a}">${AREA_NAMES[a] || a}</span>`).join('');
  const rights = (c.right_types || []).map(r => `<span class="tag">${RIGHT_NAMES[r] || r}</span>`).join('');
  const industries = (c.industries || []).map(i => `<span class="tag">${esc(i)}</span>`).join('');
  const flagshipBadge = c.featured ? `<span class="case-badge case-badge--flagship">★ 标杆</span>` : '';
  const outcomeBadge = `<span class="case-badge ${OUTCOME_BADGE_CLASS[c.outcome] || ''}">${esc(c.outcome)}</span>`;
  const dataRight = (c.right_types || []).join(' ');
  const dataArea = (c.practice_areas || []).join(' ');

  const yearStr = c.year_range ? esc(c.year_range) : esc(c.year);

  // Cover: photo (if cover_image provided) overlays the gradient + glyph
  const coverStyle = c.cover_image ? ` style="background-image:url('${c.cover_image}')"` : '';
  const coverPhotoClass = c.cover_image ? ' case-card__cover--photo' : '';
  const glyphHtml = c.cover_image
    ? `<div class="case-card__cover-glyph">${esc(c.cover_glyph || '')}</div>`
    : `<div class="case-card__cover-art">${esc(c.cover_glyph || '')}</div>`;

  return `
        <a class="case-card${c.featured ? ' case-card--flagship' : ''}" href="case-${c.slug}.html"
           data-area="${dataArea}" data-right="${dataRight}" data-year="${esc(c.year)}">
          <div class="case-card__cover case-card__cover--${c.cover_variant || 'art-01'}${coverPhotoClass}"${coverStyle}>
            ${glyphHtml}
            <div class="case-card__badges">
              ${flagshipBadge}${outcomeBadge}
            </div>
            <div class="case-card__year">${yearStr}</div>
          </div>
          <div class="case-card__body">
            <div class="case-card__meta">${areas}${rights}${industries}</div>
            <h3 class="case-card__title">${esc(c.title)}</h3>
            <p class="case-card__lede">${esc(c.lede)}</p>
            <div class="case-card__foot">
              <span class="case-card__foot-court">${esc((c.court || '').split('·')[0].trim() || c.instance || '康瑞代理')}</span>
              <span class="case-card__more">查看详情 →</span>
            </div>
          </div>
        </a>`;
}

// ----------- timeline strip ------------
function timelineHtml(cases) {
  // Choose featured cases sorted by year ASC for the rail
  const items = cases
    .filter(c => c.featured)
    .slice()
    .sort((a, b) => Number(a.year) - Number(b.year));
  const railItems = items.map(c => `
      <a class="timeline-item" href="case-${c.slug}.html">
        <span class="timeline-item__year">${c.year_range ? esc(c.year_range) : esc(c.year)}</span>
        <span class="timeline-item__dot timeline-item__dot--gold"></span>
        <div class="timeline-item__title">${esc(c.title.split(' —— ')[0])}</div>
        <span class="timeline-item__tag">${esc((c.tags || ['标杆'])[0])}</span>
      </a>`).join('');
  // "至今 / NOW" terminator — visually communicates ongoing practice
  const now = `
      <div class="timeline-now" aria-hidden="true">
        <span class="timeline-now__year">NOW</span>
        <span class="timeline-now__dot"></span>
        <span class="timeline-now__label">至今</span>
      </div>`;
  return railItems + now;
}

// ----------- detail-page lawyers block ------------
function asideLawyersHtml(lawyers) {
  if (!lawyers || lawyers.length === 0) {
    return `<p class="case-aside__lawyer-tba">本案由康瑞团队代理。主办律师信息整理后将在此显示，敬请期待。</p>`;
  }
  return `<div class="case-aside__lawyers">${
    lawyers.map(slug => `
        <a class="case-aside__lawyer" href="team-${slug}.html">
          <span class="case-aside__lawyer-avatar">${lawyerInitial(slug)}</span>
          <div>
            <div class="case-aside__lawyer-name">${lawyerName(slug)}</div>
            <div class="case-aside__lawyer-role">主办律师</div>
          </div>
        </a>`).join('')
  }</div>`;
}

// ----------- detail-page rendering ------------
function renderDetail(c, allCases, template) {
  // Hero badges
  const heroBadges = [
    c.featured ? badge('★ 标杆案件', 'case-badge--flagship') : '',
    badge(esc(c.outcome), OUTCOME_BADGE_CLASS[c.outcome] || ''),
    badge(esc(c.instance.split(' / ')[0])),
  ].filter(Boolean).join('');

  const asideAreas = (c.practice_areas || [])
    .map(a => `<a class="case-aside__pill" href="services.html#area-${a}">${AREA_NAMES[a]}</a>`).join('');
  const asideRights = (c.right_types || [])
    .map(r => `<span class="case-aside__pill">${RIGHT_NAMES[r] || r}</span>`).join('');
  const asideIndustries = (c.industries || [])
    .map(i => `<span class="case-aside__pill">${esc(i)}</span>`).join('');

  // Related cases: use explicit list, else auto by area
  let related = [];
  if (Array.isArray(c.related_cases) && c.related_cases.length) {
    related = c.related_cases.map(id => allCases.find(x => x.id === id)).filter(Boolean);
  } else {
    related = allCases
      .filter(x => x.id !== c.id)
      .filter(x => (x.practice_areas || []).some(a => (c.practice_areas || []).includes(a)))
      .slice(0, 3);
  }
  related = related.slice(0, 3);
  const relatedHtml = related.map(r => caseCard(r)).join('');

  // JSON-LD
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE_BASE}/case-${c.slug}.html#article`,
        "headline": c.title,
        "description": c.abstract || c.lede,
        "datePublished": c.last_updated || "2026-01-01",
        "dateModified": c.last_updated || "2026-01-01",
        "inLanguage": "zh-CN",
        "url": `${SITE_BASE}/case-${c.slug}.html`,
        "author": { "@type": "Organization", "name": "北京康瑞律师事务所", "url": SITE_BASE },
        "publisher": {
          "@type": "Organization",
          "name": "北京康瑞律师事务所",
          "logo": { "@type": "ImageObject", "url": `${SITE_BASE}/assets/images/logo.jpg` }
        },
        "about": (c.practice_areas || []).map(a => AREA_NAMES[a]).join(' / '),
        "keywords": [
          ...(c.industries || []),
          ...(c.right_types || []).map(r => RIGHT_NAMES[r] || r),
          ...(c.tags || []),
        ].join(','),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "首页", "item": SITE_BASE + "/" },
          { "@type": "ListItem", "position": 2, "name": "案例典藏", "item": SITE_BASE + "/cases.html" },
          { "@type": "ListItem", "position": 3, "name": c.title }
        ]
      }
    ]
  };

  const metaTitle = `${c.title} | 案例典藏 · 康瑞律师事务所 KANGRUI`;
  const metaDesc = c.abstract.replace(/<[^>]+>/g, '').slice(0, 155);
  const metaKeywords = [
    ...(c.industries || []),
    ...(c.right_types || []).map(r => RIGHT_NAMES[r] || r),
    ...(c.tags || []),
    '康瑞律师事务所',
    '知识产权代表案例'
  ].join(',');

  const replacements = {
    '{{SLUG}}': c.slug,
    '{{TITLE}}': esc(c.title),
    '{{LEDE}}': esc(c.lede),
    '{{ABSTRACT}}': esc(metaDesc),
    '{{META_TITLE}}': esc(metaTitle),
    '{{META_DESC}}': esc(metaDesc),
    '{{META_KEYWORDS}}': esc(metaKeywords),
    '{{JSONLD}}': JSON.stringify(jsonld, null, 2),
    '{{HERO_BG_STYLE}}': c.cover_image ? `background-image:url('${c.cover_image}')` : '',
    '{{CRUMB_AREA}}': esc((c.practice_areas || []).map(a => AREA_NAMES[a]).join(' · ') || '案例'),
    '{{HERO_BADGES}}': heroBadges,
    '{{KPI_OUTCOME}}': esc(c.outcome),
    '{{KPI_INSTANCE}}': esc(c.instance),
    '{{KPI_COURT}}': esc((c.court || '').split('·')[0].trim() || '—'),
    '{{KPI_YEAR}}': esc(c.year_range || c.year),
    '{{BACKGROUND}}': paragraphs(c.background),
    '{{ISSUES}}': issuesHtml(c.issues),
    '{{STRATEGY}}': paragraphs(c.strategy),
    '{{OUTCOME}}': paragraphs(c.outcome_text),
    '{{IMPACT}}': paragraphs(c.impact),
    '{{ASIDE_AREAS}}': asideAreas,
    '{{ASIDE_RIGHTS}}': asideRights,
    '{{ASIDE_INDUSTRY}}': asideIndustries,
    '{{ASIDE_LAWYERS}}': asideLawyersHtml(c.lawyers),
    '{{ASIDE_TAKEAWAY}}': esc(c.takeaway || ''),
    '{{RELATED_CASES}}': relatedHtml,
  };

  let out = template;
  for (const [k, v] of Object.entries(replacements)) {
    out = out.split(k).join(v);
  }
  return out;
}

// ----------- list page assembly ------------
function buildListPage(cases) {
  const html = fs.readFileSync(CASES_LIST_FILE, 'utf-8');

  // Card grid (featured first, then year DESC)
  const sorted = cases.slice().sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return Number(b.year) - Number(a.year);
  });
  const grid = sorted.map(c => caseCard(c)).join('');

  // Timeline strip
  const tl = timelineHtml(cases);

  // ItemList JSON-LD (regenerate <script id="cases-jsonld">)
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "康瑞律师事务所 · 案例典藏",
    "url": SITE_BASE + "/cases.html",
    "inLanguage": "zh-CN",
    "isPartOf": { "@type": "WebSite", "url": SITE_BASE + "/", "name": "康瑞律师事务所 KANGRUI" },
    "publisher": {
      "@type": "Organization",
      "name": "北京康瑞律师事务所",
      "logo": { "@type": "ImageObject", "url": SITE_BASE + "/assets/images/logo.jpg" }
    },
    "description": "康瑞律师事务所代表性知识产权案件汇编。客户名称已做脱敏处理。",
    "mainEntity": {
      "@type": "ItemList",
      "name": "康瑞代表案例",
      "numberOfItems": cases.length,
      "itemListElement": cases.map((c, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": SITE_BASE + "/case-" + c.slug + ".html",
        "name": c.title,
      }))
    }
  };

  let out = html;
  out = injectBlock(out, 'CASES-GRID', grid);
  out = injectBlock(out, 'CASES-TIMELINE', tl);
  out = out.replace(
    /<script type="application\/ld\+json" id="cases-jsonld">[\s\S]*?<\/script>/,
    '<script type="application/ld+json" id="cases-jsonld">\n' + JSON.stringify(itemList, null, 2) + '\n</script>'
  );
  return out;
}

// ----------- services.html "代表案例" injection ------------
function buildServicesInjections(cases) {
  let html = fs.readFileSync(SERVICES_FILE, 'utf-8');
  for (const code of Object.keys(AREA_NAMES)) {
    const matched = cases
      .filter(c => (c.practice_areas || []).includes(code))
      .sort((a, b) => Number(b.year) - Number(a.year))
      .slice(0, 4);

    const isLight = code === '02' || code === '04' || code === '06'; // matches services.html area--light
    const items = matched.map(c => `
        <a class="cases-ref__item" href="case-${c.slug}.html">
          <span class="cases-ref__item-year">${esc(c.year_range || c.year)}</span>
          <span class="cases-ref__item-title">${esc(c.title)}</span>
          <span class="cases-ref__item-arrow">→</span>
        </a>`).join('');

    const block = items ? `
      <div class="cases-ref">
        <div class="cases-ref__head">
          <div>
            <span class="cases-ref__title-en">Representative Matters</span>
            <h3 class="cases-ref__title">代表案例</h3>
          </div>
          <a href="cases.html" class="cases-ref__view-all">浏览全部案例 →</a>
        </div>
        <div class="cases-ref__list">${items}
        </div>
      </div>` : '';

    html = injectBlock(html, `CASES-BY-AREA-${code}`, block);
  }
  return html;
}

// ----------- team-{slug}.html "主办案例" injection ------------
function buildTeamInjections(cases) {
  // Map lawyer slug → array of cases
  const byLawyer = {};
  cases.forEach(c => (c.lawyers || []).forEach(l => {
    (byLawyer[l] = byLawyer[l] || []).push(c);
  }));
  const updates = {};
  fs.readdirSync(ROOT)
    .filter(f => f.startsWith('team-') && f.endsWith('.html'))
    .forEach(f => {
      const slug = f.replace(/^team-/, '').replace(/\.html$/, '');
      const file = path.join(ROOT, f);
      let html = fs.readFileSync(file, 'utf-8');
      const list = (byLawyer[slug] || []).slice(0, 5);
      const items = list.map(c => `
            <a class="cases-ref__item" href="case-${c.slug}.html">
              <span class="cases-ref__item-year">${esc(c.year_range || c.year)}</span>
              <span class="cases-ref__item-title">${esc(c.title)}</span>
              <span class="cases-ref__item-arrow">→</span>
            </a>`).join('');
      const block = items ? `
        <article class="profile-section">
          <h2>主办案例</h2>
          <div class="cases-ref">
            <div class="cases-ref__list">${items}
            </div>
            <div style="margin-top:18px;">
              <a href="cases.html" class="link-arrow small">浏览全部案例 <span>→</span></a>
            </div>
          </div>
        </article>` : '';
      if (html.includes(`<!-- BUILD:CASES-BY-LAWYER:${slug} -->`)) {
        html = injectBlock(html, `CASES-BY-LAWYER:${slug}`, block);
        updates[file] = html;
      }
    });
  return updates;
}

// ----------- sitemap update ------------
function buildSitemap(cases) {
  let xml = '';
  try { xml = fs.readFileSync(SITEMAP_FILE, 'utf-8'); }
  catch { xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`; }

  // Strip any prior <!-- CASES-BUILD --> ... <!-- /CASES-BUILD --> block
  xml = xml.replace(/[ \t]*<!-- CASES-BUILD -->[\s\S]*?<!-- \/CASES-BUILD -->\n?/g, '');

  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    `  <url><loc>${SITE_BASE}/cases.html</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    ...cases.map(c => `  <url><loc>${SITE_BASE}/case-${c.slug}.html</loc><lastmod>${c.last_updated || today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
  ].join('\n');

  const block = `  <!-- CASES-BUILD -->\n${entries}\n  <!-- /CASES-BUILD -->\n`;
  // Insert before </urlset>
  if (xml.includes('</urlset>')) {
    xml = xml.replace('</urlset>', block + '</urlset>');
  } else {
    xml += `\n${block}`;
  }
  return xml;
}

// ============================================================
// RUN
// ============================================================
function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const cases = data.cases || [];
  console.log(`✓ Loaded ${cases.length} cases from data/cases.json`);

  // 1. Detail pages
  const tpl = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
  for (const c of cases) {
    const out = renderDetail(c, cases, tpl);
    const file = path.join(ROOT, `case-${c.slug}.html`);
    fs.writeFileSync(file, out);
    console.log(`  · case-${c.slug}.html`);
  }

  // 2. List page
  fs.writeFileSync(CASES_LIST_FILE, buildListPage(cases));
  console.log(`✓ cases.html updated`);

  // 3. services.html injections
  fs.writeFileSync(SERVICES_FILE, buildServicesInjections(cases));
  console.log(`✓ services.html updated`);

  // 4. team-*.html injections
  const teamUpdates = buildTeamInjections(cases);
  for (const [f, html] of Object.entries(teamUpdates)) {
    fs.writeFileSync(f, html);
    console.log(`  · ${path.basename(f)}`);
  }

  // 5. sitemap
  fs.writeFileSync(SITEMAP_FILE, buildSitemap(cases));
  console.log(`✓ sitemap.xml updated`);

  console.log(`\nDone.`);
}

main();
s.html injections
  fs.writeFileSync(SERVICES_FILE, buildServicesInjections(cases));
  console.log(`✓ services.html updated`);

  // 4. team-*.html injections
  const teamUpdates = buildTeamInjections(cases);
  for (const [f, html] of Object.entries(teamUpdates)) {
    fs.writeFileSync(f, html);
    console.log(`  · ${path.basename(f)}`);
  }

  // 5. sitemap
  fs.writeFileSync(SITEMAP_FILE, buildSitemap(cases));
  console.log(`✓ sitemap.xml updated`);

  console.log(`\nDone.`);
}

main();
injections
  const teamUpdates = buildTeamInjections(cases);
  for (const [f, html] of Object.entries(teamUpdates)) {
    fs.writeFileSync(f, html);
    console.log(`  · ${path.basename(f)}`);
  }

  // 5. sitemap
  fs.writeFileSync(SITEMAP_FILE, buildSitemap(cases));
  console.log(`✓ sitemap.xml updated`);

  console.log(`\nDone.`);
}

main();
