// Handle Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('namaLengkap').value.trim();
        const email = document.getElementById('emailRegister').value.trim();
        const phoneNo = document.getElementById('noTelepon').value.trim();
        const address = document.getElementById('Alamat').value.trim();
        const password = document.getElementById('passwordRegister').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // ==== VALIDASI ====

        if (!nama || !email || !phoneNo || !address || !password || !confirmPassword) {
            alert('Semua field harus diisi!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Format email tidak valid!');
            return;
        }

        if (password.length < 8) {
            alert('Password minimal 8 karakter!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }

        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phoneNo)) {
            alert('Nomor telepon hanya boleh angka!');
            return;
        }

        // ==== KIRIM KE BACKEND ====
        try {
            const res = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nama,
                    email,
                    phoneNo,
                    address,
                    password
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Registrasi berhasil! Silakan login.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Registrasi gagal');
            }

        } catch (err) {
            console.error('Register Error:', err);
            alert('Terjadi kesalahan server.');
        }
    });
}

// Format nomor telepon (hanya angka)
const noTeleponInput = document.getElementById('noTelepon');
if (noTeleponInput) {
    noTeleponInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}


// Handle Login Form
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validasi basic
        if (!email || !password) {
            alert('Email dan password harus diisi!');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                const user = data.data.user;
                // Login berhasil
                alert('Login berhasil! Selamat datang, ' + data.data.user.nama);

                // Simpan token JWT di localStorage
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('userEmail', data.data.user.email);
                localStorage.setItem('userName', data.data.user.nama);
                localStorage.setItem('userRole', data.data.user.role);
                localStorage.setItem('staffRole', data.data.user.staffRole);
                localStorage.setItem('isLoggedIn', 'true');

                if (user.role.toLowerCase() === 'admin') {
                    window.location.href = 'admin/admin-booking.html';
                }else if (user.role.toLowerCase() === 'staff') {
                    window.location.href = 'staff/dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }

        } catch (err) {
            console.error('Login Error:', err);
            alert('Terjadi kesalahan server. Coba lagi.');
        }
    });
}