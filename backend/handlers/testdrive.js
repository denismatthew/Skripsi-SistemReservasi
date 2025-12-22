const db = require('../config/db');
const { nanoid } = require('nanoid');


const getTestDriveDataHandler = async (request, h) => {
    try {
        const [rows] = await db.query(`
            SELECT
                TestDrive_ID,
                VehicleModel,
                PoliceNo,
                isAvailable
            FROM test_drive
        `);

        return h.response({
            status: 'success',
            message: 'Data test drive berhasil diambil',
            data: rows
        }).code(200);
    } catch (error) {
        console.error('getTestDriveDataHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};


const addDataTestDriveHandler = async (request, h) => {
    try {
        const { model, noplat, isAvailable } = request.payload;
        const testdriveId = `TDRV-${nanoid(8)}`;

        await db.query(
            'INSERT INTO test_drive (TestDrive_ID, VehicleModel, PoliceNo, isAvailable) VALUES (?,?,?,?)',
            [testdriveId, model, noplat, isAvailable]
        );

        return h.response({
            status: 'success',
            message: 'Data test drive berhasil ditambah',
            data: {
                testdriveId
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


const updateDataTestDriveHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { model, noplat, isAvailable } = request.payload;

        const [result] = await db.query(
            `UPDATE test_drive
             SET VehicleModel = ?, PoliceNo = ?, isAvailable = ?
             WHERE TestDrive_ID = ?`,
            [model, noplat, isAvailable, id]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Data test drive tidak ditemukan'
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Data test drive berhasil diperbarui'
        }).code(200);
    } catch (error) {
        console.error('updateDataTestDriveHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

const deleteDataTestDriveHandler = async (request, h) => {
    try {
        const { id } = request.params;

        const [result] = await db.query(
            'DELETE FROM test_drive WHERE TestDrive_ID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Data test drive tidak ditemukan'
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Data test drive berhasil dihapus'
        }).code(200);
    } catch (error) {
        console.error('deleteDataTestDriveHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

const updateDataTestDriveStatusHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { isAvailable } = request.payload;

        const [result] = await db.query(
            `UPDATE test_drive 
             SET isAvailable = ?
             WHERE TestDrive_ID = ?`,
            [isAvailable, id]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Data test drive tidak ditemukan'
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Status layanan diperbarui',
            data: { id, isAvailable }
        }).code(200);
    } catch (error) {
        console.error('updateDataTestDriveStatusHandler error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

module.exports = { getTestDriveDataHandler, addDataTestDriveHandler, updateDataTestDriveHandler, deleteDataTestDriveHandler, updateDataTestDriveStatusHandler };
