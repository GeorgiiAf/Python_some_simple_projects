import sys
import random
from string import ascii_uppercase
from PyQt6.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QVBoxLayout, QGridLayout, QMessageBox
from PyQt6.QtGui import QIcon,QGuiApplication
from HangmanDrawing import HangmanDrawing

class HangmanGame(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Hangman на PyQt")
        self.setGeometry(0, 20, 650, 720)
        self.center_window()
        self.setWindowIcon(QIcon("hangman.jpg"))
        self.drawing_widget = HangmanDrawing()

        self.word_list = self.load_words("words.txt")
        self.target_word = random.choice(self.word_list)
        self.guessed_letters = set()
        self.wrong_guesses = 0
        self.max_wrong_guesses = 6

        self.init_ui()

    def center_window(self):
        screen = QGuiApplication.primaryScreen()
        screen_geometry = screen.geometry()
        window_geometry = self.geometry()
        x = (screen_geometry.width() - window_geometry.width()) // 2
        y = (screen_geometry.height() - window_geometry.height()) // 2 - 50
        self.move(x, y)

    @staticmethod
    def load_words(filename):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                words = [line.strip().upper() for line in f if line.strip()]
            return  words
        except FileNotFoundError:
            print("File not found , will be used default word list")
            return ["PYTHON", "HANGMAN", "DEVELOPER"]


    def init_ui(self):
        self.word_label = QLabel(self.get_display_word(), self)
        self.word_label.setStyleSheet("font-size: 40px;")

        # Сетка кнопок с буквами
        self.letter_buttons = {}
        grid_layout = QGridLayout()
        for i, letter in enumerate(ascii_uppercase):
            button = QPushButton(letter, self)
            button.clicked.connect(lambda _, l=letter: self.guess_letter(l))
            self.letter_buttons[letter] = button
            grid_layout.addWidget(button, i // 6, i % 6)

        # Кнопка для новой игры
        self.restart_button = QPushButton("New game", self)
        self.restart_button.setStyleSheet(
            "font-size: 20px; background-color: #4CAF50; color: white; border-radius: 10px;")
        self.restart_button.clicked.connect(self.new_game)

        # Размещение виджетов
        layout = QVBoxLayout()
        layout.addWidget(self.drawing_widget)
        layout.addWidget(self.word_label)
        layout.addLayout(grid_layout)
        layout.addWidget(self.restart_button)
        self.setLayout(layout)

    def get_display_word(self):
        return " ".join([letter if letter in self.guessed_letters else "_" for letter in self.target_word])

    def guess_letter(self, letter):
        if letter in self.guessed_letters:
            return

        self.guessed_letters.add(letter)
        self.letter_buttons[letter].setDisabled(True)

        if letter not in self.target_word:
            self.wrong_guesses += 1
            self.drawing_widget.update_wrong_guesses(self.wrong_guesses)

        self.word_label.setText(self.get_display_word())

        if set(self.target_word) <= self.guessed_letters:
            QMessageBox.information(self, "Victory!", "You won")
            self.new_game()
        elif self.wrong_guesses >= self.max_wrong_guesses:
            QMessageBox.critical(self, "You Lost", f"The correct word is : {self.target_word}")
            self.new_game()

    def new_game(self):
        self.target_word = random.choice(self.word_list)
        self.guessed_letters = set()
        self.wrong_guesses = 0
        self.word_label.setText(self.get_display_word())

        for button in self.letter_buttons.values():
            button.setDisabled(False)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    game = HangmanGame()
    game.show()
    sys.exit(app.exec())
