const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getLowStockProducts,
    getProductStats
} = require('../controllers/productController');

router.use(authenticateToken);

// Existing routes
router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;