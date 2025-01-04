const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createTransaction,
    getAllTransactions,
    getProductTransactions,
    getProductBalance
} = require('../controllers/inventoryTransactionController');

router.use(authenticateToken);

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/product/:productId', getProductTransactions);
router.get('/product/:productId/balance', getProductBalance);

module.exports = router;