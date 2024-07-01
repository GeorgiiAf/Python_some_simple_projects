
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

    print('  OKEI    ')

    """
    # Построение графика
    plt.figure(figsize=(10, 6))
    sns.barplot(x=common_requirements.values, y=common_requirements.index)
    plt.xlabel('Frequency')
    plt.ylabel('Requirement')
    plt.title('Top 10 Common Requirements for Python Jobs in Finland')
    plt.show()
    """
analyze_data()