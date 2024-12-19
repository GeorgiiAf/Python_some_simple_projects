from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Настройка базы данных SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Модель для студентов
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False)  # Уникальный номер зачетной книжки
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "name": self.name,
            "surname": self.surname
        }

# Модель для предметов и оценок
class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), db.ForeignKey('student.student_id'), nullable=False)
    subject_name = db.Column(db.String(50), nullable=False)
    grade = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "subject_name": self.subject_name,
            "grade": self.grade
        }

# Главная страница
@app.route('/')
def index():
    return render_template('index.html')

# Получение всех студентов и их предметов
@app.route('/get_students', methods=['GET'])
def get_students():
    students = Student.query.all()
    result = []
    for student in students:
        subjects = Subject.query.filter_by(student_id=student.student_id).all()
        student_data = student.to_dict()
        student_data['subjects'] = [subject.to_dict() for subject in subjects]
        result.append(student_data)
    return jsonify(result)

# Добавление нового студента
@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.get_json()
    if Student.query.filter_by(student_id=data['student_id']).first():
        return jsonify({"error": "Student ID already exists!"}), 400
    new_student = Student(
        student_id=data['student_id'],
        name=data['name'],
        surname=data['surname']
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify({"message": "Student added successfully!"})

# Редактирование студента
@app.route('/edit_student/<string:student_id>', methods=['PUT'])
def edit_student(student_id):
    data = request.get_json()
    student = Student.query.filter_by(student_id=student_id).first_or_404()
    student.name = data['name']
    student.surname = data['surname']
    db.session.commit()
    return jsonify({"message": "Student updated successfully!"})

# Удаление студента
@app.route('/delete_student/<string:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.filter_by(student_id=student_id).first_or_404()
    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": "Student deleted successfully!"})

# Добавление оценки
@app.route('/add_grade', methods=['POST'])
def add_grade():
    data = request.get_json()
    student = Student.query.filter_by(student_id=data['student_id']).first()
    if not student:
        return jsonify({"error": "Student not found!"}), 404
    new_subject = Subject(
        student_id=student.student_id,
        subject_name=data['subject_name'],
        grade=data['grade']
    )
    db.session.add(new_subject)
    db.session.commit()
    return jsonify({"message": "Grade added successfully!"})

# Запуск приложения
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
