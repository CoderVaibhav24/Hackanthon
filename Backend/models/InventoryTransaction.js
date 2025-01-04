const db = require('../config/db');

class InventoryTransaction {
    static async create(transactionData) {
        const { 
            product_id, 
            transaction_type, 
            quantity, 
            reference_number, 
            notes, 
            user_id 
        } = transactionData;

        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Create transaction record
            const [result] = await connection.query(
                'INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reference_number, notes, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [product_id, transaction_type, quantity, reference_number, notes, user_id]
            );

            // Update product stock
            const stockChange = transaction_type === 'IN' ? quantity : -quantity;
            await connection.query(
                'UPDATE products SET stock_level = stock_level + ? WHERE id = ?',
                [stockChange, product_id]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findAll() {
        const [rows] = await db.query(`
            SELECT 
                it.*,
                p.name as product_name,
                u.name as user_name
            FROM inventory_transactions it
            JOIN products p ON it.product_id = p.id
            JOIN users u ON it.user_id = u.id
            ORDER BY it.transaction_date DESC
        `);
        return rows;
    }

    static async findByProduct(productId) {
        const [rows] = await db.query(`
            SELECT 
                it.*,
                p.name as product_name,
                u.name as user_name
            FROM inventory_transactions it
            JOIN products p ON it.product_id = p.id
            JOIN users u ON it.user_id = u.id
            WHERE it.product_id = ?
            ORDER BY it.transaction_date DESC
        `, [productId]);
        return rows;
    }

    static async getProductBalance(productId) {
        const [rows] = await db.query(`
            SELECT 
                SUM(CASE WHEN transaction_type = 'IN' THEN quantity 
                         WHEN transaction_type = 'OUT' THEN -quantity 
                    END) as balance
            FROM inventory_transactions
            WHERE product_id = ?
        `, [productId]);
        return rows[0].balance || 0;
    }
}

module.exports = InventoryTransaction;