import express from 'express';
import transactionsRoute from './routes/transactionsRoute.js';
import dotenv from 'dotenv';
import { sql } from './config/db.js';  
import rateLimiter from './middleware/rateLimiter.js';
import job from './config/cron.js'; 

dotenv.config();

const app = express();

// Démarrage du cron job seulement en production
if(process.env.NODE_ENV === "production") job.start(); 

// Middleware pour parser le JSON
app.use(rateLimiter);
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Initialisation de la base
async function init() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2),
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Connexion à la base de données réussie ✅");
  } catch (error) {
    console.error("Connexion à la base de données échouée ❌", error);
  }
}

// Initialisation + démarrage du serveur
init().then(() => {
  // Définir les routes AVANT de démarrer le serveur
  app.use("/api/transactions", transactionsRoute);

  app.listen(process.env.PORT || 5001, () => {
    console.log('Server is running on port:', process.env.PORT || 5001);
  });
});
  const testDB = async () => {
  const result = await sql`SELECT NOW()`;
  console.log("DB time:", result);
};
testDB();
