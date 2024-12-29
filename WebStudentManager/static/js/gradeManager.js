import { showLoader, hideLoader, closeModal } from './utils.js';

let isGradeEditing = false;

export function addGrade() {
    const studentId = document.getElementById('student-id-display').innerText;
    const subject = document.getElementById('modal-subject-name').value.trim();
    const grade = document.getElementById('modal-subject-grade').value.trim();
    const date = document.getElementById('modal-subject-date').value;

    if (!validateGradeData(subject, grade, date)) return;

    const gradeNum = parseInt(grade);

    showLoader();
    fetch('/add_grade', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            student_id: studentId,
            subject_name: subject,
            grade: gradeNum,
            date: date
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка при добавлении оценки');
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Оценка успешно добавлена');
            clearGradeInputs();
            viewStudentDetails(studentId);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось добавить оценку');
        })
        .finally(hideLoader);
}

function validateGradeData(subject, grade, date) {
    if (!subject || !grade || !date) {
        alert('Все поля должны быть заполнены');
        return false;
    }

    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 5) {
        alert('Оценка должна быть числом от 0 до 5');
        return false;
    }

    return true;
}

function clearGradeInputs() {
    document.getElementById('modal-subject-name').value = '';
    document.getElementById('modal-subject-grade').value = '';
    document.getElementById('modal-subject-date').value = '';
}
