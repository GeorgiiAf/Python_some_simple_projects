import sqlite3
#  watching  the information about games
# player name , time , winner , looser , points



def fetch_game_log():
    conn = sqlite3.connect('game_log.db')
    c = conn.cursor()
    c.execute("SELECT * FROM game_log")
    rows = c.fetchall()
    conn.close()
    return rows

def print_game_log():

    #   printing the information about games

    logs = fetch_game_log()
    for log in logs:
        print(f"Player 1: {log[1]}, Player 2: {log[2]}, Start Time: {log[3]}, End Time: {log[4]}, Result: {log[5]}, Player 1 Points: {log[6]}, Player 2 Points: {log[7]}")

if __name__ == "__main__":
    print_game_log()
