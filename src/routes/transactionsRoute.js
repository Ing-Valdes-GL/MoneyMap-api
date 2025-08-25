import express from 'express';
import {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryByUserId
} from '../controllers/transactionsController.js';

const router = express.Router();

// **Important : ordre des routes**
router.get('/summary/:userId', getSummaryByUserId);  // summary avant :userid
router.get('/:userId', getTransactionsByUserId);     // récupère toutes les transactions
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;
