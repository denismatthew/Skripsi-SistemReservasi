const API_BASE_URL = "http://localhost:5000";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

document.getElementById("userName").textContent = localStorage.getItem("name");
document.getElementById("customerName").textContent = localStorage.getItem("name");

function checkCustomerAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn !== 'true') {
        alert('Anda harus login terlebih dahulu!');
        window.location.href = '../login.html';
        return false;
    }

    if (userRole === 'admin') {
        window.location.href = '../admin/dashboard.html';
        return false;
    }
    if (userRole === 'staff') {
        window.location.href = '../staff/dashboard.html';
        return false;
    }

    const displayName = userEmail?.split('@')[0];
    const formatted = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    document.getElementById('customerName').textContent = formatted;
    document.getElementById('userName').textContent = formatted;

    return true;
}


document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});


function applyFilter(type) {
    const list = document.getElementById(type === "servis" ? "listServis" : "listTestDrive");
    const filter = document.getElementById(type === "servis" ? "filterServis" : "filterTestDrive").value;
    const search = document.getElementById(type === "servis" ? "searchServis" : "searchTestDrive").value.toLowerCase();

    Array.from(list.children).forEach((card) => {
        const statusMatch = filter === "all" || card.dataset.status === filter;
        const searchMatch = card.innerText.toLowerCase().includes(search);

        card.style.display = statusMatch && searchMatch ? "block" : "none";
    });
}

document.getElementById("filterServis")?.addEventListener("change", () => applyFilter("servis"));
document.getElementById("searchServis")?.addEventListener("input", () => applyFilter("servis"));

document.getElementById("filterTestDrive")?.addEventListener("change", () => applyFilter("testdrive"));
document.getElementById("searchTestDrive")?.addEventListener("input", () => applyFilter("testdrive"));


function viewBookingDetail(id, type) {
    window.location.href = `booking-detail.html?id=${id}&type=${type}`;
}

async function loadCustomerBookings() {
    const listServis = document.getElementById("listServis");
    const listTestDrive = document.getElementById("listTestDrive");
    const emptyState = document.getElementById("emptyState");

    listServis.innerHTML = "";
    listTestDrive.innerHTML = "";

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Gagal ambil data booking");

        const data = await res.json();
        const bookings = data.data || [];

        if (bookings.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        bookings.forEach((b) => {
            const isServis = b.BookingType === "Servis";
            const card = document.createElement("div");

            card.className = "booking-card";
            card.dataset.status = b.Status.toLowerCase();
            card.dataset.id = b.BookingID;

            card.innerHTML = `
                <div class="booking-header">
                    <div class="booking-id">${isServis ? "SRV" : "TD"}-${String(b.BookingID).padStart(3, "0")}</div>
                    <span class="status-badge ${b.Status.toLowerCase()}">${b.Status}</span>
                </div>

                <div class="booking-body">
                    <div class="booking-detail">
                        <span class="detail-label">Tanggal:</span>
                        <span class="detail-value">${formatDate(b.BookingDate)}, ${b.BookingTime}</span>
                    </div>

                    ${isServis
                        ? `
                        <div class="booking-detail">
                            <span class="detail-label">Kendaraan:</span>
                            <span class="detail-value">${b.Model_Kendaraan} - ${b.No_Polisi}</span>
                        </div>
                        <div class="booking-detail">
                            <span class="detail-label">Keluhan:</span>
                            <span class="detail-value">${b.Keluhan}</span>
                        </div>`
                        : `
                        <div class="booking-detail">
                            <span class="detail-label">Mobil:</span>
                            <span class="detail-value">${b.Model_Kendaraan}</span>
                        </div>
                        <div class="booking-detail">
                            <span class="detail-label"></span>Nomor SIM:</span>
                            <span class="detail-value">${b.No_SIM || "-"}</span>
                        </div>`
                    }
                </div>

                <div class="booking-footer">
                    <button class="btn-detail" onclick="openCustomerDetailModal('${b.BookingID}')">
                        Lihat Detail
                    </button>
                </div>
            `;
            if (isServis) listServis.appendChild(card);
            else listTestDrive.appendChild(card);
        });
    } catch (err) {
        console.error("Error loadCustomerBookings:", err);
    }
}

