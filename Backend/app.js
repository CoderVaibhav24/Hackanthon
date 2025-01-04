const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const inventoryTransactionRoutes = require('./routes/inventoryTransactionRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://127.0.0.1:5500', // This is the default Live Server URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory-transactions', inventoryTransactionRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app;