const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getPendingOrders,
    getOrdersByDateRange
} = require('../controllers/orderController');

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/pending', getPendingOrders);
router.get('/date-range', getOrdersByDateRange);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;