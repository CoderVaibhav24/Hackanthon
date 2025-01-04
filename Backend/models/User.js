const db = require('../config/db');
const bcryptjs = require('bcryptjs');

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await db.query(
                'SELECT id, name, email, password, role, created_at FROM users WHERE email = ?', 
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw error;
        }
    }

    static async validatePassword(providedPassword, storedPassword) {
        // For plain text password in database
        return providedPassword === storedPassword;
    }

    static async create(userData) {
        const { name, email, password, role = 'staff' } = userData;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    }
}

module.exports = User;