from flask import Flask, request, jsonify, send_from_directory, abort
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
    return send_from_directory('.', 'index.html')  # Отправляем HTML файл

@app.route('/static')
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

if __name__ == '__main__':
    app.run(debug=True)