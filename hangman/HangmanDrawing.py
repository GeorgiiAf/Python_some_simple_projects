from PyQt6.QtWidgets import QWidget
from PyQt6.QtGui import QPainter, QPen
from PyQt6.QtCore import Qt
#  # class for drawing hangman
class HangmanDrawing(QWidget):
    def __init__(self):
        super().__init__()
        self.wrong_guesses = 0

    def paintEvent(self, event):        # create a drawing
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        pen = QPen(Qt.GlobalColor.black, 4)
        painter.setPen(pen)

        painter.drawLine(50, 250, 150, 250)  # Base
        painter.drawLine(100, 50, 100, 250)  # column
        painter.drawLine(100, 50, 180, 50)  # crossbar
        painter.drawLine(180, 50, 180, 80)  # rope

        if self.wrong_guesses > 0:
            painter.drawEllipse(160, 80, 40, 40)  # head
        if self.wrong_guesses > 1:
            painter.drawLine(180, 120, 180, 180)  # body
        if self.wrong_guesses > 2:
            painter.drawLine(180, 140, 160, 120)  # left arm
        if self.wrong_guesses > 3:
            painter.drawLine(180, 140, 200, 120)  # right arm
        if self.wrong_guesses > 4:
            painter.drawLine(180, 180, 200, 220)  # left leg
        if self.wrong_guesses > 5:
            painter.drawLine(180, 180, 200, 220)  # right leg
# update the drawing based on the number of wrong guesses
    def update_wrong_guesses(self, wrong_guesses):
        self.wrong_guesses = wrong_guesses
        self.update()
# clear the drawing
    def clear(self):
        self.wrong_guesses = 0
        self.update()