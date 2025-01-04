const Product = require('../models/Product');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const productId = await Product.create(productData);
        
        res.status(201).json({
            message: 'Product created successfully',
            productId
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

// Get a single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const updated = await Product.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// Update product stock
const updateStock = async (req, res) => {
    try {
        const { quantity } = req.body;
        const updated = await Product.updateStock(req.params.id, quantity);
        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ message: 'Error updating stock' });
    }
};

const searchProducts = async (req, res) => {
    try {
        const searchParams = {
            keyword: req.query.keyword,
            category_id: req.query.category_id,
            min_price: req.query.min_price,
            max_price: req.query.max_price,
            in_stock: req.query.in_stock === 'true',
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort_by: req.query.sort_by,
            sort_order: req.query.sort_order
        };

        const result = await Product.search(searchParams);
        res.json(result);
    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({ 
            message: 'Error searching products',
            error: error.message 
        });
    }
};

const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.getLowStockProducts();
        res.json(products);
    } catch (error) {
        console.error('Get low stock products error:', error);
        res.status(500).json({ message: 'Error fetching low stock products' });
    }
};

const getProductStats = async (req, res) => {
    try {
        const stats = await Product.getProductStats();
        res.json(stats);
    } catch (error) {
        console.error('Get product stats error:', error);
        res.status(500).json({ message: 'Error fetching product statistics' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    searchProducts,
    getLowStockProducts,
    getProductStats
};