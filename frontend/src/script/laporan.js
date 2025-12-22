// Filter Period
const filterPeriod = document.getElementById('filterPeriod');
const customDateRange = document.getElementById('customDateRange');

filterPeriod?.addEventListener('change', function() {
    if (this.value === 'custom') {
        customDateRange.style.display = 'flex';
        customDateRange.style.gap = '1rem';
        customDateRange.style.alignItems = 'center';
    } else {
        customDateRange.style.display = 'none';
    }
    
    // TODO: Reload data based on period
    console.log('Period changed:', this.value);
});

// Chart.js Configuration
Chart.defaults.color = '#E5E5E5';
Chart.defaults.borderColor = '#2A2A2A';
Chart.defaults.font.family = 'Inter, sans-serif';

async function loadBookingTrendChart() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/dashboard/chart/booking-trend", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    const data = result.data;

    new Chart(document.getElementById('bookingTrendChart'), {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Booking Servis',
                    data: data.serviceCounts,
                    borderColor: '#DC143C',
                    backgroundColor: 'rgba(220, 20, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Booking Test Drive',
                    data: data.testDriveCounts ,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33,150,243,0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1A1A1A',
                    titleColor: '#DC143C',
                    bodyColor: '#E5E5E5',
                    borderColor: '#DC143C',
                    borderWidth: 2,
                    padding: 12,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#2A2A2A'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#2A2A2A'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// 2. Booking by Status Chart (Pie Chart)
async function loadStatusChart() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/dashboard/chart/status", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const result = await res.json();
    const backend = result.data;

    // === transform backend object → chart.js array ===
    const labels = Object.keys(backend);
    const counts = Object.values(backend);

    new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: ['#4CAF50','#2196F3','#FFA500','#F44336'],
                borderWidth: 3,
                borderColor: '#1A1A1A'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1A1A1A',
                    titleColor: '#DC143C',
                    bodyColor: '#E5E5E5',
                    borderColor: '#DC143C',
                    borderWidth: 2,
                    padding: 12,
                    callbacks: {
                        label: function(ctx) {
                            const label = ctx.label || '';
                            const value = ctx.parsed || 0;
                            const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 3. Popular Services Chart (Bar Chart)
async function loadPopularServicesChart() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/dashboard/chart/popular-services", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();
    const data = result.data;

    new Chart(document.getElementById('servicesChart'), {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Jumlah Booking',
                data: data.counts,
                backgroundColor: '#DC143C',
                borderColor: '#A0111F',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1A1A1A',
                    titleColor: '#DC143C',
                    bodyColor: '#E5E5E5',
                    borderColor: '#DC143C',
                    borderWidth: 2,
                    padding: 12
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: '#2A2A2A'
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

async function loadDashboardSummary(start = null, end = null) {
    const token = localStorage.getItem("token");

    let url = "http://localhost:5000/dashboard/summary";

    // Jika ada filter tanggal, tambahkan ke URL
    if (start && end) {
        url += `?start=${start}&end=${end}`;
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (result.status !== "success") {
            console.error("Gagal mengambil summary:", result.message);
            return;
        }

        const data = result.data;

        // Masukkan ke HTML
        document.getElementById("totalBooking").textContent = data.totalBooking;
        document.getElementById("totalServis").textContent = data.totalServis;
        document.getElementById("totalTestDrive").textContent = data.totalTestDrive;
        document.getElementById("totalCompleted").textContent = data.totalCompleted;
        document.getElementById("totalCancelled").textContent = data.totalCancelled;

        // Format Rupiah
        document.getElementById("totalRevenue").textContent =
            "Rp " + Number(data.totalRevenue).toLocaleString("id-ID");

    } catch (err) {
        console.error("❌ Error fetching dashboard summary:", err);
    }
}


async function loadTopCustomers() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/dashboard/top-customers", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const json = await res.json();
    const data = json.data || [];

    const tbody = document.getElementById("top-customers-body");
    tbody.innerHTML = "";

    const rankClass = ["gold", "silver", "bronze"];

    data.forEach((cust, index) => {
        const rank = index + 1;
        const rankColor = rankClass[index] || "";

        const row = `
            <tr>
                <td><span class="rank-badge ${rankColor}">${rank}</span></td>
                <td>${cust.name}</td>
                <td>${cust.totalBooking} kali</td>
                <td>Rp ${formatRupiah(cust.totalSpending)}</td>
            </tr>
        `;

        tbody.innerHTML += row;
    });
}

function formatRupiah(num) {
    return Number(num).toLocaleString("id-ID");
}

async function loadRecentBookings() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/dashboard/recent-bookings", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const json = await res.json();
    const data = json.data || [];

    const tbody = document.getElementById("recent-bookings-body");
    tbody.innerHTML = "";

    data.forEach(item => {
        const typeBadge = item.type === "Servis"
            ? `<span class="type-badge servis">Servis</span>`
            : `<span class="type-badge testdrive">Test Drive</span>`;

        const statusClass = {
            "Completed": "completed",
            "Pending": "pending",
            "Cancelled": "cancelled",
            "InProgress": "confirmed",
        }[item.status] || "";

        const row = `
            <tr>
                <td>${item.date}</td>
                <td>${typeBadge}</td>
                <td>${item.customer}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            </tr>
        `;

        tbody.innerHTML += row;
    });
}

document.getElementById("btnExportExcel")?.addEventListener("click", exportToExcel);

async function exportToExcel() {
    try {
        console.log("Exporting Excel...");

        // 1️⃣ Ambil data statistik dari DOM
        const stats = {
            totalBooking: document.getElementById("totalBooking")?.innerText || "0",
            totalServis: document.getElementById("totalServis")?.innerText || "0",
            totalTestDrive: document.getElementById("totalTestDrive")?.innerText || "0",
            totalCompleted: document.getElementById("totalCompleted")?.innerText || "0",
            totalCancelled: document.getElementById("totalCancelled")?.innerText || "0",
            totalRevenue: document.getElementById("totalRevenue")?.innerText || "Rp 0",
        };

        // 2️⃣ Konversi statistik menjadi array untuk worksheet
        const statsSheetData = [
            ["LAPORAN STATISTIK DIPO"],
            [],
            ["Kategori", "Nilai"],
            ["Total Booking", stats.totalBooking],
            ["Total Servis", stats.totalServis],
            ["Total Test Drive", stats.totalTestDrive],
            ["Total Completed", stats.totalCompleted],
            ["Total Cancelled", stats.totalCancelled],
            ["Total Revenue", stats.totalRevenue],
        ];

        // 3️⃣ Ambil data Top Customers
        const topCustomerRows = Array.from(
            document.querySelectorAll("#top-customers-body tr")
        ).map(tr =>
            Array.from(tr.children).map(td => td.innerText)
        );

        const topCustomerSheet = [
            ["TOP 5 PELANGGAN AKTIF"],
            [],
            ["Rank", "Nama", "Total Booking", "Total Spending"],
            ...topCustomerRows
        ];

        // 4️⃣ Ambil data Recent Bookings
        const recentBookingsRows = Array.from(
            document.querySelectorAll("#recent-bookings-body tr")
        ).map(tr =>
            Array.from(tr.children).map(td => td.innerText)
        );

        const recentBookingsSheet = [
            ["RINGKASAN BOOKING TERBARU"],
            [],
            ["Tanggal", "Tipe", "Customer", "Status"],
            ...recentBookingsRows
        ];

        // 5️⃣ Buat workbook Excel
        const wb = XLSX.utils.book_new();

        // Sheet 1: Statistik
        const wsStats = XLSX.utils.aoa_to_sheet(statsSheetData);
        XLSX.utils.book_append_sheet(wb, wsStats, "Statistik");

        // Sheet 2: Top Customers
        const wsCustomers = XLSX.utils.aoa_to_sheet(topCustomerSheet);
        XLSX.utils.book_append_sheet(wb, wsCustomers, "Top Customers");

        // Sheet 3: Recent Bookings
        const wsBookings = XLSX.utils.aoa_to_sheet(recentBookingsSheet);
        XLSX.utils.book_append_sheet(wb, wsBookings, "Recent Bookings");

        // 6️⃣ Download file
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(blob, `Laporan-DIPO.xlsx`);

        alert("Berhasil! File Laporan-DIPO.xlsx telah diunduh.");

    } catch (err) {
        console.error("Excel export error:", err);
        alert("Gagal export Excel. Lihat console.");
    }
}

document.getElementById("btnExportPDF")?.addEventListener("click", exportToPDF);

function exportToPDF() {
    try {
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        // ---------- HEADER ----------
        doc.setFontSize(18);
        doc.text("Laporan Dashboard DIPO", 14, 20);

        doc.setFontSize(11);
        doc.text("Tanggal Export: " + new Date().toLocaleString("id-ID"), 14, 28);

        let yPos = 40;

        // ============================
        // 1️⃣ BAGIAN STATISTIK
        // ============================
        const stats = [
            ["Total Booking", document.getElementById("totalBooking")?.innerText],
            ["Total Servis", document.getElementById("totalServis")?.innerText],
            ["Total Test Drive", document.getElementById("totalTestDrive")?.innerText],
            ["Total Completed", document.getElementById("totalCompleted")?.innerText],
            ["Total Cancelled", document.getElementById("totalCancelled")?.innerText],
            ["Total Revenue", document.getElementById("totalRevenue")?.innerText],
        ];

        doc.setFontSize(14);
        doc.text("Ringkasan Statistik", 14, yPos);

        doc.autoTable({
            startY: yPos + 5,
            head: [["Kategori", "Nilai"]],
            body: stats,
            theme: "grid"
        });

        yPos = doc.lastAutoTable.finalY + 15;

        // ============================
        // 2️⃣ TOP CUSTOMERS
        // ============================
        doc.setFontSize(14);
        doc.text("Top Customers", 14, yPos);

        const topCustomerRows = Array.from(
            document.querySelectorAll("#top-customers-body tr")
        ).map(tr =>
            Array.from(tr.children).map(td => td.innerText)
        );

        doc.autoTable({
            startY: yPos + 5,
            head: [["Rank", "Nama", "Total Booking", "Total Spending"]],
            body: topCustomerRows,
            theme: "striped"
        });

        yPos = doc.lastAutoTable.finalY + 15;

        // ============================
        // 3️⃣ RECENT BOOKINGS
        // ============================
        doc.setFontSize(14);
        doc.text("Recent Bookings", 14, yPos);

        const recentBookingsRows = Array.from(
            document.querySelectorAll("#recent-bookings-body tr")
        ).map(tr => {
            const tds = Array.from(tr.children).map(td => td.innerText);

            // Format kolom tanggal (kolom ke-0)
            tds[0] = formatDate(tds[0]);

            return tds;
        });

        doc.autoTable({
            startY: yPos + 5,
            head: [["Tanggal", "Tipe", "Customer", "Status"]],
            body: recentBookingsRows,
            theme: "striped"
        });

        // ============================
        // SAVE FILE
        // ============================
        doc.save("Laporan-DIPO.pdf");

    } catch (err) {
        console.error("PDF export error:", err);
        alert("Gagal export PDF. Lihat console.");
    }
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toISOString().split("T")[0];
}

document.getElementById("filterPeriod").addEventListener("change", function () {
    const value = this.value;

    const today = new Date().toISOString().split("T")[0];

    if (value === "daily") {
        loadDashboardSummary(today, today);
    } 
    else if (value === "weekly") {
        const pastWeek = new Date();
        pastWeek.setDate(pastWeek.getDate() - 7);
        loadDashboardSummary(pastWeek.toISOString().split("T")[0], today);
    }
    else if (value === "monthly") {
        const firstDay = today.slice(0, 7) + "-01";
        loadDashboardSummary(firstDay, today);
    }
    else if (value === "yearly") {
        const firstYearDay = today.slice(0, 4) + "-01-01";
        loadDashboardSummary(firstYearDay, today);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadBookingTrendChart();
    loadStatusChart();
    loadPopularServicesChart();
    loadDashboardSummary();
    loadTopCustomers();
    loadRecentBookings();
    console.log('Laporan & Statistik Loaded');
});