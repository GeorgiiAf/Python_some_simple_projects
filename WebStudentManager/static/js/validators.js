export const validators = {
    nameRegex: /^[A-Za-zА-Яа-яЁё\s-]+$/,
    studentIdRegex: /^\d{8}$/,

    validateName(name, surname) {
        if (!name || !surname) return false;
        return this.nameRegex.test(name) && this.nameRegex.test(surname);
    },

    validateStudentId(studentId) {
        return this.studentIdRegex.test(studentId);
    },

    validateGrade(grade) {
        const gradeNum = parseInt(grade);
        return !isNaN(gradeNum) && gradeNum >= 0 && gradeNum <= 5 ? gradeNum : false;
    }
};