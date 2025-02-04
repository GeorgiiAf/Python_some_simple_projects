import tkinter as tk
from tictactoe import TicTacToe
from database import create_database


def create_centered_window(root, window_width, window_height):
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    position_top = int(screen_height / 2 - window_height / 2)
    position_right = int(screen_width / 2 - window_width / 2)
    root.geometry(f'{window_width}x{window_height}+{position_right}+{position_top}')

# create_button function is used to create a button with the given text, command, font, and padding.
def create_button(parent, text, command, font=("Helvetica", 14), pady=10):
    button = tk.Button(parent, text=text, command=command, font=font)
    button.pack(pady=pady)
    return button

# enter_names function is used to create a new window where the players can enter their names.
def enter_names(mode, difficulty, root):
    root.withdraw()  # withdraw the main window
    name_window = tk.Toplevel(root)  #  create a new window
    name_window.title("Enter Names")

    window_width, window_height = 400, 300
    create_centered_window(name_window, window_width, window_height)

    tk.Label(name_window, text="Enter Player 1 Name:", font=("Helvetica", 14)).pack(pady=10)
    player1_entry = tk.Entry(name_window, font=("Helvetica", 14))
    player1_entry.pack(pady=10)

    player2_entry = None
    if mode == "player":
        tk.Label(name_window, text="Enter Player 2 Name:", font=("Helvetica", 14)).pack(pady=10)
        player2_entry = tk.Entry(name_window, font=("Helvetica", 14))
        player2_entry.pack(pady=10)

    def start_game():
        player1_name = player1_entry.get()
        player2_name = player2_entry.get() if mode == "player" else None
        name_window.destroy()
        game_instance = TicTacToe(mode, difficulty, player1_name, player2_name)
        game_instance.mainloop()

    create_button(name_window, "Start Game", start_game, pady=20)
    create_button(name_window, "Back", lambda: back_to_mode_selection(name_window, root))


def back_to_mode_selection(name_window, root):
    name_window.destroy()
    root.deiconify()


def main():
    create_database()
    root = tk.Tk()
    root.title("Choose Mode")
    window_width, window_height = 400, 300
    create_centered_window(root, window_width, window_height)
    tk.Label(root, text="Choose Game Mode", font=("Helvetica", 18)).pack(pady=20)

    create_button(root, "Player vs Player", lambda: enter_names("player", "easy", root))
    create_button(root, "Player vs Easy Computer", lambda: enter_names("computer", "easy", root))
    create_button(root, "Player vs Hard Computer", lambda: enter_names("computer", "hard", root))

    quit_button = create_button(root, "Quit", root.quit, pady=10)
    quit_button.pack(side=tk.BOTTOM)

    root.mainloop()

if __name__ == "__main__":
    main()
