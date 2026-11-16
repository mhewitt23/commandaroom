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
- `voicemastery/`           the Voice Mastery course site, served at www.voicemastery.com
  - `index.html`            the sales page (its pre-order buttons go to Stripe checkout)
  - `welcome/index.html`    where buyers land after paying (posts their intake to the same Google Sheet, marked "Voice Mastery course intake")
  - `assets/`               its photos, share image, and intake script
- `server.js`               the small server Railway runs: serves `public/` for commandaroom.com and `voicemastery/` for www.voicemastery.com (voicemastery.com without www moves to www), and redirects `/assessment` and the welcome page's old address, `/voice-mastery/welcome/`, to www.voicemastery.com/welcome/
- `package.json`            tells Railway to run `node server.js`

Updating the site
Replace the contents of `public/` with the new build, keeping the same folder structure, and commit to `main`.
