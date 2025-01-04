const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Since password is stored as plain text in your database
        if (password !== user.password) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const userId = await User.create({ name, email, password });

        res.status(201).json({
            message: 'User registered successfully',
            userId
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    register
};