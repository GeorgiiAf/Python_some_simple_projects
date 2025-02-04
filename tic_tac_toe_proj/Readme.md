# Tic-Tac-Toe Game

This is a graphical Tic-Tac-Toe game implemented in Python using the Tkinter library. The game supports both Player vs Player and Player vs Computer modes with two difficulty levels for the computer opponent.

## Features

- **Player vs Player**: Two human players can play against each other.
- **Player vs Computer**: A human player can play against the computer with two difficulty levels (easy and hard).
- **Score Tracking**: The game keeps track of the scores for both players and the number of ties.
- **Game Logging**: The results of each game are logged into a SQLite database.

## Requirements

- Python 3.x
- Tkinter
- NumPy
- SQLite3

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/tic-tac-toe.git
    cd tic-tac-toe
    ```

2. Install the required Python packages:
    ```sh
    pip install numpy
    ```

## Usage

1. Run the `main.py` file to start the game:
    ```sh
    python main.py
    ```

2. A window will appear asking you to choose the game mode:
    - **Player vs Player**: Both players are human.
    - **Player vs Easy Computer**: Play against the computer with easy difficulty.
    - **Player vs Hard Computer**: Play against the computer with hard difficulty.

3. Enter the names of the players and start the game.

## Game Controls

- Click on the grid to make a move.
- The game will automatically switch turns between the players.
- The game will display the winner or if it's a tie at the end of each game.
- Click on the canvas to play again after a game is over.
- Use the "Quit" button to exit the game.

## Code Structure

- `main.py`: The main entry point of the game. It handles the initial game mode selection and player name input.
- `tictactoe.py`: Contains the `TicTacToe` class which implements the game logic and UI.
- `database.py`: Contains functions to create the SQLite database and log game results.
- `config.py`: Contains configuration constants for the game (e.g., board size, colors).

## Algorithms

### Minimax Algorithm

The game uses the Minimax algorithm for the hard difficulty level of the computer opponent. The Minimax algorithm is a recursive algorithm used for decision-making and game theory. It provides an optimal move for the player assuming that the opponent also plays optimally.

- **Evaluation Function**: The evaluation function assigns a score to the board state. It returns +10 if the computer wins, -10 if the player wins, and 0 for a tie or ongoing game.
- **Minimax Function**: The Minimax function recursively evaluates all possible moves and returns the best score for the current player. It maximizes the score for the computer and minimizes it for the player.
- **Best Move Calculation**: The best move for the computer is determined by evaluating all possible moves using the Minimax function and selecting the move with the highest score.

### Easy Difficulty

For the easy difficulty level, the computer makes random moves. This is implemented by selecting a random empty cell on the board.

## Database

The game results are logged into a SQLite database named `game_log.db`. The database schema is as follows:

```sql
CREATE TABLE IF NOT EXISTS game_log (
    match_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_name TEXT,
    player2_name TEXT,
    start_time TEXT,
    end_time TEXT,
    result TEXT,
    player1_points INTEGER,
    player2_points INTEGER
);