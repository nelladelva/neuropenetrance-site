# neuropenetrance.com Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild neuropenetrance.com in the "Clinical clarity" style, leading with Engine 2 and the app, with partner and researcher paths, a full German version, and German legal pages.

**Architecture:** Page bodies live as HTML fragments per language in `src/pages/{en,de}/`. A zero-config Node build script (`tools/build.mjs`) wraps each fragment in the shared layout (head, header, footer) and writes static HTML to the repo root (EN) and `/de/` (DE), which GitHub Pages serves unchanged. A Node test suite (`node --test`) builds the site and checks the generated files.

**Tech Stack:**
- Node 22 (built-in test runner, no test framework)
- plain HTML/CSS/JS
- `@fontsource-variable/inter` and `@fontsource/ibm-plex-mono` (self-hosted fonts)
- headless Chrome for app screenshots
- GitHub Pages with custom domain

**Spec:** `docs/superpowers/specs/2026-10-18-website-redesign-design.md` (approved 2026-10-18, including the research layer). Mockup: `docs/superpowers/specs/mockups/home-direction-A.html` (direction A).

## Global Constraints

- **Palette:**
  - navy `#0D2438`, teal `#0B6E79`, slate text `#4C5D6E`
  - light panel `#F3F6F9`, lines `#E3E8EE`, white background
  - amber `#E1A33D` only for Research Use Only badges
- **Logo:** keeps its branching shape (dark node + teal branch); the cherry red goes away.
- **Type:** Inter (text and headings), IBM Plex Mono (uppercase eyebrows and labels). Self-hosted; **no request to fonts.googleapis.com / fonts.gstatic.com**.
- **Header nav on every page:** Platform · Evidence · For partners · For researchers · Science · Team, plus EN·DE switch, "Open the app ↗" (`https://neuropenetrance.streamlit.app`, new tab) and "Partner with us" (→ For partners).
- **Contact email everywhere:** `partnerships@neuropenetrance.com`. The string `stemazing.advancement@gmail.com` must not appear.
- **Forms:** POST to `https://formspree.io/f/xeaqbkzb` (works without JavaScript; the existing AJAX submit stays as an enhancement).
- **Honest wording:**
  - tested = "identify / stratify" (AUC 0.61 on 7 unseen studies, above chance in 8/8)
  - "predict disease development and treatment response" only as what we do with partners' data, or as the goal
  - never "validated", never "0.772", never "predicts who will develop"
- **Data wording:** whole-blood gene expression (RNA), microarrays and RNA-seq, 8 public GEO studies, 779 people. Not DNA, not proteomics.
- **Team page content and Evidence numbers are unchanged** (Nella).
- **German:** every EN page has a DE page at `/de/<same file>`. Each page sets `<html lang>`, a `hreflang` en/de/x-default pair, and a switch to the same page in the other language.
- Impressum and Datenschutz: German first, English versions linked. The Impressum uses placeholders: `[Full legal name]`, `[Street and number]`, `[Postcode City]`, `Germany`, `partnerships@neuropenetrance.com`, with a visible "to be completed" note.
- WCAG AA contrast, keyboard navigation, no horizontal scroll at 360 px. No cookies, no analytics.
- Hosting stays on GitHub Pages (`CNAME` = `neuropenetrance.com`); no build step on GitHub. The generated HTML is committed.

## Review Focus

1. **A visitor on a phone (360–390 px)** sees a working menu and no sideways scrolling. → Task 1 test `every page has viewport meta and menu button`; Task 8 screenshot check at 390 px.
2. **Switching language on any page** lands on the same page in the other language, not the home page. → Task 1 test `language switch points to the same page`.
3. **Old links shared in emails and LinkedIn** (`problem.html`, `idea.html`, `impact.html`, `involved.html`, `neuropenetrance-de.html`) still lead somewhere sensible. → Task 7 test `old URLs redirect`.
4. **Someone submitting a form with JavaScript blocked** (corporate browsers) still reaches Formspree, and spam bots are filtered. → Task 5 test `forms post to formspree with required fields and honeypot`.
5. **An overclaim or the old Gmail address slipping back** into any page, EN or DE. → Task 7 test `no forbidden phrases on any page`.

---

## File Structure

```
package.json                    devDependencies: @fontsource-variable/inter, @fontsource/ibm-plex-mono; scripts build/test
tools/build.mjs                 build(): reads src/pages/{en,de}/*.html, writes ./<page>.html and ./de/<page>.html
tools/layout.mjs                renderPage({ lang, slug, title, description, body }): string (head, header, footer)
tools/i18n.mjs                  UI strings for header/footer per language (nav labels, buttons, footer)
tools/site.test.mjs             node:test checks on the generated site
tools/snapshots/                team.en.txt, evidence.en.txt (text of today's pages, used by the "unchanged" tests)
src/pages/en/*.html             page body fragments; first line: <!-- title: … | description: … -->
src/pages/de/*.html             German fragments, same file names
assets/css/site.css             direction A theme (replaces style.css)
assets/fonts/                   copied woff2 files
assets/img/                     app screenshots, og-image.png, favicon
script.js                       kept: menu toggle, AUC bars, tabs, Formspree AJAX
<page>.html, de/<page>.html     generated output (committed)
```

