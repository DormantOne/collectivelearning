document.addEventListener('DOMContentLoaded', function() {
    fetch('data.txt')
        .then(response => response.text())
        .then(data => {
            const pairs = data.split('\n..\n'); // Splitting based on your file's structure
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
            const [option1, option2] = pairs[randomIndex].split('\n');
            questionElement.textContent = `Which is better for '${option1}'?`;
            label1.textContent = option1;
            label2.textContent = option2.replace(' [better]', '');
            correctAnswer = option2.includes('[better]') ? 'option2' : 'option1';
            clearSelection();
        }

        function checkAnswer() {
            const selectedOption = option1Radio.checked ? 'option1' : 'option2';
            feedbackElement.textContent = selectedOption === correctAnswer ? 'Correct!' : 'Incorrect!';
            generateQuestion(); // Generate next question
        }

        function clearSelection() {
            option1Radio.checked = false;
            option2Radio.checked = false;
        }

        generateQuestion(); // Initial question
    }
});
