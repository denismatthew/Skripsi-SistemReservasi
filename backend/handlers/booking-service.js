const db = require('../config/db');
const { nanoid } = require('nanoid');

const createBookingServiceHandler = async (request, h) => {
  try {
    const { userId } = request.auth.credentials;
    const { 
      booking_date, 
      booking_time,
      model_kendaraan,
      no_polisi,
      kilometer,
      keluhan,
    } = request.payload;

    if (!booking_date || !booking_time) {
      return h
        .response({ status: "fail", message: "Data booking servis belum lengkap." })
        .code(400);
    }

    const booking_id = nanoid(10);
    const detail_id = nanoid(10);
    const createdAt = new Date();

    // TABLE BOOKING
    await db.query(
      `INSERT INTO booking 
        (BookingID, UserID, BookingType, BookingDate, BookingTime, Status, Created_At, Updated_At)
       VALUES (?, ?, 'Servis', ?, ?, 'Pending', ?, ?)
      `,
      [booking_id, userId, booking_date, booking_time, createdAt, createdAt]
    );

    // TABLE BOOKING SERVICE
    await db.query(
      `INSERT INTO booking_service
        (BookingService_ID, BookingID, Model_Kendaraan, No_Polisi, Kilometer, Keluhan, Total_Cost, Created_At, Updated_At)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
      `,
      [detail_id, booking_id, model_kendaraan, no_polisi, kilometer, keluhan, createdAt, createdAt]
    );

    return h.response({
      status: "success",
      message: "Booking servis berhasil dibuat",
      data: { booking_id },
    }).code(201);

  } catch (err) {
    console.error(err);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat membuat booking servis."
    }).code(500);
  }
};

const createBookingTestDriveHandler = async (request, h) => {
  try {
    const { userId } = request.auth.credentials;
    const { 
      booking_date, 
      booking_time,
      testdrive_id,
      catatan
    } = request.payload;

    if (!booking_date || !booking_time || !testdrive_id) {
      return h
        .response({ status: "fail", message: "Data booking test drive belum lengkap." })
        .code(400);
    }

    const booking_id = nanoid(10);
    const detail_id = nanoid(10);
    const createdAt = new Date();

    // TABLE BOOKING
    await db.query(
      `INSERT INTO booking 
        (BookingID, UserID, BookingType, BookingDate, BookingTime, Status, Created_At, Updated_At)
       VALUES (?, ?, 'TestDrive', ?, ?, 'Pending', ?, ?)
      `,
      [booking_id, userId, booking_date, booking_time, createdAt, createdAt]
    );

    // TABLE DETAIL TEST DRIVE
    await db.query(
      `INSERT INTO booking_test_drive
        (BookingTestDrive_ID, BookingID, TestDrive_ID, Catatan, Created_At, Updated_At)
       VALUES (?, ?, ?, ?, ?, ?)
      `,
      [detail_id, booking_id, testdrive_id, catatan, createdAt, createdAt]
    );

    return h.response({
      status: "success",
      message: "Booking test drive berhasil dibuat",
      data: { booking_id },
    }).code(201);

  } catch (err) {
    console.error(err);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat membuat booking test drive."
    }).code(500);
  }
};


const getPendingBookingsHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        bs.Model_Kendaraan,
        bs.No_Polisi,
        bs.Kilometer,
        bs.Keluhan,
        b.Created_At
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      JOIN booking_service bs ON b.BookingID = bs.BookingID
      WHERE b.Status = 'Pending'
        AND b.BookingType = 'Servis'
      ORDER BY b.Created_At DESC
    `);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);
  } catch (err) {
    console.error('❌ Error getPendingBookingsHandler:', err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data booking pending',
    }).code(500);
  }
};

const getPendingTestDriveBookingsHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        td.VehicleModel,
        td.PoliceNo,
        btd.TestDrive_ID,
        btd.Catatan,
        b.Created_At
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      JOIN booking_test_drive btd ON b.BookingID = btd.BookingID
      JOIN test_drive td ON btd.TestDrive_ID = td.TestDrive_ID
      WHERE b.Status = 'Pending'
        AND b.BookingType = 'TestDrive'
      ORDER BY b.Created_At DESC
    `);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);

  } catch (err) {
    console.error('❌ Error getPendingTestDriveBookingsHandler:', err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data pending test drive',
    }).code(500);
  }
};