Pages (slugs): `index`, `platform`, `evidence`, `partners`, `research`, `science`, `team`, `contact`, `impressum`, `datenschutz`.
Redirect stubs (generated): `problem`, `idea`, `impact` → `science`; `involved` → `partners`; `neuropenetrance-de` → `de/index`.

Commands: `npm run build` (= `node tools/build.mjs`), `npm test` (= `node tools/build.mjs && node --test tools/`).

---

### Task 1: Build system, layout, theme, fonts, site checks

**Files:**
- Create: `package.json`, `tools/build.mjs`, `tools/layout.mjs`, `tools/i18n.mjs`, `tools/site.test.mjs`, `tools/snapshots/team.en.txt`, `tools/snapshots/evidence.en.txt`, `assets/css/site.css`, `assets/fonts/*`
- Create: `src/pages/en/index.html`, `src/pages/de/index.html` (temporary minimal bodies; Task 2 fills them)

**Interfaces:**
- Produces:
  - `renderPage({ lang: 'en'|'de', slug: string, title: string, description: string, body: string }): string`
  - `build(): { written: string[] }`
  - `PAGES` (array of slugs in `tools/build.mjs`), extended by later tasks as fragments appear: build only renders slugs whose fragment exists in **both** languages and throws if a fragment exists in one language only
  - test helpers in `site.test.mjs`: `read(path)`, `textOf(html)` (strip tags/scripts/styles, collapse spaces), `pages()` (all generated non-redirect pages)

- [ ] **Step 1: Snapshot today's text** before anything changes: `textOf(<main>…</main>)` of the current `team.html` and `evidence.html` → `tools/snapshots/*.en.txt` (a one-off script; commit the two text files).
- [ ] **Step 2: Write failing tests** in `tools/site.test.mjs`:
  - `every page has its German twin`: for each generated `X.html` in root (except redirects), `de/X.html` exists, and vice versa.
  - `html lang and hreflang are set`: EN has `<html lang="en">`; DE has `lang="de"`; both contain `hreflang="en"`, `hreflang="de"`, `hreflang="x-default"`.
  - `language switch points to the same page`: in `platform.html` (once it exists) and `index.html`, the DE link is `de/<slug>.html`; in `de/<slug>.html`, the EN link is `../<slug>.html`.
  - `header has nav, app link and partner button`: each page has links labelled per language to platform, evidence, partners, research, science, team; an `<a href="https://neuropenetrance.streamlit.app"` with `target="_blank"` and `rel` containing `noopener`; and a link to `partners.html`.
  - `no Google Fonts requests`: no page or CSS contains `fonts.googleapis.com` or `fonts.gstatic.com`; `site.css` contains `@font-face`.
  - `every page has viewport meta and menu button`.
  - `internal links resolve`: every relative `href`/`src` in every page points to an existing file.
- [ ] **Step 3:** `npm test` → FAIL (`tools/build.mjs` missing).
- [ ] **Step 4: Implement.**
  - `npm i -D @fontsource-variable/inter@5 @fontsource/ibm-plex-mono@5`; build copies the needed woff2 files (Latin and Latin-ext; Inter variable; Plex Mono 500) into `assets/fonts/`.
  - **Layout:**
    - head: charset, viewport, title, description, canonical, hreflang trio, OG tags, favicon, `assets/css/site.css`
    - skip link
    - header with logo SVG (teal branch), nav, EN·DE, app button, partner button, menu button
    - `<main id="main">`
    - footer: email, nav, Impressum, Datenschutz, language links, "© NeuroPenetrance"
    - `script.js`
  - Relative paths: `../` prefix for DE.
  - `site.css` implements direction A as in the mockup: header, hero, trust strip, cards, buttons (`.btn-primary` teal, `.btn-outline` navy), `.ruo` badge (amber), sections, forms, footer, mobile menu under 900 px.
- [ ] **Step 5:** `npm test` → PASS.
- [ ] **Step 6: Commit** `build: static site generator, direction A theme, self-hosted fonts, site checks`

---

### Task 2: Home (EN + DE)

**Files:** Modify `src/pages/en/index.html`, `src/pages/de/index.html`; Test: add to `tools/site.test.mjs`

**Interfaces:** Consumes `renderPage` and the CSS classes from Task 1.

