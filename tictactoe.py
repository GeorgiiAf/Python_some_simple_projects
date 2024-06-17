from tkinter import *  # Импортируем все модули из tkinter для создания графического интерфейса
import numpy as np  # Импортируем библиотеку numpy для работы с массивами
import random  # Импортируем модуль random для случайного выбора хода компьютера

size_of_board = 600  # Размер игрового поля
symbol_size = (size_of_board / 3 - size_of_board / 8) / 2  # Размер символов (крестиков и ноликов)
symbol_thickness = 50  # Толщина линий символов
symbol_X_color = '#EE4035'  # Цвет крестиков
symbol_O_color = '#0492CF'  # Цвет ноликов
Green_color = '#7BC043'  # Цвет текста для сообщений

class Tic_Tac_Toe:
    def __init__(self, mode):
        self.mode = mode
        self.window = Tk()  # Создаем основное окно игры
        self.window.title('Tic-Tac-Toe')  # Устанавливаем заголовок окна
        self.canvas = Canvas(self.window, width=size_of_board, height=size_of_board)  # Создаем холст для рисования
        self.canvas.pack(padx=50, pady=50)  # Устанавливаем отступы для холста
        self.window.bind('<Button-1>', self.click)  # Привязываем функцию click к событию нажатия кнопки мыши

        self.X_score = 0  # Счет игрока X
        self.O_score = 0  # Счет игрока O
        self.tie_score = 0  # Счет ничьих

        self.first_turn_X = True  # Переменная, определяющая, кто ходит первым (True - игрок, False - компьютер)
        self.create_quit_button(self.window)  # Создаем кнопку "Выход"
        self.reset_game()  # Сбрасываем игру при инициализации

    def mainloop(self):
        self.window.mainloop()  # Запускаем основной цикл обработки событий

    def create_quit_button(self, root):
        quit_button = Button(root, text="Quit", command=self.quit_game, font=("Helvetica", 14))
        quit_button.pack(side=BOTTOM, pady=10)

    def quit_game(self):
        self.window.destroy()  # Закрываем основное окно Tkinter
        self.window.quit()

    def reset_game(self):
        self.canvas.delete("all")
        self.initialize_board()
        self.board_status = np.zeros(shape=(3, 3))
        self.gameover = False
        self.reset_board = False
        self.tie = False
        self.X_wins = False
        self.O_wins = False

        # Чередуем начального игрока при каждой новой игре
        self.first_turn_X = not self.first_turn_X

        self.player_X_turns = self.first_turn_X

        if self.mode == 'computer' and not self.first_turn_X:
            # Если компьютер начинает, сразу делаем его ход
            self.computer_move()

    def initialize_board(self):
        # Рисуем линии для игрового поля
        for i in range(2):
            self.canvas.create_line((i + 1) * size_of_board / 3, 0, (i + 1) * size_of_board / 3, size_of_board)
        for i in range(2):
            self.canvas.create_line(0, (i + 1) * size_of_board / 3, size_of_board, (i + 1) * size_of_board / 3)

    def play_again(self):
        self.reset_game()
        if self.mode == 'computer' and not self.first_turn_X:
            self.window.after(500, self.computer_move)  # Задержка для более реалистичного хода компьютера

    def draw_O(self, logical_position):
        logical_position = np.array(logical_position)  # Преобразуем логическую позицию в массив numpy
        grid_position = self.convert_logical_to_grid_position(logical_position)  # Преобразуем логическую позицию в координаты сетки
        self.canvas.create_oval(grid_position[0] - symbol_size, grid_position[1] - symbol_size,
                                grid_position[0] + symbol_size, grid_position[1] + symbol_size, width=symbol_thickness,
                                outline=symbol_O_color)
        self.canvas.update()  # Обновляем холст для отображения изменений

    def draw_X(self, logical_position):
        grid_position = self.convert_logical_to_grid_position(logical_position)  # Преобразуем логическую позицию в координаты сетки
        self.canvas.create_line(grid_position[0] - symbol_size, grid_position[1] - symbol_size,
                                grid_position[0] + symbol_size, grid_position[1] + symbol_size, width=symbol_thickness,
                                fill=symbol_X_color)
        self.canvas.create_line(grid_position[0] - symbol_size, grid_position[1] + symbol_size,
                                grid_position[0] + symbol_size, grid_position[1] - symbol_size, width=symbol_thickness,
                                fill=symbol_X_color)
        self.canvas.update()  # Обновляем холст для отображения изменений

    def display_gameover(self):
        if self.X_wins:
            self.X_score += 1
            text = 'Winner: Player 1 (X)'
            color = symbol_X_color
        elif self.O_wins:
            self.O_score += 1
            text = 'Winner: Player 2 (O)'
            color = symbol_O_color
        else:
            self.tie_score += 1
            text = 'Its a tie'
            color = 'gray'
        self.canvas.delete("all")  # Очищаем холст
        self.canvas.create_text(size_of_board / 2, size_of_board / 3, font="cmr 60 bold", fill=color, text=text)
        score_text = 'Scores \n'
        self.canvas.create_text(size_of_board / 2, 5 * size_of_board / 8, font="cmr 40 bold", fill=Green_color,
                                text=score_text)
        score_text = 'Player 1 (X) : ' + str(self.X_score) + '\n'
        score_text += 'Player 2 (O): ' + str(self.O_score) + '\n'
        score_text += 'Tie                    : ' + str(self.tie_score)
        self.canvas.create_text(size_of_board / 2, 3 * size_of_board / 4, font="cmr 30 bold", fill=Green_color,
                                text=score_text)
        self.reset_board = True
        score_text = 'Click to play again \n'
        self.canvas.create_text(size_of_board / 2, 15 * size_of_board / 16, font="cmr 20 bold", fill="gray",
                                text=score_text)

    def convert_logical_to_grid_position(self, logical_position):
        logical_position = np.array(logical_position, dtype=int)  # Преобразуем логическую позицию в целочисленный массив numpy
        return (size_of_board / 3) * logical_position + size_of_board / 6

    def convert_grid_to_logical_position(self, grid_position):
        grid_position = np.array(grid_position)  # Преобразуем позицию сетки в массив numpy
        return np.array(grid_position // (size_of_board / 3), dtype=int)

    def is_grid_occupied(self, logical_position):
        return self.board_status[logical_position[0]][logical_position[1]] != 0

    def is_winner(self, player):
        player = -1 if player == 'X' else 1
        for i in range(3):
            if self.board_status[i][0] == self.board_status[i][1] == self.board_status[i][2] == player:
                return True
            if self.board_status[0][i] == self.board_status[1][i] == self.board_status[2][i] == player:
                return True
        if self.board_status[0][0] == self.board_status[1][1] == self.board_status[2][2] == player:
            return True
        if self.board_status[0][2] == self.board_status[1][1] == self.board_status[2][0] == player:
            return True
        return False

    def is_tie(self):
        r, c = np.where(self.board_status == 0)  # Находим пустые клетки на доске с помощью numpy
        return len(r) == 0

    def is_gameover(self):
        self.X_wins = self.is_winner('X')
        if not self.X_wins:
            self.O_wins = self.is_winner('O')
        if not self.O_wins:
            self.tie = self.is_tie()
        return self.X_wins or self.O_wins or self.tie

    def click(self, event):
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
                    if self.is_gameover():
                        self.display_gameover()
                    elif self.mode == 'computer' and not self.player_X_turns:
                        self.computer_move()
            else:
                if self.mode == 'player' and not self.is_grid_occupied(logical_position):
                    self.draw_O(logical_position)
                    self.board_status[logical_position[0], logical_position[1]] = 1
                    self.player_X_turns = not self.player_X_turns
                    if self.is_gameover():
                        self.display_gameover()
        else:
            self.play_again()
            self.reset_board = False
            if self.mode == 'computer' and not self.player_X_turns:
                self.computer_move()

    def computer_move(self):
        if not self.gameover and not self.player_X_turns:
            empty_cells = list(zip(*np.where(self.board_status == 0)))  # Находим все пустые клетки на доске
            if empty_cells:
                logical_position = random.choice(empty_cells)  # Случайный выбор из пустых клеток
                self.draw_O(logical_position)
                self.board_status[logical_position[0], logical_position[1]] = 1
                self.player_X_turns = not self.player_X_turns
                if self.is_gameover():
                    self.display_gameover()

def main():
    root = Tk()  # Создаем окно выбора режима
    root.title("Choose Mode")  # Устанавливаем заголовок окна

    window_width = 400  # Ширина окна
    window_height = 300  # Высота окна
    screen_width = root.winfo_screenwidth()  # Ширина экрана
    screen_height = root.winfo_screenheight()  # Высота экрана
    position_top = int(screen_height / 2 - window_height / 2)  # Позиция окна по вертикали
    position_right = int(screen_width / 2 - window_width / 2)  # Позиция окна по горизонтали
    root.geometry(f'{window_width}x{window_height}+{position_right}+{position_top}')  # Устанавливаем позицию окна

    Label(root, text="Choose Game Mode", font=("Helvetica", 18)).pack(pady=20)  # Надпись в окне выбора режима
    Button(root, text="Player vs Player", font=("Helvetica", 14),
           command=lambda: start_game("player", root)).pack(pady=10)  # Кнопка для выбора режима "Игрок против Игрока"
    Button(root, text="Player vs Computer", font=("Helvetica", 14),
           command=lambda: start_game("computer", root)).pack(pady=10)  # Кнопка для выбора режима "Игрок против Компьютера"
    quit_button = Button(root, text="Quit", command=root.quit, font=("Helvetica", 14))
    quit_button.pack(side=BOTTOM, pady=10)  # Кнопка для выхода из игры
    root.mainloop()  # Запускаем основной цикл обработки событий для окна выбора режима

def start_game(mode, root):
    root.destroy()  # Закрываем окно выбора режима
    game_instance = Tic_Tac_Toe(mode)  # Создаем экземпляр игры с выбранным режимом
    game_instance.mainloop()  # Запускаем основной цикл обработки событий для игры

if __name__ == "__main__":
    main()  # Запускаем программу
