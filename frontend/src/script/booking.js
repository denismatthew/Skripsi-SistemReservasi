const todayDateStr = new Date().toISOString().split('T')[0];
document.getElementById('tanggalBooking').setAttribute('min', todayDateStr);


// Handle form submission
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    modelKendaraan: document.getElementById('modelKendaraan').value.trim(),
    nomorPolisi: document.getElementById('nomorPolisi').value.trim(),
    kilometer: document.getElementById('kilometer').value.trim(),
    tanggalBooking: document.getElementById('tanggalBooking').value,
    jamBooking: document.getElementById('jamBooking').value,
    keluhan: document.getElementById('keluhan').value.trim()
  };

  // Validasi tanggal tidak boleh di masa lalu
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(formData.tanggalBooking);
  if (selectedDate < today) {
    alert('Tanggal booking tidak boleh di masa lalu!');
    return;
  }

  // Ambil token JWT dari localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Anda belum login! Silakan login terlebih dahulu.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/booking-services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        booking_date: formData.tanggalBooking,
        booking_time: formData.jamBooking,
        model_kendaraan: formData.modelKendaraan,
        no_polisi: formData.nomorPolisi,
        kilometer: formData.kilometer,
        keluhan: formData.keluhan
      })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal melakukan booking');

    alert(`✅ Booking berhasil!\n\nModel: ${formData.modelKendaraan}\nNomor Polisi: ${formData.nomorPolisi}\nTanggal: ${formData.tanggalBooking}\nJam: ${formData.jamBooking}`);
    e.target.reset();
  } catch (err) {
    console.error('Error booking:', err);
    alert('Terjadi kesalahan: ' + (err.message || err));
  }
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

// function setCustomerInfo(){
//   if (!token) {
//     alert('Anda belum login! Silakan login terlebih dahulu.');
//     return;
//   }

//   try {
//     const res = await fetch('http://localhost:5000/getCustomer', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },

//       body: JSON.stringify({
//         booking_date: formData.tanggalBooking,
//         booking_time: formData.jamBooking,
//         model_kendaraan: formData.modelKendaraan,
//         no_polisi: formData.nomorPolisi,
//         kilometer: formData.kilometer,
//         keluhan: formData.keluhan
//       })
//     });
// }

// document.addEventListener('DOMContentLoaded', () => {
//     modelKendaraan.setAttribute('modelKendaraan');

//     console.log(modelKendaraan);
// });

// Run on page load
checkLoginStatus();