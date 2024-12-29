import { utils } from './utils.js';
import { api } from './api.js';
import { studentModule } from './studentModule.js';
import { gradeModule } from './gradeModule.js';

// Инициализация обработчиков событий
document.addEventListener('DOMContentLoaded', () => {
    // Форма добавления студента
    const addStudentForm = document.getElementById('add-student-form');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            studentModule.addStudent();
        });
    }

    // Поиск студентов
    const searchInput = document.getElementById('search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                studentModule.searchStudents(e.target.value);
            }, 300);
        });
    }

    // Модальное окно
    const modal = document.getElementById('student-modal');
    if (modal) {
        // Закрытие по крестику
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = utils.closeModal;
        }

        // Закрытие по клику вне модального окна
        window.onclick = (event) => {
            if (event.target === modal) {
                utils.closeModal();
            }
        };
    }

    // Форма добавления оценки
    const addGradeForm = document.getElementById('add-grade-form');
    if (addGradeForm) {
        addGradeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            gradeModule.addGrade();
        });
    }

    // Инициализация начального состояния
    studentModule.getAllStudents();
});

// Глобальные функции для обработки событий из HTML
window.viewStudentDetails = (studentId) => gradeModule.viewStudentDetails(studentId);
window.deleteStudent = (studentId) => studentModule.deleteStudent(studentId);
window.editStudent = (studentId) => studentModule.editStudent(studentId);
window.deleteGrade = (gradeId) => gradeModule.deleteGrade(gradeId);
window.editGrade = (gradeId) => gradeModule.editGrade(gradeId);