import { sql } from "../config/db.js";

/**
 * Récupérer toutes les transactions d'un utilisateur
 */
export async function getTransactionsByUserId(req, res) {
  try {
    const { userid } = req.params;
    if (!userid) return res.status(400).json({ message: "User ID is required" });

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE user_id = ${userid}
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Créer une nouvelle transaction
 */
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const [transaction] = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${numericAmount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Supprimer une transaction par ID
 */
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    if (isNaN(numericId)) return res.status(400).json({ message: "Invalid transaction ID" });

    const [deleted] = await sql`
      DELETE FROM transactions
      WHERE id = ${numericId}
      RETURNING *
    `;

    if (!deleted) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Obtenir le résumé des transactions pour un utilisateur
 */
export async function getSummaryByUserId(req, res) {
  try {
    const { userid } = req.params;
    if (!userid) return res.status(400).json({ message: "User ID is required" });

    const [balanceResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userid}
    `;
    const [incomeResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userid} AND amount > 0
    `;
    const [expensesResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions
      WHERE user_id = ${userid} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult.balance,
      income: incomeResult.income,
      expenses: expensesResult.expenses,
    });
  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
