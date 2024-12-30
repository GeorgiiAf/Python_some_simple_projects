export const validators = {
    nameRegex: /^[A-Za-zА-Яа-яЁё\s-]+$/,
    studentIdRegex: /^\d{8}$/,

    validateName(name, surname) {
        if (!name || !surname) {
            throw new Error('All fields must be filled.');
        }
        if (!this.nameRegex.test(name) || !this.nameRegex.test(surname)) {
            throw new Error('First and last names must contain only letters, hyphens, and spaces.');
        }
    },

    validateStudentId(studentId) {
        if (!this.studentIdRegex.test(studentId)) {
            throw new Error('The record book number must consist of 8 digits.');
        }
    },

    validateGrade(grade) {
        const gradeNum = parseInt(grade);
        if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 5) {
            throw new Error('The grade must be a number between 0 and 5.');
        }
        return gradeNum;
    }
};