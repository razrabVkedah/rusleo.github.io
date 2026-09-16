# Rusleo portfolio

Static bilingual portfolio for `rusleo.ru`. No build step or external JavaScript/font CDN is required.

## Preview

From the repository root:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`.

## Active files

- `index.html`: complete English content, semantic sections, native details and media dialog. Content and direct media links work without JavaScript.
- `css/portfolio.css`: responsive layout, visible focus and reduced-motion support.
- `data/text-en.js`, `data/text-ru.js`: matching flat translation dictionaries. Keep English HTML fallback text in sync when editing copy.
- `js/i18n.js`: text, image alternatives, accessible labels, metadata and optional language persistence.
- `js/app.js`: language control and click-to-open image/video viewer. Images support arrows, Escape, focus containment and return. Video embeds are created only after a click and removed on close.
- `assets/img/chromble/`, `assets/img/portfolio/`: optimized images used by the current page, including its favicon and social preview.

The older CSS files, renderer, project catalog and procedural-background sources are not loaded by this version. Their historical asset paths may no longer exist: unused legacy images and redundant originals have been removed from the working tree and remain available in Git history. The PDF is unchanged. Ignored local files are excluded from asset cleanup.

## Content boundaries

Chromble and Fireline are independent solo projects. No unconfirmed release date, performance metric or audience count is claimed. Bulltraffic is described through the confirmed Unity responsibilities and permitted VFX; confidential project footage is not included. Public code examples include their relevant implementation limits.

The contact address is `leonrusgamedev2004@yandex.ru`. The existing PDF uses a different address and needs a separate content update.

## Review checklist

Check English and Russian at 1440, 1024, 768, 390 and 360 px; inspect expanded details and image dialogs. Verify language persistence, blocked storage, keyboard controls, media cleanup and no horizontal overflow. YouTube playback depends on external availability; every embed includes a direct YouTube link.

`__CodexAgents` contains local research and review artifacts and is excluded from Git. Do not use it or `_temp` as a public asset source.
