# EXTREME New Tab

Chrome extension project structure:

```text
extreme-newtab/
├── assets/
│   └── icons/
│       ├── favicon.ico
│       ├── icon-16.png
│       ├── icon-32.png
│       ├── icon-48.png
│       ├── icon-128.png
│       └── icon.svg
├── src/
│   ├── index.html
│   ├── main.js
│   └── styles.css
├── LICENSE
├── manifest.json
└── README.md
```

## Structure

- `src/` contains the extension UI, behavior, and styles.
- `assets/icons/` contains the extension icons and favicon.
- `manifest.json` is the Chrome extension entry point and references the moved files.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project folder.
