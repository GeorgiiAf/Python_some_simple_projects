export function updateStudentsTable(students) {
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = '';

    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.dataset.id = student.student_id;
        tr.innerHTML = `
            <td class="id-cell">
                <a href="#" onclick="showGrades('${student.student_id}'); return false;" class="text-primary text-decoration-none">
                    ${student.student_id}
                </a>
            </td>
            <td class="name-cell">${student.name}</td>
            <td class="surname-cell">${student.surname}</td>
            <td class="action-buttons">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-danger" onclick="deleteStudent('${student.student_id}')">
                        Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

export function updateGradesTable(grades, studentId) {
    const tbody = document.querySelector('#grades-table tbody');
    tbody.innerHTML = '';

    grades.forEach(grade => {
        const tr = document.createElement('tr');
        tr.dataset.gradeId = grade.id;
        tr.innerHTML = `
            <td class="subject-cell">${grade.subject_name}</td>
            <td class="id-cell">${grade.id}</td>
            <td class="date-cell">${grade.date}</td>
            <td class="grade-cell">${grade.grade}</td>
            <td class="action-buttons">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-warning" onclick="editGrade(${grade.id})">
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteGrade(${grade.id})">
                        Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Сохраняем ID студента в модальном окне для дальнейшего использования
    const modal = document.getElementById('student-modal');
    if (modal) {
        modal.dataset.studentId = studentId;
    }
}
