document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('searchInput').addEventListener('input', filterTable);
document.getElementById('rowsPerPage').addEventListener('change', updateTable);
document.getElementById('prevPage').addEventListener('click', prevPage);
document.getElementById('nextPage').addEventListener('click', nextPage);

let allRows = [];
let filteredRows = [];
let currentPage = 1;
let rowsPerPage = 10;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("Silakan pilih file CSV atau Excel.");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        allRows = parseCSV(contents);
        filteredRows = allRows.slice();
        displayTable();
    };
    reader.readAsText(file);
}

function parseCSV(data) {
    return data.split('\n').map(row => row.split(','));
}

function displayTable() {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';

    const header = allRows[0];
    const headerRow = document.createElement('tr');
    header.forEach((text, index) => {
        const th = document.createElement('th');
        th.textContent = text;
        th.addEventListener('click', () => sortTable(index));
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(startRow + rowsPerPage - 1, filteredRows.length - 1);
    
    for (let i = startRow; i <= endRow; i++) {
        const row = filteredRows[i];
        if (row) {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        }
    }

    
    document.getElementById('pageInfo').textContent = `Halaman ${currentPage}`;
}

function sortTable(columnIndex) {
    filteredRows.sort((a, b) => {
        const cellA = a[columnIndex].toLowerCase();
        const cellB = b[columnIndex].toLowerCase();
        return cellA.localeCompare(cellB);
    });
    displayTable();
}

function filterTable() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    filteredRows = allRows.filter((row, index) => 
        index === 0 || row.some(cell => cell.toLowerCase().includes(input))
    );
    currentPage = 1; 
    displayTable();
}

function updateTable() {
    rowsPerPage = parseInt(document.getElementById('rowsPerPage').value);
    currentPage = 1; 
    displayTable();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable();
    }
}

function nextPage() {
    if ((currentPage * rowsPerPage) < filteredRows.length - 1) {
        currentPage++;
        displayTable();
    }
}
