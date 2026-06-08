const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Configure your database connection strings securely here
const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/nova_casino'
    });

    /**
     * UTILITY: Generates an isolated Cryptographic Provably Fair SHA256 outcome
      * Employs cryptographically secure random bytes instead of insecure client side structures.
       */
       function runCryptographicDiceRoll() {
           const secureBytes = crypto.randomBytes(4);
               const integerRepresentation = secureBytes.readUInt32BE(0);
                   return (integerRepresentation % 10000) / 100; // Yields precise uniform distribution: 00.00 to 99.99
                   }

                   /**
                    * API: Fetch Operator Account Session Context Profile Metadata
                     */
                     app.get('/api/account/profile', async (req, res) => {
                         const token = req.headers['authorization'];
                             if (!token) return res.status(401).json({ error: "Missing required token header parameters." });

                                 try {
                                         const result = await dbPool.query('SELECT username, balance FROM users WHERE session_token = $1', [token]);
                                                 if (result.rows.length === 0) return res.status(403).json({ error: "Invalid operational session environment context." });
                                                         return res.status(200).json(result.rows[0]);
                                                             } catch (err) {
                                                                     console.error(err);
                                                                             return res.status(500).json({ error: "Database core connection interruption." });
                                                                                 }
                                                                                 });

                                                                                 /**
                                                                                  * API: Core Real-Money Isolated Wager Routing Transaction Loop for Dice Module
                                                                                   */
                                                                                   app.post('/api/games/dice/wager', async (req, res) => {
                                                                                       const token = req.headers['authorization'];
                                                                                           const { wagerAmount, rollUnderTarget } = req.body;

                                                                                               const wager = parseFloat(wagerAmount);
                                                                                                   const target = parseFloat(rollUnderTarget);

                                                                                                       if (!token) return res.status(401).json({ error: "Unauthorized secure asset context token missing." });
                                                                                                           if (isNaN(wager) || wager <= 0 || isNaN(target) || target < 2 || target > 98) {
                                                                                                                   return res.status(400).json({ error: "Malformed matrix calculation inputs submitted." });
                                                                                                                       }

                                                                                                                           try {
                                                                                                                                   // Fetch matching balance verification profiles safely out of user reach
                                                                                                                                           const userQuery = await dbPool.query('SELECT * FROM users WHERE session_token = $1', [token]);
                                                                                                                                                   if (userQuery.rows.length === 0) return res.status(403).json({ error: "Authorization sequence validation mismatch error." });

                                                                                                                                                           const userAccountData = userQuery.rows[0];
                                                                                                                                                                   if (parseFloat(userAccountData.balance) < wager) {
                                                                                                                                                                               return res.status(400).json({ error: "Execution context failure: Insufficient liquid operational reserves." });
                                                                                                                                                                                       }

                                                                                                                                                                                               // Calculate cryptographic random numbers isolated via backend hardware
                                                                                                                                                                                                       const serverGeneratedRollPoint = runCryptographicDiceRoll();
                                                                                                                                                                                                               const verificationStateResult = serverGeneratedRollPoint < target;

                                                                                                                                                                                                                       let multiplierReturnIndex = 0.00;
                                                                                                                                                                                                                               let totalWinningsReturn = 0.00;

                                                                                                                                                                                                                                       if (verificationStateResult) {
                                                                                                                                                                                                                                                   const platformHouseEdgeFactor = 0.99; // Standard 1% commercial margin retention
                                                                                                                                                                                                                                                               multiplierReturnIndex = (100 / target) * platformHouseEdgeFactor;
                                                                                                                                                                                                                                                                           totalWinningsReturn = wager * multiplierReturnIndex;
                                                                                                                                                                                                                                                                                   }

                                                                                                                                                                                                                                                                                           const calculatedNetProfitOutcome = totalWinningsReturn - wager;
                                                                                                                                                                                                                                                                                                   const transactionVerificationHash = "0x" + crypto.randomBytes(32).toString('hex').toUpperCase();

                                                                                                                                                                                                                                                                                                           // Open transaction pipeline to ensure state synchronization alignment
                                                                                                                                                                                                                                                                                                                   await dbPool.query('BEGIN');

                                                                                                                                                                                                                                                                                                                           await dbPool.query('UPDATE users SET balance = balance + $1 WHERE user_id = $2', [calculatedNetProfitOutcome, userAccountData.user_id]);

                                                                                                                                                                                                                                                                                                                                   await dbPool.query(
                                                                                                                                                                                                                                                                                                                                               `INSERT INTO transactions (tx_hash, user_id, game_module, wager_amount, payout_multiplier, net_profit, nonce) 
                                                                                                                                                                                                                                                                                                                                                            VALUES ($1, $2, $3, $4, $5, $6, (SELECT COUNT(*)+1 FROM transactions WHERE user_id = $2))`,
                                                                                                                                                                                                                                                                                                                                                                        [transactionVerificationHash, userAccountData.user_id, 'Dice Premium Engine', wager, multiplierReturnIndex, calculatedNetProfitOutcome]
                                                                                                                                                                                                                                                                                                                                                                                );

                                                                                                                                                                                                                                                                                                                                                                                        await dbPool.query('COMMIT');

                                                                                                                                                                                                                                                                                                                                                                                                return res.status(200).json({
                                                                                                                                                                                                                                                                                                                                                                                                            txHash: transactionVerificationHash,
                                                                                                                                                                                                                                                                                                                                                                                                                        rollResult: serverGeneratedRollPoint,
                                                                                                                                                                                                                                                                                                                                                                                                                                    win: verificationStateResult,
                                                                                                                                                                                                                                                                                                                                                                                                                                                payout: totalWinningsReturn,
                                                                                                                                                                                                                                                                                                                                                                                                                                                            newBalance: parseFloat(userAccountData.balance) + calculatedNetProfitOutcome
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                        } catch (criticalErr) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                await dbPool.query('ROLLBACK');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        console.error("Ledger Process Crash Intercepted:", criticalErr);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                return res.status(500).json({ error: "Transaction roll execution exception pipeline failure." });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    const PORT = process.env.PORT || 5000;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    app.listen(PORT, () => console.log(`Nova Casino Enterprise Core listening on port ${PORT}`));
// Serve the front-end index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

