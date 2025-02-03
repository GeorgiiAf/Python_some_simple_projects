import sqlite3
def create_database():
    """Создание базы данных с обработкой ошибок"""
    try:
        conn = sqlite3.connect('game_log.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS game_log (
                    match_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player1_name TEXT,
                    player2_name TEXT,
                    start_time TEXT,
                    end_time TEXT,
                    result TEXT,
                    player1_points INTEGER,
                    player2_points INTEGER)''')
        conn.commit()
        print("Database created/connected successfully")
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()