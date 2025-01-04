const db = require('../config/db');

class Role {
    static async create(roleData) {
        const { name, description, permissions } = roleData;
        const [result] = await db.query(
            'INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)',
            [name, description, JSON.stringify(permissions)]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM roles');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, roleData) {
        const { name, description, permissions } = roleData;
        const [result] = await db.query(
            'UPDATE roles SET name = ?, description = ?, permissions = ? WHERE id = ?',
            [name, description, JSON.stringify(permissions), id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Role;