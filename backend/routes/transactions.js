const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} = require('../controllers/txController');
const authMiddleware = require('../middleware/authMiddleware');

// Pasang middleware di atas agar semua route di bawahnya otomatis terkunci gembok auth
router.use(authMiddleware);

router.post('/', createTransaction);      // POST /api/transactions
router.get('/', getTransactions);         // GET /api/transactions
router.put('/:id', updateTransaction);    // PUT /api/transactions/:id
router.delete('/:id', deleteTransaction); // DELETE /api/transactions/:id

module.exports = router;