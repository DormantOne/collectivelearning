// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJsu36rCNyJG-d5RwGyhEK4P5N3LkXpBM",
  authDomain: "collectivelearning-b4bb4.firebaseapp.com",
  projectId: "collectivelearning-b4bb4",
  storageBucket: "collectivelearning-b4bb4.appspot.com",
  messagingSenderId: "9465764517",
  appId: "1:9465764517:web:9d1cd2a4b8491a28cfcb4c",
  measurementId: "G-LFGTGKHTKJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a Firestore instance
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
   
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

function logForTeam(team) {
    console.log(`Point scored for the ${team} team.`);
    feedbackElement.textContent = `Scored for ${team} team!`;

    // Reference to the team's score in Firestore
    const teamScoreRef = db.collection('teams').doc(team);

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
    }).catch((error) => {
        console.log("Transaction failed: ", error);
    });

    document.getElementById('team-options').style.display = 'none';
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
