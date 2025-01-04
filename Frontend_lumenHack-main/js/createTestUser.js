// scripts/createTestUser.js
const bcryptjs = require('bcryptjs');
const db = require('../config/db');

async function createTestUser() {
    try {
        const password = 'password123';
        const hashedPassword = await bcryptjs.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            ['Test User', 'test@example.com', hashedPassword]
        );

        console.log('Test user created successfully');
        console.log('Email: test@example.com');
        console.log('Password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
}

createTestUser();