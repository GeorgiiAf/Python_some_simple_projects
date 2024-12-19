// -- получение всех студентов
function fetchStudents() {
    fetch('/get_students?surname=все')
        .then(response => response.json())
        .then(data => renderStudentsTable(data))
        .catch(error => console.error('Ошибка при получении данных:', error));
}

// -- рендеринг таблицы студентов
function renderStudentsTable(students) {
    var table = '<table>';
    table += `
        <tr>
            <th>Номер зачетной книжки</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Предметы и оценки</th>
            <th>Действия</th>
        </tr>`;
    students.forEach(student => {
        table += `
            <tr>
                <td>${student.student_id}</td>
                <td><input value="${student.name}" data-id="${student.student_id}" class="name-input"></td>
                <td><input value="${student.surname}" data-id="${student.student_id}" class="surname-input"></td>
                <td><input value="${formatSubjects(student.subjects)}" data-id="${student.student_id}" class="subjects-input"></td>
                <td>
                    <button onclick="updateStudent(${student.student_id})">Обновить</button>
                    <button onclick="deleteStudent(${student.student_id})">Удалить</button>
                </td>
            </tr>`;
    });
    table += '</table>';
    document.getElementById('students-container').innerHTML = table;
}

// -- форматирование предметов и оценок
function formatSubjects(subjects) {
    return Object.entries(subjects).map(([subject, grade]) => `${subject}:${grade}`).join(', ');
}

// -- добавление студента
function addStudent() {
    var studentId = document.getElementById('student-id-input').value;
    var name = document.getElementById('name-input').value;
    var surname = document.getElementById('surname-input').value;
    var subjectsText = document.getElementById('subjects-input').value;

    var subjects = parseSubjects(subjectsText);

    fetch('/add_student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, name: name, surname: surname, subjects: subjects }),
    })
        .then(response => {
            if (response.ok) {
                alert('Студент успешно добавлен');
                fetchStudents(); // Обновляем список студентов
            } else {
                alert('Ошибка при добавлении студента');
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

// -- обновление данных студента
function updateStudent(studentId) {
    var name = document.querySelector(`.name-input[data-id="${studentId}"]`).value;
    var surname = document.querySelector(`.surname-input[data-id="${studentId}"]`).value;
    var subjectsText = document.querySelector(`.subjects-input[data-id="${studentId}"]`).value;

    var subjects = parseSubjects(subjectsText);

    fetch('/update_student', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, name: name, surname: surname, subjects: subjects }),
    })
        .then(response => {
            if (response.ok) {
                alert('Студент успешно обновлён');
                fetchStudents(); // Обновляем список студентов
            } else {
                alert('Ошибка при обновле
