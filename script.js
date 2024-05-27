// Your Firebase configuration (we'll fetch this dynamically)
document.addEventListener('DOMContentLoaded', function() {
  // Fetch the configuration from Firebase Hosting's init.json
  fetch('/__/firebase/init.json').then(async response => {
    const firebaseConfig = await response.json();
    firebase.initializeApp(firebaseConfig);
  }).then(() => {
    const functions = firebase.functions();

    // Fetch scores
    async function fetchScores() {
      try {
        const response = await fetch('https://us-central1-collectivelearning-b4bb4.cloudfunctions.net/fetchScores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const scores = await response.json();
        displayScores(scores.data);
      } catch (error) {
        console.error('Fetch error: ', error);
      }
    }

    function displayScores(scores) {
      const scoreDisplay = document.getElementById('scoreDisplay');
      scoreDisplay.innerHTML = '';
      for (const [team, score] of Object.entries(scores)) {
        const scoreElement = document.createElement('p');
        scoreElement.textContent = `${team}: ${score}`;
        scoreDisplay.appendChild(scoreElement);
      }
    }

    // Update score
    async function updateScore(teamName, increment) {
      try {
        const response = await fetch('https://us-central1-collectivelearning-b4bb4.cloudfunctions.net/updateScore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ teamName, increment })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const result = await response.json();
        console.log('New score:', result.data);
        // Optionally, fetch scores again to update the display
        fetchScores();
      } catch (error) {
        console.error('Fetch error: ', error);
      }
    }

    // Fetch team names from button text
    const teamButtons = document.querySelectorAll('.team-button');
    const teamNames = Array.from(teamButtons).map(button => {
      // Assuming button text is formatted like 'Red Team', 'White Team', etc.
      return button.textContent.trim().split(' ')[0].toLowerCase(); // Converts 'Red Team' to 'red'
    });

    // Check and initialize Firestore data for each team
    teamNames.forEach((teamName) => {
      fetchScores();
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
      fetchScores();

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

      // Log team points
      function logForTeam(team) {
        updateScore(team, 1);
        // Clear the team options and feedback after transaction completes
        document.getElementById('team-options').style.display = 'none';
        feedbackElement.textContent = '';
      }

      document.querySelectorAll('.team-button').forEach(button => {
        button.addEventListener('click', function () {
          logForTeam(this.getAttribute('data-team'));
        });
      });

      generateQuestion(); // Initial question
    }
  }).catch(error => {
    console.error('Error initializing Firebase:', error);
  });
});
