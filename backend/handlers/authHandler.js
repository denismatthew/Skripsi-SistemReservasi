const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const db = require('../config/db');

// Register Handler
const registerHandler = async (request, h) => {
    try {
        const { nama, email, password, phoneNo, address } = request.payload;

        const [existingUsers] = await db.query(
            'SELECT Email FROM user WHERE Email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return h.response({
                status: 'fail',
                message: 'Email sudah terdaftar'
            }).code(400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique ID
        const userId = `USER-${nanoid(16)}`;
        const customerId = `CUST-${nanoid(16)}`;

        // Insert user to database
        await db.query(
            'INSERT INTO user (UserID, Name, Email, Password, Role, PhoneNo, Address) VALUES (?, ?, ?, ?, "Customer", ?, ?)',
            [userId, nama, email, hashedPassword, phoneNo, address]
        );

        // Insert ke tabel customer
        await db.query(
            'INSERT INTO customer (CustomerID, UserID) VALUES (?, ?)',
            [customerId, userId]
        );

        return h.response({
            status: 'success',
            message: 'User Customer berhasil didaftarkan',
            data: {
                userId,
                customerId
            }
        }).code(201);

    } catch (error) {
        console.error('Register error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

// Login Handler
const loginHandler = async (request, h) => {
    try {
        const { email, password } = request.payload;

        // Get user from database
        const [users] = await db.query(
            'SELECT UserID, Name, Email, Password, Role FROM user WHERE Email = ?',
            [email]
        );

        if (users.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Email atau password salah'
            }).code(401);
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            return h.response({
                status: 'fail',
                message: 'Email atau password salah'
            }).code(401);
        }

        let staffRole = null;

        if (user.Role === 'staff') {
        const [staffRows] = await db.query('SELECT StaffRole FROM staff WHERE UserID = ?', [user.UserID]);
        if (staffRows.length > 0) {
            staffRole = staffRows[0].StaffRole;
        }
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.UserID,
                email: user.Email,
                role: user.Role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token valid 7 hari
        );

        return h.response({
            status: 'success',
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user.UserID,
                    nama: user.Name,
                    email: user.Email,
                    role: user.Role,
                    staffRole
                }
            }
        }).code(200);

    } catch (error) {
        console.error('Login error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

module.exports = {
    registerHandler,
    loginHandler
};