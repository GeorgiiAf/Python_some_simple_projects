// Экспорт списка студентов в PDF
export function exportStudentsToPdf(students) {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    doc.text("Список студентов", 10, 10);

    // Заголовки таблицы
    const tableColumn = ["Номер зачетной книжки", "Имя", "Фамилия"];
    const tableRows = [];

    // Добавляем данные студентов в таблицу
    students.forEach((student) => {
        const studentData = [student.id, student.name, student.surname];
        tableRows.push(studentData);
    });

    // Автоматическая генерация таблицы
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    // Сохранение PDF-файла
    doc.save("Список_студентов.pdf");
}

// Экспорт зачётной книжки студента в PDF
export function exportStudentRecordToPdf(studentId, grades) {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Зачётная книжка студента: ${studentId}`, 10, 10);

    // Заголовки таблицы
    const tableColumn = ["Предмет", "Дата", "Оценка"];
    const tableRows = [];

    // Добавляем данные оценок в таблицу
    grades.forEach((grade) => {
        const gradeData = [grade.subject, grade.date, grade.grade];
        tableRows.push(gradeData);
    });

    // Автоматическая генерация таблицы
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    // Сохранение PDF-файла
    doc.save(`Зачетная_книжка_${studentId}.pdf`);
}
