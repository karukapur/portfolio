# Karan Kapur — portfolio

Personal portfolio for Karan Kapur: Edge AI engineer, software engineer, and co-founder of the Southern Taiwan Technology Council.

FlipWords opens the Work selection with the supplied Galaxy Z Flip6 mockup in `profile/flipwords-mockup.png`, showing cover-screen vocabulary and the Learn page. EdgeSentry follows with `profile/edgesentry-mockup.png`, an exploded hardware concept with a small 007-inspired field-tech insignia. Both use the shared preview in `profile/flipwords.js` and `profile/flipwords.css`, and have standalone pages at `profile/project.html?id=flipwords` and `profile/project.html?id=edgesentry`. Project content and source links live in `profile/portfolio.js`. Noshi Boshi uses the supplied product unboxing video in `profile/media/noshi-boshi-unboxing.mp4`, with a local poster frame and playback controls. Its Work preview loops muted while visible and pauses when leaving the project. Work typography uses the same shared sizes as STTC across all five projects.

These two previews ride the original 3D display's camera path into and out of Work. Its hardware surfaces and shadows stay hidden throughout those transitions.

The original 3D badge and card deck lead into Work's interactive project displays. Work shows FlipWords, EdgeSentry, AI for sustainability, Building STTC, and Noshi Boshi. STTC displays its live website inside a CSS MacBook, styled in `profile/sttc-work.css`; the other website previews use a neutral display without the former Edge AI board. Personal content lives in `profile/portfolio.js`. The introduction, cards, Work, and project pages share a light silver/lavender palette in `profile/theme.css`. The CV (October 2026) takes precedence over LinkedIn for current employment, location, and dates.

Second-screen cards show organization logos on the front and external website/resource links on the reverse. Logo files are local in `profile/logos/`; sources are documented in `profile/logos/SOURCES.md`.

The badge uses `profile/karan-avatar-v2.webp`, generated from Karan’s supplied headshot with a corrected forward gaze. Only the avatar used by the website is retained.

`lanyard/` contains the badge hardware textures. `macbook/studio.hdr` supplies the animated name’s reflection environment; the Work displays are drawn in CSS and do not use a 3D model. `fonts/` contains the local SUIT fallback fonts and their license.

Run locally with `python3 -m http.server 4173`, then open `http://localhost:4173/`.

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
