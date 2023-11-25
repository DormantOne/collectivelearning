document.addEventListener('DOMContentLoaded', function() {
    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            const pairs = text.split('\n..\n').map(pair => pair.trim().split('\n').filter(line => line.trim() !== ''));
            startQuiz(pairs);
        });

    function startQuiz(pairs) {
        const questionElement = document.getElementById('question');
        const option1Radio = document.getElementById('option1');
        const option2Radio = document.getElementById('option2');
        const label1 = document.getElementById('label1');
        const label2 = document.getElementById('label2');
        const submitButton = document.getElementById('submit');
        const feedbackElement = document.getElementById('feedback');

        function generateQuestion() {
            submitButton.disabled = false; // Enable the submit button for the new question

            const randomIndex = Math.floor(Math.random() * pairs.length);
            const [firstOption, secondOption] = pairs[randomIndex];
            const correctIndex = secondOption.includes('[better]') ? 1 : 0;

            questionElement.textContent = `Which is better?`;
            label1.textContent = firstOption.replace(' [better]', '');
            label2.textContent = secondOption.replace(' [better]', '');
            option1Radio.value = correctIndex === 0 ? 'correct' : 'incorrect';
            option2Radio.value = correctIndex === 1 ? 'correct' : 'incorrect';
            option1Radio.checked = false;
            option2Radio.checked = false;
            feedbackElement.textContent = '';
        }

        function checkAnswer() {
            submitButton.disabled = true; // Disable the submit button after an answer is selected

            const selectedValue = option1Radio.checked ? option1Radio.value : option2Radio.value;
            const isCorrect = selectedValue === 'correct';
            feedbackElement.textContent = isCorrect ? 'Correct!' : 'Incorrect!';

            if (isCorrect) {
                document.getElementById('team-options').style.display = 'block';
            } else {
                setTimeout(generateQuestion, 1);
            }
        }

        submitButton.addEventListener('click', checkAnswer);

        function logForTeam(team) {
            console.log(`Point scored for the ${team} team.`);
            feedbackElement.textContent = `Scored for ${team} team!`;

            document.getElementById('team-options').style.display = 'none';

            // Immediately clear feedback and generate a new question without delay
            feedbackElement.textContent = '';
            generateQuestion();
        }

        document.querySelectorAll('.team-button').forEach(button => {
            button.addEventListener('click', function() {
                logForTeam(this.getAttribute('data-team'));
            });
        });

        generateQuestion(); // Initial question
    }
});
