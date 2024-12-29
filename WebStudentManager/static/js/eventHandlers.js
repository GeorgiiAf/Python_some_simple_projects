window.addStudent = addStudent;
window.findStudents = findStudents;
window.getAllStudents = getAllStudents;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.sortTable = sortTable;
window.viewStudentDetails = viewStudentDetails;
window.closeModal = closeModal;
window.addGrade = addGrade;
window.sortGrades = sortGrades;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем список студентов при старте
    getAllStudents();

    // Добавляем обработчик для поиска при вводе
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', findStudents);
    }
});