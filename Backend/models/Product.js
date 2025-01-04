const db = require('../config/db');

class Product {
    static async create(productData) {
        const { 
            name, 
            description, 
            category_id, 
            price, 
            stock_level, 
            reorder_point 
        } = productData;

        const [result] = await db.query(
            'INSERT INTO products (name, description, category_id, price, stock_level, reorder_point) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, category_id, price, stock_level, reorder_point]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    }

    static async update(id, productData) {
        const { 
            name, 
            description, 
            category_id, 
            price, 
            stock_level, 
            reorder_point 
        } = productData;

        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, category_id = ?, price = ?, stock_level = ?, reorder_point = ? WHERE id = ?',
            [name, description, category_id, price, stock_level, reorder_point, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async search({
        keyword = '',
        category_id = null,
        min_price = null,
        max_price = null,
        in_stock = null,
        page = 1,
        limit = 10,
        sort_by = 'name',
        sort_order = 'ASC'
    }) {
        try {
            let query = `
                SELECT 
                    p.*,
                    c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE 1=1
            `;
            const params = [];

            // Search by keyword in name or description
            if (keyword) {
                query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
                params.push(`%${keyword}%`, `%${keyword}%`);
            }

            // Filter by category
            if (category_id) {
                query += ` AND p.category_id = ?`;
                params.push(category_id);
            }

            // Filter by price range
            if (min_price !== null) {
                query += ` AND p.price >= ?`;
                params.push(min_price);
            }
            if (max_price !== null) {
                query += ` AND p.price <= ?`;
                params.push(max_price);
            }

            // Filter by stock availability
            if (in_stock === true) {
                query += ` AND p.stock_level > 0`;
            }

            // Count total results
            const countQuery = `SELECT COUNT(*) as total FROM (${query}) as subquery`;
            const [[countResult]] = await db.query(countQuery, params);
            const total = countResult.total;

            // Add sorting
            const validSortColumns = ['name', 'price', 'stock_level', 'created_at'];
            const validSortOrders = ['ASC', 'DESC'];
            
            const finalSortBy = validSortColumns.includes(sort_by) ? sort_by : 'name';
            const finalSortOrder = validSortOrders.includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'ASC';
            
            query += ` ORDER BY p.${finalSortBy} ${finalSortOrder}`;

            // Add pagination
            const offset = (page - 1) * limit;
            query += ` LIMIT ? OFFSET ?`;
            params.push(parseInt(limit), parseInt(offset));

            // Get paginated results
            const [products] = await db.query(query, params);

            return {
                products,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total_pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }

    static async getLowStockProducts() {
        const [rows] = await db.query(`
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.stock_level <= p.reorder_point
            ORDER BY p.stock_level ASC
        `);
        return rows;
    }

    static async getProductStats() {
        const [rows] = await db.query(`
            SELECT
                COUNT(*) as total_products,
                SUM(stock_level) as total_stock,
                AVG(price) as average_price,
                COUNT(CASE WHEN stock_level <= reorder_point THEN 1 END) as low_stock_count
            FROM products
        `);
        return rows[0];
    }

    static async updateStock(id, quantity, isIncrement = true) {
        const operator = isIncrement ? '+' : '-';
        const [result] = await db.query(
            `UPDATE products SET stock_level = stock_level ${operator} ? WHERE id = ?`,
            [quantity, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Product;