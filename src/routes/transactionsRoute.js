import express from 'express';
import{getTransactionsbyuserId,
    createTransaction,
    deleteTransaction,
    getTransactionSummary
} from '../controllers/transactionsController.js';


const router = express.Router();

router.get("/:userid", getTransactionsbyuserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userid", getTransactionSummary);

export default router;
