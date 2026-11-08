# Karan Kapur — portfolio

Personal portfolio for Karan Kapur: Edge AI engineer, software engineer, and co-founder of the Southern Taiwan Technology Council.

AI for sustainability opens the Work selection. FlipWords uses the supplied Galaxy Z Flip6 mockup in `profile/flipwords-mockup.png`, showing cover-screen vocabulary and the Learn page. EdgeSentry uses `profile/edgesentry-mockup.png`, an exploded hardware concept with a small 007-inspired field-tech insignia. Both use the shared preview in `profile/flipwords.js` and `profile/flipwords.css`, and have standalone pages at `profile/project.html?id=flipwords` and `profile/project.html?id=edgesentry`. Project content and source links live in `profile/portfolio.js`. Noshi Boshi uses the supplied product unboxing video in `profile/media/noshi-boshi-unboxing.mp4`, with a local poster frame. The video plays silently once without playback controls, then holds its final frame. Work previews pause while offscreen or in hidden tabs and resume unfinished playback when visible again. Reduced motion retains the poster without autoplay. Work typography uses the same shared sizes as STTC across all six projects.

Whispener follows FlipWords in Work, with a standalone page at `profile/project.html?id=whispener` and source at https://github.com/karukapur/whispener. Its supplied portrait recording is stored as `profile/media/whispener-narad-demo.mp4`, with a matching poster. It uses the shared silent video behavior inside a metal-edged phone frame with side buttons and a camera cutout. The phone and recording share a perspective tilt, reduced on narrow screens, while preserving the recording's portrait aspect ratio. It appears in Work without adding a Life’s Story card. The project description follows the repository README: the app is installed as Narad, transcribes Chinese on the device, and offers optional remote English context summaries.

These two previews ride the original 3D display's camera path into and out of Work. Its hardware surfaces and shadows stay hidden throughout those transitions.

The contact scene frames the ID card alone with a slight rightward tilt, sized above the contact links. The project display is hidden when leaving Work.

Contact uses an original Minecraft-style character in `profile/contact-avatar.js`, rendered on a transparent, high-resolution canvas. The miniature avatar runs in, jumps, lands, and waves once, then holds its final pose. “Say hello” stays visible throughout. Playback pauses away from Contact and in hidden tabs. Reduced motion shows the final pose immediately. The supplied source video is retained in `profile/media/karan-avatar-parkour-wave.mp4`.

The original 3D badge and card deck lead into Work's interactive project displays. Work shows AI for sustainability, FlipWords, Whispener, EdgeSentry, Building STTC, and Noshi Boshi. STTC displays its live website inside a CSS MacBook, styled in `profile/sttc-work.css`; the other website previews use a neutral display without the former Edge AI board. Personal content lives in `profile/portfolio.js`. The introduction, cards, Work, and project pages share a light silver/lavender palette in `profile/theme.css`. The CV (October 2026) takes precedence over LinkedIn for current employment, location, and dates.

Second-screen cards show organization logos on the front and external website/resource links on the reverse. Logo files are local in `profile/logos/`; sources are documented in `profile/logos/SOURCES.md`.

The badge uses `profile/karan-avatar-v2.webp`, generated from Karan’s supplied headshot with a corrected forward gaze. Only the avatar used by the website is retained.

`lanyard/` contains the badge hardware textures. `macbook/studio.hdr` supplies the animated name’s reflection environment; the Work displays are drawn in CSS and do not use a 3D model. `fonts/` contains the local SUIT fallback fonts and their license.

Run locally with `python3 -m http.server 4173`, then open `http://localhost:4173/`.

The homepage uses a complete scrolling layout on screens up to 820px, with reduced motion, or when animation dependencies are unavailable. It includes selected projects, About, experience, CV and email contact. Wider screens retain the 3D scenes with a visible navigation bar; crossing the mobile breakpoint reloads into the appropriate layout while retaining the URL destination. `profile/projects.html` provides the same browsable overview on any screen. The shared renderer and styles live in `profile/browse.js` and `profile/browse.css`.

Every project has structured contribution, engineering decisions, results and limitations in `profile/portfolio.js`. Career-only project hashes return to Experience instead of selecting an unrelated Work item. Videos use silent autoplay without playback controls or full-size player links. Work previews pause away from the scene and resume unfinished playback when returning; completed videos hold their final frame. Reduced-motion preferences suppress autoplay. No new performance or customer metrics have been invented.

Deploy with the included [GitHub Pages workflow](.github/workflows/pages.yml). No package installation or build tool is required. On every push to `main`, the workflow runs the project tests, copies the website into `_site/`, and deploys it. Tests, Git metadata, and repository documentation at the root are excluded from the deployment.

To publish:

1. Create a repository in your own GitHub account. Name it `<username>.github.io` for `https://<username>.github.io/`, or choose another name for `https://<username>.github.io/<repository>/`. Relative asset paths support either option.
2. Check `git remote -v` before pushing. Ensure `origin` points to your own repository. To replace an existing remote, use `git remote set-url origin https://github.com/<username>/<repository>.git`.
3. In your GitHub repository, select **Settings → Pages → Build and deployment → Source → GitHub Actions**. See [GitHub's publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
4. Commit all website files, including `profile/`, `tests/`, `.github/`, and the cleanup deletions, then push `main`. For this checkout: `git add -A`, `git commit -m "Prepare portfolio for GitHub Pages"`, then `git push -u origin main`.
5. Follow **Actions → Deploy to GitHub Pages** for the deployment result and live URL. You can also run this workflow manually on `main`.

Google Fonts, GSAP, and Three.js load from external CDNs. The STTC project embeds its live external website; the other project experiences are served from this repository.

Each lab screen has its own project experience, also available through `profile/project.html?id=<project-id>`. STTC loads its live website directly in the lab display; its standalone project page embeds the same site above the co-founder story. The optional `liveUrl` in `profile/portfolio.js` controls this. The remaining interactive experiences are defined in `profile/project-experiences.js` and styled in `profile/theme.css`. Topic maps are illustrative; the topic-modelling explanations link to their method references.

Run the dependency-free route and selection checks with `node --test tests/project-experiences.test.cjs`. These checks use a DOM fixture; responsive layout, native keyboard behavior, and the 3D lab still need browser verification.

Retired demo routes under `web/`, the unused MacBook model, and unused portrait exports have been removed. Open `index.html` for the main website or `profile/project.html` for project details.

Portfolio identity and personal content © 2026 Karan Kapur. Third-party component terms are retained in `LICENSE`, `fonts/LICENSE`, and the relevant source attributions.
