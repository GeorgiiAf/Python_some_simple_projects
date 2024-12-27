export const utils = {
        showLoader() {
            document.body.style.cursor = 'wait';
        },
        hideloadre() {
            document.body.style.cursor = 'deafault';
        },
    validateName (name)
{
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
    return nameRegex.test(name);
},
validateStudentId(id)
{
    const StudentItRegex =  /^\d{8}$/;
    return StudentItRegex.test(id);
} ,
validateGrad(grade)
{
    const gradeNum = parseInt(grade);
    return !isNaN(gradeNum) && gradeNum >= 0 && gradeNum <= 5;
}};

