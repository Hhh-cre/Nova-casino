const express = require('express');
const { Pool } = require('pg');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// --- NEW: Route to serve your front-end ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API Route for game wagers ---
app.post('/api/games/dice/wager', async (req, res) => {
    try {
        // Simple secure roll generation
        const roll = (crypto.randomBytes(4).readUInt32BE(0) % 10000) / 100;
        const isWin = roll < req.body.rollUnderTarget;
        
        // Return result
        res.json({ rollResult: roll, win: isWin });
    } catch (error) {
        res.status(500).json({ error: "Server error during wager processing" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
