const Category = require('../models/Category');

const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const categoryId = await Category.create(categoryData);
        
        res.status(201).json({
            message: 'Category created successfully',
            categoryId
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ 
            message: 'Error creating category',
            error: error.message
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ message: 'Error fetching category' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const updated = await Category.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Error updating category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
};

const getCategoryProducts = async (req, res) => {
    try {
        const products = await Category.getProductsByCategory(req.params.id);
        res.json(products);
    } catch (error) {
        console.error('Get category products error:', error);
        res.status(500).json({ message: 'Error fetching category products' });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts
};