const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');

const createTransaction = async (req, res) => {
    try {
        const transactionData = {
            ...req.body,
            user_id: req.user.userId // From JWT token
        };

        // Validate product exists
        const product = await Product.findById(transactionData.product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validate stock level for OUT transactions
        if (transactionData.transaction_type === 'OUT') {
            if (product.stock_level < transactionData.quantity) {
                return res.status(400).json({ 
                    message: 'Insufficient stock level' 
                });
            }
        }

        const transactionId = await InventoryTransaction.create(transactionData);
        
        res.status(201).json({
            message: 'Transaction created successfully',
            transactionId
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ 
            message: 'Error creating transaction',
            error: error.message 
        });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.findAll();
        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

const getProductTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.findByProduct(req.params.productId);
        res.json(transactions);
    } catch (error) {
        console.error('Get product transactions error:', error);
        res.status(500).json({ message: 'Error fetching product transactions' });
    }
};

const getProductBalance = async (req, res) => {
    try {
        const balance = await InventoryTransaction.getProductBalance(req.params.productId);
        res.json({ balance });
    } catch (error) {
        console.error('Get product balance error:', error);
        res.status(500).json({ message: 'Error fetching product balance' });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getProductTransactions,
    getProductBalance
};