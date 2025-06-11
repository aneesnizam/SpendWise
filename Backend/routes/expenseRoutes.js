import express from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  filterExpenses,
  sharedExpenses,
  acceptPaymentRequest,
  rejectPaymentRequest
} from '../controllers/expenseController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware); 

router.post('/', createExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.get('/filter', filterExpenses);
router.get('/shared', sharedExpenses)
router.post('/accept/:id', acceptPaymentRequest)
router.post('/reject/:id', rejectPaymentRequest)

export default router;
