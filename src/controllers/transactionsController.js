import { sql } from '../config/db.js';


export async function getTransactionsbyuserId(){
    async (req, res) => {
  try {
    const { userid } = req.params;
    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userid} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions ❌", error);
    res.status(500).send("Erreur lors de la récupération des transactions ❌");
  }
}
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount == undefined || !category) {
      return res.status(400).send("Tous les champs sont requis ❌");
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;
    console.log(transaction);
    res.status(201).json(transaction[0]);

  } catch (error) {
    console.error("Erreur lors de la création de la transaction ❌", error);
    res.status(500).send("Erreur lors de la création de la transaction ❌");
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("ID de la transaction requis ❌");
    }
    if (isNaN(parseInt(id))) {
      return res.status(400).send("ID de la transaction invalide ❌");
    }
    const result = await sql`DELETE FROM transactions WHERE id = ${id}`;
    if (result.count === 0) {
      return res.status(404).send("Transaction non trouvée ❌");
    }
    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de la transaction ❌", error);
    res.status(500).send("Erreur lors de la suppression de la transaction ❌");
  }
}

export async function getTransactionSummary(req, res) {
  try {
    const { userid } = req.params;
    const balance = await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userid}`;
    
    const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userid} AND amount > 0`;
    
    const expensesResult = await sql`SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userid} AND amount < 0`;

    res.status(200).json({ balance: balance[0].balance, income: incomeResult[0].income, expenses: expensesResult[0].expenses });
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions ❌", error);
    res.status(500).send("Erreur lors de la récupération des transactions ❌");
  }
}