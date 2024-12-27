export const api = {
    async addStident(studentData) {
        const response = await fetch('/add_student',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(studentData)
            });
        return await response.json();
    },

    async getStudents() {
        const response = await fetch('/get_students');
        return await response.json();
    },
    async searchStudents(query) {
        const response = await fetch(`/search_students?query=${encodeURIComponent(query)}'`)
        ;
        return await response.json();
    },
    async deleteStudent(studentId) {
        const response = await fetch('/delete_student/${studentId}', {
            method: 'DELETE'
        });
        return await response.json();
    },
    async updateStudent(studentId, data) {
        const response = await fetch('/edit_student/${studentId}', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await response.json();
    },
    async getGrades(studentId) {
        const response = await fetch('/get_grades/${studentId}');
        return await response.json();
    },
    async addGrade(studentId) {
        const response = await fetch('/add_grade/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(gradeData)
        });
        return await response.json()
    },
    async updateGrade(gradeId, data) {
        const response = await fetch(`/edit_grade/${gradeId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(gradeData)
        });
        return await response.json()
    },
    async deleteGrade(gradeId) {
        const response = await fetch(`/delete_grade/${gradeId}`, {
            method: 'DELETE'
        });
        return await response.json()
    }
};