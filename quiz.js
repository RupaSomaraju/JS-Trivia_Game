document.addEventListener('DOMContentLoaded', function() {
    var questionElement = document.getElementById('question');
    var answerButtons = document.querySelectorAll('.btn');
    var nextButton = document.getElementById('next-btn');
    var lastButton1 = document.getElementById('end-game');
    var lastButton2 = document.getElementById('start-again');

    var currentQuestionIndex = 0;
    var questions = [];
    var currentPlayer = 1;
    var scores = {
        player1: 0,
        player2: 0
    };

    // Get player names from localStorage
    var player1Name = localStorage.getItem('player1');
    var player2Name = localStorage.getItem('player2');

    // Elements for displaying scores
    var player1ScoreElement = document.getElementById('player1Score');
    var player2ScoreElement = document.getElementById('player2Score');
    var finalScoresElement = document.getElementById('final-scores');

    //Display initial scores with player names
    player1ScoreElement.textContent = `${player1Name}: ${scores.player1}`;
    player2ScoreElement.textContent = `${player2Name}: ${scores.player2}`;

    // Fetch questions from the Trivia API
    function fetchQuestions() {
        var selectedCategory = localStorage.getItem('selectedCategory');
        var apiUrl = `https://the-trivia-api.com/api/questions?categories=${selectedCategory}`;
        console.log('API URL',apiUrl);
        fetch(apiUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format');
                }
                questions = data;
                displayQuestion();
            })
            .catch(function(error) {
                console.error('Failed to fetch questions:', error);
            });
    }

    // Display the current question and answers
    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            // All questions completed
            displayFinalScores();
            return;
        }

        var currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;

        var incorrectAnswers = currentQuestion.incorrectAnswers || [];
        var correctAnswer = currentQuestion.correctAnswer || '';

        var answers = incorrectAnswers.concat(correctAnswer).sort(function() {
            return Math.random() - 0.5;
        });

        answerButtons.forEach(function(button, index) {
            button.textContent = answers[index];
            button.style.display = 'block';
            button.onclick = function() {
                selectAnswer(button, correctAnswer);
            };
        });
    }

    // Handle answer selection
    function selectAnswer(button, correctAnswer) {
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
            if (currentPlayer === 1) {
                scores.player1++;
            } else {
                scores.player2++;
            }
            updateScores();
        } else {
            button.classList.add('incorrect');
        }
        answerButtons.forEach(function(btn) {
            btn.disabled = true;
        });
        nextButton.style.display = 'block';
    }

    // Update the displayed scores
    function updateScores() {
        player1ScoreElement.textContent = `${player1Name}: ${scores.player1}`;
        player2ScoreElement.textContent = `${player2Name}: ${scores.player2}`;
    }

    // Move to the next question
    nextButton.addEventListener('click', function() {
        currentQuestionIndex++;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        answerButtons.forEach(function(button) {
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;
        });
        nextButton.style.display = 'none';
        displayQuestion();
    });

    // Display final scores and declare the winner
    function displayFinalScores() {
        questionElement.textContent = 'Quiz complete! Final Scores:';
        answerButtons.forEach(function(button) {
            button.style.display = 'none';
        });
        nextButton.style.display = 'none';

        lastButton1.style.display = 'block';
        lastButton2.style.display = 'block';

        finalScoresElement.innerHTML = `
            <p>${player1Name}: ${scores.player1}</p>
            <p>${player2Name}: ${scores.player2}</p>
            <p>Winner: ${scores.player1 > scores.player2 ? player1Name : scores.player1 < scores.player2 ? player2Name : 'It\'s a tie!'}</p>
        `;
        finalScoresElement.style.display = 'block';
    }
    

    // Start the quiz
    fetchQuestions();
});
