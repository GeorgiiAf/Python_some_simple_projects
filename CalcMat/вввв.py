import re
import os
from PyPDF2 import PdfReader, PdfWriter


def split_pdf_by_tasks(input_pdf, output_folder):
    # Чтение PDF
    reader = PdfReader(input_pdf)
    os.makedirs(output_folder, exist_ok=True)

    task_number = 0
    current_variant = None
    writer = None
    total_tasks = 0

    for page_num, page in enumerate(reader.pages):
        text = page.extract_text()

        # Проверяем на наличие "Вариант"
        variant_match = re.search(r"Вариант\s*(\d+)", text)
        if variant_match:
            # Сохраняем предыдущий вариант, если есть
            if writer:
                with open(f"{output_folder}/variant_{current_variant}_task_{task_number}.pdf", "wb") as output_pdf:
                    writer.write(output_pdf)

            # Новый вариант
            current_variant = variant_match.group(1)
            task_number = 0
            writer = PdfWriter()
            print(f"Новый вариант: {current_variant}")

        # Проверяем на наличие "Задача"
        task_match = re.search(r"Задача\s*(\d+)", text)
        if task_match:
            task_number += 1
            print(f"Новая задача: {task_number} в варианте {current_variant}")

            # Сохраняем текущую задачу
            if writer:
                with open(f"{output_folder}/variant_{current_variant}_task_{task_number}.pdf", "wb") as output_pdf:
                    writer.write(output_pdf)

            # Создаём новый writer для новой задачи
            writer = PdfWriter()

        # Добавляем страницу в текущий файл
        if writer:
            writer.add_page(page)

    # Сохраняем последнюю задачу
    if writer:
        with open(f"{output_folder}/variant_{current_variant}_task_{task_number}.pdf", "wb") as output_pdf:
            writer.write(output_pdf)

    print(f"PDF разбит на {total_tasks} задач.")


# Использование
input_pdf = "Практическое задание по курсу - Задача.pdf"  # Ваш PDF файл
output_folder = "tasks_split"  # Папка для сохранения задач
split_pdf_by_tasks(input_pdf, output_folder)
