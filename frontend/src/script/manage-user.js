const modal = document.getElementById('modalUser');
const btnTambahStaff = document.getElementById('btnTambahStaff');
const btnTambahAdmin = document.getElementById('btnTambahAdmin');
const btnClose = document.getElementById('btnCloseModal');
const btnCancel = document.getElementById('btnCancelModal');
const formUser = document.getElementById('formUser');
const modalTitle = document.getElementById('modalTitle');
const emailHelp = document.getElementById('emailHelp');
const staffRoleGroup = document.getElementById('staffRoleGroup');
const staffRoleInput = document.getElementById('staffRoleUser');

const API_BASE = 'http://localhost:5000/users';


document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});

btnTambahStaff?.addEventListener('click', () => openAddModal('staff'));
btnTambahAdmin?.addEventListener('click', () => openAddModal('admin'));

function openAddModal(role) {
    const roleText = role === 'staff' ? 'Staff' : 'Admin';
    const emailDomain = role === 'staff' ? '@staff.dipo.co' : '@admin.dipo.co';

    modalTitle.textContent = `Tambah ${roleText} Baru`;
    formUser.reset();
    document.getElementById('userId').value = '';
    document.getElementById('userRole').value = role;

    // Show/Hide Staff Role Field
    if (role === 'staff') {
        staffRoleGroup.style.display = 'block';
        staffRoleInput.required = true;
    } else {
        staffRoleGroup.style.display = 'none';
        staffRoleInput.required = false;
    }

    // Email help text
    emailHelp.textContent = `Email harus menggunakan domain ${emailDomain}`;

    // Password required for new user
    const passwordField = document.getElementById('passwordUser');
    passwordField.required = true;
    passwordField.placeholder = 'Minimal 8 karakter';

    modal.classList.add('show');
}

btnClose?.addEventListener('click', closeModal);
btnCancel?.addEventListener('click', closeModal);

modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('show');
    formUser.reset();
    emailHelp.textContent = '';
    staffRoleGroup.style.display = 'none';
}


async function loadUserData() {
    try {
        const response = await fetch(`${API_BASE}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = await response.json();
        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Gagal memuat data user');
        }

        const data = result.data;
        const tableCustomer = document.getElementById('tableCustomer');
        const tableStaff = document.getElementById('tableStaff');
        const tableAdmin = document.getElementById('tableAdmin');
        [tableCustomer, tableStaff, tableAdmin].forEach(t => (t.innerHTML = ''));

        data.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', user.UserID);

        switch (user.Role?.toLowerCase()) {
            case 'customer':
                row.innerHTML = `
                    <td>${user.UserID}</td>
                    <td>${user.Name}</td>
                    <td>${user.Email}</td>
                    <td>${user.PhoneNo || '-'}</td>
                    <td>${user.Address || '-'}</td>
                    <td>
                        <button class="btn-action edit" onclick="editUser('${user.UserID}', '${user.Role}')">Edit</button>
                        <button class="btn-action delete" onclick="deleteUser('${user.UserID}')">Hapus</button>
                    </td>
                `;
                tableCustomer?.appendChild(row);
                break;

            case 'staff':
                row.innerHTML = `
                    <td>${user.UserID}</td>
                    <td>${user.Name}</td>
                    <td>${user.Email}</td>
                    <td>${user.PhoneNo || '-'}</td>
                    <td>${user.Address || '-'}</td>
                    <td>${user.StaffRole || '-'}</td>
                    <td>
                        <button class="btn-action edit" onclick="editUser('${user.UserID}', '${user.Role}')">Edit</button>
                        <button class="btn-action delete" onclick="deleteUser('${user.UserID}')">Hapus</button>
                    </td>
                `;
                tableStaff?.appendChild(row);
                break;

            case 'admin':
                row.innerHTML = `
                    <td>${user.UserID}</td>
                    <td>${user.Name}</td>
                    <td>${user.Email}</td>
                    <td>${user.PhoneNo || '-'}</td>
                    <td>${user.Address || '-'}</td>
                    <td>
                        <button class="btn-action edit" onclick="editUser('${user.UserID}', '${user.Role}')">Edit</button>
                        <button class="btn-action delete" onclick="deleteUser('${user.UserID}')">Hapus</button>
                    </td>
                `;
                tableAdmin?.appendChild(row);
                break;
            }
        });

        console.log('Data user berhasil dimuat.');
    } catch (error) {
        console.error('Gagal memuat data user:', error);
        alert('Terjadi kesalahan saat memuat data user.');
    }
}

formUser?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const role = document.getElementById('userRole').value;
    const nama = document.getElementById('namaUser').value;
    const email = document.getElementById('emailUser').value;
    const telepon = document.getElementById('teleponUser').value;
    const password = document.getElementById('passwordUser').value;
    const address = document.getElementById('addressUser').value;
    const staffRole = document.getElementById('staffRoleUser').value; // ✅ ambil role staff

    // Validasi domain email
    if (role === 'staff' && !email.endsWith('@staff.dipo.co')) {
        alert('Email staff harus menggunakan domain @staff.dipo.co');
        return;
    }
    if (role === 'admin' && !email.endsWith('@admin.dipo.co')) {
        alert('Email admin harus menggunakan domain @admin.dipo.co');
        return;
    }

    // Data yang akan dikirim ke server
    const data = {
        nama,
        email,
        telepon,
        password,
        role,
        address
    };
    console.log('🔹 Data yang dikirim untuk update:', data);

    // ✅ Tambahkan staffRole kalau role = staff
    if (role === 'staff' || role === 'Staff') {
        data.staffRole = staffRole;
    }

    try {
        let response;
        if (userId) {
            // UPDATE
            response = await fetch(`${API_BASE}/${userId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
        } else {
            // CREATE
            console.log('Data dikirim:', data);
            response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();
        console.log('✅ Data hasil update dari server:', result);
        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Gagal menyimpan data');
        }

        alert(userId ? 'User berhasil diperbarui!' : `${role.charAt(0).toUpperCase() + role.slice(1)} baru berhasil ditambahkan!`);
        closeModal();
        await loadUserData();

    } catch (error) {
        console.error('Error saving user:', error);
        alert('Terjadi kesalahan saat menyimpan data user.');
    }
});


