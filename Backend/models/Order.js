const db = require('../config/db');

class Order {
    static async create(orderData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const {
                supplier_id,
                expected_delivery_date,
                notes,
                created_by,
                items
            } = orderData;

            // Calculate total amount from items
            const total_amount = items.reduce((sum, item) => 
                sum + (item.quantity * item.unit_price), 0);

            // Create order
            const [orderResult] = await connection.query(
                `INSERT INTO orders (
                    supplier_id, 
                    status, 
                    expected_delivery_date, 
                    total_amount, 
                    notes, 
                    created_by
                ) VALUES (?, 'pending', ?, ?, ?, ?)`,
                [supplier_id, expected_delivery_date, total_amount, notes, created_by]
            );

            const orderId = orderResult.insertId;

            // Insert order items
            for (const item of items) {
                await connection.query(
                    `INSERT INTO order_items (
                        order_id, 
                        product_id, 
                        quantity, 
                        unit_price, 
                        total_price
                    ) VALUES (?, ?, ?, ?, ?)`,
                    [
                        orderId,
                        item.product_id,
                        item.quantity,
                        item.unit_price,
                        item.quantity * item.unit_price
                    ]
                );
            }

            await connection.commit();
            return orderId;
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
                o.*,
                s.name as supplier_name,
                u.name as created_by_name,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'product_id', oi.product_id,
                        'product_name', p.name,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'total_price', oi.total_price
                    )
                ) as items
            FROM orders o
            LEFT JOIN suppliers s ON o.supplier_id = s.id
            LEFT JOIN users u ON o.created_by = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            GROUP BY o.id
            ORDER BY o.order_date DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT 
                o.*,
                s.name as supplier_name,
                u.name as created_by_name,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'product_id', oi.product_id,
                        'product_name', p.name,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'total_price', oi.total_price
                    )
                ) as items
            FROM orders o
            LEFT JOIN suppliers s ON o.supplier_id = s.id
            LEFT JOIN users u ON o.created_by = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = ?
            GROUP BY o.id
        `, [id]);
        return rows[0];
    }

    static async updateStatus(id, status, actualDeliveryDate = null) {
        const [result] = await db.query(
            'UPDATE orders SET status = ?, actual_delivery_date = ? WHERE id = ?',
            [status, actualDeliveryDate, id]
        );
        return result.affectedRows > 0;
    }

    static async getPendingOrders() {
        const [rows] = await db.query(`
            SELECT 
                o.*,
                s.name as supplier_name
            FROM orders o
            LEFT JOIN suppliers s ON o.supplier_id = s.id
            WHERE o.status = 'pending'
            ORDER BY o.order_date
        `);
        return rows;
    }

    static async getOrdersByDateRange(startDate, endDate) {
        const [rows] = await db.query(`
            SELECT 
                o.*,
                s.name as supplier_name
            FROM orders o
            LEFT JOIN suppliers s ON o.supplier_id = s.id
            WHERE o.order_date BETWEEN ? AND ?
            ORDER BY o.order_date DESC
        `, [startDate, endDate]);
        return rows;
    }
}

module.exports = Order;