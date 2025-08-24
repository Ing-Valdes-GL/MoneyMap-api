import { neon } from "@neondatabase/serverless";
import "dotenv/config";


// Crée la connexion à la base de données
export const sql = neon(process.env.DATABASE_URL);


