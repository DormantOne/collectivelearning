document.addEventListener('DOMContentLoaded', function() {
    fetch('data.txt')
        .then(response => response.text())
        .then(data => {
            const pairs = data.split('\n..\n'); // Adjust based on your file's structure
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
        let correctAnswer;

        submitButton.addEventListener('click', checkAnswer);

        function generateQuestion() {
            const randomIndex = Math.floor(Math.random() * pairs.length);
            const pair = pairs[randomIndex].split('\n');
            questionElement.textContent = `Which is better for ${pair[0]}?`;
            label1.textContent = pair[0];
            label2.textContent = pair[1].replace(' [better]', '');
            correctAnswer = pair[1].includes('[better]') ? 'option2' : 'option1';
        }

        function checkAnswer() {
            const selectedOption = option1Radio.checked ? 'option1' : 'option2';
            feedbackElement.textContent = selectedOption === correctAnswer ? 'Correct!' : 'Incorrect!';
            generateQuestion(); // Generate next question
        }

        generateQuestion(); // Initial question
    }
});
