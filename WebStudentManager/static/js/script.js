function showLoader() {
    // Можно добавить div с классом loader в HTML
    document.body.style.cursor = 'wait';
}

function hideLoader() {
    document.body.style.cursor = 'default';
}

// Улучшенная функция добавления студента
function addStudent() {
    const nameInput = document.getElementById('name-input');
    const surnameInput = document.getElementById('surname-input');
    const studentIdInput = document.getElementById('student-id-input');

    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const studentId = studentIdInput.value.trim();

    // Валидация
    if (!name || !surname || !studentId) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
    if (!nameRegex.test(name) || !nameRegex.test(surname)) {
        alert('Имя и фамилия должны содержать только буквы, дефис и пробелы.');
        return;
    }

    const studentIdRegex = /^\d{8}$/;
    if (!studentIdRegex.test(studentId)) {
        alert('Номер зачетной книжки должен состоять из 8 цифр.');
        return;
    }

    showLoader();
    fetch('/add_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, student_id: studentId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Ошибка сервера');
        return response.json();
    })
    .then(data => {
        alert(data.message || 'Студент успешно добавлен.');
        nameInput.value = '';
        surnameInput.value = '';
        studentIdInput.value = '';
        getAllStudents();
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при добавлении студента.');
    })
    .finally(() => {
        hideLoader();
    });
}

// Улучшенная функция поиска с дебаунсингом
let searchTimeout;
function findStudents() {
    const searchTerm = document.getElementById('search').value.trim();

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (searchTerm === '') {
            getAllStudents();
            return;
        }

        showLoader();
        fetch(`/search_students?query=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка поиска');
                return response.json();
            })
            .then(data => updateStudentsTable(data))
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось выполнить поиск студентов.');
            })
            .finally(() => {
                hideLoader();
            });
    }, 300); // Задержка 300мс для дебаунсинга
}

// Функция обновления таблицы студентов
function updateStudentsTable(data) {
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




// Функция для получения списка студентов
function getAllStudents() {
    fetch('/get_students')
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при загрузке студентов');
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector('#students-table tbody');
        tableBody.innerHTML = '';

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
            row.setAttribute('data-id', student.student_id);
            row.innerHTML = `
                <td><a href="#" onclick="viewStudentDetails('${student.student_id}'); return false;">${student.student_id}</a></td>
                <td class="name-cell" onclick="editCell(event, '${student.student_id}', 'name')">${student.name}</td>
                <td class="surname-cell" onclick="editCell(event, '${student.student_id}', 'surname')">${student.surname}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editStudent('${student.student_id}')">Редактировать</button>
                        <button class="delete-btn" onclick="deleteStudent('${student.student_id}')">Удалить</button>
                    </div>
                </td>`;
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить список студентов.');
    });
}



// Функция для просмотра деталей студента
function viewStudentDetails(studentId) {
    fetch(`/get_grades/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке оценок');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('student-id-display').innerText = studentId;

            const gradesTableBody = document.querySelector('#grades-table tbody');
            gradesTableBody.innerHTML = '';

            if (!data.grades || data.grades.length === 0) {
                const row = gradesTableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 5;
                cell.textContent = 'Оценки отсутствуют';
                cell.style.textAlign = 'center';
            } else {
                data.grades.forEach(grade => {
                    const row = gradesTableBody.insertRow();
                    row.setAttribute('data-grade-id', grade.id);
                    row.innerHTML = `
                        <td class="subject-cell">${grade.subject_name}</td>
                        <td class="grade-id-cell">${grade.id}</td>
                        <td class="date-cell">${grade.date || 'Не указано'}</td>
                        <td class="grade-cell">${grade.grade}</td>
                        <td class="grade-action-cell">
                            <button onclick="editGrade('${grade.id}')">Редактировать</button>
                            <button onclick="deleteGrade('${grade.id}')">Удалить</button>
                        </td>`;
                });
            }

            const modal = document.getElementById('student-modal');
            modal.style.display = 'block';

            // Добавляем обработчик для закрытия по клику вне модального окна
            window.onclick = function(event) {
                if (event.target == modal) {
                    closeModal();
                }
            };
        })
        .catch(error => {
            console.error('Ошибка при загрузке оценок:', error);
            alert('Произошла ошибка при загрузке оценок студента');
        });
}


