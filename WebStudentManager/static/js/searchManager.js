import { showLoader, hideLoader } from './utils.js';
import { updateStudentsTable } from './tableManager.js';

let searchTimeout;

export function findStudents() {
    const searchTerm = document.getElementById('search').value.trim();

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (searchTerm === '') {
            getAllStudents();
            return;
        }

        showLoader();
        fetch(`/search_students?query=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка поиска');
                return response.json();
            })
            .then(updateStudentsTable)
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось выполнить поиск студентов.');
            })
            .finally(hideLoader);
    }, 300);
}

export function getAllStudents() {
    showLoader();
    fetch('/get_students')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке студентов');
            }
            return response.json();
        })
        .then(updateStudentsTable)
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить список студентов.');
        })
        .finally(hideLoader);
}