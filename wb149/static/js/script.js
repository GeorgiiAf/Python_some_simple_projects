function addStudent() {
    const name = document.getElementById('name-input').value.trim();
    const surname = document.getElementById('surname-input').value.trim();
    const studentId = document.getElementById('student-id-input').value.trim();

    // Проверка на пустые поля
    if (!name || !surname || !studentId) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    // Проверка, что имя и фамилия не содержат цифры
    const nameRegex = /^[A-Za-zА-Яа-яЁё]+$/; // Разрешаем только буквы
    if (!nameRegex.test(name)) {
        alert('Имя не должно содержать цифры.');
        return;
    }

    if (!nameRegex.test(surname)) {
        alert('Фамилия не должна содержать цифры.');
        return;
    }

    // Проверка зачетной книжки: она должна состоять из 8 цифр
    const studentIdRegex = /^\d{8}$/; // Проверка на 8 цифр
    if (!studentIdRegex.test(studentId)) {
        alert('Номер зачетной книжки должен состоять из 8 цифр.');
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

function findStudents() {
    const searchTerm = document.getElementById('search').value.trim();
    if (!searchTerm) {
        alert('Введите имя или фамилию для поиска');
        return;
    }

    fetch(`/search_students?query=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#students-table tbody');
            tableBody.innerHTML = '';

            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 4;
                cell.textContent = 'Студенты не найдены.';
                cell.style.textAlign = 'center';
            } else {
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
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось выполнить поиск студентов.');
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


function editCell(event, studentId, field) {
    const cell = event.target;
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
    input.addEventListener('blur', () => saveCellChange(studentId, field, input.value, cell));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveCellChange(studentId, field, input.value, cell);
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

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('student-modal');
    modal.style.display = 'none';
    // Очищаем поля ввода при закрытии
    document.getElementById('modal-subject-name').value = '';
    document.getElementById('modal-subject-grade').value = '';
    document.getElementById('modal-subject-date').value = '';
    // Удаляем обработчик события клика по окну
    window.onclick = null;
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
    fetch(`/get_grade/${gradeId}`)
        .then((response) => {
            if (!response.ok) throw new Error('Ошибка при загрузке данных');
            return response.json();
        })
        .then((data) => {
            // Заполняем модальное окно текущими данными
            const modal = document.getElementById('student-modal');
            modal.querySelector('#modal-subject-name').value = data.subject_name;
            modal.querySelector('#modal-subject-grade').value = data.grade;
            modal.querySelector('#modal-subject-date').value = data.date;

            // Добавляем обработчик кнопки "Сохранить"
            const saveGradeButton = document.getElementById('save-grade-btn');
            saveGradeButton.onclick = () => saveGradeChanges(gradeId);
            modal.style.display = 'block';
        })
        .catch((error) => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить данные оценки.');
        });
}

function saveGradeChanges(gradeId) {
    const newSubject = document.getElementById('modal-subject-name').value.trim();
    const newGrade = document.getElementById('modal-subject-grade').value.trim();
    const newDate = document.getElementById('modal-subject-date').value.trim();

    if (!newSubject || !newGrade || !newDate) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    if (isNaN(newGrade) || newGrade < 0 || newGrade > 5) {
        alert('Оценка должна быть числом от 0 до 5.');
        return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert('Дата должна быть в формате ГГГГ-ММ-ДД.');
        return;
    }

    fetch(`/edit_grade/${gradeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_name: newSubject, grade: newGrade, date: newDate }),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Ошибка при сохранении');
            return response.json();
        })
        .then(() => {
            alert('Оценка успешно обновлена!');
            document.getElementById('student-modal').style.display = 'none';
        })
        .catch((error) => {
            console.error('Ошибка:', error);
            alert(`Не удалось сохранить изменения: ${error.message}`);
        });
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('student-modal').style.display = 'none';
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

// Удаление оценки
function deleteGrade(gradeId) {
    if (!confirm('Вы уверены, что хотите удалить эту оценку?')) {
        return;
    }

    fetch(`/delete_grade/${gradeId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при удалении оценки');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Оценка успешно удалена.');
            const studentId = document.getElementById('student-id-display').innerText;
            viewStudentDetails(studentId); // Обновление списка оценок
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось удалить оценку.');
        });
}

