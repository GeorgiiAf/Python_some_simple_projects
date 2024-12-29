import { utils } from './utils.js';
import { api } from './api.js';

let isGradeEditing = false;

export const gradeModule = {
    async addGrade() {
        const studentId = document.getElementById('student-id-display').innerText;
        const subject = document.getElementById('modal-subject-name').value.trim();
        const grade = document.getElementById('modal-subject-grade').value.trim();
        const date = document.getElementById('modal-subject-date').value;

        if (!subject || !grade || !date) {
            alert('Все поля должны быть заполнены');
            return;
        }

        if (!utils.validateGrade(grade)) {
            alert('Оценка должна быть числом от 0 до 5');
            return;
        }

        try {
            utils.showLoader();
            await api.addGrade({
                student_id: studentId,
                subject_name: subject,
                grade: parseInt(grade),
                date: date
            });
            this.clearGradeForm();
            await this.viewStudentDetails(studentId);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось добавить оценку');
        } finally {
            utils.hideLoader();
        }
    },

    clearGradeForm() {
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';
    },

    async viewStudentDetails(studentId) {
        try {
            utils.showLoader();
            const data = await api.getGrades(studentId);
            this.displayGrades(data, studentId);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при загрузке оценок студента');
        } finally {
            utils.hideLoader();
        }
    },

    displayGrades(data, studentId) {
        document.getElementById('student-id-display').innerText = studentId;
        const gradesTableBody = document.querySelector('#grades-table tbody');
        gradesTableBody.innerHTML = '';

        if (!data.grades || data.grades.length === 0) {
            this.displayEmptyGradesMessage(gradesTableBody);
            return;
        }

        data.grades.forEach(grade => {
            const row = gradesTableBody.insertRow();
            row.setAttribute('data-grade-id', grade.id);
            row.innerHTML = this.createGradeRow(grade);
        });

        this.updateAverageGrade(data.grades);
        document.getElementById('student-modal').style.display = 'block';
    },

    createGradeRow(grade) {
        return `
            <td class="subject-cell">${grade.subject_name}</td>
            <td class="grade-id-cell">${grade.id}</td>
            <td class="date-cell">${grade.date || 'Не указано'}</td>
            <td class="grade-cell">${grade.grade}</td>
            <td class="grade-action-cell">
                <button onclick="editGrade('${grade.id}')">Редактировать</button>
                <button onclick="deleteGrade('${grade.id}')">Удалить</button>
            </td>`;
    },

    displayEmptyGradesMessage(tableBody) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'Оценки отсутствуют';
        cell.style.textAlign = 'center';
    },

    updateAverageGrade(grades) {
        const average = grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
        const averageDisplay = document.getElementById('average-grade-display') 
            || this.createAverageGradeElement();
        averageDisplay.textContent = `Средний балл: ${average.toFixed(2)}`;
    },

    createAverageGradeElement() {
        const averageDiv = document.createElement('div');
        averageDiv.id = 'average-grade-display';
        averageDiv.className = 'average-grade';
        document.getElementById('student-modal')
            .querySelector('.modal-content')
            .appendChild(averageDiv);
        return averageDiv;
    }
};