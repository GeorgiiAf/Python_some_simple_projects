export class StudentModule{
    constructor() {
        this.isEditing = False
        this.currentSot = {
            column : null,
            decending : false
        };
    }

    async addStudent() {
        const nameInput = document.getElementById('name-input');
        const surnameInput = document.getElementById('surname-input');
        const studentIdInput = document.getElementById('student-id-input');

        const name = nameInput.value.trim();
        const surname = surnameInput.value.trim();
        const studentId = studentIdInput.value.trim();
        if (!name || !surname || !stundetId) {
            alert('Все поля должны быть заполнены.');
            return;
        }
         if (!utils.validateName(name) || !utils.validateName(surname)) {
            alert('Имя и фамилия должны содержать только буквы, дефис и пробелы.');
            return;
        }

        if (!utils.validateStudentId(studentId)) {
            alert('Номер зачетной книжки должен состоять из 8 цифр.');
            return;
        }
     try {
            utils.showLoader();
            await api.addStudent({ name, surname, student_id: studentId });
            alert('Студент успешно добавлен.');
            this.clearInputs([nameInput, surnameInput, studentIdInput]);
            await this.getAllStudents();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении студента.');
        } finally {
            utils.hideLoader();
        }
    }
  clearInputs(inputs) {
        inputs.forEach(input => input.value = '');
    }

    // ... остальные методы для работы со студентами
}