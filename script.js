let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
let editIndex = -1;

document.getElementById('account-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const website = document.getElementById('website').value.trim();
  const contract = document.getElementById('contract').value.trim();

  const account = { name, email, password, website, contract };

  if (editIndex >= 0) {
    accounts[editIndex] = account;
    editIndex = -1;
  } else {
    accounts.push(account);
  }

  saveAccounts();
  this.reset();
  renderTable();
});

function renderTable() {
  const table = document.getElementById('account-table');
  table.innerHTML = '';

  accounts.forEach((acc, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${acc.name}</td>
      <td>${acc.email}</td>
      <td>${acc.password}</td>
      <td><a href="${acc.website}" target="_blank">Kunjungi</a></td>
      <td>${acc.contract}</td>
      <td class="actions">
        <button class="edit" onclick="editAccount(${i})">Edit</button>
        <button class="delete" onclick="deleteAccount(${i})">Hapus</button>
        <button class="copy" onclick="copyAccount(${i})">Copy</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function editAccount(index) {
  const acc = accounts[index];
  document.getElementById('name').value = acc.name;
  document.getElementById('email').value = acc.email;
  document.getElementById('password').value = acc.password;
  document.getElementById('website').value = acc.website;
  document.getElementById('contract').value = acc.contract;
  editIndex = index;
}

function deleteAccount(index) {
  if (confirm('Yakin ingin menghapus akun ini?')) {
    accounts.splice(index, 1);
    saveAccounts();
    renderTable();
  }
}

function copyAccount(index) {
  const acc = accounts[index];
  const text = `
Nama: ${acc.name}
Email: ${acc.email}
Password: ${acc.password}
Website: ${acc.website}
Contract Address: ${acc.contract}
  `;
  navigator.clipboard.writeText(text).then(() => {
    alert('Data berhasil disalin ke clipboard.');
  });
}

function saveAccounts() {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

// Initial load
renderTable();

function exportToCSV() {
  if (accounts.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  const headers = ["No", "Nama Akun", "Email", "Password", "Website", "Contract Address"];
  const rows = accounts.map((acc, i) => [
    i + 1,
    acc.name,
    acc.email,
    acc.password,
    acc.website,
    acc.contract,
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(value => `"${value}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "daftar-akun.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
