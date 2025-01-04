const db = require('../config/db');

class Category {
    static async create(categoryData) {
        const { name, description } = categoryData;
        const [result] = await db.query(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM categories');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, categoryData) {
        const { name, description } = categoryData;
        const [result] = await db.query(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getProductsByCategory(categoryId) {
        const [rows] = await db.query(
            'SELECT * FROM products WHERE category_id = ?',
            [categoryId]
        );
        return rows;
    }
}

module.exports = Category;