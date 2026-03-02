const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
