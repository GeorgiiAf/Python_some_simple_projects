export const utils = {
    showLoader() {
        document.body.style.cursor = 'wait';
    },
    hideLoader() {
        document.body.style.cursor = 'default';
    },
    validateName(name) {
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
        return nameRegex.test(name);
    },
    validateStudentId(id) {
        const studentIdRegex = /^\d{8}$/;
        return studentIdRegex.test(id);
    },
    validateGrade(grade) {
        const gradeNum = parseInt(grade);
        return !isNaN(gradeNum) && gradeNum >= 0 && gradeNum <= 5;
    },
    closeModal() {
        const modal = document.getElementById('student-modal');
        modal.style.display = 'none';
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';
        window.onclick = null;
    }
};