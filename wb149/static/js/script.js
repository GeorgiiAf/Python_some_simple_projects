//-- запрос полных данных о студентах
function getStudents() {
    var surname = document.getElementById('surname').value;
    fetch('/get_students?surname=' + encodeURIComponent(surname))
        .then(response => response.json())
        .then(data => {
            var table = '<table><tr>';
            if (data.length > 0) {
                for (var key in data[0]) {
                    table += '<th>' + key + '</th>';
                }
                table += '</tr>';
                data.forEach(function(student) {
                    table += '<tr>';
                    for (var key in student) {
                        table += '<td>' + student[key] + '</td>';
                    }
                    table += '</tr>';
                });
            } else {
                table += '<td>Данные не найдены</td></tr>';
            }
            table += '</table>';
            document.getElementById('result').innerHTML = table;
        })
        .catch(error => {
            console.error('Ошибка:', error);
            document.getElementById('result').innerHTML = 'Произошла ошибка при получении данных';
        });
}

function getAllStudents() {
    document.getElementById('surname').value = 'все';
    getStudents();
}

//-- запрос списка фамилий студентов
function getNames() {
	var surname = document.getElementById('surname').value;
	fetch('/get_students?surname=' + encodeURIComponent(surname))
		.then(response => response.json())
		.then(data => {
			console.log(data)
			
			var table = '<table><tr><th>фамилия</th></tr>';
			for (j=0; j<data.length; j++) {
				table += '<tr><td>' + data[j] + '</td></tr>';
			}
			table += '</table>';
			document.getElementById('result').innerHTML = table;
			
		})
		.catch(error => console.error('Ошибка:', error));
}

function getAllNames() {
	document.getElementById('surname').value = 'names';
	getNames();
}
