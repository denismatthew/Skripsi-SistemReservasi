const db = require('../config/db');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

// --- GET ALL USERS ---
const getAllUsersHandler = async (request, h) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.UserID,
                u.Name,
                u.Email,
                u.Address,
                u.PhoneNo,
                u.Role,
                s.StaffRole
            FROM user u
            LEFT JOIN staff s ON u.UserID = s.UserID
            ORDER BY u.UserID ASC
        `);

        return h.response({
            status: 'success',
            message: 'Data user berhasil diambil',
            data: rows
        }).code(200);

    } catch (error) {
        console.error('getAllUsersHandler error:', error);
        return h.response({ 
            status: 'error', 
            message: 'Terjadi kesalahan pada server saat mengambil data user' 
        }).code(500);
    }
};

const getUserByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const [rows] = await db.query(`
            SELECT 
                u.UserID,
                u.Name,
                u.Email,
                u.Address,
                u.PhoneNo,
                u.Role,
                s.StaffRole
            FROM user u
            LEFT JOIN staff s ON u.UserID = s.UserID
            WHERE u.UserID=?
        `, [id]);

        if (rows.length === 0) {
            return h.response({ status: 'fail', message: 'User tidak ditemukan' }).code(404);
        }

        return h.response({ status: 'success', data: rows[0] }).code(200);

    } catch (error) {
        console.error('getUserByIdHandler error:', error);
        return h.response({ status: 'error', message: 'Gagal mengambil data user' }).code(500);
    }
};


// --- ADD USER ---
const addUserHandler = async (request, h) => {
    try {
        const { nama, email, telepon, password, role, address, staffRole } = request.payload;
        const userId = `USER-${nanoid(8)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert ke tabel user
        await db.query(
            `INSERT INTO user (UserID, Name, Email, PhoneNo, Password, Role, Address)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, nama, email, telepon, hashedPassword, role, address]
        );

        // Jika role = staff
        if (role === 'staff') {
            if (!staffRole) {
                return h.response({
                    status: 'fail',
                    message: 'Staff role (Technician/Sales) wajib diisi untuk user staff',
                }).code(400);
            }

            const staffId = `STF-${nanoid(6)}`;
            await db.query(
                `INSERT INTO staff (StaffID, UserID, StaffRole)
                 VALUES (?, ?, ?)`,
                [staffId, userId, staffRole]
            );
        }

        // Jika role = admin
        if (role === 'admin') {
            const adminId = `ADM-${nanoid(6)}`;
            await db.query(
                `INSERT INTO admin (AdminID, UserID)
                 VALUES (?, ?)`,
                [adminId, userId]
            );
        }

        return h.response({
            status: 'success',
            message: 'User baru berhasil ditambahkan',
            data: { userId },
        }).code(201);
    } catch (error) {
        console.error('addUserHandler error:', error);
        return h.response({ status: 'error', message: 'Gagal menambah user' }).code(500);
    }
};

// --- UPDATE USER ---
const updateUserHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { nama, email, telepon, password, role, address, staffRole } = request.payload;

        // Update tabel user
        let query = `UPDATE user SET Name=?, Email=?, PhoneNo=?, Role=?, Address=?`;
        const params = [nama, email, telepon, role, address];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, Password=?`;
            params.push(hashedPassword);
        }

        query += ` WHERE UserID=?`;
        params.push(id);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return h.response({ status: 'fail', message: 'User tidak ditemukan' }).code(404);
        }

        // Hapus semua child dulu
        await db.query(`DELETE FROM staff WHERE UserID=?`, [id]);
        await db.query(`DELETE FROM admin WHERE UserID=?`, [id]);
        // (Customer tidak perlu karena tidak punya atribut tambahan)

        // Tambahkan child baru sesuai role
        if (role === 'staff') {
            if (!staffRole) {
                return h.response({ status: 'fail', message: 'StaffRole wajib diisi untuk staff' }).code(400);
            }
            const staffId = `STF-${nanoid(6)}`;
            await db.query(`INSERT INTO staff (StaffID, UserID, StaffRole) VALUES (?, ?, ?)`, [staffId, id, staffRole]);
        } else if (role === 'admin') {
            const adminId = `ADM-${nanoid(6)}`;
            await db.query(`INSERT INTO admin (AdminID, UserID) VALUES (?, ?)`, [adminId, id]);
        }

        return h.response({ status: 'success', message: 'Data user berhasil diperbarui' }).code(200);

    } catch (error) {
        console.error('updateUserHandler error:', error);
        return h.response({ status: 'error', message: 'Gagal memperbarui user' }).code(500);
    }
};

// --- DELETE USER ---
const deleteUserHandler = async (request, h) => {
    try {
        const { id } = request.params;

        await db.query(`DELETE FROM staff WHERE UserID=?`, [id]);
        await db.query(`DELETE FROM admin WHERE UserID=?`, [id]);
        await db.query(`DELETE FROM user WHERE UserID=?`, [id]);

        return h.response({ status: 'success', message: 'User berhasil dihapus' }).code(200);
    } catch (error) {
        console.error('deleteUserHandler error:', error);
        return h.response({ status: 'error', message: 'Gagal menghapus user' }).code(500);
    }
};

module.exports = {
    getAllUsersHandler,
    getUserByIdHandler,
    addUserHandler,
    updateUserHandler,
    deleteUserHandler,
};
