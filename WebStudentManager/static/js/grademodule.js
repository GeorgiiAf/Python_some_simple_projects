export class GradeModule {
    constructor() {
        this.isGradeEditing = false;
    }

    async addGrade() {
        const studentId = document.getElementById('student-id-display').innerText;
        const subject = document.getElementById('modal-subject-name').value.trim();
        const grade = document.getElementById('modal-subject-grade').value.trim();
        const date = document.getElementById('modal-subject-date').value;

        if (!subject || !grade || !date) {
            alert('Все поля должны быть заполнены');
            return;
        }

        if (!utils.validateGrade(grade)) {
            alert('Оценка должна быть числом от 0 до 5');
            return;
        }

        try {
            utils.showLoader();
            await api.addGrade({
                student_id: studentId,
                subject_name: subject,
                grade: parseInt(grade),
                date: date
            });
            alert('Оценка успешно добавлена');
            this.clearGradeInputs();
            await this.viewStudentDetails(studentId);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось добавить оценку');
        } finally {
            utils.hideLoader();
        }
    }

    // ... остальные методы для работы с оценками
}