const API_BASE_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

// =======================
//   AUTH CHECK STAFF
// =======================
function checkStaffAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const staffRole = localStorage.getItem('staffRole');
    const userEmail = localStorage.getItem('userEmail');

    if (!isLoggedIn || userRole !== 'staff') {
        alert('Akses ditolak! Anda harus login sebagai staff.');
        window.location.href = '../login.html';
        return false;
    }

    // Set Staff Profile
    const staffNameEl = document.getElementById('staffName');
    const staffEmailEl = document.getElementById('staffEmail');
    const staffRoleBadge = document.getElementById('staffRoleBadge');

    if (staffEmailEl && userEmail) {
        staffEmailEl.textContent = userEmail;
        const name = userEmail.split('@')[0];
        if (staffNameEl) {
            staffNameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        }
    }

    if (staffRoleBadge && staffRole) {
        staffRoleBadge.textContent = staffRole === 'Technician' ? 'TECHNICIAN' : 'SALES';
        staffRoleBadge.style.background = staffRole === 'Technician' ? '#FF9800' : '#2196F3';
    }

    return true;
}

// =======================
//   LOAD APPROVED TASKS
// =======================
async function loadApprovedBookings() {
    const tbody = document.getElementById('tasksTable');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/approved`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Gagal memuat data booking");

        const { data: bookings = [] } = await res.json();
        tbody.innerHTML = '';

        if (bookings.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        bookings.forEach((b, index) => {
            const tr = document.createElement('tr');
            const statusClass = b.Status.toLowerCase().replace(/\s+/g, "");
            
            tr.setAttribute('data-type', b.BookingType.replace(/\s+/g, '').toLowerCase());
            tr.setAttribute('data-status', b.Status.toLowerCase());

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${b.Customer_Name}</td>
                <td>${formatDate(b.BookingDate)}</td>
                <td>${b.BookingTime}</td>
                <td>${b.Model_Kendaraan || '-'}</td>
                <td><span class="status-badge ${statusClass}">${b.Status}</span></td>
                <td>
                    <button class="btn-action view" onclick="openDetailModal('${b.BookingID}')">Detail</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error loadApprovedBookings:", err);
        tbody.innerHTML = `<tr><td colspan="8">Gagal memuat data.</td></tr>`;
    }
}

async function loadApprovedTestDriveBookings() {
    const tbody = document.getElementById('tasksTable');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/approved-testdrive`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("=== FETCH TEST DRIVE ===");
        console.log(await res.clone().text()); // lihat raw response
        console.log("Parsed:", await res.clone().json());


        if (!res.ok) throw new Error("Gagal memuat data test drive");

        const { data: bookings = [] } = await res.json();
        tbody.innerHTML = '';

        if (bookings.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        bookings.forEach((b, index) => {
            const tr = document.createElement('tr');

            tr.setAttribute('data-type', b.BookingType.replace(/\s+/g, '').toLowerCase());
            tr.setAttribute('data-status', b.Status.toLowerCase());

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${b.Customer_Name}</td>
                <td>${formatDate(b.BookingDate)}</td>
                <td>${b.BookingTime}</td>
                <td>${b.Model_Kendaraan || '-'}</td>
                <td>
                    <span class="status-badge ${b.Status.toLowerCase().replace(/\s+/g, "")}">
                        ${b.Status}
                    </span>
                </td>
                <td>
                    <button class="btn-action view" onclick="openDetailModal('${b.BookingID}')">Detail</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error loadApprovedTestDriveBookings:", err);
        tbody.innerHTML = `<tr><td colspan="8">Gagal memuat data.</td></tr>`;
    }
}


// =======================
//      STATUS FILTER
// =======================
document.getElementById('filterStatus')?.addEventListener('change', function() {
    const value = this.value;
    const rows = document.querySelectorAll('#tasksTable tr');

    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        row.style.display = (value === 'all' || value === rowStatus) ? '' : 'none';
    });
});

// =======================
//         SEARCH
// =======================
document.getElementById('searchTasks')?.addEventListener('input', function() {
    const term = this.value.toLowerCase();
    const staffRole = localStorage.getItem('staffRole');
    const rows = document.querySelectorAll('#tasksTable tr');

    rows.forEach(row => {
        const type = row.getAttribute('data-type');
        const relevant =
            (staffRole === 'Technician' && type === 'servis') ||
            (staffRole === 'Sales' && type === 'testdrive');

        if (!relevant) return;

        const cells = [...row.querySelectorAll('td')];
        const match = cells.some(td => td.textContent.toLowerCase().includes(term));

        row.style.display = term === '' || match ? '' : 'none';
    });
});


