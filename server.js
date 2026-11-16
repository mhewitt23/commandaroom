const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE = path.join(__dirname, 'public');

// voicemastery.com runs on this same server, from its own folder. Every other address gets Command a Room.
const VOICE_MASTERY_SITE = path.join(__dirname, 'voicemastery');
const VOICE_MASTERY_HOST = 'www.voicemastery.com';
const VOICE_MASTERY_BARE_HOST = 'voicemastery.com';

// The address a visitor asked for, lower case and without a port.
function requestedHost(req) {
    const forwarded = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
    return (forwarded || String(req.headers.host || '')).toLowerCase().replace(/:\d+$/, '');
}

// The site's "page not found", with plain text if that page can't be sent.
function sendNotFound(res, page) {
    res.status(404).sendFile(page, (err) => {
        if (err && !res.headersSent) {
            res.type('text/plain').send('Page not found');
        }
    });
}

const voiceMastery = express.Router();
voiceMastery.use(express.static(VOICE_MASTERY_SITE, { extensions: ['html'] }));
voiceMastery.use((req, res) => {
    sendNotFound(res, path.join(VOICE_MASTERY_SITE, '404.html'));
});

app.use((req, res, next) => {
    const host = requestedHost(req);
    if (host === VOICE_MASTERY_BARE_HOST) {
        res.redirect(301, 'https://' + VOICE_MASTERY_HOST + req.originalUrl);
        return;
    }
    if (host === VOICE_MASTERY_HOST) {
        voiceMastery(req, res, next);
        return;
    }
    next();
});

app.get('/assessment', (req, res) => {
    res.redirect('https://magnificent-flexibility-production-4c2b.up.railway.app');
});

// The Voice Mastery welcome page lived here before voicemastery.com had its own site; send any old link there.
app.get(['/voice-mastery/welcome', '/voice-mastery/welcome/'], (req, res) => {
    const queryStart = req.originalUrl.indexOf('?');
    const query = queryStart === -1 ? '' : req.originalUrl.slice(queryStart);
    res.redirect(301, 'https://' + VOICE_MASTERY_HOST + '/welcome/' + query);
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
