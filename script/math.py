from js import document

# def grade(event):
#     # Fetch the user's answers from the input fields
#     answer1 = document.getElementById('answer1').value
#     answer2 = document.getElementById('answer2').value

#     # Initialize the score
#     score = 0

#     # Grade the first answer (linear equation problem)
#     if answer1.strip() == "-18":
#         score += 1

#     # Grade the second answer (volleyball club problem)
#     if answer2.strip() == '500':
#         score += 1

#     # Display the result
#     result_text = f'점수: {score} / 2'
#     document.getElementById('result').innerText = result_text

# document.getElementById("submit-button").addEventListener("click", grade)

import random

number_input = Element("number_input")
result = Element("result")

def play_game(*args):
    user_guess = number_input.value
    machine_guess = random.randint(1, 50)

    if int(user_guess)==machine_guess:
        result.element.innerText = "You win!!"
    else:
        result.element.innerText = "You lose!!"
    number_input.clear() 