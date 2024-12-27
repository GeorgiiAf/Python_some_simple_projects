import { utils } from './utils.js';
import { api } from './api.js';
import { StudentModule } from './studentModule.js';
import { GradeModule } from './gradeModule.js';

const studentModule = new StudentModule();
const gradeModule = new GradeModule();

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация кнопок и обработчиков событий
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => studentModule.addStudent());
    }

    // Инициализация поиска с debounce
    const searchInput = document.getElementById('search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                studentModule.findStudents(e.target.value);
            }, 300);
        });
    }
});