function editCell(event, studentId, field) {
    const cell = event.target;

    // Проверяем, не находится ли ячейка уже в режиме редактирования
    if (cell.querySelector('input')) {
        return;
    }

    const originalValue = cell.textContent;

    // Создание поля ввода
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalValue;
    cell.textContent = '';
    cell.appendChild(input);

    // Фокус на поле ввода
    input.focus();

    // Обработчик события для сохранения изменений
    const handleSave = () => {
        if (!input.parentElement) return; // Проверка, что input все еще в DOM
        saveCellChange(studentId, field, input.value, cell);
    };

    input.addEventListener('blur', handleSave);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
        if (e.key === 'Escape') {
            cell.textContent = originalValue;
        }
    });
}

// Функция для сохранения изменений в ячейке
function saveCellChange(studentId, field, newValue, cell) {
    if (newValue.trim() === '') {
        alert('Значение не может быть пустым');
        cell.textContent = '';
        return;
    }

    // Отправка данных на сервер для обновления
    fetch(`/update_student_field/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при сохранении данных');
        }
        return response.json();
    })
    .then(data => {
        cell.textContent = newValue; // Обновляем ячейку на новое значение
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить изменения.');
        cell.textContent = newValue; // Восстанавливаем старое значение при ошибке
    });
}

function closeModal() {
    const modal = document.getElementById('student-modal');
    modal.style.display = 'none';
    // Очищаем поля ввода при закрытии
    document.getElementById('modal-subject-name').value = '';
    document.getElementById('modal-subject-grade').value = '';
    document.getElementById('modal-subject-date').value = '';
    // Удаляем обработчик события клика по окну
    window.onclick = null;
    // Сбрасываем обработчик кнопки сохранения
    const saveGradeButton = document.getElementById('save-grade-btn');
    if (saveGradeButton) {
        saveGradeButton.onclick = null;
    }
}



// Функция для добавления оценки
function addGrade() {
    const studentId = document.getElementById('student-id-display').innerText;
    const subject = document.getElementById('modal-subject-name').value.trim();
    const grade = document.getElementById('modal-subject-grade').value.trim();
    const date = document.getElementById('modal-subject-date').value.trim();

    if (!subject || !grade || !date) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    if (isNaN(grade) || grade < 0 || grade > 5) {
        alert('Оценка должна быть числом от 0 до 5.');
        return;
    }

    fetch('/add_grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            student_id: studentId,
            subject_name: subject,
            grade: parseInt(grade),
            date: date
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || 'Оценка успешно добавлена.');
        // Очищаем поля ввода
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';
        // Обновляем список оценок
        viewStudentDetails(studentId);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при добавлении оценки.');
    });
}

// Добавьте в начало файла:
document.addEventListener('DOMContentLoaded', function() {
    // Очищаем таблицу студентов при загрузке страницы
    const tableBody = document.querySelector('#students-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
    }
});

function editStudent(studentId) {
    const row = document.querySelector(`tr[data-id="${studentId}"]`);
    if (!row) {
        console.error('Студент не найден.');
        return;
    }

    // Делаем ячейки редактируемыми
    const nameCell = row.querySelector('.name-cell');
    const surnameCell = row.querySelector('.surname-cell');

    const nameValue = nameCell.textContent.trim();
    const surnameValue = surnameCell.textContent.trim();

    nameCell.innerHTML = '';
    surnameCell.innerHTML = '';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = nameValue;

    const surnameInput = document.createElement('input');
    surnameInput.type = 'text';
    surnameInput.value = surnameValue;

    nameCell.appendChild(nameInput);
    surnameCell.appendChild(surnameInput);

    // Добавляем кнопку "Сохранить"
    const actionButtons = row.querySelector('.action-buttons');
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
    saveButton.className = 'save-btn';

    saveButton.onclick = () => saveStudentChanges(studentId, row);

    // Скрываем кнопку "Редактировать"
    const editButton = row.querySelector('.edit-btn');
    editButton.style.display = 'none';

    actionButtons.appendChild(saveButton);
}

function saveStudentChanges(studentId, row) {
    const nameInput = row.querySelector('.name-cell input');
    const surnameInput = row.querySelector('.surname-cell input');

    const newName = nameInput.value.trim();
    const newSurname = surnameInput.value.trim();

    if (!newName || !newSurname) {
        alert('Имя и фамилия не могут быть пустыми.');
        return;
    }

    // Отправляем изменения на сервер
    fetch(`/edit_student/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, surname: newSurname }),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Ошибка при сохранении изменений');
            return response.json();
        })
        .then(() => {
            alert('Данные успешно обновлены!');
            row.querySelector('.name-cell').textContent = newName;
            row.querySelector('.surname-cell').textContent = newSurname;

            const saveButton = row.querySelector('.save-btn');
            saveButton.remove();

            row.querySelector('.edit-btn').style.display = 'inline-block';
        })
        .catch((error) => {
            console.error('Ошибка:', error);
            alert('Не удалось сохранить изменения.');
        });
}
function editGrade(gradeId) {
    showLoader();
    fetch(`/get_grade/${gradeId}`)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка при загрузке данных');
            return response.json();
        })
        .then(grade => {
            const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
            if (!row) throw new Error('Строка не найдена');

            // Заменяем ячейки на поля ввода
            const cells = row.querySelectorAll('td');

            // Предмет
            cells[0].innerHTML = `<input type="text" class="edit-subject" value="${grade.subject_name}">`;

            // Дата
            cells[2].innerHTML = `<input type="date" class="edit-date" value="${grade.date}">`;

            // Оценка
            cells[3].innerHTML = `<input type="number" class="edit-grade" value="${grade.grade}" min="0" max="5">`;

            // Кнопки действий
            cells[4].innerHTML = `
                <button onclick="saveGradeChanges(${gradeId})">Сохранить</button>
                <button onclick="cancelGradeEdit(${gradeId})">Отмена</button>
            `;
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить данные оценки');
        })
        .finally(hideLoader);
}

