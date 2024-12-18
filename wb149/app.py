from flask import Flask, request, jsonify, send_from_directory, abort, render_template
from flask_sqlalchemy import SQLAlchemy
import csv
import os


app = Flask(__name__)
def read_csv_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file, delimiter=';')
        headers = next(csv_reader)  # Считываем заголовки
        return [dict(zip(headers, row)) for row in csv_reader]

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<path:filename>')
def static_files(filename):
    if os.path.exists(filename):
        return send_from_directory('.', filename)  # Отправляем статический файл
    abort(404)


@app.route('/get_students', methods=['GET'])
def get_students():
    surname = request.args.get('surname', '').lower()  # Получаем параметр 'surname'
    students_data = read_csv_file('studs.csv')  # Считываем данные из CSV

    # Фильтруем данные в зависимости от параметра surname
    if surname == 'все':
        response_data = students_data
    elif surname == 'names':
        response_data = [student['фамилия'] for student in students_data]
    else:
        response_data = [student for student in students_data if student['фамилия'].lower() == surname]

    return jsonify(response_data)

@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.get_json()  # Получаем новые данные
    new_student = Student(name=data['name'], surname=data['surname'])
    db.session.add(new_student)
    db.session.commit()
    return jsonify({"message": "Student added successfully!"}), 201

@app.route('/get_students', methods=['GET'])
def get_students():
    students_data = Student.query.all()  # Получаем всех студентов из базы данных
    return jsonify([student.to_dict() for student in students_data])  # Возвращаем список студентов

@app.route('/edit_student/<int:id>', methods=['PUT'])
def edit_student(id):
    data = request.get_json()  # Получаем новые данные
    student = Student.query.get_or_404(id)  # Ищем студента по ID
    student.name = data['name']
    student.surname = data['surname']
    db.session.commit()
    return jsonify({"message": "Student updated successfully!"})

@app.route('/delete_student/<int:id>', methods=['DELETE'])
def delete_student(id):
    student = Student.query.get_or_404(id)  # Ищем студента по ID
    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": "Student deleted successfully!"})



if __name__ == '__main__':
    app.run(debug=True)