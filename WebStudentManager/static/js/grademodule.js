export class GradeModule {
    constructor() {
        this.isGradeEditing = false;
    }

    // Метод для добавления оценки
    async addGrade() {
        const studentId = document.getElementById('student-id-display').innerText;
        const subject = document.getElementById('modal-subject-name').value.trim();
        const grade = document.getElementById('modal-subject-grade').value.trim();
        const date = document.getElementById('modal-subject-date').value;

        if (!this.validateGradeInputs({ subject, grade, date })) {
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
            console.error('Ошибка при добавлении оценки:', error);
            alert('Не удалось добавить оценку');
        } finally {
            utils.hideLoader();
        }
    }

    // Метод для сохранения изменений оценки
    async saveGradeChanges(gradeId) {
        const row = document.querySelector(`tr[data-grade-id="${gradeId}"]`);
        if (!row) {
            alert('Строка не найдена');
            this.isGradeEditing = false;
            return;
        }

        const subjectInput = row.querySelector('.edit-subject');
        const dateInput = row.querySelector('.edit-date');
        const gradeInput = row.querySelector('.edit-grade');

        const subject = subjectInput.value.trim();
        const date = dateInput.value;
        const grade = parseInt(gradeInput.value);

        if (!this.validateGradeInputs({ subject, grade, date })) {
            return;
        }

        try {
            utils.showLoader();
            await api.updateGrade(gradeId, {
                subject_name: subject,
                date: date,
                grade: grade
            });
            alert('Изменения успешно сохранены');
            row.classList.remove('editing');
            this.isGradeEditing = false;
            const studentId = document.getElementById('student-id-display').innerText;
            await this.viewStudentDetails(studentId);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
            alert('Не удалось сохранить изменения');
        } finally {
            utils.hideLoader();
            this.isGradeEditing = false;
        }
    }

    // Валидация входных данных для оценки
    validateGradeInputs({ subject, grade, date }) {
        if (!subject || !date) {
            alert('Все поля должны быть заполнены');
            return false;
        }

        const gradeNum = parseInt(grade);
        if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 5) {
            alert('Оценка должна быть числом от 0 до 5');
            return false;
        }

        return true;
    }

    // Очистка полей для добавления оценки
    clearGradeInputs() {
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';
    }

    // Просмотр информации о студенте
    async viewStudentDetails(studentId) {
        try {
            utils.showLoader();
            const data = await api.getStudentDetails(studentId);
            // Логика отображения данных студента
            console.log('Данные студента:', data);
        } catch (error) {
            console.error('Ошибка при загрузке данных студента:', error);
            alert('Не удалось загрузить информацию о студенте');
        } finally {
            utils.hideLoader();
        }
    }
}
