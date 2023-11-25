document.addEventListener('DOMContentLoaded', function() {
    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            const pairs = text.split('\n..\n').map(pair => pair.trim().split('\n'));
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

        function generateQuestion() {
            // Randomly select a pair and identify the correct answer
            const randomIndex = Math.floor(Math.random() * pairs.length);
            const [incorrect, correct] = pairs[randomIndex];
            correctAnswer = correct.includes('[better]') ? 'option2' : 'option1';

            // Update the question text and labels
            questionElement.textContent = `Which is better?`;
            label1.textContent = incorrect;
            option1Radio.value = incorrect;
            label2.textContent = correct.replace(' [better]', '');
            option2Radio.value = label2.textContent;

            // Clear previous selections and feedback
            option1Radio.checked = false;
            option2Radio.checked = false;
            feedbackElement.textContent = '';
        }

        function checkAnswer() {
            // Check if the selected answer is correct
            const selectedOption = option1Radio.checked ? 'option1' : 'option2';
            feedbackElement.textContent = selectedOption === correctAnswer ? 'Correct!' : 'Incorrect!';
        }

        // Attach the checkAnswer function to the submit button
        submitButton.addEventListener('click', checkAnswer);

        // Generate the first question
        generateQuestion();
    }
});