function saveGradeChanges(gradeId) {
    const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
    if (!row) {
        alert('Строка не найдена');
        return;
    }

    const subjectInput = row.querySelector('.edit-subject');
    const dateInput = row.querySelector('.edit-date');
    const gradeInput = row.querySelector('.edit-grade');

    const subject = subjectInput.value.trim();
    const date = dateInput.value;
    const grade = parseInt(gradeInput.value);

    // Валидация
    if (!subject || !date) {
        alert('Все поля должны быть заполнены');
        return;
    }

    if (isNaN(grade) || grade < 0 || grade > 5) {
        alert('Оценка должна быть числом от 0 до 5');
        return;
    }

    showLoader();
    fetch(`/edit_grade/${gradeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subject_name: subject,
            date: date,
            grade: grade
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Ошибка при сохранении');
        return response.json();
    })
    .then(() => {
        // Обновляем отображение оценок
        const studentId = document.getElementById('student-id-display').innerText;
        viewStudentDetails(studentId);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить изменения');
    })
    .finally(hideLoader);
}

function cancelGradeEdit(gradeId) {
    const studentId = document.getElementById('student-id-display').innerText;
    viewStudentDetails(studentId);
}


function deleteStudent(studentId) {
    if (!confirm('Вы уверены, что хотите удалить этого студента?')) {
        return;
    }

    fetch(`/delete_student/${studentId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при удалении студента');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Студент успешно удален.');
            getAllStudents(); // Обновление списка студентов
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось удалить студента.');
        });
}

function addGrade() {
    const studentId = document.getElementById('student-id-display').innerText;
    const subject = document.getElementById('modal-subject-name').value.trim();
    const grade = document.getElementById('modal-subject-grade').value.trim();
    const date = document.getElementById('modal-subject-date').value;

    // Валидация
    if (!subject || !grade || !date) {
        alert('Все поля должны быть заполнены');
        return;
    }

    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 5) {
        alert('Оценка должна быть числом от 0 до 5');
        return;
    }

    showLoader();
    fetch('/add_grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            student_id: studentId,
            subject_name: subject,
            grade: gradeNum,
            date: date
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Ошибка при добавлении оценки');
        return response.json();
    })
    .then(data => {
        alert(data.message || 'Оценка успешно добавлена');
        // Очищаем поля ввода
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';
        // Обновляем список оценок
        viewStudentDetails(studentId);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось добавить оценку');
    })
    .finally(hideLoader);
}

function deleteGrade(gradeId) {
    if (!confirm('Вы уверены, что хотите удалить эту оценку?')) {
        return;
    }

    showLoader();
    fetch(`/delete_grade/${gradeId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Ошибка при удалении оценки');
        return response.json();
    })
    .then(() => {
        const studentId = document.getElementById('student-id-display').innerText;
        viewStudentDetails(studentId);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось удалить оценку');
    })
    .finally(hideLoader);
}