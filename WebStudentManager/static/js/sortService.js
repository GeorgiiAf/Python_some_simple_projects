export let currentSort = {
    column: null,
    descending: false
};

export function sortTable(column) {
    const table = document.querySelector("#students-table tbody");
    const rows = Array.from(table.rows);

    if (currentSort.column === column) {
        currentSort.descending = !currentSort.descending;
    } else {
        currentSort.column = column;
        currentSort.descending = false;
    }

    rows.sort((a, b) => {
        let valA, valB;

        switch (column) {
            case 'name':
                valA = a.querySelector('.name-cell').textContent.toLowerCase();
                valB = b.querySelector('.name-cell').textContent.toLowerCase();
                break;
            case 'surname':
                valA = a.querySelector('.surname-cell').textContent.toLowerCase();
                valB = b.querySelector('.surname-cell').textContent.toLowerCase();
                break;
            default:
                return 0;
        }

        return currentSort.descending ?
            (valA > valB ? -1 : 1) :
            (valA > valB ? 1 : -1);
    });

    table.innerHTML = '';
    rows.forEach(row => table.appendChild(row));
    updateSortIcons(column);
}

export function sortGrades(column) {
    const tableBody = document.querySelector('#grades-table tbody');
    const rows = Array.from(tableBody.rows);

    rows.sort((a, b) => {
        let valA, valB;

        switch (column) {
            case 'date':
                valA = new Date(a.querySelector('.date-cell').textContent);
                valB = new Date(b.querySelector('.date-cell').textContent);
                break;
            case 'subject':
                valA = a.querySelector('.subject-cell').textContent.toLowerCase();
                valB = b.querySelector('.subject-cell').textContent.toLowerCase();
                break;
            case 'grade':
                valA = Number(a.querySelector('.grade-cell').textContent);
                valB = Number(b.querySelector('.grade-cell').textContent);
                break;
            default:
                return 0;
        }

        if (valA > valB) return 1;
        if (valA < valB) return -1;
        return 0;
    });

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    rows.forEach(row => tableBody.appendChild(row));
}