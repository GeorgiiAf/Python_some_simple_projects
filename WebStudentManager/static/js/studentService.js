import { showLoader, hideLoader } from './utils3.js';
import { updateStudentsTable } from './tableService.js';
import { validators } from './validators.js';

export let isEditing = false;

export async function addStudent() {
    const nameInput = document.getElementById('name-input');
    const surnameInput = document.getElementById('surname-input');
    const studentIdInput = document.getElementById('student-id-input');

    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const studentId = studentIdInput.value.trim();

    try {
        validators.validateName(name, surname);
        validators.validateStudentId(studentId);

        showLoader();
        const response = await fetch('/add_student', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, surname, student_id: studentId})
        });

        if (!response.ok) throw new Error('Ошибка сервера');
        const data = await response.json();

        alert(data.message || 'Студент успешно добавлен.');
        nameInput.value = '';
        surnameInput.value = '';
        studentIdInput.value = '';
        await getAllStudents();
    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message || 'Произошла ошибка при добавлении студента.');
    } finally {
        hideLoader();
    }
}

export async function getAllStudents() {
    try {
        showLoader();
        const response = await fetch('/get_students');
        if (!response.ok) throw new Error('Ошибка при загрузке студентов');

        const data = await response.json();
        updateStudentsTable(data);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить список студентов.');
    } finally {
        hideLoader();
    }
}

export async function findStudents() {
    const searchTerm = document.getElementById('search').value.trim();

    if (searchTerm === '') {
        await getAllStudents();
        return;
    }

    try {
        showLoader();
        const response = await fetch(`/search_students?query=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Ошибка поиска');

        const data = await response.json();
        updateStudentsTable(data);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось выполнить поиск студентов.');
    } finally {
        hideLoader();
    }
}

export async function editStudent(studentId) {
    if (isEditing) {
        alert('Пожалуйста, завершите текущее редактирование.');
        return;
    }

    isEditing = true;
    const row = document.querySelector(`tr[data-id="${studentId}"]`);
    if (!row) {
        console.error('Студент не найден.');
        isEditing = false;
        return;
    }

    row.classList.add('editing');
    const nameCell = row.querySelector('.name-cell');
    const surnameCell = row.querySelector('.surname-cell');

    const nameValue = nameCell.textContent.trim();
    const surnameValue = surnameCell.textContent.trim();

    // Создаем поля ввода
    const nameInput = createInput(nameValue, 'edit-input');
    const surnameInput = createInput(surnameValue, 'edit-input');

    nameCell.innerHTML = '';
    surnameCell.innerHTML = '';
    nameCell.appendChild(nameInput);
    surnameCell.appendChild(surnameInput);

    // Добавляем кнопки действий
    const actionButtons = row.querySelector('.action-buttons');
    actionButtons.innerHTML = `
        <button class="save-btn">Сохранить</button>
        <button class="cancel-btn">Отмена</button>
    `;

    // Назначаем обработчики
    actionButtons.querySelector('.save-btn').onclick = () => saveStudentChanges(studentId, row);
    actionButtons.querySelector('.cancel-btn').onclick = () => cancelEdit(studentId, row, nameValue, surnameValue);
}

function createInput(value, className) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.className = className;
    return input;
}

export async function deleteStudent(studentId) {
    if (!confirm('Вы уверены, что хотите удалить этого студента?')) {
        return;
    }

    try {
        showLoader();
        const response = await fetch(`/delete_student/${studentId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Ошибка при удалении студента');

        const data = await response.json();
        alert(data.message || 'Студент успешно удален.');
        await getAllStudents();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось удалить студента.');
    } finally {
        hideLoader();
    }
}

async function saveStudentChanges(studentId, row) {
    const nameInput = row.querySelector('.name-cell input');
    const surnameInput = row.querySelector('.surname-cell input');

    const newName = nameInput.value.trim();
    const newSurname = surnameInput.value.trim();

    if (!newName || !newSurname) {
        alert('Имя и фамилия не могут быть пустыми.');
        return;
    }

    try {
        showLoader();
        const response = await fetch(`/edit_student/${studentId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: newName, surname: newSurname})
        });

        if (!response.ok) throw new Error('Ошибка при сохранении изменений');

        await getAllStudents();
        isEditing = false;
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить изменения.');
    } finally {
        hideLoader();
    }
}