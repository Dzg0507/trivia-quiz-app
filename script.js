// Trivia Quiz Game Logic
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const shareBtn = document.getElementById('share-btn');
    let questions = [];
    let currentQuestionIndex = 0;
    let points = parseInt(localStorage.getItem('points')) || 0;

    // Fetch questions from Open Trivia DB
    async function fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
            const data = await response.json();
            questions = data.results.map(q => ({
                question: decodeHTML(q.question),
                answers: [...q.incorrect_answers, q.correct_answer]
                    .map(decodeHTML)
                    .sort(() => Math.random() - 0.5), // Shuffle answers
                correct_answer: decodeHTML(q.correct_answer)
            }));
            displayQuestion();
        } catch (error) {
            quizContainer.innerHTML = '<p>Error loading questions. Please try again.</p>';
        }
    }

    // Decode HTML entities (e.g., &quot; to ")
    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // Display current question
    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            quizContainer.innerHTML = '<p>Quiz complete! Check your points.</p>';
            resultsContainer.innerHTML = `<p>Total Points: ${points}</p>`;
            resultsContainer.classList.remove('d-none');
            shareBtn.classList.remove('d-none');
            return;
        }

        const q = questions[currentQuestionIndex];
        quizContainer.innerHTML = `
            <h3>${q.question}</h3>
            <form id="quiz-form">
                ${q.answers.map((answer, index) => `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="answer" id="answer${index}" value="${answer}">
                        <label class="form-check-label" for="answer${index}">${answer}</label>
                    </div>
                `).join('')}
                <button type="submit" class="btn btn-primary mt-3">Submit</button>
            </form>
        `;

        document.getElementById('quiz-form').addEventListener('submit', e => {
            e.preventDefault();
            checkAnswer();
        });
    }

    // Check answer and update points
    function checkAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            resultsContainer.innerHTML = '<p class="text-danger">Please select an answer!</p>';
            return;
        }

        const userAnswer = selectedAnswer.value;
        const correctAnswer = questions[currentQuestionIndex].correct_answer;
        if (userAnswer === correctAnswer) {
            points += 10;
            resultsContainer.innerHTML = '<p class="text-success">Correct! +10 points</p>';
        } else {
            points += 5;
            resultsContainer.innerHTML = `<p class="text-warning">Incorrect. Correct answer: ${correctAnswer}. +5 points</p>`;
        }
        localStorage.setItem('points', points);
        resultsContainer.classList.remove('d-none');
        currentQuestionIndex++;
        setTimeout(displayQuestion, 1000); // Move to next question after 1s
    }

    // Share score (basic placeholder)
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Trivia Score',
                text: `I scored ${points} points in Trivia Quiz! Try it:`,
                url: window.location.href
            }).catch(err => console.error('Share failed:', err));
        } else {
            alert(`Share your score: ${points} points!`);
        }
    });

    // Start the quiz
    fetchQuestions();
});