const approveBookingHandler = async (request, h) => {
  const { id } = request.params;
  const { userId } = request.auth.credentials;

  try {
    // 1. Ambil data staff & role
    const [staffRows] = await db.query(
      `SELECT StaffID, StaffRole FROM staff WHERE UserID = ?`,
      [userId]
    );

    if (!staffRows.length) {
      return h.response({ status: "fail", message: "Staff tidak ditemukan" }).code(404);
    }

    const { StaffID: staffId, StaffRole: staffRole } = staffRows[0];

    // 2. Ambil booking
    const [rows] = await db.query(
      `SELECT BookingType, Status FROM booking WHERE BookingID = ?`,
      [id]
    );

    if (!rows.length) {
      return h.response({ status: "fail", message: "Booking tidak ditemukan" }).code(404);
    }

    const booking = rows[0];

    // 3. Prevent double approve
    if (booking.Status !== "Pending") {
      return h.response({
        status: "fail",
        message: "Booking sudah diproses oleh staff lain",
      }).code(400);
    }

    // 4. Validasi role staff terhadap tipe booking
    if (booking.BookingType === "Servis" && staffRole !== "Technician") {
      return h.response({
        status: "fail",
        message: "Hanya teknisi yang boleh menerima booking servis",
      }).code(403);
    }

    if (booking.BookingType === "TestDrive" && staffRole !== "Sales") {
      return h.response({
        status: "fail",
        message: "Hanya sales yang boleh menerima booking test drive",
      }).code(403);
    }

    // 5. Update booking
    await db.query(
      `UPDATE booking 
       SET Status = 'InProgress', StaffID = ?, Updated_At = NOW() 
       WHERE BookingID = ?`,
      [staffId, id]
    );

    return h.response({
      status: "success",
      message: `Booking ${booking.BookingType} berhasil diterima`,
    }).code(200);
  } catch (err) {
    console.error("❌ Error approveBookingHandler:", err);
    return h.response({
      status: "fail",
      message: "Gagal memproses booking",
    }).code(500);
  }
};



const getApprovedBookingsHandler = async (request, h) => {
  try {
    // Ambil userId dari token
    const { userId } = request.auth.credentials;

    // Cari StaffID berdasarkan UserID
    const [staffRows] = await db.query(
      'SELECT StaffID FROM staff WHERE UserID = ?',
      [userId]
    );

    if (!staffRows.length) {
      return h.response({
        status: 'fail',
        message: 'Staff tidak ditemukan',
      }).code(404);
    }

    const staffId = staffRows[0].StaffID;

    // Ambil booking Approved milik staff ini
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
      JOIN staff s2 ON b.StaffID = s2.StaffID
      JOIN user st ON s2.UserID = st.UserID
      JOIN booking_service bs ON b.BookingID = bs.BookingID
      WHERE b.Status IN ('InProgress', 'Completed', 'Cancelled')
        AND b.StaffID = ?
        AND b.BookingType = 'Servis'
      ORDER BY b.Updated_At DESC
    `, [staffId]);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);

  } catch (err) {
    console.error('❌ Error getApprovedBookingsHandler:', err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data booking yang sudah diapprove',
    }).code(500);
  }
};

const getApprovedTestDriveHandler = async (request, h) => {
  try {
    const { userId } = request.auth.credentials;

    // Ambil StaffID
    const [staffRows] = await db.query(
      'SELECT StaffID FROM staff WHERE UserID = ?',
      [userId]
    );

    if (!staffRows.length) {
      return h.response({
        status: 'fail',
        message: 'Staff tidak ditemukan',
      }).code(404);
    }

    const staffId = staffRows[0].StaffID;

    // Ambil test drive yg sedang dikerjakan staff (InProgress)
    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        st.Name AS Staff_Name,
        
        tdg.VehicleModel AS Model_Kendaraan,
        tdg.PoliceNo AS No_Polisi,
        
        btd.Catatan,

        b.Created_At,
        b.Updated_At

      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      JOIN staff s ON b.StaffID = s.StaffID
      JOIN user st ON s.UserID = st.UserID

      JOIN booking_test_drive btd 
        ON b.BookingID = btd.BookingID

      JOIN test_drive tdg
        ON btd.TestDrive_ID = tdg.TestDrive_ID

      WHERE b.Status IN ('InProgress', 'Completed', 'Cancelled')
        AND b.StaffID = ?
        AND b.BookingType = 'TestDrive'
      ORDER BY b.Updated_At DESC
    `, [staffId]);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);

  } catch (err) {
    console.error('❌ Error getApprovedTestDriveHandler:', err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data test drive',
    }).code(500);
  }
};

