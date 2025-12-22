const token = localStorage.getItem('token');
const API_BASE = 'http://localhost:5000/bookings/pending';
const API_TESTDRIVE = 'http://localhost:5000/bookings/pending-testdrive';
const tableServis = document.getElementById('tableServis');
const tableTestDrive = document.getElementById('tableTestDrive');


function checkStaffAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const staffRole = localStorage.getItem('staffRole');
    const userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn !== 'true' || userRole !== 'staff') {
        alert('Akses ditolak! Anda harus login sebagai staff.');
        window.location.href = '../login.html';
        return false;
    }

    // Set header info
    const staffName = document.getElementById('staffName');
    const staffEmail = document.getElementById('staffEmail');
    const staffRoleBadge = document.getElementById('staffRoleBadge');

    if (staffEmail && userEmail) staffEmail.textContent = userEmail;
    if (staffName && userEmail) {
        const name = userEmail.split('@')[0];
        staffName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    }

    if (staffRoleBadge && staffRole) {
        staffRoleBadge.textContent = staffRole === 'Technician' ? 'TECHNICIAN' : 'SALES';
        staffRoleBadge.style.background = staffRole === 'Technician' ? '#FF9800' : '#2196F3';
    }

    initializeTabs(staffRole);
    return true;
}


function initializeTabs(staffRole) {
    const tabTechnician = document.getElementById('tabTechnician');
    const tabSales = document.getElementById('tabSales');

    const contentTechnician = document.getElementById('tab-technician');
    const contentSales = document.getElementById('tab-sales');

    // Reset semua dulu
    tabTechnician.style.display = 'none';
    tabSales.style.display = 'none';
    contentTechnician.classList.remove('active');
    contentSales.classList.remove('active');

    // Jika staff technician → tampilkan tab servis saja
    if (staffRole === 'Technician') {
        tabTechnician.style.display = 'block';
        tabTechnician.classList.add('active');

        contentTechnician.classList.add('active');
        return;
    }

    // Jika staff sales → tampilkan tab test drive saja
    if (staffRole === 'Sales') {
        tabSales.style.display = 'block';
        tabSales.classList.add('active');

        contentSales.classList.add('active');
        return;
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.style.display === 'none') return; // cegah klik tab yang disembunyikan

        const tabName = this.getAttribute('data-tab');

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toISOString().split("T")[0];
}


async function loadPendingBookings() {
  try {
    const response = await fetch(API_BASE, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data;

    console.log('📦 Data booking pending:', data);

    renderBookingTable(data);

  } catch (error) {
    console.error('❌ Error loadPendingBookings:', error);
  }
}

async function loadPendingBookingsTestDrive() {
  try {
    const response = await fetch(API_TESTDRIVE, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data;

    console.log('📦 Data test drive pending:', data);

    renderTestDriveTable(data);

  } catch (error) {
    console.error('❌ Error loadPendingBookingsTestDrive:', error);
  }
}

// 🔹 Render tabel booking
function renderBookingTable(data) {
  tableServis.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tableServis.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:10px;">Tidak ada booking pending</td>
      </tr>`;
    return;
  }

  data.forEach((booking, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${formatDate(booking.BookingDate)}</td>
      <td>${booking.BookingTime}</td>
      <td>${booking.Customer_Name}</td>
      <td>${booking.Model_Kendaraan}</td>
      <td>${booking.No_Polisi}</td>
      <td>${booking.Keluhan}</td>
      <td>
        <button class="btn-action approve" onclick="approveBooking('${booking.BookingID}')">Approve</button>
        <button class="btn-action view" onclick="rejectBooking('${booking.BookingID}')">Reject</button>
      </td>
    `;
    tableServis.appendChild(row);
  });
}

function renderTestDriveTable(data) {
  tableTestDrive.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tableTestDrive.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:10px;">
          Tidak ada booking test drive pending
        </td>
      </tr>`;
    return;
  }

  data.forEach((booking, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${formatDate(booking.BookingDate)}</td>
      <td>${booking.BookingTime}</td>
      <td>${booking.Customer_Name}</td>
      <td>${booking.VehicleModel}</td>
      <td>${booking.PoliceNo}</td>
      <td>
        <button class="btn-action approve" onclick="approveBooking('${booking.BookingID}')">Approve</button>
        <button class="btn-action view" onclick="rejectBooking('${booking.BookingID}')">Reject</button>
      </td>
    `;
    tableTestDrive.appendChild(row);
  });
}

// 🔹 Approve booking
async function approveBooking(id) {
  if (!confirm('Setujui booking ini?')) return;
  try {
    const response = await fetch(`http://localhost:5000/bookings/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Gagal approve booking');

    alert('Booking berhasil disetujui!');
    loadPendingBookings();
    loadPendingBookingsTestDrive();

  } catch (err) {
    console.error('❌ Error approveBooking:', err);
  }
}

// 🔹 Reject booking
async function rejectBooking(id) {
  if (!confirm('Tolak booking ini?')) return;
  try {
    const response = await fetch(`http://localhost:5000/booking/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Gagal reject booking');

    alert('Booking berhasil ditolak!');
    loadPendingBookings();
    loadPendingBookingsTestDrive();

  } catch (err) {
    console.error('❌ Error rejectBooking:', err);
  }
}


// -----------------------
// View Detail (placeholder)
// -----------------------
function viewDetail(bookingId, type) {
    alert(`Lihat detail ${type} booking: ${bookingId}\nFitur detail akan ditambahkan nanti.`);
}

// -----------------------
// Filter & Search
// -----------------------
function filterAndSearchTable(tableId, status, searchTerm) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');
    for (let row of rows) {
        const rowStatus = row.getAttribute('data-status');
        const text = row.textContent.toLowerCase();
        const show = (status === 'all' || rowStatus === status) && (text.includes(searchTerm.toLowerCase()) || searchTerm === '');
        row.style.display = show ? '' : 'none';
    }
}

// Event Listeners
['Servis','TestDrive'].forEach(type => {
    const statusEl = document.getElementById(`filterStatus${type}`);
    const searchEl = document.getElementById(`search${type}`);

    const tableId = type === 'Servis' ? 'tableServis' : 'tableTestDrive';

    statusEl?.addEventListener('change', () => filterAndSearchTable(tableId, statusEl.value, searchEl.value));
    searchEl?.addEventListener('input', () => filterAndSearchTable(tableId, statusEl.value, searchEl.value));
});

// -----------------------
// Update Stats
// -----------------------
function updateStats() {
    const staffRole = localStorage.getItem('staffRole');
    const tableId = staffRole === 'Technician' ? 'tableServis' : 'tableTestDrive';
    const rows = document.getElementById(tableId)?.getElementsByTagName('tr') || [];

    let pending = 0, onprogress = 0, completed = 0, myTasks = 0;
    for (let row of rows) {
        const status = row.getAttribute('data-status');
        if (status === 'pending') pending++;
        if (status === 'onprogress') { onprogress++; myTasks++; }
        if (status === 'completed') completed++;
    }

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('onprogressCount').textContent = onprogress;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('myTasksCount').textContent = myTasks;
}

// -----------------------
// Logout
// -----------------------
document.getElementById('btnStaffLogout')?.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        ['isLoggedIn','userRole','staffRole','userEmail','token'].forEach(k => localStorage.removeItem(k));
        window.location.href = '../login.html';
    }
});

// -----------------------
// Helper
// -----------------------
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkStaffAuth()) return;
    loadPendingBookings();
    loadPendingBookingsTestDrive();
});