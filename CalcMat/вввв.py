from PyPDF2 import PdfReader, PdfWriter
import os

def split_pdf_by_tasks(input_pdf, output_folder):
    if not os.path.exists(input_pdf):
        print(f"Файл {input_pdf} не найден.")
        return

    reader = PdfReader(input_pdf)
    os.makedirs(output_folder, exist_ok=True)

    variant_number = 0
    task_number = 0
    writer = None

    for page_num, page in enumerate(reader.pages):
        text = page.extract_text()

        # Если текст на странице не найден, пропускаем эту страницу
        if not text:
            print(f"Страница {page_num + 1} пуста или содержит изображения.")
            continue

        # Если на странице появляется новый вариант
        if "Вариант " in text:
            if writer:  # Сохраняем текущую задачу
                with open(f"{output_folder}/variant{variant_number}_task{task_number}.pdf", "wb") as out_file:
                    writer.write(out_file)

            # Переходим к новому варианту
            variant_number += 1
            task_number = 0  # Сбросим номер задачи
            writer = PdfWriter()

        # Если на странице появляется новая задача
        if "Задача " in text:
            if writer and task_number > 0:  # Сохраняем текущую задачу
                with open(f"{output_folder}/variant{variant_number}_task{task_number}.pdf", "wb") as out_file:
                    writer.write(out_file)
            task_number += 1  # Увеличиваем номер задачи
            writer = PdfWriter()  # Создаем новый файл для следующей задачи

        # Добавляем текущую страницу в файл задачи
        if writer:
            writer.add_page(page)

    # Сохраняем последнюю задачу последнего варианта
    if writer:
        with open(f"{output_folder}/variant{variant_number}_task{task_number}.pdf", "wb") as out_file:
            writer.write(out_file)

    print(f"PDF разбит на {variant_number} вариантов и {task_number} задач.")

# Использование
input_pdf = "Практическое задание по курсу - Задача.pdf"  # Ваш PDF файл
output_folder = "tasks_split"  # Папка для сохранения задач
split_pdf_by_tasks(input_pdf, output_folder)
