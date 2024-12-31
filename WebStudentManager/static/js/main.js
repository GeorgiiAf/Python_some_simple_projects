import { closeModal } from './utils.js';
import * as studentService from './studentService.js';
import * as gradeService from './gradeService.js';
import * as sortService from './sortService.js';

class AppEventHandler {
    constructor() {
        this.initializeEventListeners();
        this.exposeRequiredGlobals();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSearchHandlers();
            this.setupStudentFormHandler();
            this.setupSortingHandlers();
            this.setupGradeHandlers();
            this.setupModalHandlers();
        });
    }

    setupSearchHandlers() {
        document.querySelector('.search-btn')?.addEventListener('click', studentService.findStudents);
        document.querySelector('.refresh-btn')?.addEventListener('click', studentService.getAllStudents);
    }

    setupStudentFormHandler() {
        document.getElementById('add-student-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            studentService.addStudent();
        });
    }

    setupSortingHandlers() {
    // Для таблицы студентов
    document.querySelectorAll('#students-table [data-sort]').forEach(header => {
        header.addEventListener('click', (e) => {
            const column = e.target.closest('[data-sort]').dataset.sort;
            sortService.sortTable(column);
        });
    });

    // Для таблицы оценок
    document.querySelectorAll('#grades-table [data-sort]').forEach(header => {
        header.addEventListener('click', (e) => {
            const column = e.target.closest('[data-sort]').dataset.sort;
            sortService.sortGrades(column);
        });
    });
}

    setupGradeHandlers() {
        document.getElementById('add-grade-btn')?.addEventListener('click', gradeService.addGrade);
    }

    setupModalHandlers() {
        document.querySelector('.close')?.addEventListener('click', closeModal);
    }

    exposeRequiredGlobals() {
        // Temporary solution for legacy HTML onclick handlers
        Object.assign(window, {
            ...studentService,
            ...gradeService,
            ...sortService,
            closeModal
        });
    }
}

new AppEventHandler();