# fivestar1103.github.io

Seonghwan Oh's personal site and the static pages for independently shipped products.

## Repository layout

```text
.
├── branding/          # Repository and Finder icon artwork
├── docs/              # GitHub Pages document root
│   ├── assets/        # Homepage styles, scripts, and social preview
│   ├── spamdog/       # SpamDog product, privacy, and support pages
│   ├── subtitle-overlay/
│   ├── fateAndAccidy/
│   ├── legacy/        # Archived portfolio pages
│   ├── webgl-*/       # Historical interactive demos
│   └── index.html     # Personal homepage
├── .gitignore
└── README.md
```

GitHub Pages publishes from `main:/docs`. Because `docs/` is the document root, existing public paths such as `/spamdog/`, `/subtitle-overlay/privacy.html`, and `/fateAndAccidy/links.html` remain unchanged.

Historical releases, demos, source snippets, screenshots, and resumes stay inside `docs/` because old portfolio pages still reference them. The root directory is reserved for repository-level files only.
