import { showLoader, hideLoader } from './utils.js';
import { updateStudentsTable } from './tableService.js';
import { validators } from './validators.js';

export let isEditing = false;

export async function addStudent() {
   const nameInput = document.getElementById('name-input');
   const surnameInput = document.getElementById('surname-input');
   const studentIdInput = document.getElementById('student-id-input');

   const name = nameInput.value.trim();
   const surname = surnameInput.value.trim();
   const studentId = studentIdInput.value.trim();

   if (!validators.validateName(name, surname)) {
       alert('Invalid name format');
       return;
   }

   if (!validators.validateStudentId(studentId)) {
       alert('Invalid student ID format');
       return;
   }

   try {
       showLoader();
       const response = await fetch('/add_student', {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({name, surname, student_id: studentId})
       });

       if (!response.ok) throw new Error('Server error');
       const data = await response.json();

       alert(data.message || 'Student added successfully.');
       nameInput.value = '';
       surnameInput.value = '';
       studentIdInput.value = '';
       await getAllStudents();
   } catch (error) {
       console.error('Error:', error);
       alert(error.message || 'An error occurred while adding the student.');
   } finally {
       hideLoader();
   }
}

export async function getAllStudents() {
    try {
        showLoader();
        const response = await fetch('/get_students');
        if (!response.ok) throw new Error('Error loading students');

        const data = await response.json();
        updateStudentsTable(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Could not load the list of students.');
    } finally {
        hideLoader();
    }
}

export async function findStudents() {
    const searchTerm = document.getElementById('search').value.trim();

    if (searchTerm === '') {
        await getAllStudents();
        return;
    }

    try {
        showLoader();
        const response = await fetch(`/search_students?query=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Search error');

        const data = await response.json();
        updateStudentsTable(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Could not perform student search.');
    } finally {
        hideLoader();
    }
}

export async function editStudent(studentId) {
    if (isEditing) {
        alert('Please finish the current edit session.');
        return;
    }

    isEditing = true;
    const row = document.querySelector(`tr[data-id="${studentId}"]`);
    if (!row) {
        console.error('Student not found.');
        isEditing = false;
        return;
    }

    row.classList.add('editing');
    const nameCell = row.querySelector('.name-cell');
    const surnameCell = row.querySelector('.surname-cell');

    const nameValue = nameCell.textContent.trim();
    const surnameValue = surnameCell.textContent.trim();

    // Create input fields
    const nameInput = createInput(nameValue, 'edit-input');
    const surnameInput = createInput(surnameValue, 'edit-input');

    nameCell.innerHTML = '';
    surnameCell.innerHTML = '';
    nameCell.appendChild(nameInput);
    surnameCell.appendChild(surnameInput);

    // Add action buttons
    const actionButtons = row.querySelector('.action-buttons');
    actionButtons.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;

    // Assign event listeners
    actionButtons.querySelector('.save-btn').onclick = () => saveStudentChanges(studentId, row);
    actionButtons.querySelector('.cancel-btn').onclick = () => cancelEdit(studentId, row, nameValue, surnameValue);
}

export function cancelEdit(studentId, row, originalName, originalSurname) {
    if (!row) return;

    const nameCell = row.querySelector('.name-cell');
    const surnameCell = row.querySelector('.surname-cell');
    const actionButtons = row.querySelector('.action-buttons');

    // Restore original values
    nameCell.textContent = originalName;
    surnameCell.textContent = originalSurname;

    // Reset action buttons
    actionButtons.innerHTML = `
        <button onclick="editStudent('${studentId}')">Edit</button>
        <button onclick="deleteStudent('${studentId}')">Delete</button>
    `;

    // Reset styling
    row.classList.remove('editing');
    isEditing = false;
}


function createInput(value, className) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.className = className;
    return input;
}

export async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        showLoader();
        const response = await fetch(`/delete_student/${studentId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error deleting student');

        const data = await response.json();
        alert(data.message || 'Student deleted successfully.');
        await getAllStudents();
    } catch (error) {
        console.error('Error:', error);
        alert('Could not delete the student.');
    } finally {
        hideLoader();
    }
}

async function saveStudentChanges(studentId, row) {
    const nameInput = row.querySelector('.name-cell input');
    const surnameInput = row.querySelector('.surname-cell input');

    const newName = nameInput.value.trim();
    const newSurname = surnameInput.value.trim();

    if (!newName || !newSurname) {
        alert('First and last names cannot be empty.');
        return;
    }

    try {
        showLoader();
        const response = await fetch(`/edit_student/${studentId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: newName, surname: newSurname})
        });

        if (!response.ok) throw new Error('Error saving changes');

        await getAllStudents();
        isEditing = false;
    } catch (error) {
        console.error('Error:', error);
        alert('Could not save changes.');
    } finally {
        hideLoader();
    }
}