async function editUser(id, role) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const result = await response.json();
        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Gagal memuat data user');
        }

        const data = result.data;
        modalTitle.textContent = `Edit ${data.Role.charAt(0).toUpperCase() + data.Role.slice(1)}`;
        document.getElementById('userId').value = data.UserID;
        document.getElementById('userRole').value = data.Role;
        document.getElementById('namaUser').value = data.Name;
        document.getElementById('emailUser').value = data.Email;
        document.getElementById('teleponUser').value = data.PhoneNo;
        document.getElementById('addressUser').value = data.Address;

        // Role staff?
        if (role === 'staff' || role === 'Staff') {
            staffRoleGroup.style.display = 'block';
            staffRoleInput.required = true;

            // Set selected value
            if (data.StaffRole) {
                staffRoleInput.value = data.StaffRole;
            } else {
                staffRoleInput.value = '';
            }
        } else {
            staffRoleGroup.style.display = 'none';
            staffRoleInput.required = false;
            staffRoleInput.value = '';
        }

        // Password optional
        const passwordField = document.getElementById('passwordUser');
        passwordField.required = false;
        passwordField.placeholder = 'Kosongkan jika tidak ingin mengubah password';

        emailHelp.textContent = '';
        modal.classList.add('show');
    } catch (error) {
        console.error('Gagal memuat data user:', error);
        alert('Terjadi kesalahan saat memuat data user.');
    }
}

async function deleteUser(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const result = await response.json();
        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Gagal menghapus user');
        }

        alert('User berhasil dihapus!');
        document.querySelector(`tr[data-id="${id}"]`)?.remove();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Terjadi kesalahan saat menghapus user.');
    }
}


function searchTable(tableId, term) {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term.toLowerCase()) ? '' : 'none';
    });
}

document.getElementById('searchCustomer')?.addEventListener('input', e => searchTable('tableCustomer', e.target.value));
document.getElementById('searchStaff')?.addEventListener('input', e => searchTable('tableStaff', e.target.value));
document.getElementById('searchAdmin')?.addEventListener('input', e => searchTable('tableAdmin', e.target.value));


document.getElementById('teleponUser')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});


document.addEventListener('DOMContentLoaded', loadUserData);
