import { sql } from "../config/db.js";

// Récupère toutes les transactions d'un utilisateur
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE user_id = user_31jTmbSsd1wOrZEY2EdXtNzjPCX
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Erreur getTransactionsByUserId :", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Crée une transaction
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [transaction] = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Erreur createTransaction :", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Supprime une transaction
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    const [result] = await sql`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING *
    `;

    if (!result) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Erreur deleteTransaction :", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Résumé (summary) des transactions
export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const [balanceResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
    `;
    const [incomeResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;
    const [expensesResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult.balance,
      income: incomeResult.income,
      expenses: expensesResult.expenses
    });
  } catch (error) {
    console.error("Erreur getSummaryByUserId :", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
