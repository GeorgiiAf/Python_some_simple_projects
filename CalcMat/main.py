import requests
from bs4 import BeautifulSoup
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

# URL страницы с задачами
url = "https://textarchive.ru/c-1158747.html"

# Заголовки для имитации браузера
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Скачивание страницы
response = requests.get(url, headers=headers)
response.raise_for_status()

# Парсинг HTML
soup = BeautifulSoup(response.content, "html.parser")

# Извлечение блока с задачами
text_block = soup.find("div", id="text")
if not text_block:
    print("Блок с задачами не найден.")
    exit()

# Создание папки для сохранения изображений
os.makedirs("images", exist_ok=True)

# Настройка Selenium
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get(url)

# Обработка текста и изображений
tasks = []
for p in text_block.find_all("p"):  # Перебор всех параграфов
    text = p.get_text(strip=True)  # Текст задачи

    # Извлечение изображений в текущем параграфе
    images = p.find_all("img")
    img_paths = []

    for img in images:
        img_url = f"https://textarchive.ru{img['src']}"  # Полный URL изображения
        img_name = os.path.join("images", os.path.basename(img['src']))

        # Заменяем расширение на .png
        img_name = os.path.splitext(img_name)[0] + ".png"

        # Сохраняем скриншот элемента через Selenium
        try:
            img_element = driver.find_element(By.XPATH, f"//img[@src='{img['src']}']")
            img_element.screenshot(img_name)
            img_paths.append(img_name)
        except Exception as e:
            print(f"Ошибка при обработке изображения {img_url}: {e}")
            continue

    # Добавление текста и путей к изображениям в задачи
    tasks.append({"text": text, "images": img_paths})

# Завершение работы Selenium
driver.quit()

# Сохранение задач в файл
with open("tasks.json", "w", encoding="utf-8") as f:
    json.dump(tasks, f, ensure_ascii=False, indent=4)

print("Задачи и изображения успешно сохранены.")
