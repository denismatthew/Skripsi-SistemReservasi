const db = require('../config/db');
const { nanoid } = require('nanoid');


const getAllServicesHandler = async (request, h) => {
    try {
        const [rows] = await db.query(`
            SELECT
                Service_ID,
                Name,
                Description,
                Price,
                is_Active,
                Created_At,
                Updated_At
            FROM service
        `);

        return h.response({
            status: 'success',
            message: 'Data service berhasil diambil',
            data: rows
        }).code(200);
    } catch (error) {
        console.error('getAllServicesHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};


const addServiceHandler = async (request, h) => {
    try {
        const { nama, deskripsi, harga, isActive } = request.payload;
        const serviceId = `SERV-${nanoid(8)}`;

        await db.query(
            'INSERT INTO service (Service_ID, Name, Description, Price, is_Active) VALUES (?,?,?,?,?)',
            [serviceId, nama, deskripsi, harga, isActive]
        );

        return h.response({
            status: 'success',
            message: 'Data service berhasil ditambah',
            data: {
                serviceId
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


const updateServiceHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { nama, deskripsi, harga, isActive } = request.payload;

        const [result] = await db.query(
            `UPDATE service 
             SET Name = ?, Description = ?, Price = ?, is_Active = ?, Updated_At = NOW()
             WHERE Service_ID = ?`,
            [nama, deskripsi, harga, isActive, id]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Data service tidak ditemukan'
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Data service berhasil diperbarui'
        }).code(200);
    } catch (error) {
        console.error('updateServiceHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

const deleteServiceHandler = async (request, h) => {
    try {
        const { id } = request.params;

        const [result] = await db.query(
            'DELETE FROM service WHERE Service_ID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Data service tidak ditemukan'
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Data service berhasil dihapus'
        }).code(200);
    } catch (error) {
        console.error('deleteServiceHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

const updateServiceStatusHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { isActive } = request.payload;

        const [result] = await db.query(
            `UPDATE service 
             SET is_Active = ?, Updated_At = NOW() 
             WHERE Service_ID = ?`,
            [isActive, id]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Data service tidak ditemukan'
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Status layanan diperbarui',
            data: { id, isActive }
        }).code(200);
    } catch (error) {
        console.error('updateServiceStatusHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};


module.exports = { getAllServicesHandler, addServiceHandler, updateServiceHandler, deleteServiceHandler, updateServiceStatusHandler };