async function loadCustomerTestDriveBookings() {
    const listTestDrive = document.getElementById("listTestDrive");

    listTestDrive.innerHTML = "";

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/mytd`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Gagal ambil data test drive");

        const data = await res.json();
        const bookings = data.data || [];

        bookings.forEach((b) => {
            const card = document.createElement("div");

            card.className = "booking-card";
            card.dataset.status = b.Status.toLowerCase();
            card.dataset.id = b.BookingID;

            card.innerHTML = `
                <div class="booking-header">
                    <div class="booking-id">TD-${String(b.BookingID).padStart(3, "0")}</div>
                    <span class="status-badge ${b.Status.toLowerCase()}">${b.Status}</span>
                </div>

                <div class="booking-body">
                    <div class="booking-detail">
                        <span class="detail-label">Tanggal:</span>
                        <span class="detail-value">${formatDate(b.BookingDate)}, ${b.BookingTime}</span>
                    </div>

                    <div class="booking-detail">
                        <span class="detail-label">Mobil:</span>
                        <span class="detail-value">${b.VehicleModel} (${b.PoliceNo})</span>
                    </div>

                    <div class="booking-detail">
                        <span class="detail-label">Catatan:</span>
                        <span class="detail-value">${b.Catatan || "-"}</span>
                    </div>
                </div>

                <div class="booking-footer">
                    <button class="btn-detail" onclick="openCustomerDetailModal('${b.BookingID}')">
                        Lihat Detail
                    </button>
                </div>
            `;

            listTestDrive.appendChild(card);
        });

    } catch (err) {
        console.error("Error loadCustomerTestDriveBookings:", err);
    }
}

async function openCustomerDetailModal(bookingId) {
    try {
        const res = await fetch(`${API_BASE_URL}/customer/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        if (json.status !== 'success') return alert("Gagal mengambil detail booking");

        const b = json.data;
        console.log(b);

        document.getElementById("custBookingId").textContent = b.BookingID;
        document.getElementById("custStatus").textContent = b.Status;
        document.getElementById("custDate").textContent = formatDate(b.BookingDate);
        document.getElementById("custTime").textContent = b.BookingTime;

        document.getElementById("custName").textContent = b.Customer_Name;
        document.getElementById("custEmail").textContent = b.Customer_Email ?? "-";
        document.getElementById("custPhone").textContent = b.Customer_Phone ?? "-";
        document.getElementById("custAddress").textContent = b.Customer_Address ?? "-";

        if (b.BookingType.toLowerCase() === "servis") {
            document.getElementById("custSectionVehicle").style.display = "block";
            document.getElementById("custSectionCar").style.display = "none";
            document.getElementById("custSectionServiceList").style.display = "block";

            document.getElementById("custModel").textContent = b.details.Model_Kendaraan ?? "-";
            document.getElementById("custNoPol").textContent = b.details.No_Polisi ?? "-";
            document.getElementById("custKm").textContent = b.details.Kilometer ?? "-";
            document.getElementById("custKeluhan").textContent = b.details.Keluhan ?? "-";

            const tbody = document.getElementById("custServiceDetailBody");
            console.log("Booking detail:", b.details);
            console.log("Total_cost:", b.details?.Total_cost);
            tbody.innerHTML = `
                <tr>
                    <td>${b.details?.ServiceName ?? "-"}</td>
                    <td>${b.details?.ServiceDescription ?? "-"}</td>
                    <td>Rp ${Number(b.details.Total_Cost).toLocaleString()}</td>
                </tr>
            `;
            const totalCost = Number(b.details?.Total_Cost) || 0;
            document.getElementById("custTotalCost").textContent = `Rp ${totalCost.toLocaleString()}`;

        } 

        else {
            document.getElementById("custSectionVehicle").style.display = "none";
            document.getElementById("custSectionCar").style.display = "block";
            document.getElementById("custSectionServiceList").style.display = "none";

            document.getElementById("custCar").textContent = b.details.VehicleModel ?? "-";
            document.getElementById("custCatatan").textContent = b.details.Catatan ?? "-";
        }

        const modal = document.getElementById("modalDetailCustomer");
        modal.style.display = "flex";

        document.getElementById("btnCloseDetailCustomer").onclick = () => {
            modal.style.display = "none";
        };

        const btnCancel = document.getElementById("btnCustomerCancelBooking");
        
        if (["completed", "cancelled", "inprogress"].includes(b.Status.toLowerCase())) {
            btnCancel.style.display = "none";
        } else {
            btnCancel.style.display = "inline-block";
            btnCancel.onclick = async () => {
                if (!confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) return;

                try {
                    btnCancel.disabled = true; // disable sementara
                    const resCancel = await fetch(`${API_BASE_URL}/customer/bookings/${bookingId}/cancel`, {
                        method: "PATCH",
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const cancelJson = await resCancel.json();

                    if (cancelJson.status === "success") {
                        alert("Booking berhasil dibatalkan!");
                        modal.style.display = "none";
                        loadCustomerBookings();
                        loadCustomerTestDriveBookings();
                    } else {
                        alert("Gagal membatalkan booking");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Terjadi kesalahan saat membatalkan booking");
                } finally {
                    btnCancel.disabled = false;
                }
            };
        }

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat mengambil data");
    }
}


const userButton = document.getElementById('userButton');
const dropdownMenu = document.getElementById('dropdownMenu');

userButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', () => dropdownMenu?.classList.remove('show'));

document.getElementById('btnLogout')?.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.clear();
        window.location.href = '../index.html';
    }
});

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toISOString().split("T")[0]; 
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkCustomerAuth()) return;

    loadCustomerBookings();
    loadCustomerTestDriveBookings();
    console.log('Customer Dashboard Loaded');
});
