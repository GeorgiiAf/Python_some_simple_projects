import {  closeModal } from './utils.js';
import {
    addStudent,
    getAllStudents,
    findStudents,
    editStudent,
    deleteStudent
} from './studentService.js';
import {
    addGrade,
    viewStudentDetails, editGrade, deleteGrade, saveGradeChanges, calculateAverageGrade
} from './gradeService.js';
import { sortTable, sortGrades} from './sortService.js';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка начального списка студентов

    // Назначаем обработчики событий
    document.querySelector('.search-btn').addEventListener('click', findStudents);
    document.querySelector('.refresh-btn').addEventListener('click', getAllStudents);
    // Форма добавления студента
    document.getElementById('add-student-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addStudent();
    });

    // Инициализация сортировки
    document.querySelectorAll('[data-sort]').forEach(header => {
        header.addEventListener('click', (e) => {
            const column = e.target.closest('[data-sort]').dataset.sort;
            sortTable(column);
        });
    });

    // Кнопка добавления оценки
    document.getElementById('add-grade-btn').addEventListener('click', addGrade);

    // Закрытие модального окна
    document.querySelector('.close').addEventListener('click', closeModal);
});



// Делаем функции доступными глобально для работы с существующей разметкой
window.addStudent = addStudent;
window.getAllStudents = getAllStudents;
window.findStudents = findStudents;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.addGrade = addGrade;
window.viewStudentDetails = viewStudentDetails;
window.sortTable = sortTable;
window.sortGrades = sortGrades;
window.closeModal = closeModal;
window.editGrade = editGrade;
window.deleteGrade = deleteGrade;
window.saveGradeChanges = saveGradeChanges;
window.calculateAverageGrade = calculateAverageGrade;