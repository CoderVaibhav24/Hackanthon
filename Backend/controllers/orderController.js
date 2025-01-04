const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const orderId = await Order.create({
            ...req.body,
            created_by: req.user.id
        });
        const order = await Order.findById(orderId);
        res.status(201).json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Error retrieving orders' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Error retrieving order' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status, actual_delivery_date } = req.body;
        const updated = await Order.updateStatus(req.params.id, status, actual_delivery_date);
        if (!updated) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const order = await Order.findById(req.params.id);
        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};

const getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.getPendingOrders();
        res.json(orders);
    } catch (error) {
        console.error('Get pending orders error:', error);
        res.status(500).json({ message: 'Error retrieving pending orders' });
    }
};

const getOrdersByDateRange = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const orders = await Order.getOrdersByDateRange(start_date, end_date);
        res.json(orders);
    } catch (error) {
        console.error('Get orders by date range error:', error);
        res.status(500).json({ message: 'Error retrieving orders' });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getPendingOrders,
    getOrdersByDateRange
};