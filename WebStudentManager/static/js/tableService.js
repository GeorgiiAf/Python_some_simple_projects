export function updateStudentsTable(data) {
    const tableBody = document.querySelector('#students-table tbody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4;
        cell.textContent = 'Студенты не найдены.';
        cell.style.textAlign = 'center';
        return;
    }

    data.forEach(student => {
        const row = tableBody.insertRow();
        row.setAttribute('data-id', student.student_id);
        row.innerHTML = `
            <td><a href="#" onclick="viewStudentDetails('${student.student_id}'); return false;">${student.student_id}</a></td>
            <td class="name-cell">${student.name}</td>
            <td class="surname-cell">${student.surname}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editStudent('${student.student_id}')">Редактировать</button>
                    <button class="delete-btn" onclick="deleteStudent('${student.student_id}')">Удалить</button>
                </div>
            </td>`;
    });
}