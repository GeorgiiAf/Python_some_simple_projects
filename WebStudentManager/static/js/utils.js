export function showLoader() {
    document.body.style.cursor = 'wait';
}

export function hideLoader() {
    document.body.style.cursor = 'default';
}
export function closeModal() {
    const modal = document.getElementById('student-modal');
    modal.style.display = 'none';
    document.getElementById('modal-subject-name').value = '';
    document.getElementById('modal-subject-grade').value = '';
    document.getElementById('modal-subject-date').value = '';
    window.onclick = null;
    const saveGradeButton = document.getElementById('save-grade-btn');
    if (saveGradeButton) {
        saveGradeButton.onclick = null;
    }
}
