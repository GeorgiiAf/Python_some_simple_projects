export const validators = {
    nameRegex: /^[A-Za-zА-Яа-яЁё\s-]+$/,
    studentIdRegex: /^\d{8}$/,

    validateName(name, surname) {
        if (!name || !surname) {
            throw new Error('Все поля должны быть заполнены.');
        }
        if (!this.nameRegex.test(name) || !this.nameRegex.test(surname)) {
            throw new Error('Имя и фамилия должны содержать только буквы, дефис и пробелы.');
        }
    },

    validateStudentId(studentId) {
        if (!this.studentIdRegex.test(studentId)) {
            throw new Error('Номер зачетной книжки должен состоять из 8 цифр.');
        }
    },

    validateGrade(grade) {
        const gradeNum = parseInt(grade);
        if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 5) {
            throw new Error('Оценка должна быть числом от 0 до 5');
        }
        return gradeNum;
    }
};