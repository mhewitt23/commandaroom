const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE = path.join(__dirname, 'public');

app.get('/assessment', (req, res) => {
    res.redirect('https://magnificent-flexibility-production-4c2b.up.railway.app');
});

// Photos, diagrams, and the two scripts.
app.use('/assets', express.static(path.join(SITE, 'assets')));

// Image links from the previous site keep working where the file name still exists.
app.use('/images', express.static(path.join(SITE, 'assets')));

// The pages: /, /apply/, robots.txt, sitemap.xml, and the icons.
app.use(express.static(SITE, { extensions: ['html'] }));

// Anything else gets the site's own "page not found".
app.use((req, res) => {
    res.status(404).sendFile(path.join(SITE, '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
