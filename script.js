document.addEventListener('DOMContentLoaded', function() {
    fetch('data.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n..\n'); // Adjust based on your file's structure
            startQuiz(lines);
        });

    function startQuiz(lines) {
        const questionElement = document.getElementById('question');
        const option1Button = document.getElementById('option1');
        const option2Button = document.getElementById('option2');
        const feedbackElement = document.getElementById('feedback');

        option1Button.addEventListener('click', () => checkAnswer(0));
        option2Button.addEventListener('click', () => checkAnswer(1));

        function generateQuestion() {
            const randomIndex = Math.floor(Math.random() * lines.length);
            const pair = lines[randomIndex].split('\n');
            questionElement.textContent = `What is the better term for ${pair[0]}?`;
            option1Button.textContent = pair[0];
            option2Button.textContent = pair[1].replace(' [better]', '');
            return pair[1].includes('[better]');
        }

        function checkAnswer(selectedOption) {
            const isCorrect = generateQuestion();
            feedbackElement.textContent = isCorrect === (selectedOption === 1) ? 'Correct!' : 'Incorrect!';
        }

        generateQuestion();
    }
});
