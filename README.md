# KUB Fajar Samudra

Company profile website for **Kelompok Usaha Bersama (KUB) Fajar Samudra**, a traditional salt producer from Dusun Peh Pulo, Desa Sumbersih, Kecamatan Panggungrejo, Kabupaten Blitar, East Java, Indonesia.

## Features

- No build tools — pure HTML, CSS, and vanilla JavaScript
- Mobile-first, responsive on all devices
- BEM CSS — easy to maintain and scale
- Sliced architecture — each component has its own HTML, CSS, and JS file
- Semantic HTML for SEO and accessibility
- WebP images with lazy loading
- Scroll animations using Intersection Observer
- WhatsApp click-to-chat
- FAQ accordion without any library
- Product cards rendered from a JavaScript data array
- SEO tags, Open Graph, sitemap, and robots.txt

## Project Structure

```
garam-fajar-samudra/
├── index.html                  shell — loads partials via JavaScript
├── partials/                   HTML partials (10 files)
│   ├── header.html
│   ├── hero.html
│   ├── about.html
│   ├── products.html
│   ├── advantages.html
│   ├── gallery.html
│   ├── testimonials.html
│   ├── faq.html
│   ├── contact.html
│   └── footer.html
├── assets/
│   ├── css/
│   │   ├── style.css           entry point — imports everything
│   │   ├── base.css            reset, variables, typography
│   │   ├── layout.css          container and section styles
│   │   ├── utilities.css       animations, back-to-top, WhatsApp float
│   │   └── components/
│   │       ├── buttons.css
│   │       ├── header.css
│   │       ├── hero.css
│   │       ├── about.css
│   │       ├── products.css
│   │       ├── advantages.css
│   │       ├── gallery.css
│   │       ├── testimonials.css
│   │       ├── faq.css
│   │       ├── contact.css
│   │       └── footer.css
│   ├── js/
│   │   ├── main.js             orchestrator
│   │   └── modules/
│   │       ├── loader.js       fetches and injects HTML partials
│   │       ├── products.js     product data and grid rendering
│   │       ├── header.js       scroll effect and mobile nav
│   │       ├── faq.js          accordion toggle
│   │       ├── animations.js   Intersection Observer
│   │       ├── navigation.js   active link and smooth scroll
│   │       └── utils.js        back-to-top button
│   └── images/                 WebP placeholder images
├── favicon.svg / favicon.ico
├── apple-touch-icon.png
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── README.md
```

## Getting Started

No build tools needed. Just run a local server:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser. An HTTP server is required because HTML partials are loaded with `fetch()`.

## Deployment

**GitHub Pages**
1. Push to GitHub
2. Go to Settings → Pages
3. Set source to `main` branch (root)
4. Your site will be live at `https://pohpuleh99.github.io/garam-fajar-samudra/`

**Netlify**
Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop).

## Tech Stack

- HTML5
- CSS3 with custom properties and BEM
- Vanilla JavaScript (no framework, no transpiler)
- Google Fonts (Montserrat + Source Sans Pro)

## License

MIT
