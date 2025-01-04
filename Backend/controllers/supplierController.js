const Supplier = require('../models/Supplier');

const createSupplier = async (req, res) => {
    try {
        const supplierId = await Supplier.create(req.body);
        const supplier = await Supplier.findById(supplierId);
        res.status(201).json(supplier);
    } catch (error) {
        console.error('Create supplier error:', error);
        res.status(500).json({ message: 'Error creating supplier' });
    }
};

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (error) {
        console.error('Get suppliers error:', error);
        res.status(500).json({ message: 'Error retrieving suppliers' });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        console.error('Get supplier error:', error);
        res.status(500).json({ message: 'Error retrieving supplier' });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const updated = await Supplier.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        const supplier = await Supplier.findById(req.params.id);
        res.json(supplier);
    } catch (error) {
        console.error('Update supplier error:', error);
        res.status(500).json({ message: 'Error updating supplier' });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const deleted = await Supplier.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Delete supplier error:', error);
        res.status(500).json({ message: 'Error deleting supplier' });
    }
};

const getSupplierOrders = async (req, res) => {
    try {
        const orders = await Supplier.getSupplierOrders(req.params.id);
        res.json(orders);
    } catch (error) {
        console.error('Get supplier orders error:', error);
        res.status(500).json({ message: 'Error retrieving supplier orders' });
    }
};

const searchSuppliers = async (req, res) => {
    try {
        const { query } = req.query;
        const suppliers = await Supplier.search(query);
        res.json(suppliers);
    } catch (error) {
        console.error('Search suppliers error:', error);
        res.status(500).json({ message: 'Error searching suppliers' });
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    getSupplierOrders,
    searchSuppliers
};