// =======================
//       LOGOUT
// =======================
document.getElementById('btnStaffLogout')?.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.clear();
        window.location.href = '../login.html';
    }
});

// =======================
//     DETAIL MODAL
// =======================
async function openDetailModal(bookingId) {
    try {
        const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        if (json.status !== 'success') return alert("Gagal mengambil detail booking");

        const b = json.data;
        console.log(b)

        // --- COMMON / UMUM ---
        document.getElementById("detailBookingId").textContent = b.BookingID;
        document.getElementById("detailStatus").textContent = b.Status;
        document.getElementById("detailDate").textContent = formatDate(b.BookingDate);
        document.getElementById("detailTime").textContent = b.BookingTime;

        // customer info
        document.getElementById("detailCustomerName").textContent = b.Customer_Name;
        document.getElementById("detailCustomerEmail").textContent = b.Customer_Email ?? "-";
        document.getElementById("detailCustomerPhone").textContent = b.Customer_Phone ?? "-";
        document.getElementById("detailCustomerAddress").textContent = b.Customer_Address ?? "-";

        // --- SERVIS ---
        if (b.BookingType.toLowerCase() === "servis") {
            document.getElementById("sectionVehicle").style.display = "block";
            document.getElementById("sectionCar").style.display = "none";

            document.getElementById("detailModel").textContent = b.details.Model_Kendaraan;
            document.getElementById("detailNoPol").textContent = b.details.No_Polisi;
            document.getElementById("detailKm").textContent = b.details.Kilometer;
            document.getElementById("detailKeluhan").textContent = b.details.Keluhan;

            // service related sections untuk teknisi
            document.getElementById("sectionAddService").style.display = "block";
            document.getElementById("sectionServiceList").style.display = "block";

            loadServiceOptions();

            loadServiceDetailList(b.details.BookingService_ID, b.Status);
            document.getElementById("btnAddService").onclick = () => {
                addServiceDetail(b.details.BookingService_ID);
            };
        } 
        
        // --- TEST DRIVE ---
        else {
            document.getElementById("sectionVehicle").style.display = "none";
            document.getElementById("sectionCar").style.display = "block";

            document.getElementById("detailCar").textContent = b.details.VehicleModel ?? "-";
            document.getElementById("detailCatatan").textContent = b.details.Catatan ?? "-";

            // hiding service-related sections
            document.getElementById("sectionAddService").style.display = "none";
            document.getElementById("sectionServiceList").style.display = "none";
        }

        // Tampilkan modal
        document.getElementById("modalDetail").style.display = "flex";

        document.getElementById("btnCompleteBooking").style.display = "inline-block";
        document.getElementById("btnCloseDetailFooter").style.display = "inline-block";
        document.getElementById("sectionAddService").style.display = "block";
        document.getElementById("selectService").disabled = false;
        document.getElementById("btnAddService").disabled = false;

        const staffRole = localStorage.getItem('staffRole');

        if (staffRole === "Sales") {
            document.getElementById("sectionAddService").style.display = "none";
            
            // disable add service bagian form
            document.getElementById("selectService").disabled = true;
            document.getElementById("btnAddService").disabled = true;
        }

        if (b.Status === "Completed" || b.Status === "Cancelled") {
            // hide tombol action
            document.getElementById("btnCompleteBooking").style.display = "none";
            document.getElementById("btnCloseDetailFooter").style.display = "none";
            document.getElementById("sectionAddService").style.display = "none";
            // document.getElementById("sectionServiceList").style.display = "none";
            // disable select service dan tombol tambah service
            document.getElementById("selectService").disabled = true;
            document.getElementById("btnAddService").disabled = true;
        }

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat mengambil data");
    }
}


