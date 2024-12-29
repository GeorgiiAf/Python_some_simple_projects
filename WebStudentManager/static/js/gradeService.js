export let isGradeEditing = false;

export async function addGrade() {
    const studentId = document.getElementById('student-id-display').innerText;
    const subject = document.getElementById('modal-subject-name').value.trim();
    const grade = document.getElementById('modal-subject-grade').value.trim();
    const date = document.getElementById('modal-subject-date').value;

    if (!subject || !grade || !date) {
        alert('Все поля должны быть заполнены');
        return;
    }

    try {
        const gradeNum = validators.validateGrade(grade);

        showLoader();
        const response = await fetch('/add_grade', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                student_id: studentId,
                subject_name: subject,
                grade: gradeNum,
                date: date
            })
        });

        if (!response.ok) throw new Error('Ошибка при добавлении оценки');

        const data = await response.json();
        alert(data.message || 'Оценка успешно добавлена');

        // Очищаем поля
        document.getElementById('modal-subject-name').value = '';
        document.getElementById('modal-subject-grade').value = '';
        document.getElementById('modal-subject-date').value = '';

        // Обновляем список оценок
        await viewStudentDetails(studentId);
    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message || 'Не удалось добавить оценку');
    } finally {
        hideLoader();
    }
}

export async function viewStudentDetails(studentId) {
    try {
        showLoader();
        const response = await fetch(`/get_grades/${studentId}`);
        if (!response.ok) throw new Error('Ошибка при загрузке оценок');

        const data = await response.json();
        updateGradesTable(data, studentId);

        const modal = document.getElementById('student-modal');
        modal.style.display = 'block';
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при загрузке оценок студента');
    } finally {
        hideLoader();
    }
}