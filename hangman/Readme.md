Overview

This is a graphical implementation of the classic Hangman game using Python's PySimpleGUI library. The player has to guess a hidden word by suggesting letters. The game ends when either the player guesses the word correctly or makes too many incorrect guesses (with a maximum of 6 wrong guesses allowed).
This game also tracks the number of games played and the number of wins.

Features

Graphical Interface: The game's UI is built using the PySimpleGUI library, making it simple and visually appealing.
Word Selection: A word is selected randomly from a words.txt file. Each time a new game starts, a new word is chosen.
Guessing Mechanism: Players can click on buttons corresponding to letters. The game updates the state of the word being guessed and displays the hangman scaffold as incorrect guesses accumulate.
Game Tracking: The game keeps track of the number of games played and the number of wins.
Game Over: The game ends either when the player guesses all the letters correctly or reaches the maximum number of incorrect guesses (6 wrong guesses).
Restart & New Game Options: The game provides options to restart the current round or start a new game.


Requirements

Python 3.x
PySimpleGUI library
A text file named words.txt containing a list of words, one word per line