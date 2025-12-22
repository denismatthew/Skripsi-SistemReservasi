const modal = document.getElementById('modalLayanan');
const btnTambah = document.getElementById('btnTambahLayanan');
const btnClose = document.getElementById('btnCloseModal');
const btnCancel = document.getElementById('btnCancelModal');
const formLayanan = document.getElementById('formLayanan');
const modalTitle = document.getElementById('modalTitle');
const tableBody = document.getElementById('tableLayanan');


const API_BASE = 'http://localhost:5000/testdrive';
const token = localStorage.getItem('token');

function closeModal() {
    modal.classList.remove('show');
    formLayanan.reset();
}

btnTambah?.addEventListener('click', () => {
    modalTitle.textContent = 'Tambah Layanan Baru';
    formLayanan.reset();
    document.getElementById('layananId').value = '';
    modal.classList.add('show');
});

// Event: tutup modal
btnClose?.addEventListener('click', closeModal);
btnCancel?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// Load semua layanan
async function loadLayananData() {
    try {
        const response = await fetch(API_BASE, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();
        const data = result.data;
        console.log("Data dari backend:", data);

        tableBody.innerHTML = '';

        if (!Array.isArray(data)) {
            console.error('Response bukan array:', data);
            return;
        }

        data.forEach((item) => {
            const isAvailable = item.isAvailable === 'Yes';

            const row = document.createElement('tr');
            row.setAttribute('data-id', item.TestDrive_ID);

            row.innerHTML = `
                <td>${item.TestDrive_ID}</td>
                <td>${item.VehicleModel}</td>
                <td>${item.PoliceNo}</td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${isAvailable ? 'checked' : ''} 
                            onchange="toggleStatus('${item.TestDrive_ID}', this)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status-text">${isAvailable ? 'Active' : 'Inactive'}</span>
                </td>
                <td>
                    <button onclick="editLayanan('${item.TestDrive_ID}')" class="btn-action edit">Edit</button>
                    <button onclick="deleteLayanan('${item.TestDrive_ID}')" class="btn-action delete">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading layanan:', error);
    }
}


// Submit form tambah/edit
formLayanan?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const layananId = document.getElementById('layananId').value;
    const model = document.getElementById('namaModel').value;
    const noplat = document.getElementById('NoPlat').value;
    const isAvailable = document.getElementById('isAvailable').checked ? 'Yes' : 'No';

    const payload = { model, noplat, isAvailable };

    try {
        let response;
        if (layananId) {
            // UPDATE
            response = await fetch(`${API_BASE}/${layananId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });
            alert('Layanan berhasil diperbarui!');
        } else {
            // CREATE
            response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            alert('Layanan baru berhasil ditambahkan!');
        }

        if (!response.ok) throw new Error('Gagal menyimpan data');
        closeModal();
        await loadLayananData();

    } catch (error) {
        console.error('Error saving layanan:', error);
    }
});

// Fungsi Edit Layanan
async function editLayanan(id) {
    try {
        const response = await fetch(`${API_BASE}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();
        const data = result.data;

        const layanan = data.find(l => l.TestDrive_ID === id);

        if (!layanan) {
            alert('Data layanan tidak ditemukan');
            return;
        }

        modalTitle.textContent = 'Edit Layanan';
        document.getElementById('layananId').value = layanan.TestDrive_ID;
        document.getElementById('namaModel').value = layanan.VehicleModel;
        document.getElementById('NoPlat').value = layanan.PoliceNo;
        document.getElementById('isAvailable').checked = layanan.isAvailable === 'Yes';
        modal.classList.add('show');

    } catch (error) {
        console.error('Error edit layanan:', error);
    }
}


// Fungsi Delete Layanan
async function deleteLayanan(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;
    try {
        const response = await fetch(`${API_BASE}/${id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Gagal menghapus layanan');
        alert('Layanan berhasil dihapus!');
        await loadLayananData();
    } catch (error) {
        console.error('Error delete layanan:', error);
    }
}

// Search Layanan
document.getElementById('searchLayanan')?.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const table = document.getElementById('tableLayanan');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                found = true;
                break;
            }
        }
        
        if (found || searchTerm === '') {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
});

//toggle status
async function toggleStatus(id, checkbox) {
    const isAvailable = checkbox.checked ? 'Yes' : 'No';
    const statusText = checkbox.closest('td').querySelector('.status-text');

    try {
        const response = await fetch(`http://localhost:5000/testdrive/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isAvailable })
        });

        if (!response.ok) throw new Error('Gagal update status');

        statusText.textContent = isAvailable === 'Yes' ? 'Active' : 'Inactive';
    } catch (err) {
        console.error('Error toggle status:', err);
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', loadLayananData);
