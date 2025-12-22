// Check if user is admin
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    // Redirect if not logged in or not admin
    if (isLoggedIn !== 'true' || userRole !== 'admin' || !token) {
        alert('Akses ditolak! Anda harus login sebagai admin.');
        window.location.href = '../login.html';
        return false;
    }

    // Set admin info in header
    const adminNameEl = document.getElementById('adminName');
    const adminEmailEl = document.getElementById('adminEmail');
    
    if (adminEmailEl && userEmail) {
        adminEmailEl.textContent = userEmail;
        const name = userEmail.split('@')[0];
        if (adminNameEl) {
            adminNameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        }
    }

    return true;
}

// Load Dashboard Stats (Mock Data - nanti ganti dengan API)
async function loadDashboardStats() {
    try {
        // TODO: Fetch dari backend pakai JWT
        // const response = await fetch('http://localhost:5000/api/admin/stats', {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        // });
        // const data = await response.json();

        const stats = {
            bookingToday: 12,
            bookingWeek: 48,
            bookingMonth: 187,
            totalCustomers: 324
        };

        for (const key in stats) {
            animateNumber(key, 0, stats[key], 1000);
        }

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function animateNumber(elementId, start, end, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            el.textContent = end;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

async function loadRecentActivities() {
    try {
        // TODO: Fetch dari backend
        // const response = await fetch('http://localhost:5000/api/admin/recent-activities', {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        // });
        // const data = await response.json();
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

// Logout
document.getElementById('btnAdminLogout')?.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.clear();
        window.location.replace('../login.html');
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAuth()) return;
    loadDashboardStats();
    loadRecentActivities();
    console.log('Admin Dashboard Loaded');
});
