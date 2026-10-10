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
