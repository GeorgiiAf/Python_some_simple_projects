export const validators = {
    validateName(name) {
        // Разрешаем буквы (включая кириллицу), пробелы и дефисы
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]{2,50}$/;
        return nameRegex.test(name.trim());
    },

    validateStudentId(studentId) {
        // Разрешаем буквы, цифры, минимум 3 символа, максимум 20
        const studentIdRegex = /^[A-Za-z0-9]{3,20}$/;
        return studentIdRegex.test(studentId.trim());
    },

    validateGrade(grade) {
        const gradeNum = parseInt(grade);
        if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 5) {
            throw new Error('Grade must be a number between 1 and 5');
        }
        return gradeNum;
    }
};