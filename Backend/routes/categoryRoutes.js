const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts
} = require('../controllers/categoryController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Category routes
router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:id/products', getCategoryProducts);

module.exports = router;