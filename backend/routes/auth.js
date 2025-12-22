const Joi = require('@hapi/joi');
const { registerHandler, loginHandler } = require('../handlers/authHandler');

const authRoutes = {
    name: 'auth-routes',
    version: '1.0.0',
    register: async (server) => {
        
        server.route({
            method: 'POST',
            path: '/register',
            handler: registerHandler,
            options: {
                auth: false,
                validate: {
                    payload: Joi.object({
                        nama: Joi.string().required().messages({
                            'any.required': 'Nama lengkap harus diisi',
                            'string.empty': 'Nama lengkap tidak boleh kosong'
                        }),
                        email: Joi.string().email().required().messages({
                            'any.required': 'Email harus diisi',
                            'string.email': 'Format email tidak valid',
                            'string.empty': 'Email tidak boleh kosong'
                        }),
                        password: Joi.string().min(8).required().messages({
                            'any.required': 'Password harus diisi',
                            'string.min': 'Password minimal 8 karakter',
                            'string.empty': 'Password tidak boleh kosong'
                        }),
                        phoneNo: Joi.string().pattern(/^[0-9]+$/).min(10).required().messages({
                            'any.required': 'Nomor telepon harus diisi',
                            'string.pattern.base': 'Nomor telepon hanya boleh angka',
                            'string.min': 'Nomor telepon minimal 10 digit',
                            'string.empty': 'Nomor telepon tidak boleh kosong'
                        }),
                        address: Joi.string().required().messages({
                            'any.required': 'Alamat harus diisi',
                            'string.empty': 'Alamat telepon tidak boleh kosong'
                        })
                    }),
                    failAction: (request, h, error) => {
                        const errorMessage = error.details[0].message;
                        return h.response({
                            status: 'fail',
                            message: errorMessage
                        }).code(400).takeover();
                    }
                }
            }
        });

        // Login Route
        server.route({
            method: 'POST',
            path: '/login',
            handler: loginHandler,
            options: {
                auth: false,
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email().required().messages({
                            'any.required': 'Email harus diisi',
                            'string.email': 'Format email tidak valid',
                            'string.empty': 'Email tidak boleh kosong'
                        }),
                        password: Joi.string().required().messages({
                            'any.required': 'Password harus diisi',
                            'string.empty': 'Password tidak boleh kosong'
                        })
                    }),
                    failAction: (request, h, error) => {
                        const errorMessage = error.details[0].message;
                        return h.response({
                            status: 'fail',
                            message: errorMessage
                        }).code(400).takeover();
                    }
                }
            }
        });
    }
};

module.exports = authRoutes;