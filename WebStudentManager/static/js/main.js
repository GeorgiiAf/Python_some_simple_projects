import { closeModal } from './utils.js';
import * as studentService from './studentService.js';
import * as gradeService from './gradeService.js';
import * as sortService from './sortService.js';

class AppEventHandler {
    constructor() {
        this.initializeEventListeners();
        // Load initial data
        studentService.getAllStudents().catch(error => {
            console.error('Failed to load initial data:', error);
        });
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
        const searchBtn = document.querySelector('.search-btn');
        const refreshBtn = document.querySelector('.refresh-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => studentService.findStudents());
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => studentService.getAllStudents());
        }
    }

    setupStudentFormHandler() {
        const form = document.getElementById('add-student-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                studentService.addStudent();
            });
        }
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
        const addGradeBtn = document.getElementById('add-grade-btn');
        if (addGradeBtn) {
            addGradeBtn.addEventListener('click', () => gradeService.addGrade());
        }
    }

    setupModalHandlers() {
        const modal = document.getElementById('student-modal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => {
                // Очищаем форму
                const form = modal.querySelector('.grade-form');
                if (form) {
                    form.reset();
                }
                
                // Удаляем backdrop и очищаем стили body
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                
                // Сбрасываем состояние редактирования
                if (gradeService.isGradeEditing) {
                    const editingRow = modal.querySelector('tr.editing');
                    if (editingRow) {
                        const gradeId = editingRow.dataset.gradeId;
                        if (gradeId) {
                            gradeService.cancelGradeEdit(gradeId);
                        }
                    }
                    gradeService.isGradeEditing = false;
                }
            });
        }
    }
}

// Initialize the application
new AppEventHandler();