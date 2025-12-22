const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware untuk verifikasi JWT token
 * dan optionally cek role user (misal: hanya admin)
 */
const verifyToken = (requiredRole = null) => {
  return async (request, h) => {
    try {
      // Ambil header Authorization: Bearer <token>
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return h
          .response({
            status: 'fail',
            message: 'Token tidak ditemukan atau format salah',
          })
          .code(401)
          .takeover();
      }

      const token = authHeader.split(' ')[1]; // ambil token setelah "Bearer "

      // Verifikasi token menggunakan secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Simpan data user ke dalam request (biar bisa dipakai di handler)
      request.user = decoded;

      // Kalau route butuh role tertentu, cek di sini
      if (requiredRole && decoded.role !== requiredRole) {
        return h
          .response({
            status: 'fail',
            message: 'Akses ditolak: kamu tidak memiliki izin',
          })
          .code(403)
          .takeover();
      }

      // Kalau semua aman, lanjut ke handler
      return h.continue;
    } catch (err) {
      console.error('verifyToken error:', err);
      return h
        .response({
          status: 'fail',
          message: 'Token tidak valid atau sudah kedaluwarsa',
        })
        .code(401)
        .takeover();
    }
  };
};

module.exports = verifyToken;
