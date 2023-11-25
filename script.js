document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAJsu36rCNyJG-d5RwGyhEK4P5N3LkXpBM",
        authDomain: "collectivelearning-b4bb4.firebaseapp.com",
        projectId: "collectivelearning-b4bb4",
        storageBucket: "collectivelearning-b4bb4.appspot.com",
        messagingSenderId: "9465764517",
        appId: "1:9465764517:web:9d1cd2a4b8491a28cfcb4c",
        measurementId: "G-LFGTGKHTKJ"
    };
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            const pairs = text.split('\n..\n').map(pair => pair.trim().split('\n').filter(line => line.trim() !== ''));
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
            const selectedValue = option1Radio.checked ? option1Radio.value : option2Radio.value;
            const isCorrect = selectedValue === 'correct';
            feedbackElement.textContent = isCorrect ? 'Correct!' : 'Incorrect!';

            if (isCorrect) {
                document.getElementById('team-options').style.display = 'block';
            } else {
                setTimeout(generateQuestion, 100);
            }
        }

        function logForTeam(team) {
            var teamRef = db.collection('teams').doc(team);

            teamRef.update({
                score: firebase.firestore.FieldValue.increment(1)
            }).then(() => {
                return teamRef.get();
            }).then(doc => {
                if (doc.exists) {
                    var teamScore = doc.data().score;
                    document.getElementById('team-score').textContent = `Team ${team} Score: ${teamScore}`;
                    updateTotalScore();
                }
            }).catch(error => {
                console.error("Error updating score:", error);
            });

            document.getElementById('team-options').style.display = 'none';
            setTimeout(() => {
                feedbackElement.textContent = '';
                generateQuestion();
            }, 2000);
        }

        document.querySelectorAll('.team-button').forEach(button => {
            button.addEventListener('click', function() {
                logForTeam(this.getAttribute('data-team'));
            });
        });

        function updateTotalScore() {
            db.collection('teams').get().then(querySnapshot => {
                var totalScore = 0;
                querySnapshot.forEach(doc => {
                    totalScore += doc.data().score;
                });
                document.getElementById('total-score').textContent = `Total Score: ${totalScore}`;
            }).catch(error => {
                console.error("Error retrieving total score:", error);
            });
        }

        generateQuestion();
    }
});
