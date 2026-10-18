# neuropenetrance.com redesign: design

*Date: 2026-10-18 · Owner: Nella Delva · Status: ready for approval*
Mockup reference: `.superpowers/brainstorm/directions-v1.html`, **direction A, "Clinical clarity"** (copy saved next to this doc as `mockups/home-direction-A.html`).

## 1. Intent: why
The site must win **partnerships with biotech and pharma companies**. Today it reads as an early-stage stem-cell lab idea (Engine 1) with warm editorial styling. The data and the working software are **Engine 2**: blood gene expression (RNA) analysis and the PenetranSci app. So the site will lead with what exists and works, look like a credible clinical/biotech company, and make contacting us for a partnership the obvious next step.

**Primary visitor:** a business development or R&D person at a biotech/pharma company.
**What they must get in ~10 seconds (Nella's words):** we predict who develops disease from patient-derived blood samples.
**What they should do:** contact us for a partnership.
**First partnership offer (Nella's words):** analysing their samples to find ways to predict disease development and who responds to treatment.

## 2. Goals, non-goals, anti-goals
**Goals**
1. Lead with Engine 2: blood gene expression (RNA) profiling and the PenetranSci app. Engine 1 (patient-derived neurons) is shown as "in development / coming next".
2. One goal on every page: **"Partner with us" / "Discuss a partnership"**, ending in a partnership contact form.
3. The app is **one click from every page** ("Open the app ↗" in the header) and is shown on the Home and Platform pages.
4. A professional clinical/biotech look (direction A).
5. A **full German version** of every page, with a language switch that keeps you on the same page.
6. Meet German legal requirements for a business site (Impressum, Datenschutzerklärung) and avoid GDPR problems (no third-party font loading).

**Non-goals**
- A new hosting platform or paid site builder (stays on GitHub Pages, €0).
- Changing the app itself.
- A blog or CMS.

**Anti-goals: failure even if it looks good**
- **Overclaiming.** Tested today: the 6-gene blood signature *distinguishes people with depression from healthy people* (AUC 0.61 on 7 unseen studies, above chance in 8/8). It has **not** been shown to predict future onset. Copy says "identify / stratify" for what's tested; "predict disease development and treatment response" is presented as **what we do with partners' data** (their longitudinal or trial data) and as the goal, never as an existing validated result.
- Changing the **Team page content** or the **Evidence numbers** (Nella: keep as they are).
- Stock-photo, generic "AI biotech" fluff that hides the science.
- A slower or broken site on phones.

## 3. Constraints
- **Hosting:** GitHub Pages from repo `nelladelva/neuropenetrance-site`, custom domain `neuropenetrance.com` (CNAME). Plain HTML/CSS/JS, no build step required.
- **App:** `https://neuropenetrance.streamlit.app` (public). Opens in a new tab.
- **Contact form:** existing Formspree endpoint `https://formspree.io/f/xeaqbkzb` (free plan: 50 submissions/month).
- **Data wording:** the model was built on **whole-blood gene expression (RNA)**, measured by microarrays and RNA-seq, from 8 public GEO studies (779 people). Not DNA, not proteomics.
- **Accessibility:** WCAG AA contrast, keyboard navigable, works at 360 px width.
- **Fonts:** self-hosted (no requests to Google servers). Inter for text, IBM Plex Mono for small labels; no serif in direction A.

## 4. What Nella decided
| Topic | Decision |
|---|---|
| Audience | Biotech and pharma companies; they should contact us for a partnership |
| Message | Predict who develops disease from patient-derived blood samples (worded honestly, see anti-goals) |
| Focus | Engine 2 first; Engine 1 as a potential idea in development |
| Offer | Analysing their samples to find ways to predict disease development and who responds to treatment |
| Look | Direction A, "Clinical clarity" |
| Keep as is | Team page (content) and Evidence numbers |
| Language | English + full German translation |

## 5. Design (direction A)
- **Palette:**
  - navy `#0D2438` (headings, dark panels)
  - teal `#0B6E79` (primary buttons, accents, links)
  - slate text `#4C5D6E`
  - light panel `#F3F6F9`, lines `#E3E8EE`, white background
  - amber `#E1A33D` only for "Research Use Only" badges
  - the logo keeps its branching shape: dark node + **teal** branch (the cherry red goes away, matching the app)
- **Type:** Inter (headings 700–800, body 400/500), IBM Plex Mono uppercase for eyebrows and labels.
- **Components** (as in the mockup):
  - header with logo, nav, EN·DE switch, "Open the app ↗" (outlined) and "Partner with us" (filled)
  - hero with a live-looking app report card
  - trust strip (8 studies · 779 participants · 8/8 above chance · EU/GDPR · RUO)
  - three offer cards
  - "Coming next · Engine 1" banner
  - footer with Impressum / Datenschutz / language links

## 6. Pages (EN at root, DE under `/de/`, same file names)
| Page | File | Content |
|---|---|---|
| Home | `index.html` | As in the mockup. Headline "Find which patients carry the biology that matters, from a blood sample." Lede about analysing partners' samples for signals of disease development and treatment response. |
| Platform | `platform.html` | **What we analyse:** whole-blood RNA (PAXgene/Tempus tubes; RNA-seq, microarray or targeted qPCR panel). How the engine works (6-gene immune signature, calibrated probability). What partners get (per-patient report, subgroup analysis, batch scoring). App screenshots + "Open the app". Data protection + Research Use Only. Engine 2 as today, Engine 1 as "in development". |
| Evidence | `evidence.html` | **Current content and numbers unchanged**; restyled; DE translation. |
| For partners | `partners.html` (new) | The three offers. How a partnership works (intro call → data-sharing agreement → analysis → report and next steps). What to send. Partnership form (Formspree) with fields: name, company, role, email, interest (analyse samples / stratify a trial / model treatment response / other), message. |
| Science & roadmap | `science.html` (new; replaces `problem.html`, `idea.html`, `impact.html`) | Incomplete penetrance in brief (from today's Problem/Idea pages); why blood immune profiling; Engine 1 (patient-derived neurons) as in development; roadmap (inflammatory subgroup, CRP validation, proteomics). |
| Team | `team.html` | **Current content unchanged**; restyled; DE translation. |
| Contact | `contact.html` | Short; points to the partnership form; general contact. |
| Impressum | `impressum.html` | Legal notice (German law). Content needs Nella's legal details. |
| Datenschutz | `datenschutz.html` | Privacy policy: hosting (GitHub Pages), Formspree, the app link (Streamlit), no cookies/analytics. |

- **Redirects:** old pages (`problem.html`, `idea.html`, `impact.html`, `involved.html`, `neuropenetrance-de.html`) become short pages that redirect to their new equivalents, so existing links keep working.

## 7. German translation
- A full translation of every page in `/de/`, written natively (not machine-literal), keeping technical terms that German biotech readers use (e.g. "Research Use Only", "RNA-Sequenzierung", "Biomarker").
- Language switch in the header on every page, linking to the same page in the other language. `<html lang>` and `hreflang` alternate links set for search engines.
- The existing German one-pager (`neuropenetrance-de.html`) is replaced by `/de/index.html`.

## 8. Left to the builder
- CSS architecture.
- Exact responsive breakpoints.
- Icon set (simple inline SVG or emoji as in the mockup).
- App screenshots: capture from the live app (Report and Gene reference pages).
- The wording of the new sections in Nella's voice, within the anti-goals.
- `sitemap.xml`, meta descriptions, Open Graph image.

## 9. Calls made by Claude (check these)
1. Stay on GitHub Pages and plain HTML (€0, fast, owned); no Framer/Webflow.
2. Merge Problem, Idea and Impact into one **Science & roadmap** page; the old URLs redirect.
3. `involved.html` (Get involved) redirects to **For partners**. A small "Join us / co-founder" note stays on the Team page, as today.
4. Self-host the fonts (GDPR); no analytics or cookies, so no cookie banner is needed.
5. The Impressum and Datenschutz pages are in German, with an English version linked (German law expects the German text).
6. Logo colours: dark node + teal branch, matching the app.

## 10. Answers from Nella
1. **Impressum:** use a **placeholder** for now: `[Full legal name]`, `[Street and number]`, `[Postcode City]`, `Germany`, and email `partnerships@neuropenetrance.com`. The page carries a visible note for Nella to fill it in before promoting the site. (The domain is registered at IONOS; no company register entry is listed, so the Impressum is drafted for a person, not a company. Adjust if a company is founded.)
2. **Contact email:** **`partnerships@neuropenetrance.com`** on every page, replacing the Gmail address. Nella sets up the forwarding in IONOS (Email → create forwarding → Gmail); the domain's mail already runs through IONOS.
