// Функция для добавления студента
function addStudent() {
    const name = document.getElementById('name-input').value.trim();
    const surname = document.getElementById('surname-input').value.trim();
    const studentId = document.getElementById('student-id-input').value.trim();

    if (!name || !surname || !studentId) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    fetch('/add_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, student_id: studentId })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Студент успешно добавлен.');
            getAllStudents();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении студента.');
        });
}

// Функция для получения списка студентов
function getAllStudents() {
    fetch('/get_students')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#students-table tbody');
            tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением новых данных

            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 4;
                cell.textContent = 'Студенты отсутствуют.';
                cell.style.textAlign = 'center';
                return;
            }

            data.forEach(student => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td><a href="#" onclick="viewStudentDetails('${student.student_id}')">${student.student_id}</a></td>
                    <td>${student.name}</td>
                    <td>${student.surname}</td>
                    <td>
                        <button onclick="editStudent('${student.student_id}')">Редактировать</button>
                        <button onclick="deleteStudent('${student.student_id}')">Удалить</button>
                    </td>`;
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить список студентов.');
        });
}

// Функция для поиска студентов
function findStudents() {
    const query = document.getElementById('search').value.trim();

    if (!query) {
        alert('Введите имя или фамилию для поиска.');
        return;
    }

    fetch(`/search_students?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#students-table tbody');
            tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением новых данных

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
                row.innerHTML = `
                    <td><a href="#" onclick="viewStudentDetails('${student.student_id}')">${student.student_id}</a></td>
                    <td>${student.name}</td>
                    <td>${student.surname}</td>
                    <td>
                        <button onclick="editStudent('${student.student_id}')">Редактировать</button>
                        <button onclick="deleteStudent('${student.student_id}')">Удалить</button>
                    </td>`;
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при поиске студентов.');
        });
}

// Функция для редактирования студента
function editStudent(studentId) {
    const name = prompt("Введите новое имя:").trim();
    const surname = prompt("Введите новую фамилию:").trim();

    if (!name || !surname) {
        alert('Имя и фамилия не могут быть пустыми.');
        return;
    }

    fetch(`/edit_student/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Студент успешно обновлён.');
            getAllStudents();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при редактировании студента.');
        });
}

// Функция для удаления студента
function deleteStudent(studentId) {
    if (!confirm("Вы уверены, что хотите удалить студента?")) return;

    fetch(`/delete_student/${studentId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Студент успешно удалён.');
            getAllStudents();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при удалении студента.');
        });
}

// Функция для просмотра деталей студента
function viewStudentDetails(studentId) {
    console.log('Открываем детали студента:', studentId); // Отладочный вывод

    fetch(`/get_grades/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Получены данные:', data); // Отладочный вывод

            // Заполняем информацию о студенте
            document.getElementById('student-id-display').textContent = studentId;

            // Получаем tbody таблицы оценок
            const gradesTableBody = document.querySelector('#grades-table tbody');
            gradesTableBody.innerHTML = ''; // Очищаем таблицу

            if (!data.grades || data.grades.length === 0) {
                const row = gradesTableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 4;
                cell.textContent = 'Оценки отсутствуют';
                cell.style.textAlign = 'center';
            } else {
                // Добавляем каждую оценку в таблицу
                data.grades.forEach(grade => {
                    const row = gradesTableBody.insertRow();
                    row.innerHTML = `
                        <td>${grade.subject_name}</td>
                        <td>${grade.id}</td>
                        <td>${grade.date || 'Не указано'}</td>
                        <td>${grade.grade}</td>
                    `;
                });
            }

            // Показываем модальное окно
            const modal = document.getElementById('student-modal');
            modal.style.display = 'block';
            console.log('Модальное окно должно быть видимым'); // Отладочный вывод
        })
        .catch(error => {
            console.error('Ошибка при загрузке оценок:', error);
            alert('Произошла ошибка при загрузке оценок студента');
        });
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById('student-modal').style.display = 'none';
}

function addGrade() {
    const studentId = document.getElementById('student-id-display').innerText;
    const subject = document.getElementById('subject-name').value.trim();
    const grade = document.getElementById('subject-grade').value.trim();
    const date = document.getElementById('subject-date').value.trim();

    if (!subject || !grade || !date) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    // Добавить запрос на добавление оценки на сервер
    fetch('/add_grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, subject_name: subject, grade: grade, date: date })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Оценка успешно добавлена.');
        viewStudentDetails(studentId); // Перезагрузить данные студента
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при добавлении оценки.');
    });
}

function editGrade(gradeId) {
    const subjectName = prompt("Введите новое название предмета:");
    const gradeValue = prompt("Введите новую оценку:");
    const date = prompt("Введите новую дату:");

    if (!subjectName || !gradeValue || !date) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    fetch(`/edit_grade/${gradeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_name: subjectName, grade: gradeValue, date: date })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Оценка успешно обновлена.');
        const studentId = document.getElementById('student-id-display').innerText;
        viewStudentDetails(studentId); // Перезагрузить данные студента
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при редактировании оценки.');
    });
}

function deleteGrade(gradeId) {
    if (!confirm("Вы уверены, что хотите удалить эту оценку?")) return;

    fetch(`/delete_grade/${gradeId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Оценка успешно удалена.');
        const studentId = document.getElementById('student-id-display').innerText;
        viewStudentDetails(studentId); // Перезагрузить данные студента
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при удалении оценки.');
    });
}

function viewStudentDetails(studentId) {
    fetch(`/get_grades/${studentId}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('student-id-display').innerText = studentId;

        const gradesTableBody = document.querySelector('#grades-table tbody');
        gradesTableBody.innerHTML = ''; // Очищаем таблицу перед вставкой новых данных

        if (!data.grades || data.grades.length === 0) {
            const row = gradesTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = 'Оценки отсутствуют.';
            cell.style.textAlign = 'center';
            return;
        }

        data.grades.forEach(grade => {
            const row = gradesTableBody.insertRow();
            row.innerHTML = `
                <td>${grade.subject_name}</td>
                <td>${grade.grade}</td>
                <td>${grade.date}</td>
                <td>
                    <button onclick="editGrade('${grade.id}')">Редактировать</button>
                    <button onclick="deleteGrade('${grade.id}')">Удалить</button>
                </td>
            `;
        });

        // Показываем модальное окно
        document.getElementById('student-modal').style.display = 'block';
    })
     .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при загрузке оценок.');
    });
}