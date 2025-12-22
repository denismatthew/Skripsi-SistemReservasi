const API_BASE_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

// ===================== TAB SWITCH =====================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});

// ===================== FILTER & SEARCH =====================
function setupStatusFilter(filterId, tableId) {
    document.getElementById(filterId)?.addEventListener('change', function() {
        const value = this.value.toLowerCase();
        const rows = document.querySelectorAll(`#${tableId} tr`);

        rows.forEach(row => {
            const rowStatus = row.getAttribute('data-status');
            row.style.display = (value === 'all' || value === rowStatus) ? '' : 'none';
        });
    });
}

// Panggil untuk kedua tabel
setupStatusFilter('filterStatusServis', 'tableServis');
setupStatusFilter('filterStatusTestDrive', 'tableTestDrive');

document.getElementById('searchServis')?.addEventListener('input', function() {
    searchTable('tableServis', this.value.toLowerCase());
});

document.getElementById('searchTestDrive')?.addEventListener('input', function() {
    searchTable('tableTestDrive', this.value.toLowerCase());
});


function searchTable(tableId, term) {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term.toLowerCase()) ? '' : 'none';
    });
}

// ===================== DETAIL VIEW =====================
function viewDetail(bookingId, type) {
    alert(`Lihat detail ${type} booking: ${bookingId}`);
    // nanti bisa diarahkan ke halaman detail:
    // window.location.href = `booking-detail.html?id=${bookingId}&type=${type}`;
}

// ===================== LOAD DATA =====================
async function loadApprovedBookings() {
    const tbody = document.querySelector("#tableServis");
    if (!tbody) return;

    tbody.innerHTML = "";

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/all-services`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Gagal memuat data booking");

        const { data: bookings = [] } = await res.json();

        bookings.forEach((b, index) => {
            const statusClass = b.Status.toLowerCase().replace(/\s+/g, "");
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(b.BookingDate)}</td>
                <td>${b.BookingTime}</td>
                <td>${b.Customer_Name}</td>
                <td>${b.Model_Kendaraan || '-'}</td>
                <td>${b.No_Polisi || '-'}</td>
                <td><span class="status-badge ${statusClass}">${b.Status}</span></td>
                <td>
                    <button class="btn-action view" onclick="openAdminDetailModal('${b.BookingID}')">Detail</button>
                </td>
            `;
            tr.setAttribute('data-status', b.Status.toLowerCase());
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="8">Gagal memuat data.</td></tr>`;
    }
}

async function openAdminDetailModal(bookingId) {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        if (json.status !== 'success') return alert("Gagal mengambil detail booking");

        const b = json.data;

        // Set data umum
        document.getElementById("adminBookingId").textContent = b.BookingID;
        document.getElementById("adminStatus").textContent = b.Status;
        document.getElementById("adminDate").textContent = formatDate(b.BookingDate);
        document.getElementById("adminTime").textContent = b.BookingTime;

        // Info customer
        document.getElementById("adminCustName").textContent = b.Customer_Name;
        document.getElementById("adminCustEmail").textContent = b.Customer_Email ?? "-";
        document.getElementById("adminCustPhone").textContent = b.Customer_Phone ?? "-";
        document.getElementById("adminCustAddress").textContent = b.Customer_Address ?? "-";

        // Jika booking = servis
        if (b.BookingType.toLowerCase() === "servis") {
            document.getElementById("adminSectionVehicle").style.display = "block";
            document.getElementById("adminSectionCar").style.display = "none";
            document.getElementById("adminSectionServiceList").style.display = "block";

            document.getElementById("adminModel").textContent = b.details.Model_Kendaraan ?? "-";
            document.getElementById("adminNoPol").textContent = b.details.No_Polisi ?? "-";
            document.getElementById("adminKm").textContent = b.details.Kilometer ?? "-";
            document.getElementById("adminKeluhan").textContent = b.details.Keluhan ?? "-";

            const tbody = document.getElementById("adminServiceDetailBody");
            tbody.innerHTML = `
                <tr>
                    <td>${b.details?.ServiceName ?? "-"}</td>
                    <td>${b.details?.ServiceDescription ?? "-"}</td>
                    <td>Rp ${Number(b.details?.Total_Cost || 0).toLocaleString()}</td>
                </tr>
            `;

            const totalCost = Number(b.details?.Total_Cost) || 0;
            document.getElementById("adminTotalCost").textContent =
                `Rp ${totalCost.toLocaleString()}`;
        }

        // Jika booking = test drive/konsultasi
        else {
            document.getElementById("adminSectionVehicle").style.display = "none";
            document.getElementById("adminSectionCar").style.display = "block";
            document.getElementById("adminSectionServiceList").style.display = "none";

            document.getElementById("adminCar").textContent = b.details.VehicleModel ?? "-";
            document.getElementById("adminCatatan").textContent = b.details.Catatan ?? "-";
        }

        // Tampilkan modal
        const modal = document.getElementById("modalDetailAdmin");
        modal.style.display = "flex";

        // Tombol close
        document.getElementById("btnCloseDetailAdmin").onclick = () => {
            modal.style.display = "none";
        };

        // Admin tidak boleh melakukan aksi apapun → sembunyikan tombol aksi
        const btnAdminAction = document.getElementById("btnAdminCancelBooking");
        if (btnAdminAction) btnAdminAction.style.display = "none";

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat mengambil data");
    }
}

async function loadApprovedTestDriveBookings() {
    const tbody = document.querySelector("#tableTestDrive");
    if (!tbody) return;

    tbody.innerHTML = "";

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/all-testdrive`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Gagal memuat data test drive");

        const { data: bookings = [] } = await res.json();

        bookings.forEach((b, index) => {
            const statusClass = b.Status.toLowerCase().replace(/\s+/g, "");
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(b.BookingDate)}</td>
                <td>${b.BookingTime}</td>
                <td>${b.Customer_Name}</td>
                <td>${b.VehicleModel || '-'}</td>
                <td><span class="status-badge ${statusClass}">${b.Status}</span></td>
                <td>
                    <button class="btn-action view" onclick="openAdminDetailModal('${b.BookingID}')">Detail</button>
                </td>
            `;
            tr.setAttribute('data-status', b.Status.toLowerCase());
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="8">Gagal memuat data.</td></tr>`;
    }
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toISOString().split("T")[0]; 
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    loadApprovedBookings();
    loadApprovedTestDriveBookings();
    console.log('Monitoring Booking Initialized');
});