- [ ] **Step 1: Write failing tests:**
  - `home leads with Engine 2 and both paths`: `index.html` contains `Find which patients carry the biology that matters, from a blood sample.`; links to `partners.html` and `research.html`; the trust strip text includes `8`, `779`, `8 / 8`, `EU`, `RUO`; it mentions `Engine 1`.
  - `German home is translated`: `de/index.html` contains no `Find which patients` and contains `Blutprobe`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement** the bodies following the mockup:
  - **Hero:** eyebrow "Blood-based immune profiling · precision psychiatry"; headline as tested; lede "We analyse your patient samples and cohorts to find signals of disease development and treatment response. A 6-gene blood gene-expression (RNA) signature, tested on 8 independent studies."; buttons "Discuss a partnership →" and "Try the analysis app ↗"; app report card with RUO badge.
  - **Trust strip:** 8 independent public studies · 779 participants analysed · 8 / 8 studies above chance · EU data hosted in Frankfurt · GDPR · RUO Research Use Only, open methods.
  - **Three offer cards:** Analyse your samples / Stratify your trial / Model treatment response, as in the mockup.
  - **Two-path band:** "For biotech & pharma →" / "For researchers →".
  - **"Coming next · Engine 1" banner.**
  - DE: a natural German equivalent (headline e.g. "Erkennen Sie, welche Patientinnen und Patienten die entscheidende Biologie tragen – aus einer Blutprobe.").
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(site): new home page (EN/DE)`

---

### Task 3: Platform (EN + DE) with app screenshots

**Files:** Create `src/pages/{en,de}/platform.html`, `assets/img/app-report.png`, `assets/img/app-intake.png`, `tools/screenshots.mjs`

- [ ] **Step 1: Write failing test** `platform explains data, outputs and the app`. `platform.html` contains:
  - `RNA`, `PAXgene`, `Research Use Only`
  - `<img` tags for `assets/img/app-report.png` and `assets/img/app-intake.png`, each with non-empty `alt`
  - a link to the app
  - the words `Engine 1` and `in development`
  - and NOT `DNA sequencing`
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement.**
  - `tools/screenshots.mjs` takes two images. (1) `app-intake.png`: the live app start screen, via headless Chrome with `--virtual-time-budget=120000` at 1280×900; the app is public but can't be clicked through headlessly. (2) `app-report.png`: the app's own PDF report for the Example B profile, built with the app repo's `report.py` and rendered to PNG with `qlmanage -t`. Save optimized PNGs ≤ 300 KB.
  - **Page sections:** What we analyse · How the engine works · What you get · The app (screenshots + button) · Data protection & Research Use Only · Engine 1 (in development).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(site): platform page with app screenshots (EN/DE)`

---

### Task 4: Evidence and Team, unchanged content in the new style (EN + DE)

