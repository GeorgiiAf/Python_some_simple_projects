# Hangman Game

## Overview

This is a graphical implementation of the classic Hangman game using Python's **PyQt** library. The player has to guess a hidden word by suggesting letters. The game ends when either the player guesses the word correctly or makes too many incorrect guesses (with a maximum of 6 wrong guesses allowed). The game also tracks the number of games played and the number of wins.

## Features

- **Graphical Interface**: The game's UI is built using the **PyQt** library, providing a simple graphical interface.
- **Word Selection**: A word is selected randomly from a `words.txt` file. Each time a new game starts, a new word is chosen.
- **Guessing Mechanism**: Players can click on buttons corresponding to letters. The game updates the state of the word being guessed and displays the hangman scaffold as incorrect guesses accumulate.
- **Game Over**: The game ends either when the player guesses all the letters correctly or reaches the maximum number of incorrect guesses (6 wrong guesses).
- **Restart & New Game Options**: The game provides options to restart the current round or start a new game.

## Classes

### `HangmanGame`
This is the main game class that handles the game logic and UI components.

- **Initialization**: Initializes the game by setting the window title, dimensions, and layout. It also loads a word from `words.txt` and starts the game state.
- **UI Setup**: Uses a `QGridLayout` for the letter buttons and a `QVBoxLayout` to organize the UI elements vertically. The hangman drawing is managed using the `HangmanDrawing` widget.
- **Guessing**: Handles letter guesses and updates the state of the word being guessed, while also tracking incorrect guesses.
- **Game Reset**: Resets the game state, including the word and letter buttons, and displays the updated word.

### `HangmanDrawing`
This class is responsible for drawing the hangman scaffold and the hangman figure as the player makes incorrect guesses.

- **Drawing**: The `paintEvent` method draws the scaffold and the hangman figure using the `QPainter` class, updating it based on the number of incorrect guesses.
- **Clear**: The `clear` method clears the hangman drawing when a new game starts or after a win/loss.

## Requirements

- Python 3.x
- PyQt6 library
- A text file named `words.txt` containing a list of words (one word per line)

## Installation

1. Install Python 3.x if not already installed.
2. Install the required libraries by running:

   ```bash
   pip install PyQt6
