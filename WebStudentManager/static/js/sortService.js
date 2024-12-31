export let currentSort = {
    column: null,
    descending: false
};

function updateSortIcons(column) {
    document.querySelectorAll('[data-sort]').forEach(header => {
        const icon = header.querySelector('.sort-icon') || createSortIcon(header);

        if (header.dataset.sort === column) {
            icon.textContent = currentSort.descending ? '▼' : '▲';
            icon.classList.add('active');
        } else {
            icon.textContent = '▲';
            icon.classList.remove('active');
        }
    });
}

function createSortIcon(header) {
    const icon = document.createElement('span');
    icon.className = 'sort-icon';
    icon.textContent = '▲';
    header.appendChild(icon);
    return icon;
}

function getSortValue(row, column, type = 'text') {
    const cell = row.querySelector(`.${column}-cell`);
    const value = cell?.textContent || '';

    switch (type) {
        case 'date': return new Date(value);
        case 'number': return Number(value);
        default: return value.toLowerCase();
    }
}

function sortRows(rows, column, type = 'text') {
    return rows.sort((a, b) => {
        const valA = getSortValue(a, column, type);
        const valB = getSortValue(b, column, type);

        return currentSort.descending
            ? (valA > valB ? -1 : 1)
            : (valA > valB ? 1 : -1);
    });
}

export function sortTable(column) {
    const tbody = document.querySelector("#students-table tbody");
    currentSort.descending = currentSort.column === column ? !currentSort.descending : false;
    currentSort.column = column;

    const rows = sortRows(Array.from(tbody.rows), column);
    tbody.replaceChildren(...rows);
    updateSortIcons(column);
}

export function sortGrades(column) {
    const tbody = document.querySelector('#grades-table tbody');
    const type = column === 'date' ? 'date' : column === 'grade' ? 'number' : 'text';
    const rows = sortRows(Array.from(tbody.rows), column, type);
    tbody.replaceChildren(...rows);
}