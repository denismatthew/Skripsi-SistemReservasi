const modal = document.getElementById('modalLayanan');
const btnTambah = document.getElementById('btnTambahLayanan');
const btnClose = document.getElementById('btnCloseModal');
const btnCancel = document.getElementById('btnCancelModal');
const formLayanan = document.getElementById('formLayanan');
const modalTitle = document.getElementById('modalTitle');
const tableBody = document.getElementById('tableLayanan');


const API_BASE = 'http://localhost:5000/services';
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
            const isActive = item.is_Active === 'Yes';

            const row = document.createElement('tr');
            row.setAttribute('data-id', item.Service_ID);

            row.innerHTML = `
                <td>${item.Service_ID}</td>
                <td>${item.Name}</td>
                <td>${item.Description}</td>
                <td>${formatRupiah(item.Price)}</td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${isActive ? 'checked' : ''} 
                            onchange="toggleStatus('${item.Service_ID}', this)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status-text">${isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td>
                    <button onclick="editLayanan('${item.Service_ID}')" class="btn-action edit">Edit</button>
                    <button onclick="deleteLayanan('${item.Service_ID}')" class="btn-action delete">Hapus</button>
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
    const nama = document.getElementById('namaLayanan').value;
    const deskripsi = document.getElementById('deskripsiLayanan').value;
    const harga = document.getElementById('hargaLayanan').value;
    const isActive = document.getElementById('isActive').checked ? 'Yes' : 'No';

    const payload = { nama, deskripsi, harga: parseInt(harga), isActive };

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
                    'Authorization': `Bearer ${token}`,
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

        const layanan = data.find(l => l.Service_ID === id);

        if (!layanan) {
            alert('Data layanan tidak ditemukan');
            return;
        }

        modalTitle.textContent = 'Edit Layanan';
        document.getElementById('layananId').value = layanan.Service_ID;
        document.getElementById('namaLayanan').value = layanan.Name;
        document.getElementById('deskripsiLayanan').value = layanan.Description;
        document.getElementById('hargaLayanan').value = layanan.Price;
        document.getElementById('isActive').checked = layanan.is_Active === 'Yes';
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
    const isActive = checkbox.checked ? 'Yes' : 'No';
    const statusText = checkbox.closest('td').querySelector('.status-text');

    try {
        const response = await fetch(`http://localhost:5000/services/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive })
        });

        if (!response.ok) throw new Error('Gagal update status');

        statusText.textContent = isActive === 'Yes' ? 'Active' : 'Inactive';
    } catch (err) {
        console.error('Error toggle status:', err);
    }
}

// Format ke rupiah
function formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', loadLayananData);
