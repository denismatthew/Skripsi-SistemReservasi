const db = require('../config/db');

const getServiceBookingsHandler = async (request, h) => {
  try {
    // Admin bisa akses semua — tidak ambil StaffID dari token

    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        st.Name AS Staff_Name,
        bs.Model_Kendaraan,
        bs.No_Polisi,
        bs.Kilometer,
        bs.Keluhan,
        b.Created_At,
        b.Updated_At
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      LEFT JOIN staff s2 ON b.StaffID = s2.StaffID
      LEFT JOIN user st ON s2.UserID = st.UserID
      LEFT JOIN booking_service bs ON b.BookingID = bs.BookingID
      WHERE b.BookingType = 'Servis'
      ORDER BY b.Updated_At DESC
    `);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);

  } catch (err) {
    console.error('❌ Error getServiceBookingsHandler (Admin):', err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data booking (admin)',
    }).code(500);
  }
};

const getTestDriveBookingsHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        st.Name AS Staff_Name,
        td.VehicleModel,
        td.PoliceNo,
        btd.Catatan,
        b.Created_At,
        b.Updated_At
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      LEFT JOIN staff s2 ON b.StaffID = s2.StaffID
      LEFT JOIN user st ON s2.UserID = st.UserID
      LEFT JOIN booking_test_drive btd ON b.BookingID = btd.BookingID
      LEFT JOIN test_drive td ON btd.TestDrive_ID = td.TestDrive_ID
      WHERE b.BookingType = 'TestDrive'
      ORDER BY b.Updated_At DESC
    `);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);

  } catch (err) {
    console.error('❌ Error getTestDriveBookingsHandler (Admin):', err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data booking test drive (admin)',
    }).code(500);
  }
};

const getDashboardSummaryHandler = async (request, h) => {
  try {
    const { start, end } = request.query;

    let dateFilter = "";
    if (start && end) {
      dateFilter = `AND DATE(created_at) BETWEEN '${start}' AND '${end}'`;
    }

    // Total Servis
    const [[{ totalServis }]] = await db.query(`
      SELECT COUNT(*) AS totalServis 
      FROM booking 
      WHERE BookingType = 'Servis' 
      ${dateFilter}
    `);

    // Total Test Drive
    const [[{ totalTestDrive }]] = await db.query(`
      SELECT COUNT(*) AS totalTestDrive 
      FROM booking 
      WHERE BookingType = 'TestDrive'
      ${dateFilter}
    `);

    // Total Completed
    const [[{ totalCompleted }]] = await db.query(`
      SELECT COUNT(*) AS totalCompleted
      FROM booking 
      WHERE Status = 'Completed'
      ${dateFilter}
    `);

    // Total Cancelled
    const [[{ totalCancelled }]] = await db.query(`
      SELECT COUNT(*) AS totalCancelled
      FROM booking 
      WHERE Status = 'Cancelled'
      ${dateFilter}
    `);

    // Total Revenue
    const [[{ totalRevenue }]] = await db.query(`
      SELECT IFNULL(SUM(Total_cost), 0) AS totalRevenue
      FROM booking_service
      WHERE 1 = 1 
      ${dateFilter}
    `);

    const totalBooking = totalServis + totalTestDrive;

    return h.response({
      status: "success",
      data: {
        totalBooking,
        totalServis,
        totalTestDrive,
        totalCompleted,
        totalCancelled,
        totalRevenue,
      },
    });

  } catch (err) {
    console.error("❌ Error summary dashboard:", err);
    return h
      .response({
        status: "fail",
        message: "Gagal mengambil data summary",
      })
      .code(500);
  }
};



