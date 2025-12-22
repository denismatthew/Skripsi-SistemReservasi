// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
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

console.log('DIPO Website Loaded!');