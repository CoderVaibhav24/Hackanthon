const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    getSupplierOrders,
    searchSuppliers
} = require('../controllers/supplierController');

router.use(authenticateToken);

router.post('/', createSupplier);
router.get('/', getAllSuppliers);
router.get('/search', searchSuppliers);
router.get('/:id', getSupplierById);
router.get('/:id/orders', getSupplierOrders);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;