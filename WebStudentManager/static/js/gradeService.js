import { showLoader, hideLoader, showAlert } from './utils.js';
import { validators } from "./validators.js";

let isGradeEditing = false;

export async function addGrade() {
    const studentId = document.getElementById('student-id-display').innerText;
    const subject = document.getElementById('modal-subject-name').value.trim();
    const grade = document.getElementById('modal-subject-grade').value.trim();
    const date = document.getElementById('modal-subject-date').value;

    if (!subject || !grade || !date) {
        showAlert('All fields must be filled in', 'danger');
        return;
    }

    try {
        const gradeNum = validators.validateGrade(grade);

        showLoader();
        const response = await fetch('/add_grade', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                student_id: studentId,
                subject_name: subject,
                grade: gradeNum,
                date: date
            })
        });

        if (!response.ok) throw new Error('Error adding the grade');

        const data = await response.json();
        showAlert(data.message || 'Grade added successfully', 'success');

        // Clear input fields
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';

        // Обновляем список оценок
        await viewStudentDetails(studentId);
    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message || 'Failed to add grade', 'danger');
    } finally {
        hideLoader();
    }
}

export async function editGrade(gradeId) {
    if (isGradeEditing) {
        alert('Please finish editing the current grade first');
        return;
    }

    const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
    if (!row) {
        alert('Row not found');
        return;
    }

    isGradeEditing = true;
    row.classList.add('editing');

    const cells = row.querySelectorAll('td');
    const subject = cells[0].textContent;
    const date = cells[2].textContent;
    const grade = cells[3].textContent;

    cells[0].innerHTML = `<input type="text" class="form-control form-control-sm edit-subject" value="${subject}">`;
    cells[2].innerHTML = `<input type="date" class="form-control form-control-sm edit-date" value="${date}">`;
    cells[3].innerHTML = `<input type="number" class="form-control form-control-sm edit-grade" value="${grade}" min="1" max="5">`;
    cells[4].innerHTML = `
        <div class="btn-group btn-group-sm">
            <button class="btn btn-success" onclick="saveGradeChanges(${gradeId})">Save</button>
            <button class="btn btn-secondary" onclick="cancelGradeEdit(${gradeId})">Cancel</button>
        </div>
    `;
}

export async function cancelGradeEdit(gradeId) {
    const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
    if (!row) {
        return;
    }
    
    try {
        // Получаем текущие данные оценки
        const response = await fetch(`/get_grade/${gradeId}`);
        if (!response.ok) {
            throw new Error('Failed to get grade data');
        }
        
        const grade = await response.json();
        
        // Восстанавливаем исходное состояние строки
        row.classList.remove('editing');
        const cells = row.querySelectorAll('td');
        
        cells[0].textContent = grade.subject_name;
        cells[2].textContent = grade.date;
        cells[3].textContent = grade.grade;
        cells[4].innerHTML = `
            <div class="btn-group btn-group-sm">
                <button class="btn btn-warning" onclick="editGrade(${gradeId})">Edit</button>
                <button class="btn btn-danger" onclick="deleteGrade(${gradeId})">Delete</button>
            </div>
        `;
        
        isGradeEditing = false;
    } catch (error) {
        console.error('Error canceling edit:', error);
        showAlert('Failed to cancel edit. Please try closing and reopening the grade book.', 'danger');
    }
}

export async function deleteGrade(gradeId) {
    if (!confirm('Are you sure you want to delete this grade?')) {
        return;
    }

    showLoader();
    try {
        const response = await fetch(`/delete_grade/${gradeId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error deleting grade');
        }
        
        const data = await response.json();
        const studentId = document.getElementById('student-id-display').innerText;
        await viewStudentDetails(studentId);
        showAlert('Grade deleted successfully', 'success');
    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to delete grade', 'danger');
    } finally {
        hideLoader();
    }
}

export async function saveGradeChanges(gradeId) {
    const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
    if (!row) {
        showAlert('Row not found', 'danger');
        isGradeEditing = false;
        return;
    }

    // Используем добавленные классы для поиска инпутов
    const subjectInput = row.querySelector('.edit-subject');
    const dateInput = row.querySelector('.edit-date');
    const gradeInput = row.querySelector('.edit-grade');

    if (!subjectInput || !dateInput || !gradeInput) {
        showAlert('Could not find input fields', 'danger');
        return;
    }

    const subject = subjectInput.value.trim();
    const date = dateInput.value;
    const grade = parseInt(gradeInput.value);

    if (!subject || !date) {
        showAlert('All fields must be filled in', 'danger');
        return;
    }

    if (isNaN(grade) || grade < 1 || grade > 5) {
        showAlert('Grade must be a number between 1 and 5', 'danger');
        return;
    }

    try {
        showLoader();
        const response = await fetch(`/edit_grade/${gradeId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                subject_name: subject,
                date: date,
                grade: grade
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to save changes');
        }

        // Сбрасываем состояние редактирования
        row.classList.remove('editing');
        isGradeEditing = false;

        // Обновляем данные в таблице
        const studentId = document.getElementById('student-modal').dataset.studentId;
        await viewStudentDetails(studentId);

        // Показываем сообщение об успехе
        showAlert(data.message || 'Grade updated successfully', 'success');
    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message, 'danger');
    } finally {
        hideLoader();
        isGradeEditing = false;
    }
}

export async function viewStudentDetails(studentId) {
    try {
        showLoader();
        const response = await fetch(`/get_grades/${studentId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to load grades');
        }

        const data = await response.json();
        
        // Update student ID display
        document.getElementById('student-id-display').textContent = studentId;
        document.getElementById('student-modal').dataset.studentId = studentId;
        
        // Update grades table with proper encoding
        const tbody = document.querySelector('#grades-table tbody');
        tbody.innerHTML = data.grades.map(grade => `
            <tr data-grade-id="${grade.id}">
                <td>${grade.subject_name}</td>
                <td>${grade.id}</td>
                <td>${grade.date}</td>
                <td class="grade-cell">${grade.grade}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-warning" onclick="editGrade(${grade.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteGrade(${grade.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Calculate and display average grade
        const averageGrade = calculateAverageGrade();
        const averageDisplay = document.getElementById('average-grade-display');
        if (averageDisplay) {
            averageDisplay.textContent = `Average grade: ${averageGrade}`;
        } else {
            const averageDiv = document.createElement('div');
            averageDiv.id = 'average-grade-display';
            averageDiv.className = 'mt-3 text-end';
            averageDiv.textContent = `Average grade: ${averageGrade}`;
            document.querySelector('.modal-body').appendChild(averageDiv);
        }
        
        // Show modal using Bootstrap Modal instance
        if (window.studentModal) {
            window.studentModal.show();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to load student grades', 'danger');
    } finally {
        hideLoader();
    }
}

export function calculateAverageGrade() {
    const grades = Array.from(document.querySelectorAll('#grades-table tbody td:nth-child(4)'))
        .map(cell => Number(cell.textContent))
        .filter(grade => !isNaN(grade));

    if (grades.length === 0) return 0;

    const sum = grades.reduce((acc, curr) => acc + curr, 0);
    return (sum / grades.length).toFixed(2);
}