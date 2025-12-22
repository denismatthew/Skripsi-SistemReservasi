// Set minimum date untuk date picker (hari ini)
const today = new Date().toISOString().split('T')[0];
document.getElementById('tanggalTestDrive').setAttribute('min', today);



async function loadTestDriveCars() {
    const dropdown = document.getElementById("mobilPilihan");
    dropdown.innerHTML = `<option value="">Loading...</option>`;

    const token = localStorage.getItem("token"); // AMBIL JWT

    try {
        const response = await fetch("http://localhost:5000/testdrive/vehicles", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,   // PENTING
                "Content-Type": "application/json"
            }
        });

        // Jika error token, response tidak akan JSON → tambahkan cek:
        if (!response.ok) {
            dropdown.innerHTML = `<option value="">Unauthorized</option>`;
            return;
        }

        const result = await response.json();

        dropdown.innerHTML = `<option value="">-- Pilih Mobil --</option>`;

        result.data.forEach(car => {
            const option = document.createElement("option");
            option.value = car.TestDrive_ID;
            option.textContent = `${car.VehicleModel} - ${car.PoliceNo}`;
            dropdown.appendChild(option);
        });

    } catch (error) {
        dropdown.innerHTML = `<option value="">Gagal memuat data</option>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadTestDriveCars();
});


document.getElementById("testDriveForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
        booking_date: document.getElementById("tanggalTestDrive").value,
        booking_time: document.getElementById("jamTestDrive").value,
        testdrive_id: document.getElementById("mobilPilihan").value,
        catatan: document.getElementById("catatan").value
    };

    const response = await fetch("http://localhost:5000/booking-testdrive", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    alert(result.message);
});

// Check login status and update nav
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    const btnLogin = document.getElementById('btnLogin');
    const userDropdown = document.getElementById('userDropdown');
    const userName = document.getElementById('userName');
    
    if (isLoggedIn === 'true' && userEmail) {
        // User is logged in
        if (btnLogin) btnLogin.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'block';
        
        // Set user name (ambil dari email, part sebelum @)
        const name = userEmail.split('@')[0];
        if (userName) userName.textContent = name;
    } else {
        // User is NOT logged in
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (userDropdown) userDropdown.style.display = 'none';
    }
}

// Toggle dropdown menu
const userButton = document.getElementById('userButton');
const dropdownMenu = document.getElementById('dropdownMenu');

if (userButton && dropdownMenu) {
    userButton.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
        userButton.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userButton.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            userButton.classList.remove('active');
        }
    });
}

// Handle logout
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Clear login status
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            
            // Redirect to landing page
            window.location.href = 'index.html';
        }
    });
}

// Run on page load
checkLoginStatus();

document.addEventListener("DOMContentLoaded", () => {
    loadTestDriveCars();
});
