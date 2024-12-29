export const loader = {
    show: () => {
        document.body.style.cursor = 'wait';
    },
    hide: () => {
        document.body.style.cursor = 'default';
    }
};

export const validators = {
    isNameValid: (name) => {
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
        return nameRegex.test(name);
    },
    isStudentIdValid: (studentId) => {
        const studentIdRegex = /^\d{8}$/;
        return studentIdRegex.test(studentId);
    },
    isGradeValid: (grade) => {
        const gradeNum = parseInt(grade);
        return !isNaN(gradeNum) && gradeNum >= 0 && gradeNum <= 5;
    }
};

export const sortHelpers = {
    sortByColumn: (rows, column, descending) => {
        return rows.sort((a, b) => {
            let valA, valB;
            switch (column) {
                case 'name':
                    valA = a.querySelector('.name-cell').textContent.toLowerCase();
                    valB = b.querySelector('.name-cell').textContent.toLowerCase();
                    break;
                case 'surname':
                    valA = a.querySelector('.surname-cell').textContent.toLowerCase();
                    valB = b.querySelector('.surname-cell').textContent.toLowerCase();
                    break;
                case 'date':
                    valA = new Date(a.querySelector('.date-cell').textContent);
                    valB = new Date(b.querySelector('.date-cell').textContent);
                    break;
                case 'subject':
                    valA = a.querySelector('.subject-cell').textContent.toLowerCase();
                    valB = b.querySelector('.subject-cell').textContent.toLowerCase();
                    break;
                case 'grade':
                    valA = Number(a.querySelector('.grade-cell').textContent);
                    valB = Number(b.querySelector('.grade-cell').textContent);
                    break;
                default:
                    return 0;
            }
            if (valA > valB) return descending ? -1 : 1;
            if (valA < valB) return descending ? 1 : -1;
            return 0;
        });
    },
    updateSortIcons: (column, currentSort) => {
        const headers = document.querySelectorAll('#students-table th');
        headers.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            if (icon) {
                if (currentSort.column === column && header.dataset.column === column) {
                    icon.textContent = currentSort.descending ? '↓' : '↑';
                } else {
                    icon.textContent = '↕';
                }
            }
        });
    }
};

export const gradeCalculator = {
    calculateAverage: (grades) => {
        if (!grades || grades.length === 0) return 0;
        const sum = grades.reduce((acc, curr) => acc + curr, 0);
        return (sum / grades.length).toFixed(2);
    },
    getGradesFromTable: () => {
        return Array.from(document.querySelectorAll('#grades-table .grade-cell'))
            .map(cell => Number(cell.textContent))
            .filter(grade => !isNaN(grade));
    }
};