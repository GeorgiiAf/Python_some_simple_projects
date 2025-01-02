import * as studentService from './studentService.js';
import * as gradeService from './gradeService.js';
import * as sortService from './sortService.js';
import * as pdfExport from './pdfExport.js';

class AppEventHandler {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSearchHandlers();
            this.setupStudentFormHandler();
            this.setupSortingHandlers();
            this.setupGradeHandlers();
            this.setupModalHandlers();
            this.setupExportHandlers();
            
            // Скрываем таблицу при загрузке
            const studentList = document.getElementById('student-list');
            if (studentList) {
                studentList.style.display = 'none';
            }
        });
    }

    setupExportHandlers() {
        // Export all students
        const exportAllBtn = document.querySelector('.export-all-btn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => {
                pdfExport.exportAllStudentsToPDF();
            });
        }

        // Export student grades
        const exportGradesBtn = document.querySelector('.export-grades-btn');
        if (exportGradesBtn) {
            exportGradesBtn.addEventListener('click', () => {
                const studentId = document.getElementById('student-id-display').textContent;
                const studentName = document.querySelector(`tr[data-id="${studentId}"] .name-cell`).textContent +
                                  ' ' +
                                  document.querySelector(`tr[data-id="${studentId}"] .surname-cell`).textContent;
                pdfExport.exportStudentGradesToPDF(studentId, studentName);
            });
        }
    }

    setupSearchHandlers() {
        const searchBtn = document.querySelector('.search-btn');
        const refreshBtn = document.querySelector('.refresh-btn');
        const hideBtn = document.querySelector('.hide-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                studentService.findStudents().then(() => {
                    const studentList = document.getElementById('student-list');
                    if (studentList) {
                        studentList.style.display = 'block';
                    }
                });
            });
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                studentService.getAllStudents().then(() => {
                    const studentList = document.getElementById('student-list');
                    if (studentList) {
                        studentList.style.display = 'block';
                    }
                });
            });
        }

        if (hideBtn) {
            hideBtn.addEventListener('click', () => {
                const studentList = document.getElementById('student-list');
                if (studentList) {
                    studentList.style.display = 'none';
                }
            });
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
            // Создаем экземпляр модального окна Bootstrap
            const modalInstance = new bootstrap.Modal(modal);
            
            // Сохраняем экземпляр в window для доступа из других модулей
            window.studentModal = modalInstance;
            
            modal.addEventListener('hidden.bs.modal', () => {
                // Очищаем форму
                const form = modal.querySelector('.grade-form');
                if (form) {
                    form.reset();
                }
                
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

            // Обработчик для кнопки закрытия
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modalInstance.hide();
                });
            }
        }
    }
}

// Initialize the application
new AppEventHandler();