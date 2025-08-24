import express from 'express';
import transactionsRoute from './src/routes/transactionsRoute.js';
import dotenv from 'dotenv';
import { sql } from './src/config/db.js';  
import rateLimiter from './src/middleware/rateLimiter.js';
import job from './src/config/cron.js'; 



dotenv.config();

const app = express();

if(process.env.NODE_ENV === "production") job.start(); // Démarrer le cron job
// Middleware pour parser le JSON
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function init() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR (255) NOT NULL,
      title VARCHAR (255) NOT NULL,
      amount DECIMAL(10, 2),
      category VARCHAR (255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    
    console.log("Connexion à la base de données réussie ✅");
  } catch (error) {
    console.error("Connexion à la base de données échouée ❌", error);
  }
}

init().then(() => {
    app.listen(PORT, () => {
  console.log('Server is running on port:', PORT);
});
});

app.use("/api/transactions", transactionsRoute);