**Files:** Create `src/pages/{en,de}/evidence.html`, `src/pages/{en,de}/team.html` (EN bodies = today's `<main>` inner HTML with class names adapted to the new CSS; DE = translation)

- [ ] **Step 1: Write failing tests:**
  - `team text unchanged`: `textOf(main of team.html)` equals `tools/snapshots/team.en.txt` after removing the old "← Back to home" breadcrumb text.
  - `evidence numbers unchanged`: `evidence.html` contains `0.500`, `0.755`, `0.613`, `0.611`, `0.57–0.63`, `0.61`, `8 / 8`, `779`; and every number in `tools/snapshots/evidence.en.txt` that matches `/\d+\.\d+/` also appears in the new page.
  - `German team and evidence exist and keep the numbers`: `de/evidence.html` contains `0,613` or `0.613`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement.** Copy the bodies; replace old classes with the new theme's equivalents (bars keep `data-target` so `script.js` still animates). Translate both into German; German numbers use a decimal comma.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(site): evidence and team restyled, content unchanged (EN/DE)`

---

### Task 5: For partners and For researchers (EN + DE) with forms

**Files:** Create `src/pages/{en,de}/partners.html`, `src/pages/{en,de}/research.html`

- [ ] **Step 1: Write failing tests:**
  - `forms post to formspree with required fields and honeypot`. In `partners.html`, `research.html` and their DE twins:
    - `<form` with `action="https://formspree.io/f/xeaqbkzb"` and `method="POST"`
    - inputs named `name`, `email` (type email, required), `message`
    - a hidden `type` input with value `partnership` or `research`
    - a hidden `_subject`
    - a hidden honeypot `_gotcha`
    - partners has `company`; research has `institution`
    - an interest `<select name="interest">`: partners options analyse samples / stratify a trial / model treatment response / other; research options joint study / share a cohort / student project / use the app / other
  - `research page offers open science`: `research.html` links to 8 GEO accessions (`acc=GSE98793`, `GSE19738`, `GSE251778`, `GSE46743`, `GSE247998`, `GSE185855`, `GSE76826`, `GSE52790`), to `github.com/nelladelva/neuropenetrance_app`, and to `evidence.html`; contains `available on request` and `How to cite`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement.**
  - **Partners:** the three offers in detail; "How a partnership works" (4 steps: intro call → data-sharing agreement → analysis → report & next steps); what to send (whole-blood RNA data or tubes; clinical labels; follow-up/response data for prediction); typical timeline; form.
  - **Research:**
    - Open science: datasets, methods in plain words, results link, app code, how to cite (a suggested citation: "Delva NC. NeuroPenetrance PenetranSci immune signature (Stage 1), 2026. https://neuropenetrance.com/research.html")
    - App free for academic research
    - Collaboration types
    - Research updates (CRP validation, proteomics)
    - Form
  - DE translations.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(site): partner and researcher pages with forms (EN/DE)`

---

### Task 6: Science & roadmap and Contact (EN + DE)

**Files:** Create `src/pages/{en,de}/science.html`, `src/pages/{en,de}/contact.html`

- [ ] **Step 1: Write failing tests:**
  - `science tells the story and the roadmap`: contains `incomplete penetrance`, `Engine 1`, `CRP`, `proteomics`.
  - `contact routes to the forms`: links to `partners.html#form` and `research.html#form`; contains `partnerships@neuropenetrance.com`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement.** Science condenses today's Problem/Idea/Impact pages (keep their strongest paragraphs and the literature tabs, re-pointed at blood immune profiling first, Engine 1 as in development) and adds the roadmap. Contact is short. DE translations.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(site): science & roadmap and contact (EN/DE)`

---

### Task 7: Legal pages, redirects, SEO, cleanup

**Files:**
- Create: `src/pages/{en,de}/impressum.html`, `src/pages/{en,de}/datenschutz.html`, `assets/img/og-image.png`, `assets/img/favicon.svg`
- Generated: `sitemap.xml`, `robots.txt`
- Modify: `tools/build.mjs` (redirect stubs, sitemap)
- Delete: `style.css`, the old `problem.html`, `idea.html`, `impact.html`, `involved.html`, `neuropenetrance-de.html` (replaced by generated redirect stubs)

- [ ] **Step 1: Write failing tests:**
  - `old URLs redirect`: `problem.html`, `idea.html`, `impact.html` contain `http-equiv="refresh"` and `url=science.html`; `involved.html` → `partners.html`; `neuropenetrance-de.html` → `de/index.html`; each has a visible link too.
  - `no forbidden phrases on any page`: no EN or DE page contains `stemazing.advancement@gmail.com`, `0.772`, `0,772`, `validated`, `validiert` (except the literal phrase `validated protocols`/`validierten Protokollen` about the MDC lab), `predicts who will develop`, `DNA sequencing`.
  - `impressum has placeholders and a visible note`: `de/impressum.html` contains `Angaben gemäß § 5 DDG`, `[Full legal name]`, `partnerships@neuropenetrance.com`, and a `.todo-note` element.
  - `datenschutz names the processors`: `de/datenschutz.html` contains `GitHub`, `Formspree`, `Streamlit`, `keine Cookies`.
  - `sitemap lists every page in both languages`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement.**
  - **Impressum:** DE with § 5 DDG wording and placeholders; EN version.
  - **Datenschutz:** DE+EN covering:
    - controller (placeholder)
    - hosting: GitHub Pages, with server logs and IP addresses
    - contact forms via Formspree (USA; EU Standard Contractual Clauses)
    - the external app link (Streamlit Community Cloud)
    - no cookies or analytics; self-hosted fonts
    - rights under GDPR Art. 15–21 and the right to complain to a supervisory authority
    - a note that it's a draft to be reviewed
  - **Redirect stubs:** meta refresh + canonical + link. Sitemap with hreflang; `robots.txt` pointing to it. OG image 1200×630 (logo + headline, PIL). Delete the obsolete files.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(site): legal pages, redirects, sitemap, cleanup`

---

### Task 8: Visual check and handover

- [ ] Serve locally (`npx serve .` or `python3 -m http.server`), take headless-Chrome screenshots of every EN and DE page at 1280 px and 390 px, and look at each: no overflow, menu works, contrast fine, German text not overflowing buttons.
- [ ] Fix anything found (each fix with a test if it's checkable by `site.test.mjs`, e.g. missing alt text).
- [ ] `npm test` → all green. Commit `chore(site): visual fixes`.
- [ ] Handover note in `README.md`:
  - how to edit a page (edit `src/pages/<lang>/<page>.html`, run `npm run build`, commit)
  - Nella's to-dos: Impressum details, IONOS forwarding for partnerships@, legal review of Datenschutz
