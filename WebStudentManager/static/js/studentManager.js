import { showLoader, hideLoader } from './utils.js';

let isEditing = false;

export function addStudent() {
    const nameInput = document.getElementById('name-input');
    const surnameInput = document.getElementById('surname-input');
    const studentIdInput = document.getElementById('student-id-input');

    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const studentId = studentIdInput.value.trim();

    if (!validateStudentData(name, surname, studentId)) return;

    showLoader();
    fetch('/add_student', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, surname, student_id: studentId})
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сервера');
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Студент успешно добавлен.');
            clearInputs([nameInput, surnameInput, studentIdInput]);
            getAllStudents();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении студента.');
        })
        .finally(hideLoader);
}

function validateStudentData(name, surname, studentId) {
    if (!name || !surname || !studentId) {
        alert('Все поля должны быть заполнены.');
        return false;
    }

    const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
    if (!nameRegex.test(name) || !nameRegex.test(surname)) {
        alert('Имя и фамилия должны содержать только буквы, дефис и пробелы.');
        return false;
    }

    const studentIdRegex = /^\d{8}$/;
    if (!studentIdRegex.test(studentId)) {
        alert('Номер зачетной книжки должен состоять из 8 цифр.');
        return false;
    }

    return true;
}

function clearInputs(inputs) {
    inputs.forEach(input => input.value = '');
}