async function loadServiceOptions() {
    try {
        const res = await fetch(`${API_BASE_URL}/get-services`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        if (json.status !== "success") return alert("Gagal memuat list service");
        console.log(json)

        const select = document.getElementById("selectService");
        select.innerHTML = `<option value="">-- Pilih Service --</option>`;

        json.data.forEach(service => {
            const opt = document.createElement("option");
            opt.value = service.Service_ID;
            opt.textContent = `${service.Name} (${service.Price})`;
            select.appendChild(opt);
        });

    } catch (err) {
        console.error(err);
        alert("Error load service list");
    }
}

async function addServiceDetail(bookingServiceId) {
    const serviceId = document.getElementById("selectService").value;

    if (!serviceId) return alert("Pilih service terlebih dahulu");

    try {
        const res = await fetch(`${API_BASE_URL}/booking-services/${bookingServiceId}/details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ serviceId })
        });

        const json = await res.json();
        if (json.status !== "success") return alert("Gagal menambah service");

        // reload list
        loadServiceDetailList(bookingServiceId);

    } catch (err) {
        console.error(err);
    }
}

async function loadServiceDetailList(bookingServiceId, bookingStatus = "Pending") {
    const tbody = document.getElementById("serviceDetailBody");
    const totalCostEl = document.getElementById("totalCost");

    tbody.innerHTML = ""; // reset dulu
    totalCostEl.textContent = "Rp 0";

    if (!bookingServiceId) return;

    try {
        const res = await fetch(`${API_BASE_URL}/booking-services/${bookingServiceId}/details`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        if (json.status !== "success") return;

        const details = json.data || [];
        let totalCost = 0;

        const isReadOnly = bookingStatus === "Completed" || bookingStatus === "Cancelled";

        details.forEach(item => {
            const tr = document.createElement("tr");
            const subtotal = item.SubtotalPrice ?? 0;
            totalCost += Number(subtotal);

            tr.innerHTML = `
                <td>${item.Nama_Service}</td>
                <td>${item.Description ?? "-"}</td>
                <td>Rp ${Number(item.Price).toLocaleString()}</td>
                <td>
                    ${
                        isReadOnly
                        ? `<span style="color: gray;">Read-only</span>`
                        : `<button class = "btn-action view" onclick="deleteServiceDetail('${item.ServiceDetail_ID}', '${bookingServiceId}')">Hapus</button>`
                    }
                </td>
                <td>${formatDate(item.Updated_At)}</td>
            `;

            tbody.appendChild(tr);
        });

        totalCostEl.textContent = `Rp ${totalCost.toLocaleString()}`;

    } catch (err) {
        console.error("Error loadServiceDetailList:", err);
    }
}

async function deleteServiceDetail(serviceDetailId, bookingServiceId) {
    if (!confirm("Apakah kamu yakin ingin menghapus service ini?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/booking-service-details/${serviceDetailId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        if (json.status !== "success") return alert("Gagal menghapus service");

        alert("Service berhasil dihapus");
        // refresh list
        loadServiceDetailList(bookingServiceId);

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat menghapus service");
    }
}

const modalDetail = document.getElementById("modalDetail");
const btnCloseDetail = document.getElementById("btnCloseDetail");

function closeModalDetail() {
    modalDetail.style.display = "none";
}

if (btnCloseDetail) {
    btnCloseDetail.addEventListener("click", closeModalDetail);
}

modalDetail.addEventListener("click", function (e) {
    if (e.target === modalDetail) {
        closeModalDetail();
    }
});

async function updateBookingStatus(bookingId, newStatus) {
    if (!confirm(`Apakah yakin ingin merubah status menjadi "${newStatus}"?`)) return;

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        const json = await res.json();
        if (json.status !== "success") return alert("Gagal update status booking");

        alert(`Status booking berhasil diubah menjadi ${newStatus}`);
        // refresh detail modal dan tabel
        openDetailModal(bookingId);
        const role = localStorage.getItem("staffRole");
        if (role === "Technician") {
            loadApprovedBookings();
        } else if (role === "Sales") {
            loadApprovedTestDriveBookings();
        }

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat mengubah status booking");
    }
}

btnCloseDetailFooter?.addEventListener("click", () => {
    const bookingId = document.getElementById("detailBookingId").textContent;
    updateBookingStatus(bookingId, "Cancelled");
});

btnCompleteBooking?.addEventListener("click", () => {
    const bookingId = document.getElementById("detailBookingId").textContent;
    updateBookingStatus(bookingId, "Completed");
});

// =======================
//      FORMAT TGL
// =======================
function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toISOString().split("T")[0];
}

// =======================
//       INIT PAGE
// =======================
document.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    const ok = checkStaffAuth();
    if (!ok) return;

    const role = localStorage.getItem("staffRole");

    if (role === "Technician") {
        await loadApprovedBookings(); // servis
    } 
    else if (role === "Sales") {
        await loadApprovedTestDriveBookings(); // test drive
    }
});
