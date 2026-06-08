const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Serve static files (HTML, CSS, JS) from the root folder
app.use(express.static(path.join(__dirname, '.')));

// 2. Explicitly serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. API route
app.post('/api/games/dice/wager', async (req, res) => {
    // ... your logic here ...
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
