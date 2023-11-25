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
            feedbackElement.textContent = selectedValue === 'correct' ? 'Correct!' : 'Incorrect!';
            // Wait a bit before generating a new question
            setTimeout(generateQuestion, 2000);
        }

        submitButton.addEventListener('click', checkAnswer);

        generateQuestion(); // Initial question
    }
});