const getCustomerBookingDetailHandler = async (request, h) => {
  const { userId } = request.auth.credentials; // Ambil ID customer dari token
  const { id } = request.params; // BookingID dari URL

  try {
    // 1. Ambil data booking umum beserta UserID
    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        DATE(b.BookingDate) AS BookingDate,
        b.BookingTime,
        b.Status,
        b.Created_At,
        b.Updated_At,
        b.UserID, -- penting untuk validasi akses
        u.Name AS Customer_Name,
        u.Email AS Customer_Email,
        u.PhoneNo AS Customer_Phone,
        u.Address AS Customer_Address
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      WHERE b.BookingID = ?
    `, [id]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Booking tidak ditemukan'
      }).code(404);
    }

    const booking = rows[0];

    // 2. Validasi: pastikan booking milik customer yang login
    if (booking.UserID !== userId) {
      return h.response({
        status: 'fail',
        message: 'Anda tidak memiliki akses ke booking ini'
      }).code(403);
    }

    // 3. Ambil detail berdasarkan BookingType
    if (booking.BookingType === "Servis") {
      const [serviceRows] = await db.query(`
        SELECT 
          bs.BookingService_ID, 
          bs.Model_Kendaraan, 
          bs.No_Polisi, 
          bs.Kilometer, 
          bs.Keluhan, 
          bs.Total_Cost,
          s.Name AS ServiceName,
          s.Description AS ServiceDescription,
          s.Price AS ServicePrice,
          s.Is_Active
        FROM booking_service bs
        LEFT JOIN booking_service_detail bsd ON bs.BookingService_ID = bsd.BookingService_ID
        LEFT JOIN service s ON bsd.Service_ID = s.Service_ID
        WHERE bs.BookingID = ?
      `, [id]);

      booking.details = serviceRows[0] || {};
    } 
    else if (booking.BookingType === "TestDrive") {
      const [tdRows] = await db.query(`
        SELECT
          btd.BookingTestDrive_ID,
          btd.Catatan,
          td.VehicleModel,
          td.PoliceNo
        FROM booking_test_drive btd
        JOIN test_drive td ON btd.TestDrive_ID = td.TestDrive_ID
        WHERE btd.BookingID = ?
      `, [id]);

      booking.details = tdRows[0] || {};
    }

    return h.response({
      status: "success",
      data: booking
    }).code(200);

  } catch (err) {
    console.error("❌ Error getCustomerBookingDetailHandler:", err);
    return h.response({
      status: 'error',
      message: 'Gagal mengambil detail booking'
    }).code(500);
  }
};

const cancelCustomerBookingHandler = async (request, h) => {
  const { id } = request.params; // BookingID
  const { userId } = request.auth.credentials; // Customer's UserID

  try {
    // 1. Ambil booking milik customer
    const [rows] = await db.query(
      `SELECT BookingID, BookingType, Status, UserID FROM booking WHERE BookingID = ? AND UserID = ?`,
      [id, userId]
    );

    if (!rows.length) {
      return h.response({
        status: "fail",
        message: "Booking tidak ditemukan atau bukan milik Anda",
      }).code(404);
    }

    const booking = rows[0];

    // 2. Cek status Pending
    if (booking.Status !== "Pending") {
      return h.response({
        status: "fail",
        message: "Booking sudah diproses dan tidak bisa dibatalkan",
      }).code(400);
    }

    // 3. Update status jadi Cancelled
    await db.query(
      `UPDATE booking 
       SET Status = 'Cancelled', Updated_At = NOW()
       WHERE BookingID = ?`,
      [id]
    );

    return h.response({
      status: "success",
      message: `Booking ${booking.BookingType} berhasil dibatalkan`,
    }).code(200);

  } catch (err) {
    console.error("❌ Error cancelCustomerBookingHandler:", err);
    return h.response({
      status: "error",
      message: "Gagal membatalkan booking",
    }).code(500);
  }
};

const getAdminBookingDetailHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        DATE(b.BookingDate) AS BookingDate,
        b.BookingTime,
        b.Status,
        b.Created_At,
        b.Updated_At,
        u.Name AS Customer_Name,
        u.Email AS Customer_Email,
        u.PhoneNo AS Customer_Phone,
        u.Address AS Customer_Address
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      WHERE b.BookingID = ?
    `, [id]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Booking tidak ditemukan'
      }).code(404);
    }

    const booking = rows[0];

    // Tidak perlu validasi booking.UserID !== userId
    // karena admin boleh lihat semua data

    if (booking.BookingType === "Servis") {
      const [serviceRows] = await db.query(`
        SELECT 
          bs.Model_Kendaraan,
          bs.No_Polisi,
          bs.Kilometer,
          bs.Keluhan,
          bs.Total_Cost,
          s.Name AS ServiceName,
          s.Description AS ServiceDescription
        FROM booking_service bs
        LEFT JOIN booking_service_detail bsd ON bs.BookingService_ID = bsd.BookingService_ID
        LEFT JOIN service s ON bsd.Service_ID = s.Service_ID
        WHERE bs.BookingID = ?
      `, [id]);

      booking.details = serviceRows[0] || {};
    } else {
      const [tdRows] = await db.query(`
        SELECT
          btd.Catatan,
          td.VehicleModel,
          td.PoliceNo
        FROM booking_test_drive btd
        JOIN test_drive td ON btd.TestDrive_ID = td.TestDrive_ID
        WHERE btd.BookingID = ?
      `, [id]);

      booking.details = tdRows[0] || {};
    }

    return h.response({
      status: "success",
      data: booking
    }).code(200);

  } catch (err) {
    console.error("❌ Error getAdminBookingDetailHandler:", err);
    return h.response({
      status: 'error',
      message: 'Gagal mengambil detail booking'
    }).code(500);
  }
};

const getBookingTrendHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(created_at) AS month,
        BookingType,
        COUNT(*) AS total
      FROM booking
      GROUP BY MONTH(created_at), BookingType
      ORDER BY MONTH(created_at)
    `);

    let servis = Array(12).fill(0);
    let testDrive = Array(12).fill(0);

    rows.forEach(row => {
      const index = row.month - 1;
      if (row.BookingType === "Servis") servis[index] = row.total;
      if (row.BookingType === "TestDrive") testDrive[index] = row.total;
    });

    return h.response({
      status: "success",
      data: {
        labels: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
        serviceCounts: servis,
        testDriveCounts: testDrive
      },
    });
  } catch (err) {
    console.error("Error booking trend:", err);
    return h.response({
      status: "fail",
      message: "Gagal mengambil data tren booking",
    }).code(500);
  }
};


const getBookingStatusChartHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT Status, COUNT(*) AS total
      FROM booking
      GROUP BY Status
    `);

    const result = {
      Completed: 0,
      InProgress: 0,
      Pending: 0,
      Cancelled: 0
    };

    rows.forEach(r => {
      result[r.Status] = r.total;
    });

    return h.response({
      status: "success",
      data: result,
    });

  } catch (err) {
    console.error("Error status chart:", err);
    return h.response({
      status: "fail",
      message: "Gagal mengambil data status booking",
    }).code(500);
  }
};

const getPopularServicesHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.Name AS name,
        COUNT(bsd.Service_ID) AS total
      FROM booking_service_detail bsd
      JOIN service s 
        ON bsd.Service_ID = s.Service_ID
      GROUP BY bsd.Service_ID
      ORDER BY total DESC
      LIMIT 10;
    `);

    const labels = rows.map(r => r.name);
    const counts = rows.map(r => r.total);

    return h.response({
      status: "success",
      data: { labels, counts },
    });
  } catch (err) {
    console.error("🔥Error popular services:", err);
    return h.response({
      status: "fail",
      message: "Gagal mengambil layanan populer",
    }).code(500);
  }
};

const getTopCustomersHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.UserID AS userId,
        u.Name AS name,
        COUNT(b.BookingID) AS totalBooking,
        IFNULL(SUM(bs.Total_cost), 0) AS totalSpending
      FROM customer c
      JOIN user u ON c.UserID = u.UserID
      LEFT JOIN booking b ON b.UserID = u.UserID
      LEFT JOIN booking_service bs ON bs.BookingID = b.BookingID
      GROUP BY u.UserID
      ORDER BY totalBooking DESC, totalSpending DESC
      LIMIT 5;
    `);

    return h.response({
      status: "success",
      data: rows,
    });
  } catch (err) {
    console.error("🔥 Error top customers:", err);
    return h.response({
      status: "fail",
      message: "Gagal mengambil data pelanggan",
    }).code(500);
  }
};

const getRecentBookingsHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.BookingDate AS date,
        b.BookingType AS type,
        u.Name AS customer,
        b.Status AS status
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      ORDER BY b.Created_At DESC
      LIMIT 5;
    `);

    return h.response({
      status: "success",
      data: rows,
    });
  } catch (err) {
    console.error("🔥 Error recent bookings:", err);
    return h.response({
      status: "fail",
      message: "Gagal mengambil booking terbaru",
    }).code(500);
  }
};

module.exports = { 
    getServiceBookingsHandler, 
    getTestDriveBookingsHandler,
    getDashboardSummaryHandler,
    getCustomerBookingDetailHandler,
    cancelCustomerBookingHandler,
    getAdminBookingDetailHandler,
    getBookingTrendHandler,
    getBookingStatusChartHandler,
    getPopularServicesHandler,
    getTopCustomersHandler,
    getRecentBookingsHandler,
};
