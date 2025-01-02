export function exportStudentGradesToPDF(studentId, studentName) {
    try {
        // Prepare document definition
        const docDefinition = {
            content: [
                { text: `Student Record Book: ${studentId}`, fontSize: 16, margin: [0, 0, 0, 10] },
                { text: `Student: ${studentName}`, fontSize: 12, margin: [0, 0, 0, 5] },
                { text: `Date: ${new Date().toLocaleDateString()}`, fontSize: 12, margin: [0, 0, 0, 20] },
            ],
            defaultStyle: {
                font: 'Roboto'
            }
        };

        // Get grades data from table
        const gradesTable = document.getElementById('grades-table');
        const grades = [];
        
        // Add table headers
        grades.push([
            { text: 'Subject', style: 'tableHeader' },
            { text: 'Date', style: 'tableHeader' },
            { text: 'Grade', style: 'tableHeader' }
        ]);

        // Add table rows
        gradesTable.querySelectorAll('tbody tr').forEach(row => {
            grades.push([
                row.cells[0].textContent, // Subject
                row.cells[2].textContent, // Date
                row.cells[3].textContent  // Grade
            ]);
        });

        // Calculate average grade
        const gradeValues = grades.slice(1).map(row => parseFloat(row[2]));
        const averageGrade = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;

        // Add table to document
        docDefinition.content.push({
            table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: grades
            },
            layout: {
                fillColor: function(rowIndex) {
                    return rowIndex === 0 ? '#4CAF50' : null;
                },
                fillOpacity: function(rowIndex) {
                    return rowIndex === 0 ? 0.8 : 1;
                }
            },
            margin: [0, 0, 0, 20]
        });

        // Add average grade
        docDefinition.content.push({
            text: `Average Grade: ${averageGrade.toFixed(2)}`,
            fontSize: 12,
            margin: [0, 10, 0, 0]
        });

        // Generate and download PDF
        pdfMake.createPdf(docDefinition).download(`student_grades_${studentId}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}

export function exportAllStudentsToPDF() {
    try {
        // Prepare document definition
        const docDefinition = {
            content: [
                { text: 'Students List', fontSize: 16, margin: [0, 0, 0, 10] },
                { text: `Generated: ${new Date().toLocaleDateString()}`, fontSize: 12, margin: [0, 0, 0, 20] }
            ],
            defaultStyle: {
                font: 'Roboto'
            }
        };

        // Get students data from table
        const studentsTable = document.getElementById('students-table');
        const students = [];
        
        // Add table headers
        students.push([
            { text: 'Student ID', style: 'tableHeader' },
            { text: 'First Name', style: 'tableHeader' },
            { text: 'Last Name', style: 'tableHeader' }
        ]);

        // Add table rows
        studentsTable.querySelectorAll('tbody tr').forEach(row => {
            students.push([
                row.cells[0].textContent, // ID
                row.cells[1].textContent, // First Name
                row.cells[2].textContent  // Last Name
            ]);
        });

        // Add table to document
        docDefinition.content.push({
            table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: students
            },
            layout: {
                fillColor: function(rowIndex) {
                    return rowIndex === 0 ? '#4CAF50' : null;
                },
                fillOpacity: function(rowIndex) {
                    return rowIndex === 0 ? 0.8 : 1;
                }
            }
        });

        // Generate and download PDF
        pdfMake.createPdf(docDefinition).download('students_list.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
} 