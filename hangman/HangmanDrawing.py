from PyQt6.QtWidgets import QWidget
from PyQt6.QtGui import QPainter, QPen
from PyQt6.QtCore import Qt

class HangmanDrawing(QWidget):
    def __init__(self):
        super().__init__()
        self.wrong_guesses = 0

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        pen = QPen(Qt.GlobalColor.black, 4)
        painter.setPen(pen)

        painter.drawLine(50, 250, 150, 250)  # Основание
        painter.drawLine(100, 50, 100, 250)  # Столб
        painter.drawLine(100, 50, 180, 50)  # Поперечина
        painter.drawLine(180, 50, 180, 80)  # Веревка

        if self.wrong_guesses > 0:
            painter.drawEllipse(160, 80, 40, 40)  # Голова
        if self.wrong_guesses > 1:
            painter.drawLine(180, 120, 180, 180)  # Тело
        if self.wrong_guesses > 2:
            painter.drawLine(180, 140, 160, 120)  # Левая рука
        if self.wrong_guesses > 3:
            painter.drawLine(180, 140, 200, 120)  # Правая рука
        if self.wrong_guesses > 4:
            painter.drawLine(180, 180, 200, 220)  # Левая нога
        if self.wrong_guesses > 5:
            painter.drawLine(180, 180, 200, 220)  # Правая нога

    def update_wrong_guesses(self, wrong_guesses):
        self.wrong_guesses = wrong_guesses
        self.update()

    def clear(self):
         self.update()