const getCustomerBookingsHandler = async (request, h) => {
  try {
    const { userId } = request.auth.credentials;

    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        bs.Model_Kendaraan,
        bs.No_Polisi,
        bs.Kilometer,
        bs.Keluhan,
        b.Created_At
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      JOIN booking_service bs ON b.BookingID = bs.BookingID
      WHERE b.UserID = ?
        AND b.BookingType = 'Servis'
      ORDER BY b.Created_At DESC
    `, [userId]);

    return h.response({
      status: 'success',
      data: rows
    });

  } catch (err) {
    console.error(err);
    return h
      .response({ status: 'error', message: 'Gagal mengambil data booking' })
      .code(500);
  }
};

const getCustomerTestDriveBookingsHandler = async (request, h) => {
  try {
    const { userId } = request.auth.credentials;

    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        td.VehicleModel,
        td.PoliceNo,
        btd.TestDrive_ID,
        btd.Catatan,
        b.Created_At
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      JOIN booking_test_drive btd ON b.BookingID = btd.BookingID
      JOIN test_drive td ON btd.TestDrive_ID = td.TestDrive_ID
      WHERE b.UserID = ?
        AND b.BookingType = 'TestDrive'
      ORDER BY b.Created_At DESC
    `, [userId]);

    return h.response({
      status: 'success',
      data: rows
    });

  } catch (err) {
    console.error(err);
    return h
      .response({ status: 'error', message: 'Gagal mengambil data test drive' })
      .code(500);
  }
};


const getBookingDetailHandler = async (request, h) => {
  const { id } = request.params;

  try {
    // 1. Ambil data booking umum
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

    // 2. Ambil detail berdasarkan BookingType
    if (booking.BookingType === "Servis") {
      const [serviceRows] = await db.query(`
        SELECT BookingService_ID, Model_Kendaraan, No_Polisi, Kilometer, Keluhan, Total_Cost
        FROM booking_service
        WHERE BookingID = ?
      `, [id]);

      booking.details = serviceRows[0] || null;
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

      booking.details = tdRows[0] || null;
    }

    return h.response({
      status: "success",
      data: booking
    }).code(200);

  } catch (err) {
    console.error("❌ Error getBookingDetailHandler:", err);
    return h.response({
      status: 'error',
      message: 'Gagal mengambil detail booking'
    }).code(500);
  }
};


const getTestDriveVehiclesHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        TestDrive_ID,
        VehicleModel,
        PoliceNo,
        isAvailable
      FROM test_drive
      WHERE isAvailable = 'yes'
    `);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({ status: 'error', message: 'Gagal mengambil data test drive' })
      .code(500);
  }
};

const getServicesHandler = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT Service_ID, Name, Description, Price, Is_Active
      FROM service
      WHERE Is_Active = 1
    `);

    return h.response({ status: 'success', data: rows }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ status: 'error', message: 'Gagal mengambil data service' }).code(500);
  }
};

const getBookingServiceDetailsHandler = async (request, h) => {
  const { bookingServiceId } = request.params;
  try {
    const [rows] = await db.query(`
      SELECT sd.ServiceDetail_ID, sd.SubtotalPrice, s.Name AS Nama_Service, s.Price, s.Description, s.Created_At, s.Updated_At
      FROM booking_service_detail sd
      JOIN service s ON sd.Service_ID = s.Service_ID
      WHERE sd.BookingService_ID = ?
    `, [bookingServiceId]);

    return h.response({ status: 'success', data: rows }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ status: 'error', message: 'Gagal mengambil service detail' }).code(500);
  }
};

