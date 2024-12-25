from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Модель для студентов
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    # Добавляем связь с оценками и каскадное удаление
    grades = db.relationship('Subject', backref='student',
                           cascade='all, delete-orphan',
                           lazy=True)

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
    date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "subject_name": self.subject_name,
            "grade": self.grade,
            "date": self.date.strftime('%Y-%m-%d') if self.date else None  # Добавляем дату
        }

# Главная страница
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({"error": "Bad request"}), 400

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

@app.route('/get_student/<string:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.filter_by(student_id=student_id).first_or_404()
    subjects = Subject.query.filter_by(student_id=student.student_id).all()

    return jsonify({
        "student": student.to_dict(),
        "subjects": [subject.to_dict() for subject in subjects]
    })



@app.route('/search_students', methods=['GET'])
def search_students():
    query = request.args.get('query', '').strip()

    if not query:
        return jsonify([])

    students = Student.query.filter(
        db.or_(
            Student.name.ilike(f'%{query}%'),
            Student.surname.ilike(f'%{query}%'),
            Student.student_id.ilike(f'%{query}%')
        )
    ).all()

    return jsonify([student.to_dict() for student in students])


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

    try:
        # Преобразуем строку даты в объект datetime
        grade_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except (ValueError, KeyError):
        return jsonify({"error": "Invalid date format"}), 400

    new_subject = Subject(
        student_id=student.student_id,
        subject_name=data['subject_name'],
        grade=data['grade'],
        date=grade_date
    )
    db.session.add(new_subject)
    db.session.commit()
    return jsonify({"message": "Grade added successfully!"})


@app.route('/delete_grade/<int:grade_id>', methods=['DELETE'])
def delete_grade(grade_id):
    subject = Subject.query.get_or_404(grade_id)
    db.session.delete(subject)
    db.session.commit()
    return jsonify({"message": "Grade deleted successfully!"})

# Редактирование оценки
@app.route('/edit_grade/<int:grade_id>', methods=['PUT'])
def edit_grade(grade_id):
    data = request.get_json()
    subject = Subject.query.get_or_404(grade_id)

    try:
        # Валидация данных
        if 'grade' in data:
            grade = int(data['grade'])
            if not (0 <= grade <= 5):
                return jsonify({"error": "Grade must be between 0 and 5"}), 400
            subject.grade = grade

        if 'subject_name' in data:
            subject_name = data['subject_name'].strip()
            if not subject_name:
                return jsonify({"error": "Subject name cannot be empty"}), 400
            subject.subject_name = subject_name

        if 'date' in data:
            try:
                new_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
                if new_date > datetime.now().date():
                    return jsonify({"error": "Date cannot be in the future"}), 400
                subject.date = new_date
            except ValueError:
                return jsonify({"error": "Invalid date format"}), 400

        db.session.commit()
        return jsonify({"message": "Grade updated successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/edit_student/<string:student_id>', methods=['PUT'])
def edit_student(student_id):
    data = request.get_json()
    student = Student.query.filter_by(student_id=student_id).first_or_404()

    if 'name' in data:
        student.name = data['name']
    if 'surname' in data:
        student.surname = data['surname']

    try:
        db.session.commit()
        return jsonify({"message": "Student updated successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/get_grades/<string:student_id>', methods=['GET'])
def get_grades(student_id):
    student = Student.query.filter_by(student_id=student_id).first_or_404()
    subjects = Subject.query.filter_by(student_id=student.student_id) \
        .order_by(Subject.date.desc()) \
        .all()  # Сортируем по дате

    return jsonify({
        "student": {
            **student.to_dict(),
            "total_grades": len(subjects),
            "average_grade": sum(s.grade for s in subjects) / len(subjects) if subjects else 0
        },
        "grades": [subject.to_dict() for subject in subjects]
    })

@app.route('/get_grade/<int:grade_id>', methods=['GET'])
def get_grade(grade_id):
    subject = Subject.query.get_or_404(grade_id)
    return jsonify(subject.to_dict())

@app.route('/update_student_field/<student_id>', methods=['PUT'])
def update_student_field(student_id):
    data = request.get_json()
    field = list(data.keys())[0]  # Получаем ключ (например, 'name' или 'surname')
    new_value = data[field]

    # Обновление данных студента в базе
    student = Student.query.filter_by(student_id=student_id).first()  # Используем правильный запрос
    if student:
        setattr(student, field, new_value)
        db.session.commit()  # Сохраняем изменения в базе данных
        return jsonify({'message': 'Данные успешно обновлены.'}), 200
    else:
        return jsonify({'error': 'Студент не найден.'}), 404



# Запуск приложения
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

