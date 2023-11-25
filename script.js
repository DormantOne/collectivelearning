
// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

// Now, you can use 'db' to interact with Firestore


document.addEventListener('DOMContentLoaded', function() {
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
