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