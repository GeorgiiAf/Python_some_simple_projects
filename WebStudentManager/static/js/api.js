export const api = {
    async addStudent(studentData) {
        const response = await fetch('/add_student', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(studentData)
        });
        return response.json();
    },

    async searchStudents(query) {
        const response = await fetch(`/search_students?query=${encodeURIComponent(query)}`);
        return response.json();
    },

    async getAllStudents() {
        const response = await fetch('/get_students');
        return response.json();
    },

    async deleteStudent(studentId) {
        const response = await fetch(`/delete_student/${studentId}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    async updateStudent(studentId, data) {
        const response = await fetch(`/edit_student/${studentId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async getGrades(studentId) {
        const response = await fetch(`/get_grades/${studentId}`);
        return response.json();
    },

    async addGrade(gradeData) {
        const response = await fetch('/add_grade', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(gradeData)
        });
        return response.json();
    },

    async updateGrade(gradeId, data) {
        const response = await fetch(`/edit_grade/${gradeId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async deleteGrade(gradeId) {
        const response = await fetch(`/delete_grade/${gradeId}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};