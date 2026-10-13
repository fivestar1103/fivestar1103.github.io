# fivestar1103.github.io

Kuiper Belt's company site at kuiperbelt.site, Seonghwan Oh's personal homepage at `/hwan/`, and the static pages for the products.

## Repository layout

```text
.
├── branding/          # Repository and Finder icon artwork
├── docs/              # GitHub Pages document root
│   ├── assets/        # Homepage styles, scripts, and social preview
│   ├── spamdog/       # SpamDog product, privacy, and support pages
│   ├── subtitle-overlay/
│   ├── fateAndAccidy/
│   ├── company/       # Redirect from the old company URL to /
│   ├── hwan/          # Founder's personal homepage
│   ├── legacy/        # Archived portfolio pages
│   ├── webgl-*/       # Historical interactive demos
│   └── index.html     # Kuiper Belt company homepage
├── .gitignore
└── README.md
```

GitHub Pages publishes from `main:/docs`. Because `docs/` is the document root, existing public paths such as `/spamdog/`, `/subtitle-overlay/privacy.html`, and `/fateAndAccidy/links.html` remain unchanged.

Historical releases, demos, source snippets, screenshots, and resumes stay inside `docs/` because old portfolio pages still reference them. The root directory is reserved for repository-level files only.

## Product videos

The company homepage uses a silent 12-second Subtitle Overlay preview, with an explicit pause/play control. It downloads and plays only when visible, unless reduced motion or data saving is enabled. The founder homepage and English/Korean Subtitle Overlay overviews offer the 30-second app preview; product pages also have an optional 80-second tour. These two tours use native playback controls and `preload="none"`. Product navigation pauses a playing video before replacing the page.

The dated media directory is `docs/subtitle-overlay/media/1.8-preview/`. Videos are hosted with the site, with matching posters, an English caption track for the short tour, and source hashes. They are labelled as a preview of the 1.8 update; publishing the website does not publish the extension update. When updating the assets, keep release availability, both product languages and the captions aligned.

`tools/verify-homepage-videos.mjs` uses Playwright Chromium to check all four entry pages at 320/390/1440px in light/dark modes, EN/KO switching, lazy downloads, playback, manual pause, reduced motion/data saving and product navigation. Run it with `@playwright/test` available in Node's module path; use `--base https://kuiperbelt.site` to verify a deployment and `--out <directory>` to choose a receipt/screenshot directory. It starts a local range-capable preview server when `--base` is omitted. `tools/add-marketing-videos.mjs` is the one-time migration from the reviewed source, with a guard against accidental reruns.
