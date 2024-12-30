export function updateStudentsTable(data) {
    const tableBody = document.querySelector('#students-table tbody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4;
        cell.textContent = 'No students found.';
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
                    <button class="edit-btn" onclick="editStudent('${student.student_id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteStudent('${student.student_id}')">Delete</button>
                </div>
            </td>`;
    });
}

export function updateGradesTable(grades, studentId) {
    document.getElementById('student-id-display').innerText = studentId;

    const gradesTableBody = document.querySelector('#grades-table tbody');
    gradesTableBody.innerHTML = ''; // Clear the table before updating.

    if (!grades || grades.length === 0) {
        const row = gradesTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No grades available';
        cell.style.textAlign = 'center';
    } else {
        grades.forEach(grade => {
            const row = gradesTableBody.insertRow();
            row.setAttribute('data-grade-id', grade.id);
            row.innerHTML = `
                <td class="subject-cell">${grade.subject_name}</td>
                <td class="grade-id-cell">${grade.id}</td>
                <td class="date-cell">${grade.date || 'Not specified'}</td>
                <td class="grade-cell">${grade.grade}</td>
                <td class="grade-action-cell">
                    <button onclick="editGrade('${grade.id}')">Edit</button>
                    <button onclick="deleteGrade('${grade.id}')">Delete</button>
                </td>`;
        });
    }
}
