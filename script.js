document.addEventListener('DOMContentLoaded', function() {
    // ... (previous code for fetching and parsing the text file)

    function startQuiz(pairs) {
        // ... (previous setup code)

        function checkAnswer() {
            const selectedOption = option1Radio.checked ? 'option1' : 'option2';
            const isCorrect = selectedOption === correctAnswer;
            feedbackElement.textContent = isCorrect ? 'Correct!' : 'Incorrect!';

            if (isCorrect) {
                // Show team options when the answer is correct
                showTeamOptions();
            } else {
                // Generate a new question when the answer is incorrect
                setTimeout(generateQuestion, 2000); // 2 seconds delay
            }
        }

        function showTeamOptions() {
            // Hide question and answer options
            questionElement.style.display = 'none';
            option1Radio.style.display = 'none';
            label1.style.display = 'none';
            option2Radio.style.display = 'none';
            label2.style.display = 'none';
            submitButton.style.display = 'none';

            // Display team options (you can add this directly to your HTML if preferred)
            const teamContainer = document.createElement('div');
            const teams = ['Red', 'White', 'Blue', 'Crimson'];
            teams.forEach(team => {
                const teamButton = document.createElement('button');
                teamButton.textContent = `Log for ${team} team`;
                teamButton.onclick = function() {
                    logForTeam(team);
                    // Clean up team buttons
                    teamContainer.remove();
                    // Show question and answer options for the next question
                    questionElement.style.display = 'block';
                    option1Radio.style.display = 'block';
                    label1.style.display = 'block';
                    option2Radio.style.display = 'block';
                    label2.style.display = 'block';
                    submitButton.style.display = 'block';
                    generateQuestion();
                };
                teamContainer.appendChild(teamButton);
            });
            document.body.appendChild(teamContainer);
        }

        function logForTeam(team) {
            // Log the correct answer for the chosen team
            console.log(`Correct answer logged for the ${team} team.`);
            // TODO: Implement actual logging logic, e.g. sending to server or Firebase
        }

        generateQuestion(); // Initial question
    }
});
