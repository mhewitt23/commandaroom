Command a Room, the website
===========================

Live at https://www.commandaroom.com. Railway deploys this repo automatically every time `main` changes.

What is where
- `public/`                 the website itself
  - `index.html`            the homepage
  - `apply/index.html`      the application page (posts to the Google Sheet, then opens Calendly)
  - `assets/`               photos, diagrams, testimonial screenshots, the share image, and the two scripts
  - `404.html`              the page for addresses that do not exist
  - icons, `robots.txt`, `sitemap.xml`
- `server.js`               the small server Railway runs: serves `public/` and redirects `/assessment`
- `package.json`            tells Railway to run `node server.js`

Updating the site
Replace the contents of `public/` with the new build, keeping the same folder structure, and commit to `main`.
