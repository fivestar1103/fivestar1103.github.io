# Public homepage design

The company page (`/company/`) and personal homepage (`/`) use the Kuiper Belt dashboard design. The source is the committed `graduation` revision `3c6da09`: `globals.css`, `Shell`, `SiteNav`, `Card`, and `ThemeToggle`.

- IBM Plex Sans KR for text and IBM Plex Mono for labels and numbers.
- A 768 px content shell, small mono labels, and sections separated by thin rules.
- The dashboard's exact light/dark paper, ink, line, and slate values.
- System theme by default; an explicit selection is retained using `kisdash-theme`. Company and personal pages share the choice because they share an origin.
- Existing Korean/English content, navigation and product destinations remain available.

`docs/assets/dashboard.css` contains the shared foundation. Page layouts live in `company.css` and `site.css`. The product identity stylesheet `kuiper.css` is retained for product pages.

Fonts are served locally. The unmodified font files and CSS declarations come from the committed dashboard assets. The fonts CSS Git blob is `3f4b4948469dc2e8522bf433ed8f071c31ddf7c8`, verified against the home server. Only weights 400, 500 and 600 are included. The [official IBM Plex license](https://github.com/IBM/plex/blob/master/LICENSE.txt) is included at `docs/assets/fonts/IBM-Plex-OFL.txt`.

The logo comparison is a proposal. A permanent SVG company mark can be made after a concept is selected.

## Validation

- Browser review of both pages at desktop and 320 px mobile sizes.
- Light/dark switching, retained theme after reload and navigation, English/Korean switching, and Korean product destinations.
- Mobile menu expansion and Escape dismissal on the personal homepage.
- Existing body links preserved, no duplicate IDs, no horizontal overflow, images present.
- JavaScript syntax check and Git whitespace check.

Rollback: revert the design PR merge commit; GitHub Pages rebuilds from `main:/docs`. DNS, the company mailbox and server services are independent of this change.
