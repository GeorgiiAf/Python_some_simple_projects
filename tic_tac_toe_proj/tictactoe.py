import tkinter as tk , numpy as np
from tkinter import *
import random, sys, sqlite3
from datetime import datetime


# Constants for sizes and colors

size_of_board = 600
symbol_size = (size_of_board / 3 - size_of_board / 8) / 2
symbol_thickness = 50
symbol_X_color = '#EE4035'
symbol_O_color = '#0492CF'
Green_color = '#7BC043'



def create_database():      # Function to create the database if it does not exist
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
    conn.close()

class Tic_Tac_Toe:      # Class to implement the game
      # Initialization Functions:

    def __init__(self, mode, difficulty, player1_name, player2_name):
        self.mode = mode
        self.difficulty = difficulty
        self.player1_name = player1_name
        self.player2_name = player2_name if mode == "player" else "Mr. G (PC)"
        self.start_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Setting up the game window using tkinter

        self.window = tk.Tk()
        self.window.title('Tic-Tac-Toe')
        #  creating canvas for drawing
        self.canvas = tk.Canvas(self.window, width=size_of_board, height=size_of_board)
        self.canvas.pack(padx=50, pady=50)
        self.current_turn_label = tk.Label(self.window, text=f"Turn: {self.player1_name}", font=("Helvetica", 14))
        self.current_turn_label.pack()
        # Input from user in form of clicks

        self.window.bind('<Button-1>', self.click)

        # Initializing scores

        self.X_score = 0
        self.O_score = 0
        self.tie_score = 0
        self.first_turn_X = True
        self.create_quit_button(self.window)
        self.reset_game()

    def mainloop(self):
        self.window.mainloop()  #         Start the main loop for the game.

    def create_quit_button(self, root):
        quit_button = tk.Button(root, text="Quit", command=self.quit_game, font=("Helvetica", 14))
        quit_button.pack(side=BOTTOM, pady=10)

    def quit_game(self):
        self.window.destroy()
        self.window.quit()
        sys.exit()


    # Logging the game result in the database
    # id , time ,winner / tie , points
    def log_result(self, player1_name, player2_name, start_time, end_time, result, player1_points, player2_points):
        conn = sqlite3.connect('game_log.db')
        c = conn.cursor()
        c.execute('''INSERT INTO game_log (player1_name, player2_name, start_time, end_time, result, player1_points, player2_points)
                     VALUES (?, ?, ?, ?, ?, ?, ?)''',
                  (player1_name, player2_name, start_time, end_time, result, player1_points, player2_points))
        conn.commit()
        game_id = c.lastrowid
        conn.close()
        print(f"Game ID: {game_id}")



    # Reset the game to the initial state
    def reset_game(self):
        self.start_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.canvas.delete("all")  # Clear the canvas
        self.initialize_board()
        self.board_status = np.zeros(shape=(3, 3))
        self.gameover = False
        self.reset_board = False
        self.tie = False
        self.X_wins = False
        self.O_wins = False
        self.first_turn_X = not self.first_turn_X
        self.player_X_turns = self.first_turn_X
        self.current_turn_label.config(text=f"Turn: {self.player1_name if self.first_turn_X else self.player2_name}")
        if self.mode == 'computer' and not self.first_turn_X:
            self.computer_move()

    def initialize_board(self):     # Initialize the game board by drawing grid lines
        for i in range(2):
            self.canvas.create_line((i + 1) * size_of_board / 3, 0, (i + 1) * size_of_board / 3, size_of_board)
        for i in range(2):
            self.canvas.create_line(0, (i + 1) * size_of_board / 3, size_of_board, (i + 1) * size_of_board / 3)

    def play_again(self):         # Start a new game after reset
        self.reset_game()
        if self.mode == 'computer' and not self.first_turn_X:
            self.window.after(500, self.computer_move)

    def draw_O(self, logical_position):
        # logical_position = grid value on the board
        # grid_position = actual pixel values of the center of the grid

        logical_position = np.array(logical_position)
        grid_position = self.convert_logical_to_grid_position(logical_position)
        self.canvas.create_oval(grid_position[0] - symbol_size, grid_position[1] - symbol_size,
                                grid_position[0] + symbol_size, grid_position[1] + symbol_size, width=symbol_thickness,
                                outline=symbol_O_color)
        self.canvas.update()

    def draw_X(self, logical_position):
        grid_position = self.convert_logical_to_grid_position(logical_position)
        self.canvas.create_line(grid_position[0] - symbol_size, grid_position[1] - symbol_size,
                                grid_position[0] + symbol_size, grid_position[1] + symbol_size, width=symbol_thickness,
                                fill=symbol_X_color)
        self.canvas.create_line(grid_position[0] - symbol_size, grid_position[1] + symbol_size,
                                grid_position[0] + symbol_size, grid_position[1] - symbol_size, width=symbol_thickness,
                                fill=symbol_X_color)
        self.canvas.update()

    def display_gameover(self):     # Display game over results and log them in the database
        end_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        if self.X_wins:
            self.X_score += 1
            text = f'Winner: {self.player1_name} (X)'
            player1_points = 1
            player2_points = 0
            color = symbol_X_color
        elif self.O_wins:
            self.O_score += 1
            text = f'Winner: {self.player2_name} (O)'
            player1_points = 0
            player2_points = 1
            color = symbol_O_color
        else:
            self.tie_score += 1
            text = 'It\'s a tie'
            player1_points = 0
            player2_points = 0
            color = 'gray'
        self.log_result(self.player1_name, self.player2_name, self.start_time, end_time, text, player1_points, player2_points)
        self.canvas.delete("all")
        self.canvas.create_text(size_of_board / 2, size_of_board / 3, font="cmr 60 bold", fill=color, text=text)
        score_text = 'Scores \n'
        self.canvas.create_text(size_of_board / 2, 5 * size_of_board / 8, font="cmr 40 bold", fill=Green_color,
                                text=score_text)
        score_text = f'{self.player1_name} (X) : ' + str(self.X_score) + '\n'
        score_text += f'{self.player2_name} (O): ' + str(self.O_score) + '\n'
        score_text += 'Tie                    : ' + str(self.tie_score)
        self.canvas.create_text(size_of_board / 2, 3 * size_of_board / 4, font="cmr 30 bold", fill=Green_color,
                                text=score_text)
        self.reset_board = True
        score_text = 'Click to play again \n'
        self.canvas.create_text(size_of_board / 2, 15 * size_of_board / 16, font="cmr 20 bold", fill="gray",
                                text=score_text)

    # Logical Functions:
    # The modules required to carry out game logic

    def convert_logical_to_grid_position(self, logical_position):
        # Convert logical position to pixel grid position
        logical_position = np.array(logical_position, dtype=int)
        return (size_of_board / 3) * logical_position + size_of_board / 6

    def convert_grid_to_logical_position(self, grid_position):
        # Convert pixel grid position to logical position

        grid_position = np.array(grid_position)
        return np.array(grid_position // (size_of_board / 3), dtype=int)

    def is_grid_occupied(self, logical_position):
        # Check if the grid position is occupied

        return self.board_status[logical_position[0]][logical_position[1]] != 0

    def is_winner(self, player):
        player = -1 if player == 'X' else 1
        #         Check if the given player has won the game.


        # Three in a row
        for i in range(3):
            if self.board_status[i][0] == self.board_status[i][1] == self.board_status[i][2] == player:
                return True
            if self.board_status[0][i] == self.board_status[1][i] == self.board_status[2][i] == player:
                return True

        # Diagonals

        if self.board_status[0][0] == self.board_status[1][1] == self.board_status[2][2] == player:
            return True
        if self.board_status[0][2] == self.board_status[1][1] == self.board_status[2][0] == player:
            return True
        return False

    def is_tie(self):
        r, c = np.where(self.board_status == 0)
        return len(r) == 0

    def is_gameover(self):
        self.X_wins = self.is_winner('X')
        if not self.X_wins:
            self.O_wins = self.is_winner('O')
        if not self.O_wins:
            self.tie = self.is_tie()
        return self.X_wins or self.O_wins or self.tie

    def click(self, event):

        #         Handle click events on the game canvas.

        if self.gameover:
            return
        if event.widget != self.canvas:
            return
        grid_position = [event.x, event.y]
        logical_position = self.convert_grid_to_logical_position(grid_position)
        if not self.reset_board:
            if self.player_X_turns:
                if not self.is_grid_occupied(logical_position):
                    self.draw_X(logical_position)
                    self.board_status[logical_position[0], logical_position[1]] = -1
                    self.player_X_turns = not self.player_X_turns
                    self.current_turn_label.config(text=f"Turn: {self.player2_name}")
                    if self.is_gameover():
                        self.display_gameover()
                    elif self.mode == 'computer' and not self.player_X_turns:
                        self.computer_move()
            else:
                if self.mode == 'player' and not self.is_grid_occupied(logical_position):
                    self.draw_O(logical_position)
                    self.board_status[logical_position[0], logical_position[1]] = 1
                    self.player_X_turns = not self.player_X_turns
                    self.current_turn_label.config(text=f"Turn: {self.player1_name}")
                    if self.is_gameover():
                        self.display_gameover()
        else:
            self.play_again()
            self.reset_board = False
            if self.mode == 'computer' and not self.player_X_turns:
                self.computer_move()

    def computer_move(self):
        #            Perform the computer's move.

        if not self.gameover and not self.player_X_turns:
            if self.difficulty == 'easy':
                empty_cells = list(zip(*np.where(self.board_status == 0)))
                if empty_cells:
                    logical_position = random.choice(empty_cells)
            else:
                logical_position = self.find_best_move(self.board_status)

            self.draw_O(logical_position)
            self.board_status[logical_position[0], logical_position[1]] = 1
            self.player_X_turns = not self.player_X_turns
            self.current_turn_label.config(text=f"Turn: {self.player1_name}")
            if self.is_gameover():
                self.display_gameover()

    def evaluate(self, board):

  #  Evaluate the current state of the board.
  #  Parameters:
   # - board: 2D list representing the current state of the game board.

    #Returns:
    #- Integer: Evaluation score based on the current state.
     # - 10: If 'O' (computer) wins.
     # - -10: If 'X' (player) wins.
     # - 0: If the game is not won by any player yet.


        # Check rows for a win
        for row in range(3):
            if board[row][0] == board[row][1] == board[row][2]:
                if board[row][0] == 1:  # 'O' (computer) wins
                    return 10
                elif board[row][0] == -1:  # 'X' (player) wins
                    return -10

        # Check columns for a win
        for col in range(3):
            if board[0][col] == board[1][col] == board[2][col]:
                if board[0][col] == 1:  # 'O' (computer) wins
                    return 10
                elif board[0][col] == -1:  # 'X' (player) wins
                    return -10

        # Check diagonals for a win
        if board[0][0] == board[1][1] == board[2][2]:
            if board[0][0] == 1:  # 'O' (computer) wins
                return 10
            elif board[0][0] == -1:  # 'X' (player) wins
                return -10
        if board[0][2] == board[1][1] == board[2][0]:
            if board[0][2] == 1:  # 'O' (computer) wins
                return 10
            elif board[0][2] == -1:  # 'X' (player) wins
                return -10

        return 0  # No winner yet

    def minimax(self, board, depth, is_maximizing):
        """
    Implement the minimax algorithm for AI move calculation.
    Parameters:
    - board: 2D list representing the current state of the game board.
    - depth: Integer representing the depth of recursion.
    - is_maximizing: Boolean indicating if it's the maximizing player's turn (True)
    or minimizing player's turn (False).
    Returns:
    - Integer: Best score for the current board state.
        """

        #          Implement the minimax algorithm for AI move calculation.

        score = self.evaluate(board)  # Evaluate the current board state

        # Return score based on evaluation
        if score == 10:
            return score - depth
        elif score == -10:
            return score + depth
        elif not any(0 in row for row in board):  # No empty cells left
            return 0

        if is_maximizing:
            best = -1000
            for i in range(3):
                for j in range(3):
                    if board[i][j] == 0:  # Check if cell is empty
                        board[i][j] = 1  # Make a move for the maximizing player (AI)
                        best = max(best, self.minimax(board, depth + 1,
                                                      not is_maximizing))  # Recursively evaluate and maximize
                        board[i][j] = 0  # Undo the move
            return best
        else:
            best = 1000
            for i in range(3):
                for j in range(3):
                    if board[i][j] == 0:  # Check if cell is empty
                        board[i][j] = -1  # Make a move for the minimizing player (opponent)
                        best = min(best, self.minimax(board, depth + 1,
                                                      not is_maximizing))  # Recursively evaluate and minimize
                        board[i][j] = 0  # Undo the move
            return best

    def find_best_move(self, board):
        #     Find the best move for the computer using minimax algorithm.

        #    Parameters:
        #    - board: 2D list representing the current state of the game board.

        #     Returns:
        #      Tuple (row, col) representing the best move coordinates.

        best_val = -1000
        best_move = (-1, -1)

        for i in range(3):
            for j in range(3):
                if board[i][j] == 0:
                    board[i][j] = 1
                    move_val = self.minimax(board, 0, False)
                    board[i][j] = 0
                    if move_val > best_val:
                        best_move = (i, j)
                        best_val = move_val
        return best_move




def main():
    create_database()    # Initialize the database
    root = Tk()
    root.title("Choose Mode")
    window_width = 400
    window_height = 300
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    position_top = int(screen_height / 2 - window_height / 2)
    position_right = int(screen_width / 2 - window_width / 2)
    root.geometry(f'{window_width}x{window_height}+{position_right}+{position_top}')
    Label(root, text="Choose Game Mode", font=("Helvetica", 18)).pack(pady=20)
    Button(root, text="Player vs Player", font=("Helvetica", 14), command=lambda: enter_names("player", "easy", root)).pack(pady=10)
    Button(root, text="Player vs Easy Computer", font=("Helvetica", 14), command=lambda: enter_names("computer", "easy", root)).pack(pady=10)
    Button(root, text="Player vs Hard Computer", font=("Helvetica", 14), command=lambda: enter_names("computer", "hard", root)).pack(pady=10)
    quit_button = Button(root, text="Quit", command=root.quit, font=("Helvetica", 14))
    quit_button.pack(side=BOTTOM, pady=10)
    root.mainloop()


def enter_names(mode, difficulty, root):

    #       Function to get player names and start the game.
    root.withdraw()
    name_window = Toplevel(root)
    name_window.title("Enter Names")
    window_width = 400
    window_height = 300
    screen_width = name_window.winfo_screenwidth()
    screen_height = name_window.winfo_screenheight()
    position_top = int(screen_height / 2 - window_height / 2)
    position_right = int(screen_width / 2 - window_width / 2)
    name_window.geometry(f'{window_width}x{window_height}+{position_right}+{position_top}')
    Label(name_window, text="Enter Player 1 Name:", font=("Helvetica", 14)).pack(pady=10)
    player1_entry = Entry(name_window, font=("Helvetica", 14))
    player1_entry.pack(pady=10)
    if mode == "player":
        Label(name_window, text="Enter Player 2 Name:", font=("Helvetica", 14)).pack(pady=10)
        player2_entry = Entry(name_window, font=("Helvetica", 14))
        player2_entry.pack(pady=10)
    else:
        player2_entry = None

    def start_game():
        player1_name = player1_entry.get()
        player2_name = player2_entry.get() if mode == "player" else None
        name_window.destroy()
        game_instance = Tic_Tac_Toe(mode, difficulty, player1_name, player2_name)
        game_instance.mainloop()

    tk.Button(name_window, text="Start Game", command=start_game, font=("Helvetica", 14)).pack(pady=20)
    tk.Button(name_window, text="Back", command=lambda: back_to_mode_selection(name_window, root),
              font=("Helvetica", 14)).pack(pady=10)


def back_to_mode_selection(name_window, root):
    name_window.destroy()
    root.deiconify()

if __name__ == "__main__":
    main()