const addBookingServiceDetailHandler = async (request, h) => {
  const { bookingServiceId } = request.params;
  const { serviceId } = request.payload;

  try {
    const createdAt = new Date();
    const detailId = nanoid(10);

    // ambil harga service dari tabel service
    const [serviceRows] = await db.query(
      'SELECT Price FROM service WHERE Service_ID = ?',
      [serviceId]
    );
    if (!serviceRows.length) return h.response({ status: 'fail', message: 'Service tidak ditemukan' }).code(404);

    const price = serviceRows[0].Price;

    await db.query(`
      INSERT INTO booking_service_detail
      (ServiceDetail_ID, BookingService_ID, Service_ID, SubtotalPrice, Created_At, Updated_At)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [detailId, bookingServiceId, serviceId, price, createdAt, createdAt]);

    return h.response({ status: 'success', message: 'Service berhasil ditambahkan' }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ status: 'error', message: 'Gagal menambahkan service' }).code(500);
  }
};

const deleteBookingServiceDetailHandler = async (request, h) => {
    const { id } = request.params; // ServiceDetail_ID

    try {
        // Cek apakah service detail ada
        const [rows] = await db.query(
            "SELECT * FROM booking_service_detail WHERE ServiceDetail_ID = ?",
            [id]
        );

        if (rows.length === 0) {
            return h.response({
                status: "fail",
                message: "Service detail tidak ditemukan"
            }).code(404);
        }

        // Hapus dari DB
        await db.query(
            "DELETE FROM booking_service_detail WHERE ServiceDetail_ID = ?",
            [id]
        );

        return h.response({
            status: "success",
            message: "Service detail berhasil dihapus"
        }).code(200);

    } catch (err) {
        console.error("❌ Error deleteBookingServiceDetailHandler:", err);
        return h.response({
            status: "error",
            message: "Gagal menghapus service detail"
        }).code(500);
    }
};

const updateBookingStatusHandler = async (req, h) => {
    const { id } = req.params;
    const { status } = req.payload;

    try {
        // 1. Update status booking
        const [result] = await db.query(
            "UPDATE booking SET Status = ? WHERE BookingID = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return h.response({ status: "fail", message: "Booking tidak ditemukan" }).code(404);
        }

        // 2. Jika status jadi Completed → hitung total biaya
        if (status === "Completed") {

            // Ambil total subtotal dari service_detail
            const [[{ totalCost }]] = await db.query(
                `
                SELECT IFNULL(SUM(SubtotalPrice), 0) AS totalCost
                FROM booking_service_detail sd
                JOIN booking_service bs ON sd.BookingService_ID = bs.BookingService_ID
                WHERE bs.BookingID = ?
                `,
                [id]
            );

            // Update total_cost di tabel booking_service
            await db.query(
                `
                UPDATE booking_service
                SET Total_cost = ?
                WHERE BookingID = ?
                `,
                [totalCost, id]
            );

            console.log("Total service cost updated:", totalCost);
        }

        return h
            .response({ status: "success", message: "Status berhasil diupdate" })
            .code(200);

    } catch (err) {
        console.error(err);
        return h.response({ status: "error", message: "Gagal update status" }).code(500);
    }
};


const rejectBookingHandler = async (request, h) => {
  const { id } = request.params; 
  const { userId } = request.auth.credentials;

  try {
    // 1. Ambil data staff
    const [staffRows] = await db.query(
      `SELECT StaffID, StaffRole FROM staff WHERE UserID = ?`,
      [userId]
    );

    if (!staffRows.length) {
      return h.response({ status: "fail", message: "Staff tidak ditemukan" }).code(404);
    }

    const { StaffID: staffId, StaffRole: staffRole } = staffRows[0];

    // 2. Ambil booking
    const [rows] = await db.query(
      `SELECT BookingType, Status FROM booking WHERE BookingID = ?`,
      [id]
    );

    if (!rows.length) {
      return h.response({ status: "fail", message: "Booking tidak ditemukan" }).code(404);
    }

    const booking = rows[0];

    // 3. Prevent double reject
    if (booking.Status !== "Pending") {
      return h.response({
        status: "fail",
        message: "Booking sudah diproses",
      }).code(400);
    }

    // 4. Validasi role staff
    if (booking.BookingType === "Servis" && staffRole !== "Technician") {
      return h.response({
        status: "fail",
        message: "Hanya teknisi yang boleh menolak booking servis",
      }).code(403);
    }

    if (booking.BookingType === "TestDrive" && staffRole !== "Sales") {
      return h.response({
        status: "fail",
        message: "Hanya sales yang boleh menolak booking test drive",
      }).code(403);
    }

    // 5. Update jadi Cancelled
    await db.query(
      `UPDATE booking 
       SET Status = 'Cancelled', StaffID = ?, Updated_At = NOW()
       WHERE BookingID = ?`,
      [staffId, id]
    );

    return h.response({
      status: "success",
      message: `Booking ${booking.BookingType} berhasil ditolak`,
    }).code(200);

  } catch (err) {
    console.error("❌ Error rejectBookingHandler:", err);
    return h.response({
      status: "error",
      message: "Gagal menolak booking"
    }).code(500);
  }
};

const getCustomerInfo = async (request, h) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.BookingID,
        b.BookingType,
        b.BookingDate,
        b.BookingTime,
        b.Status,
        u.Name AS Customer_Name,
        bs.Model_Kendaraan,
        bs.No_Polisi,
        bs.Kilometer,
        bs.Keluhan,
        b.Created_At
      FROM booking b
      JOIN user u ON b.UserID = u.UserID
      JOIN booking_service bs ON b.BookingID = bs.BookingID
      WHERE b.Status = 'Pending'
        AND b.BookingType = 'Servis'
      ORDER BY b.Created_At DESC
    `);

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);
  } catch (err) {
    console.error('❌ Error getPendingBookingsHandler:', err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data booking pending',
    }).code(500);
  }
};

module.exports = {
    createBookingServiceHandler,
    createBookingTestDriveHandler,
    getPendingBookingsHandler,
    getPendingTestDriveBookingsHandler,
    approveBookingHandler,
    rejectBookingHandler,
    getApprovedBookingsHandler,
    getApprovedTestDriveHandler,
    getCustomerBookingsHandler,
    getCustomerTestDriveBookingsHandler,
    getBookingDetailHandler,
    getTestDriveVehiclesHandler,
    getServicesHandler,
    getBookingServiceDetailsHandler,
    addBookingServiceDetailHandler,
    deleteBookingServiceDetailHandler,
    updateBookingStatusHandler,
    getCustomerInfo,
};
