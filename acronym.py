user_input = input('Enter a phrase: ')
s = ''.join(str(i[0]).upper() for i in user_input.split())
print(s)
