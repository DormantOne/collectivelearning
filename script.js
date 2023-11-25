document.addEventListener('DOMContentLoaded', function() {
    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            // Split the text file content into pairs
            const pairs = text.split('\n..\n').map(pair => {
                const terms = pair.trim().split('\n').filter(Boolean);
                return terms.map(term => term.replace(' [better]', ''));
            });
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
        let correctIndex;

        submitButton.addEventListener('click', checkAnswer);

        function generateQuestion() {
            // Randomly select a pair and assign the terms to the radio buttons
            const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
            correctIndex = randomPair.findIndex(term => term.includes('*')); // Assumes the correct term has an asterisk
            const options = randomPair.map(term => term.replace('*', '')); // Removes the asterisk for display
            
            questionElement.textContent = "Which is the better term?";
            label1.textContent = options[0];
            option1Radio.value = options[0];
            label2.textContent = options[1];
            option2Radio.value = options[1];

            // Clear previous selections and feedback
            option1Radio.checked = false;
            option2Radio.checked = false;
            feedbackElement.textContent = '';
        }

        function checkAnswer() {
            // Determine which radio button was checked and provide feedback
            const selectedOptionIndex = option1Radio.checked ? 0 : 1;
            feedbackElement.textContent = selectedOptionIndex === correctIndex ? 'Correct!' : 'Incorrect!';
            // Wait a moment before generating a new question
            setTimeout(generateQuestion, 1000);
        }

        // Generate the initial question
        generateQuestion();
    }
});
