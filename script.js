document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize Firebase with just the projectId
        firebase.initializeApp({
            projectId: "collectivelearning-b4bb4",
        });

        // Get a Firestore instance
        const db = firebase.firestore();

        // Get the Firebase Functions instance
        const functions = firebase.functions();

        // Call the getConfig function to fetch the Firebase config
        const getConfig = functions.httpsCallable('getConfig');
        const result = await getConfig();
        const firebaseConfig = result.data;

        // Re-initialize Firebase with the full config
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app(); // if already initialized, use that one
        }

        // Now you can use the full Firebase services
        const fullDb = firebase.firestore();

        // Fetch team names from button text
        const teamButtons = document.querySelectorAll('.team-button');
        const teamNames = Array.from(teamButtons).map(button => {
            // Assuming button text is formatted like 'Red Team', 'White Team', etc.
            return button.textContent.trim().split(' ')[0].toLowerCase(); // Converts 'Red Team' to 'red'
        });

        // Check and initialize Firestore data for each team
        teamNames.forEach((teamName) => {
            const teamScoreRef = db.collection('teams').doc(teamName);

            teamScoreRef.get().then((doc) => {
                if (!doc.exists || typeof doc.data().score === 'undefined') {
                    console.log(`No data found for ${teamName}, initializing score to 0.`);
                    return teamScoreRef.set({ score: 0 });
                } else {
                    console.log(`Data exists for ${teamName}, score is:`, doc.data().score);
                    // Additional logic if data exists
                }
            }).catch((error) => {
                console.error(`Error accessing Firestore for ${teamName}:`, error);
            });
        });

        // Assuming you have a 'data.txt' file with quiz data
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
            const tryAgainButton = document.createElement('button'); // Create a try again button
            tryAgainButton.textContent = 'Try Again';
            tryAgainButton.style.display = 'none'; // Initially hide the try again button
            tryAgainButton.addEventListener('click', generateQuestion);

            feedbackElement.insertAdjacentElement('afterend', tryAgainButton); // Add try again button after the feedback element

            function generateQuestion() {
                submitButton.disabled = false; 
                tryAgainButton.style.display = 'none'; // Hide the try again button

                const randomIndex = Math.floor(Math.random() * pairs.length);
                const [firstOption, secondOption] = pairs[randomIndex];
                const correctIndex = secondOption.includes('[better]') ? 1 : 0;

                // Randomize the order of options
                const isOption1First = Math.random() < 0.5; // Randomly decide the order of options

                questionElement.textContent = `Choose the better documentation:`;
                if (isOption1First) {
                    label1.textContent = firstOption.replace(' [better]', '');
                    label2.textContent = secondOption.replace(' [better]', '');
                    option1Radio.value = correctIndex === 0 ? 'correct' : 'incorrect';
                    option2Radio.value = correctIndex === 1 ? 'correct' : 'incorrect';
                } else {
                    label1.textContent = secondOption.replace(' [better]', '');
                    label2.textContent = firstOption.replace(' [better]', '');
                    option1Radio.value = correctIndex === 1 ? 'correct' : 'incorrect';
                    option2Radio.value = correctIndex === 0 ? 'correct' : 'incorrect';
                }
                option1Radio.checked = false;
                option2Radio.checked = false;
                feedbackElement.textContent = '';
            }

            // Call updateScores here to populate initial scores
            updateScores();

            function checkAnswer() {
                // Check if either of the options is selected
                if (!option1Radio.checked && !option2Radio.checked) {
                    feedbackElement.textContent = 'Please select an option before submitting.';
                    return; // Exit the function if no option is selected
                }
                submitButton.disabled = true;

                const selectedValue = option1Radio.checked ? option1Radio.value : option2Radio.value;
                const isCorrect = selectedValue === 'correct';
                if (isCorrect) {
                    feedbackElement.textContent = 'Correct!';
                    document.getElementById('team-options').style.display = 'block';
                } else {
                    feedbackElement.textContent = 'Incorrect!';
                    tryAgainButton.style.display = 'block'; // Show the try again button
                }
            }

            submitButton.addEventListener('click', checkAnswer);

            function updateScores() {
                let totalScore = 0;

                db.collection('teams').get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const teamName = doc.id; // 'red', 'white', etc.
                        const teamScore = doc.data().score || 0;
                        totalScore += teamScore;

                        // Update individual team score in HTML
                        document.querySelector(`#score-${teamName} span`).textContent = teamScore;
                    });

                    // Update total score in HTML
                    document.querySelector('#total-score span').textContent = totalScore;
                }).catch((error) => {
                    console.error("Error getting documents: ", error);
                });
            }

            function logForTeam(team) {
                // Convert team name to lowercase to match Firestore document IDs
                let teamLowerCase = team.toLowerCase();

                console.log(`Point scored for the ${teamLowerCase} team.`);
                feedbackElement.textContent = `Scored for ${teamLowerCase} team!`;

                const teamScoreRef = db.collection('teams').doc(teamLowerCase);

                db.runTransaction((transaction) => {
                    return transaction.get(teamScoreRef).then((teamScoreDoc) => {
                        if (!teamScoreDoc.exists) {
                            throw "Document does not exist!"; // Ideally, handle this scenario more gracefully
                        }

                        // Calculate the new score
                        let newScore = (teamScoreDoc.data().score || 0) + 1;

                        // Set the new score
                        transaction.update(teamScoreRef, { score: newScore });

                        return newScore;
                    });
                }).then((newScore) => {
                    console.log(`New score for the ${team} team is ${newScore}`);
                    // Call updateScores and generateQuestion here after transaction completes
                    updateScores();
                    generateQuestion();
                }).catch((error) => {
                    console.log("Transaction failed: ", error);
                });

                // Clear the team options and feedback after transaction completes
                document.getElementById('team-options').style.display = 'none';
                feedbackElement.textContent = '';
            }

            document.querySelectorAll('.team-button').forEach(button => {
                button.addEventListener('click', function() {
                    logForTeam(this.getAttribute('data-team'));
                });
            });

            generateQuestion(); // Initial question
        }
    } catch (error) {
        console.error("Error fetching Firebase configuration:", error);
    }
});
