const db = require('../config/db');

class Supplier {
    static async create(supplierData) {
        const {
            name,
            contact_person,
            email,
            phone,
            address,
            status = 'active'
        } = supplierData;

        const [result] = await db.query(
            'INSERT INTO suppliers (name, contact_person, email, phone, address, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, contact_person, email, phone, address, status]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.query(`
            SELECT 
                s.*,
                (SELECT COUNT(*) FROM orders WHERE supplier_id = s.id) as total_orders,
                (SELECT COUNT(*) FROM orders WHERE supplier_id = s.id AND status = 'pending') as pending_orders
            FROM suppliers s
            ORDER BY s.name
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT * FROM suppliers WHERE id = ?
        `, [id]);
        return rows[0];
    }

    static async update(id, supplierData) {
        const {
            name,
            contact_person,
            email,
            phone,
            address,
            status
        } = supplierData;

        const [result] = await db.query(
            'UPDATE suppliers SET name = ?, contact_person = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?',
            [name, contact_person, email, phone, address, status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getSupplierOrders(supplierId) {
        const [rows] = await db.query(`
            SELECT 
                o.*,
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
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.supplier_id = ?
            GROUP BY o.id
            ORDER BY o.order_date DESC
        `, [supplierId]);
        return rows;
    }

    static async search(query) {
        const searchQuery = `%${query}%`;
        const [rows] = await db.query(`
            SELECT * FROM suppliers
            WHERE name LIKE ? 
            OR contact_person LIKE ?
            OR email LIKE ?
            OR phone LIKE ?
            ORDER BY name
        `, [searchQuery, searchQuery, searchQuery, searchQuery]);
        return rows;
    }
}

module.exports = Supplier;