const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/assessment', (req, res) => {
    res.redirect('https://magnificent-flexibility-production-4c2b.up.railway.app');
});

app.use('/images', express.static(path.join(__dirname, 'images'), {
    maxAge: '7d',
    immutable: true
}));

app.use(express.static(__dirname, {
    extensions: ['html']
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
