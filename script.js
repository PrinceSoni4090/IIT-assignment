let chemicalData = [
    { id: 1, chemicalName: "Ammonium Persulfate", vendor: "LG Chem", density: "3525.92", viscosity: "60.63", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: 6495.18 },
    { id: 2, chemicalName: "Caustic Potash", vendor: "Formosa", density: "3172.15", viscosity: "48.22", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: 8751.90 },
    { id: 3, chemicalName: "Dimethylaminopropylamino", vendor: "LG Chem", density: "8435.37", viscosity: "12.62", packaging: "Barrel", packSize: "75.00", unit: "L", quantity: 5964.61 },
    { id: 4, chemicalName: "Mono Ammonium Phosphate", vendor: "Sinopec", density: "1597.65", viscosity: "76.51", packaging: "Bag", packSize: "105.00", unit: "kg", quantity: 8183.73 },
    { id: 5, chemicalName: "Ferric Nitrate", vendor: "DowDuPont", density: "364.04", viscosity: "14.90", packaging: "Bag", packSize: "105.00", unit: "kg", quantity: 4154.33 },
    { id: 6, chemicalName: "n-Pentane", vendor: "Sinopec", density: "4535.26", viscosity: "66.76", packaging: "N/A", packSize: "N/A", unit: "t", quantity: 6272.34 },
    { id: 7, chemicalName: "Glycol Ether PM", vendor: "LG Chem", density: "6495.18", viscosity: "72.12", packaging: "Bag", packSize: "250.00", unit: "kg", quantity: 8749.54 },
];

const table = document.getElementById('chemicalTable');
const tbody = table.querySelector('tbody');
const selectAllCheckbox = document.getElementById('selectAll');

function renderTable() {
    tbody.innerHTML = '';
    chemicalData.forEach((chemical, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="rowCheckbox"></td>
            <td class="editable" data-field="chemicalName">${chemical.id}. ${chemical.chemicalName}</td>
            <td class="editable" data-field="vendor">${chemical.vendor}</td>
            <td class="editable" data-field="density">${chemical.density}</td>
            <td class="editable" data-field="viscosity">${chemical.viscosity}</td>
            <td class="editable" data-field="packaging">${chemical.packaging}</td>
            <td class="editable" data-field="packSize">${chemical.packSize}</td>
            <td class="editable" data-field="unit">${chemical.unit}</td>
            <td class="editable" data-field="quantity">${chemical.quantity}</td>
        `;
        tbody.appendChild(row);
    });
}

function sortTable(column) {
    const currentDirection = table.querySelector(`th[data-sort="${column}"]`).dataset.sortDirection;
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    // Reset all sort indicators
    table.querySelectorAll('th').forEach(th => {
        th.removeAttribute('data-sort-direction');
    });

    // Set the new sort direction
    table.querySelector(`th[data-sort="${column}"]`).dataset.sortDirection = newDirection;

    chemicalData.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        // Special handling for chemicalName column
        if (column === 'id') {
            aValue = a.chemicalName.toLowerCase();
            bValue = b.chemicalName.toLowerCase();
        }

        if (typeof aValue === 'string') {
            return newDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
            return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
    });

    renderTable();
}

function addRow() {
    const newId = chemicalData.length + 1;
    const newChemical = {
        id: newId,
        chemicalName: "New Chemical",
        vendor: "New Vendor",
        density: "0",
        viscosity: "0",
        packaging: "N/A",
        packSize: "0",
        unit: "kg",
        quantity: 0
    };
    chemicalData.push(newChemical);
    renderTable();
}

function handleCheckboxSelection() {
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    const selectedRows = document.querySelectorAll('.rowCheckbox:checked');
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.closest('tr').classList.toggle('selected', checkbox.checked);
    });

    selectAllCheckbox.checked = selectedRows.length === checkboxes.length;
}

function handleSelectAll() {
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        checkbox.closest('tr').classList.toggle('selected', selectAllCheckbox.checked);
    });
}

function makeEditable(cell) {
    const field = cell.dataset.field;
    let value = cell.textContent;
    
    // Remove the ID from the chemical name when editing
    if (field === 'chemicalName') {
        value = value.split('. ')[1];
    }
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.padding = '5px';
    input.style.border = '1px solid #ddd';
    input.style.backgroundColor = '#fff';
    input.style.fontSize = '14px';

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => saveEdit(cell, input, field));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
}

function saveEdit(cell, input, field) {
    const newValue = input.value;
    const rowIndex = cell.parentElement.rowIndex - 1;
    chemicalData[rowIndex][field] = newValue;

    if (field === 'chemicalName') {
        cell.textContent = `${chemicalData[rowIndex].id}. ${newValue}`;
    } else {
        cell.textContent = newValue;
    }
}

function moveRowUp() {
    const selectedCheckbox = document.querySelector('.rowCheckbox:checked');
    if (selectedCheckbox) {
        const row = selectedCheckbox.closest('tr');
        const index = Array.from(tbody.children).indexOf(row);
        if (index > 0) {
            const temp = chemicalData[index];
            chemicalData[index] = chemicalData[index - 1];
            chemicalData[index - 1] = temp;
            renderTable();
        }
    }
}

function moveRowDown() {
    const selectedCheckbox = document.querySelector('.rowCheckbox:checked');
    if (selectedCheckbox) {
        const row = selectedCheckbox.closest('tr');
        const index = Array.from(tbody.children).indexOf(row);
        if (index < chemicalData.length - 1) {
            const temp = chemicalData[index];
            chemicalData[index] = chemicalData[index + 1];
            chemicalData[index + 1] = temp;
            renderTable();
        }
    }
}

function deleteRow() {
    const selectedCheckboxes = document.querySelectorAll('.rowCheckbox:checked');
    selectedCheckboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const index = Array.from(tbody.children).indexOf(row);
        chemicalData.splice(index, 1);
    });
    renderTable();
}

function saveData() {
    localStorage.setItem('chemicalData', JSON.stringify(chemicalData));
    alert('Data saved successfully!');
}

function loadData() {
    const savedData = localStorage.getItem('chemicalData');
    if (savedData) {
        chemicalData = JSON.parse(savedData);
    }
    renderTable();
}

document.getElementById('addRow').addEventListener('click', addRow);
document.getElementById('moveRowUp').addEventListener('click', moveRowUp);
document.getElementById('moveRowDown').addEventListener('click', moveRowDown);
document.getElementById('deleteRow').addEventListener('click', deleteRow);
document.getElementById('refreshData').addEventListener('click', loadData);
document.getElementById('saveData').addEventListener('click', saveData);

tbody.addEventListener('change', handleCheckboxSelection);
selectAllCheckbox.addEventListener('change', handleSelectAll);

tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('editable')) {
        makeEditable(e.target);
    }
});

// Add event listeners for sorting
document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
        const column = th.dataset.sort;
        sortTable(column);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadData();
});