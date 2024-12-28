// studentModule.js
import { utils } from './utils.js';
import { api } from './api.js';

export class StudentModule {
    constructor() {
        this.isEditing = false;
        this.currentSort = {
            column: null,
            descending: false
        };
        this.searchTimeout = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Инициализация обработчиков событий при создании экземпляра класса
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.findStudents(e));
        }
    }

    async addStudent() {
        const nameInput = document.getElementById('name-input');
        const surnameInput = document.getElementById('surname-input');
        const studentIdInput = document.getElementById('student-id-input');

        const name = nameInput.value.trim();
        const surname = surnameInput.value.trim();
        const studentId = studentIdInput.value.trim();

        if (!this.validateStudentData(name, surname, studentId)) {
            return;
        }

        try {
            utils.showLoader();
            await api.addStudent({ name, surname, student_id: studentId });
            alert('Студент успешно добавлен.');
            this.clearInputs([nameInput, surnameInput, studentIdInput]);
            await this.getAllStudents();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении студента.');
        } finally {
            utils.hideLoader();
        }
    }

    validateStudentData(name, surname, studentId) {
        if (!name || !surname || !studentId) {
            alert('Все поля должны быть заполнены.');
            return false;
        }

        if (!utils.validateName(name) || !utils.validateName(surname)) {
            alert('Имя и фамилия должны содержать только буквы, дефис и пробелы.');
            return false;
        }

        if (!utils.validateStudentId(studentId)) {
            alert('Номер зачетной книжки должен состоять из 8 цифр.');
            return false;
        }

        return true;
    }

    async findStudents(event) {
        const searchTerm = event.target.value.trim();

        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(async () => {
            if (searchTerm === '') {
                await this.getAllStudents();
                return;
            }

            try {
                utils.showLoader();
                const data = await api.searchStudents(searchTerm);
                await this.updateStudentsTable(data);
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось выполнить поиск студентов.');
            } finally {
                utils.hideLoader();
            }
        }, 300);
    }

    async getAllStudents() {
        try {
            utils.showLoader();
            const data = await api.getStudents();
            await this.updateStudentsTable(data);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить список студентов.');
        } finally {
            utils.hideLoader();
        }
    }

    async updateStudentsTable(data) {
        const tableBody = document.querySelector('#students-table tbody');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            this.showNoDataMessage(tableBody);
            return;
        }

        data.forEach(student => {
            const row = this.createStudentRow(student);
            tableBody.appendChild(row);
        });
    }

    showNoDataMessage(tableBody) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4;
        cell.textContent = 'Студенты не найдены.';
        cell.style.textAlign = 'center';
    }

    createStudentRow(student) {
        const row = document.createElement('tr');
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
        return row;
    }

    clearInputs(inputs) {
        inputs.forEach(input => input.value = '');
    }

    async editStudent(studentId) {
        if (this.isEditing) {
            alert('Пожалуйста, завершите текущее редактирование.');
            return;
        }

        this.isEditing = true;
        const row = document.querySelector(`tr[data-id="${studentId}"]`);

        if (!row) {
            console.error('Студент не найден.');
            this.isEditing = false;
            return;
        }

        try {
            this.startEditing(row, studentId);
        } catch (error) {
            console.error('Ошибка при начале редактирования:', error);
            this.isEditing = false;
        }
    }

    startEditing(row, studentId) {
        row.classList.add('editing');
        const nameCell = row.querySelector('.name-cell');
        const surnameCell = row.querySelector('.surname-cell');

        // Сохраняем оригинальные значения
        const nameValue = nameCell.textContent.trim();
        const surnameValue = surnameCell.textContent.trim();

        // Создаем поля ввода
        this.createEditInputs(nameCell, surnameCell, nameValue, surnameValue);
        this.createEditButtons(row, studentId, nameValue, surnameValue);
    }

    createEditInputs(nameCell, surnameCell, nameValue, surnameValue) {
        nameCell.innerHTML = `<input type="text" class="edit-input" value="${nameValue}">`;
        surnameCell.innerHTML = `<input type="text" class="edit-input" value="${surnameValue}">`;
    }

    createEditButtons(row, studentId, nameValue, surnameValue) {
        const actionButtons = row.querySelector('.action-buttons');
        const editButton = row.querySelector('.edit-btn');
        const deleteButton = row.querySelector('.delete-btn');

        editButton.style.display = 'none';
        deleteButton.style.display = 'none';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить';
        saveButton.className = 'save-btn';
        saveButton.onclick = () => this.saveStudentChanges(studentId, row);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Отмена';
        cancelButton.className = 'cancel-btn';
        cancelButton.onclick = () => this.cancelEdit(studentId, row, nameValue, surnameValue);

        actionButtons.appendChild(saveButton);
        actionButtons.appendChild(cancelButton);
    }

    async saveStudentChanges(studentId, row) {
        const nameInput = row.querySelector('.name-cell input');
        const surnameInput = row.querySelector('.surname-cell input');

        const newName = nameInput.value.trim();
        const newSurname = surnameInput.value.trim();

        if (!this.validateStudentData(newName, newSurname, studentId)) {
            return;
        }

        try {
            utils.showLoader();
            await api.updateStudent(studentId, {
                name: newName,
                surname: newSurname
            });
            alert('Данные успешно обновлены!');
            await this.getAllStudents();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось сохранить изменения.');
        } finally {
            utils.hideLoader();
            this.isEditing = false;
        }
    }

    sortTable(column) {
        if (this.currentSort.column === column) {
            this.currentSort.descending = !this.currentSort.descending;
        } else {
            this.currentSort.column = column;
            this.currentSort.descending = false;
        }

        const table = document.querySelector("#students-table tbody");
        const rows = Array.from(table.rows);

        rows.sort((a, b) => this.compareRows(a, b, column));

        this.updateTableAfterSort(table, rows);
        this.updateSortIcons(column);
    }

    compareRows(a, b, column) {
        const valA = this.getCellValue(a, column);
        const valB = this.getCellValue(b, column);

        if (valA > valB) return this.currentSort.descending ? -1 : 1;
        if (valA < valB) return this.currentSort.descending ? 1 : -1;
        return 0;
    }

    getCellValue(row, column) {
        const cell = row.querySelector(`.${column}-cell`);
        return cell ? cell.textContent.toLowerCase() : '';
    }

    updateTableAfterSort(table, rows) {
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        rows.forEach(row => table.appendChild(row));
    }

    updateSortIcons(column) {
        const headers = document.querySelectorAll('#students-table th');
        headers.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            if (icon) {
                icon.textContent = this.getSortIcon(header, column);
            }
        });
    }

    getSortIcon(header, column) {
        if (this.currentSort.column === column && header.dataset.column === column) {
            return this.currentSort.descending ? '↓' : '↑';
        }
        return '↕';
    }
}