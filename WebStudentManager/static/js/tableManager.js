import { showLoader, hideLoader } from './utils.js';

let currentSort = {
    column: null,
    descending: false
};

export function updateStudentsTable(data) {
    const tableBody = document.querySelector('#students-table tbody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        insertEmptyMessage(tableBody);
        return;
    }

    data.forEach(student => {
        const row = createStudentRow(student);
        tableBody.appendChild(row);
    });
}

function insertEmptyMessage(tableBody) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 4;
    cell.textContent = 'Студенты не найдены.';
    cell.style.textAlign = 'center';
}

function createStudentRow(student) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', student.student_id);
    row.innerHTML = `
        <td><a href="#" class="student-details-link" data-id="${student.student_id}">${student.student_id}</a></td>
        <td class="name-cell">${student.name}</td>
        <td class="surname-cell">${student.surname}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn" data-id="${student.student_id}">Редактировать</button>
                <button class="delete-btn" data-id="${student.student_id}">Удалить</button>
            </div>
        </td>`;
    return row;
}

export function sortTable(column) {
    const table = document.querySelector("#students-table tbody");
    const rows = Array.from(table.rows);

    // Меняем направление сортировки если кликнули по той же колонке
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

        if (valA > valB) return currentSort.descending ? -1 : 1;
        if (valA < valB) return currentSort.descending ? 1 : -1;
        return 0;
    });

    // Очищаем и заполняем таблицу заново
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    rows.forEach(row => table.appendChild(row));

    // Обновляем иконки сортировки
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

function updateSortIcons(column) {
    const headers = document.querySelectorAll('#students-table th');
    headers.forEach(header => {
        const icon = header.querySelector('.sort-icon');
        if (icon) {
            if (currentSort.column === column && header.dataset.column === column) {
                icon.textContent = currentSort.descending ? '↓' : '↑';
            } else {
                icon.textContent = '↕';
            }
        }
    });
}

// Экспортируем вспомогательные функции, если они нужны в других модулях
export {
    createStudentRow,
    insertEmptyMessage,
};