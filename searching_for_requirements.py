import requests
from bs4 import BeautifulSoup
import pandas as pd
import sqlite3
import matplotlib.pyplot as plt
import seaborn as sns


def fetch_duunitori_jobs():
    url = 'https://duunitori.fi/tyopaikat/?haku=python'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    job_listings = []

    for job in soup.find_all('div', class_='job-box'):
        title_elem = job.find('h2', class_='job-box-title')
        company_elem = job.find('div', class_='job-box-employer')
        location_elem = job.find('div', class_='job-box-location')
        requirements_elem = job.find('div', class_='job-box-requirements')
        date_elem = job.find('div', class_='job-box-date')

        title = title_elem.text.strip() if title_elem else 'N/A'
        company = company_elem.text.strip() if company_elem else 'N/A'
        location = location_elem.text.strip() if location_elem else 'N/A'
        requirements = requirements_elem.text.strip() if requirements_elem else 'N/A'
        date_posted = date_elem.text.strip() if date_elem else 'N/A'

        job_listings.append({
            'title': title,
            'company': company,
            'location': location,
            'requirements': requirements,
            'date_posted': date_posted
        })

    return job_listings


# Тестирование функции
job_listings = fetch_duunitori_jobs()
print(job_listings)

# Преобразование данных в DataFrame для дальнейшего анализа
df = pd.DataFrame(job_listings)


def store_data_to_db(df):
    # Создание подключения к базе данных
    conn = sqlite3.connect('jobs.db')
    c = conn.cursor()

    # Создание таблицы (если она еще не существует)
    c.execute('''CREATE TABLE IF NOT EXISTS job_listings
                 (title TEXT, company TEXT, location TEXT, requirements TEXT, date_posted TEXT)''')

    # Вставка данных в таблицу
    df.to_sql('job_listings', conn, if_exists='append', index=False)

    # Сохранение (commit) и закрытие подключения
    conn.commit()
    conn.close()

store_data_to_db(df)


def analyze_data():
    # Подключение к базе данных и загрузка данных в DataFrame
    conn = sqlite3.connect('jobs.db')
    df = pd.read_sql_query("SELECT * FROM job_listings", conn)
    conn.close()

    # Пример анализа: самые распространенные требования
    requirements_series = df['requirements'].str.split(',').explode().str.strip()
    common_requirements = requirements_series.value_counts().head(10)

    # Построение графика
    plt.figure(figsize=(10, 6))
    sns.barplot(x=common_requirements.values, y=common_requirements.index)
    plt.xlabel('Frequency')
    plt.ylabel('Requirement')
    plt.title('Top 10 Common Requirements for Python Jobs in Finland')
    plt.show()

analyze_data()

