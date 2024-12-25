from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
# Настройка подключения к базе данных SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Инициализация SQLAlchemy и Flask-Migrate
db = SQLAlchemy(app)
migrate = Migrate(app, db)


# Модель для таблицы студентов
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Уникальный идентификатор
    student_id = db.Column(db.String(20), unique=True, nullable=False)  # Номер зачетной книжки
    name = db.Column(db.String(50), nullable=False)  # Имя студента
    surname = db.Column(db.String(50), nullable=False)  # Фамилия студента
    # Связь "один-ко-многим" с оценками
    grades = db.relationship('Subject', backref='student', cascade='all, delete-orphan', lazy=True)

    # Метод для представления данных студента в виде словаря
    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "name": self.name,
            "surname": self.surname
        }


# Модель для таблицы предметов и оценок
class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Уникальный идентификатор
    student_id = db.Column(db.String(20), db.ForeignKey('student.student_id'), nullable=False)  # ID студента
    subject_name = db.Column(db.String(50), nullable=False)  # Название предмета
    grade = db.Column(db.Integer, nullable=False)  # Оценка
    date = db.Column(db.Date, nullable=False)  # Дата выставления оценки

    # Метод для представления данных предмета и оценки в виде словаря
    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "subject_name": self.subject_name,
            "grade": self.grade,
            "date": self.date.strftime('%Y-%m-%d') if self.date else None  # Форматируем дату
        }


# Главная страница
@app.route('/')
def index():
    # Отображение HTML-страницы
    return render_template('index.html')


# Обработчик ошибок (404)
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404


# Обработчик ошибок (400)
@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({"error": "Bad request"}), 400


# Получение списка всех студентов вместе с их предметами и оценками
@app.route('/get_students', methods=['GET'])
def get_students():
    students = Student.query.all()  # Получаем всех студентов из базы
    result = []
    for student in students:
        subjects = Subject.query.filter_by(student_id=student.student_id).all()  # Получаем все предметы студента
        student_data = student.to_dict()
        student_data['subjects'] = [subject.to_dict() for subject in subjects]  # Добавляем предметы в список
        result.append(student_data)
    return jsonify(result)


# Получение данных конкретного студента
@app.route('/get_student/<string:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.filter_by(student_id=student_id).first_or_404()  # Ищем студента по ID
    subjects = Subject.query.filter_by(student_id=student.student_id).all()  # Все предметы студента

    return jsonify({
        "student": student.to_dict(),
        "subjects": [subject.to_dict() for subject in subjects]
    })


# Поиск студентов по имени, фамилии или номеру зачетной книжки
@app.route('/search_students', methods=['GET'])
def search_students():
    query = request.args.get('query', '').strip()  # Получаем поисковый запрос

    if not query:
        return jsonify([])  # Если запрос пуст, возвращаем пустой список

    # Поиск студентов по имени, фамилии или номеру зачетной книжки
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
    data = request.get_json()  # Получаем данные из запроса
    # Проверяем, что номер зачетной книжки уникален
    if Student.query.filter_by(student_id=data['student_id']).first():
        return jsonify({"error": "Student ID already exists!"}), 400
    # Создаем нового студента
    new_student = Student(
        student_id=data['student_id'],
        name=data['name'],
        surname=data['surname']
    )
    db.session.add(new_student)  # Добавляем в сессию
    db.session.commit()  # Сохраняем изменения
    return jsonify({"message": "Student added successfully!"})


# Удаление студента
@app.route('/delete_student/<string:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.filter_by(student_id=student_id).first_or_404()  # Ищем студента
    db.session.delete(student)  # Удаляем из базы
    db.session.commit()  # Сохраняем изменения
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

    # Создаем новую запись об оценке
    new_subject = Subject(
        student_id=student.student_id,
        subject_name=data['subject_name'],
        grade=data['grade'],
        date=grade_date
    )
    db.session.add(new_subject)
    db.session.commit()
    return jsonify({"message": "Grade added successfully!"})


# Удаление оценки
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

    # Обновляем данные оценки
    if 'grade' in data:
        subject.grade = data['grade']
    if 'subject_name' in data:
        subject.subject_name = data['subject_name']
    if 'date' in data:
        subject.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

    db.session.commit()  # Сохраняем изменения
    return jsonify({"message": "Grade updated successfully!"})


# Запуск приложения
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Создаем таблицы
    app.run(debug=True)  # Запуск приложения
