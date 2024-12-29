import { utils } from './utils.js';
import { api } from './api.js';

let isEditing = false;

export const studentModule = {
    async addStudent() {
        const name = document.getElementById('name-input').value.trim();
        const surname = document.getElementById('surname-input').value.trim();
        const studentId = document.getElementById('student-id-input').value.trim();

        if (!name || !surname || !studentId) {
            alert('Все поля должны быть заполнены.');
            return;
        }

        if (!utils.validateName(name) || !utils.validateName(surname)) {
            alert('Имя и фамилия должны содержать только буквы, дефис и пробелы.');
            return;
        }

        if (!utils.validateStudentId(studentId)) {
            alert('Номер зачетной книжки должен состоять из 8 цифр.');
            return;
        }

        try {
            utils.showLoader();
            await api.addStudent({ name, surname, student_id: studentId });
            this.clearStudentForm();
            this.getAllStudents();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении студента.');
        } finally {
            utils.hideLoader();
        }
    },

    clearStudentForm() {
        document.getElementById('name-input').value = '';
        document.getElementById('surname-input').value = '';
        document.getElementById('student-id-input').value = '';
    },

    async searchStudents(searchTerm) {
        if (!searchTerm.trim()) {
            return this.getAllStudents();
        }

        try {
            utils.showLoader();
            const data = await api.searchStudents(searchTerm);
            this.updateStudentsTable(data);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось выполнить поиск студентов.');
        } finally {
            utils.hideLoader();
        }
    },

    async getAllStudents() {
        try {
            utils.showLoader();
            const data = await api.getAllStudents();
            this.updateStudentsTable(data);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить список студентов.');
        } finally {
            utils.hideLoader();
        }
    },

    updateStudentsTable(students) {
        const tableBody = document.querySelector('#students-table tbody');
        tableBody.innerHTML = '';

        if (students.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 4;
            cell.textContent = 'Студенты не найдены.';
            cell.style.textAlign = 'center';
            return;
        }

        students.forEach(student => {
            const row = tableBody.insertRow();
            row.setAttribute('data-id', student.student_id);
            row.innerHTML = this.createStudentRow(student);
        });
    },

    createStudentRow(student) {
        return `
            <td><a href="#" onclick="viewStudentDetails('${student.student_id}'); return false;">${student.student_id}</a></td>
            <td class="name-cell">${student.name}</td>
            <td class="surname-cell">${student.surname}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editStudent('${student.student_id}')">Редактировать</button>
                    <button class="delete-btn" onclick="deleteStudent('${student.student_id}')">Удалить</button>
                </div>
            </td>`;
    }
};