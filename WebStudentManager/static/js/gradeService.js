import { showLoader, hideLoader, closeModal } from './utils.js';
import { updateGradesTable } from './tableService.js';
import {validators} from "./validators.js";


export let isGradeEditing = false;

export async function addGrade() {
    const studentId = document.getElementById('student-id-display').innerText;
    const subject = document.getElementById('modal-subject-name').value.trim();
    const grade = document.getElementById('modal-subject-grade').value.trim();
    const date = document.getElementById('modal-subject-date').value;

     if (!subject || !grade || !date) {
        alert('All fields must be filled in');
        return;
    }
    try {
        const gradeNum = validators.validateGrade(grade);

        showLoader();
        const response = await fetch('/add_grade', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                student_id: studentId,
                subject_name: subject,
                grade: gradeNum,
                date: date
            })
        });

        if (!response.ok) throw new Error('Error adding the grade');

        const data = await response.json();
        alert(data.message || 'Grade added successfully');

        // Clear input fields
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';

        // Обновляем список оценок
        await viewStudentDetails(studentId);
    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message || 'Не удалось добавить оценку');
    } finally {
        hideLoader();
    }
}

export async function editGrade(gradeId) {
    if (isGradeEditing) {
        alert('Please finish the current editing first.');
        return;
    }

    isGradeEditing = true;
    showLoader();
    fetch(`/get_grade/${gradeId}`)
        .then(response => {
            if (!response.ok) throw new Error('Error loading grade data');
            return response.json();
        })
        .then(grade => {
            const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
            if (!row) throw new Error('Row not found');

            row.classList.add('editing');
            const cells = row.querySelectorAll('td');

            cells[0].innerHTML = `<input type="text" class="edit-subject" value="${grade.subject_name}">`;
            cells[2].innerHTML = `<input type="date" class="edit-date" value="${grade.date}">`;
            cells[3].innerHTML = `<input type="number" class="edit-grade" value="${grade.grade}" min="0" max="5">`;
            cells[4].innerHTML = `
                <button class="save-grade-btn" onclick="saveGradeChanges('${gradeId}')">Save</button>
                <button class="cancel-grade-btn" onclick="cancelGradeEdit('${gradeId}')">Cancel</button>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load grade data');
            isGradeEditing = false;
        })
        .finally(hideLoader);
}


export async function cancelGradeEdit(gradeId) {
    const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
    if (row) {
        row.classList.remove('editing');
    }
    isGradeEditing = false;
    const studentId = document.getElementById('student-id-display').innerText;
    await viewStudentDetails(studentId);
}

export async function deleteGrade(gradeId) {
    if (!confirm('Are you sure you want to delete this grade?')) {
        return;
    }

    showLoader();
    fetch(`/delete_grade/${gradeId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Error deleting grade');
            return response.json();
        })
        .then(() => {
            const studentId = document.getElementById('student-id-display').innerText;
            viewStudentDetails(studentId);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete grade');
        })
        .finally(hideLoader);
}

export async function saveGradeChanges(gradeId) {
    const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
    if (!row) {
        alert('Row not found');
        isGradeEditing = false;
        return;
    }

    const subjectInput = row.querySelector('.edit-subject');
    const dateInput = row.querySelector('.edit-date');
    const gradeInput = row.querySelector('.edit-grade');

    const subject = subjectInput.value.trim();
    const date = dateInput.value;
    const grade = parseInt(gradeInput.value);

    if (!subject || !date) {
        alert('All fields must be filled in');
        return;
    }

    if (isNaN(grade) || grade < 0 || grade > 5) {
        alert('Grade must be a number between 0 and 5');
        return;
    }

    showLoader();
    fetch(`/edit_grade/${gradeId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            subject_name: subject,
            date: date,
            grade: grade
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Error saving changes');
            return response.json();
        })
        .then(() => {
            row.classList.remove('editing');
            isGradeEditing = false;
            const studentId = document.getElementById('student-id-display').innerText;
            viewStudentDetails(studentId);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save changes');
        })
        .finally(() => {
            hideLoader();
            isGradeEditing = false;
        });
}


export async function viewStudentDetails(studentId) {
    try {
        showLoader();

        const response = await fetch(`/get_grades/${studentId}`);
        if (!response.ok) {
            throw new Error('Error loading grades');
        }

        const data = await response.json();

        // Update grades table using the function from tableService
        updateGradesTable(data.grades, studentId);

        const averageGrade = calculateAverageGrade();
        const averageDisplay = document.getElementById('average-grade-display');
        if (averageDisplay) {
            averageDisplay.textContent = `Average grade: ${averageGrade}`;
        } else {
            const averageDiv = document.createElement('div');
            averageDiv.id = 'average-grade-display';
            averageDiv.className = 'average-grade';
            averageDiv.textContent = `Average grade: ${averageGrade}`;
            document.getElementById('student-modal').querySelector('.modal-content').appendChild(averageDiv);
        }

        // Display the modal window
        const modal = document.getElementById('student-modal');
        modal.style.display = 'block';

        // Add event handler to close the modal window
        window.onclick = function (event) {
            if (event.target === modal) {
                closeModal();
            }
        };
    } catch (error) {
        console.error('Error loading grades:', error);
        alert('An error occurred while loading student grades');
    } finally {
        hideLoader();
    }
}


export function calculateAverageGrade() {
    const grades = Array.from(document.querySelectorAll('#grades-table .grade-cell'))
        .map(cell => Number(cell.textContent))
        .filter(grade => !isNaN(grade));

    if (grades.length === 0) return 0;

    const sum = grades.reduce((acc, curr) => acc + curr, 0);
    return (sum / grades.length).toFixed(2);  // Возвращаем средний балл с точностью до двух знаков
}