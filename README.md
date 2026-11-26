# Karan Kapur — portfolio

Personal portfolio with a desktop 3D badge, career cards and interactive Work displays. Mobile screens (up to 820px), primary-touch devices in either orientation, desktop windows below 600px tall, reduced motion and unavailable animation dependencies use a scrolling document layout. Project pages live at `profile/project.html?id=<project-id>`.

## Run and edit

No package installation is required. Run `python3 -m http.server 4173`, then open `http://localhost:4173/`.

Edit project names, selection order, roles, contact links and location in `profile/portfolio.js`. The CV (October 2026) takes precedence over LinkedIn for current employment, location and dates. Project tabs and case studies serve different reading contexts; retain their specific contributions, results and limitations.

After editing shared content, refresh the static fallback, identity fields and metadata:

```sh
node scripts/sync-portfolio.cjs
node --test tests/*.test.cjs
```

HTML inside `portfolio:` comment markers and attributes marked `data-portfolio-*` is generated. Keep it committed so local previews and visitors without JavaScript retain the fallback content. These copies are not separate sources to edit. CI runs `node scripts/sync-portfolio.cjs --check` to prevent drift.

## Source map

| Files | Responsibility |
| --- | --- |
| `index.html` | Homepage, 3D scenes, badge physics and navigation |
| `profile/portfolio.js` | Shared personal/project data and derived selections, links and labels |
| `profile/layout.js` | Input/viewport layout selection, debounced mode changes and resize scheduling |
| `profile/browse.js`, `profile/browse.css` | Scrolling project index, About, experience and contact |
| `profile/project.html`, `profile/project-experiences.js` | Case-study pages and interactive illustrations |
| `profile/theme.css` | Shared typography, palette and project styling |
| `profile/flipwords.js`, `profile/flipwords.css` | Image and video previews shared by Work and project pages |
| `profile/sttc-work.css`, `profile/sttc-keyboard.svg` | CSS MacBook for the live STTC website |
| `profile/sustainability-work.*` | Illustrative sustainability dashboard |
| `profile/contact-avatar.js` | Canvas contact avatar animation |
| `SCROLL_SETTINGS.md` | Scroll-tuning values and restoration instructions |

Work previews follow the scene camera, pause away from Work or in hidden tabs, and resume unfinished playback on return. Videos play silently once and retain their final frame; reduced motion retains posters. Whispener uses a portrait phone frame. EdgeSentry's exploded image is a hardware concept. STTC embeds its external website; other experiences are local. Career-only hashes lead to Experience.

Contact's Minecraft-style avatar runs, jumps and waves once, then holds its pose. It pauses away from Contact and in hidden tabs; reduced motion shows the final pose immediately.

## Assets and checks

`profile/media/` holds recordings and poster frames. Organization logos and source attribution live in `profile/logos/`. The badge uses `profile/karan-avatar-v2.webp`; `lanyard/` holds hardware textures. `fonts/` contains local SUIT fallback fonts and their license. Google Fonts load without blocking rendering. GSAP loads from a CDN only for desktop scene mode. The name uses the lightweight SVG treatment; Three.js is no longer required. Project mockups use lossless WebP.

The dependency-free tests cover routes, shared content, interactions, navigation and playback using DOM fixtures. The optional browser suite checks rendered layouts, project selection, navigation and console errors across the viewport matrix. Dashboard data and topic-map coordinates are illustrative; method references are linked from the experiences.

## Deployment

The included `.github/workflows/pages.yml` checks generated content, runs tests, copies website files into `_site/` and deploys GitHub Pages on pushes to `main`. `_site/` is ignored deployment output, not source. Root documentation, scripts, tests and Git metadata are excluded from the published site.

To set up hosting, check that `origin` points to your own GitHub repository, then choose **Settings → Pages → Build and deployment → Source → GitHub Actions**. Commit the changes and push `main`; follow the workflow in **Actions** for the deployment URL. Relative asset paths support both user sites and repository subpaths.

Portfolio identity and personal content © 2026 Karan Kapur. Third-party component terms are retained in `LICENSE`, `fonts/LICENSE` and source attributions.

## Responsive verification

Desktop Work uses a centered, two-column layout shared by the text and the 3D preview.
The project title, tabs and body copy scale with the available viewport width and height.
Project facts appear below the tab content. The browser suite checks each tab against
the header, preview and project dock.

Verified on 19 November 2026 in isolated headless Chromium: 16 viewport sizes, all six
Work selections, and all ten case-study routes at 320px, 932px and 1440px widths.
Desktop sizes cover 1024×600 through 3840×2160, including 3440×1440 and 2560×720;
mobile/tablet widths cover 320, 360, 390, 430, 768 and 820px, plus 932×430 landscape touch.
No page errors or unintended horizontal document overflow were found. Screenshots were
reviewed for representative hero, Work, Contact, case-study and mobile layouts.

Additional checks passed for phone rotation, project deep links across the 820px boundary,
reduced motion, blocked animation CDNs, JavaScript disabled, keyboard entry and inactive-video
pausing. Device pixel ratio 2 was checked with CPU slowed 4× and network set to 100ms latency,
200 KB/s download and 100 KB/s upload. These are lab checks, not real-device or field measurements.
Safari/iOS, Firefox, native browser zoom, and the affected physical monitor still need confirmation.

For repeatable viewport screenshots and assertions, install Playwright outside this buildless
repository and run the following with the local server running:

```sh
NODE_PATH=/path/to/node_modules node scripts/verify-responsive.cjs
```

The script uses Playwright's installed Chromium by default. `PORTFOLIO_CHROMIUM` can select
an existing Chromium executable, `PORTFOLIO_URL` selects the preview URL, and
`PORTFOLIO_QA_OUTPUT` selects an artifact directory (default: the system temporary directory).
The ordinary content/unit checks remain dependency-free.
