document.addEventListener('DOMContentLoaded', function() {
    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            // Split the text into pairs and remove empty lines
            const pairs = text.split('\n..\n').map(pair => {
                return pair.trim().split('\n').filter(line => line.trim() !== '');
            });
            console.log(pairs); // Debug: Log the pairs to inspect their format
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
            const randomIndex = Math.floor(Math.random() * pairs.length);
            const [firstOption, secondOption] = pairs[randomIndex];

            // Determine which option is marked as better
            const correctIndex = secondOption.includes('[better]') ? 1 : 0;
            const correctOption = correctIndex === 1 ? secondOption : firstOption;

            // Update the question and options
            questionElement.textContent = `Which is better?`;
            label1.textContent = firstOption.replace(' [better]', '');
            label2.textContent = secondOption.replace(' [better]', '');

            // Store the correct answer in the value attribute of the radio buttons
            option1Radio.value = correctIndex === 0 ? 'correct' : 'incorrect';
            option2Radio.value = correctIndex === 1 ? 'correct' : 'incorrect';

            // Reset any previous selection and feedback
            option1Radio.checked = false;
            option2Radio.checked = false;
            feedbackElement.textContent = '';

            console.log(`Correct answer: ${correctOption}`); // Debug: Log the correct answer
        }

        function checkAnswer() {
            const selectedValue = option1Radio.checked ? option1Radio.value : option2Radio.value;
            const isCorrect = selectedValue === 'correct';
            feedbackElement.textContent = isCorrect ? 'Correct!' : 'Incorrect!';

            if (isCorrect) {
                // Show team selection if the answer is correct
                document.getElementById('team-options').style.display = 'block';
            } else {
                // Proceed to next question if incorrect
                setTimeout(generateQuestion, 1);
            }
        }

        submitButton.addEventListener('click', checkAnswer);

        function logForTeam(team) {
            // Log the point for the selected team and show confirmation
            console.log(`Point scored for the ${team} team.`);
            feedbackElement.textContent = `Scored for ${team} team!`;

            // Hide team options
            document.getElementById('team-options').style.display = 'none';

            // Wait a bit, then clear feedback and generate a new question
            setTimeout(() => {
                feedbackElement.textContent = '';
                generateQuestion();
            }, 2000); // Adjust delay as needed
        }

        // Attach event listeners to team buttons
        document.querySelectorAll('.team-button').forEach(button => {
            button.addEventListener('click', function() {
                logForTeam(this.getAttribute('data-team'));
            });
        });

        generateQuestion(); // Initial question
    }
});
