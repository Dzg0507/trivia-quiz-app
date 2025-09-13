// Trivia Quiz Game Logic
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const badgesContainer = document.getElementById('badges-container');
    const shareBtn = document.getElementById('share-btn');
    const themeSelect = document.getElementById('theme-select');
    let questions = [];
    let currentQuestionIndex = 0;
    let points = parseInt(localStorage.getItem('points')) || 0;
    let correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
    let badges = JSON.parse(localStorage.getItem('badges')) || [];
    let themes = JSON.parse(localStorage.getItem('themes')) || ['default'];
    let currentTheme = localStorage.getItem('currentTheme') || 'default';
    let lastPlayed = localStorage.getItem('lastPlayed');
    let streak = parseInt(localStorage.getItem('streak')) || 0;

    // Update points display
    function updatePointsDisplay() {
        document.getElementById('points').textContent = points;
    }

    // Check and update streak with bonuses and warning
    function updateStreak() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        if (lastPlayed) {
            const last = new Date(lastPlayed);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - last) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak += 1;
                // Apply streak bonuses
                if (streak === 5) {
                    points += 50;
                    resultsContainer.innerHTML += '<p class="text-success">Streak Bonus: +50 points for 5 days!</p>';
                } else if (streak === 10) {
                    points += 100;
                    resultsContainer.innerHTML += '<p class="text-success">Streak Bonus: +100 points for 10 days!</p>';
                } else if (streak === 15) {
                    points += 200;
                    resultsContainer.innerHTML += '<p class="text-success">Streak Bonus: +200 points for 15 days!</p>';
                }
            } else if (diffDays > 1) {
                if (streak > 1) {
                    resultsContainer.innerHTML += '<p class="text-warning">Streak reset to 1 day—play tomorrow to keep it going!</p>';
                }
                streak = 1; // Reset if gap > 1 day
            }
        } else {
            streak = 1; // First play
        }
        localStorage.setItem('lastPlayed', today);
        localStorage.setItem('streak', streak);
        localStorage.setItem('points', points); // Save bonus points
        checkStreakBadges();
        updatePointsDisplay();
    }

    // Badge definitions
    const badgeDefinitions = [
        { name: 'Beginner', correctNeeded: 10, description: 'Answer 10 questions correctly' },
        { name: 'Trivia Star', correctNeeded: 25, description: 'Answer 25 questions correctly' },
        { name: 'Quiz Master', correctNeeded: 50, description: 'Answer 50 questions correctly' }
    ];

    // Streak badge definitions
    const streakBadgeDefinitions = [
        { name: 'Streak Starter', streakNeeded: 3, description: 'Play 3 days in a row' },
        { name: 'Streak Legend', streakNeeded: 7, description: 'Play 7 days in a row' },
        { name: 'Streak Master', streakNeeded: 15, description: 'Play 15 days in a row' }
    ];

    // Check and award badges
    function checkBadges() {
        badgeDefinitions.forEach(badge => {
            if (correctAnswers >= badge.correctNeeded && !badges.includes(badge.name)) {
                badges.push(badge.name);
                localStorage.setItem('badges', JSON.stringify(badges));
                resultsContainer.innerHTML += `<p class="text-info">Unlocked badge: ${badge.name}!</p>`;
            }
        });
        displayBadges();
    }

    // Check and award streak badges
    function checkStreakBadges() {
        streakBadgeDefinitions.forEach(badge => {
            if (streak >= badge.streakNeeded && !badges.includes(badge.name)) {
                badges.push(badge.name);
                localStorage.setItem('badges', JSON.stringify(badges));
                resultsContainer.innerHTML += `<p class="text-info">Unlocked badge: ${badge.name}!</p>`;
            }
        });
        displayBadges();
    }

    // Check and unlock themes
    function checkThemes() {
        const themeDefinitions = [
            { name: 'default', pointsNeeded: 0, description: 'Default Theme' },
            { name: 'dark', pointsNeeded: 100, description: 'Dark Mode' },
            { name: 'retro', pointsNeeded: 250, description: 'Retro 80s Theme' }
        ];
        themeDefinitions.forEach(theme => {
            if (points >= theme.pointsNeeded && !themes.includes(theme.name)) {
                themes.push(theme.name);
                localStorage.setItem('themes', JSON.stringify(themes));
                resultsContainer.innerHTML += `<p class="text-info">Unlocked theme: ${theme.description}!</p>`;
            }
        });
        updateThemeSelector();
    }

    // Update theme selector dropdown
    function updateThemeSelector() {
        themeSelect.innerHTML = themes.map(theme => `
            <option value="${theme}" ${theme === currentTheme ? 'selected' : ''}>
                ${themeDefinitions.find(t => t.name === theme).description}
            </option>
        `).join('');
        document.body.className = currentTheme + '-theme';
    }

    // Display badges
    function displayBadges() {
        badgesContainer.classList.remove('d-none');
        badgesContainer.innerHTML = `
            <h4>Your Badges</h4>
            <div class="d-flex flex-wrap">
                ${badges.length ? badges.map(badge => `
                    <div class="badge-card m-2 p-2 border rounded">
                        <strong>${badge}</strong>
                        <p>${badgeDefinitions.find(b => b.name === badge)?.description || streakBadgeDefinitions.find(b => b.name === badge).description}</p>
                    </div>
                `).join('') : '<p>No badges yet. Keep playing!</p>'}
            </div>
            <p>Current Streak: ${streak} days</p>
        `;
    }

    // Fetch questions from Open Trivia DB
    async function fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
            const data = await response.json();
            questions = data.results.map(q => ({
                question: decodeHTML(q.question),
                answers: [...q.incorrect_answers, q.correct_answer]
                    .map(decodeHTML)
                    .sort(() => Math.random() - 0.5),
                correct_answer: decodeHTML(q.correct_answer)
            }));
            updateStreak(); // Check/update streak on load
            displayQuestion();
            displayBadges();
            updatePointsDisplay();
            updateThemeSelector();
        } catch (error) {
            quizContainer.innerHTML = '<p>Error loading questions. Please try again.</p>';
        }
    }

    // Decode HTML entities
    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // Display current question with optional ad
    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            quizContainer.innerHTML = '<p>Quiz complete! Check your points.</p>';
            const affiliateLinks = `
                <p>Love trivia? Check out these:</p>
                <ul>
                    <li><a href="https://www.amazon.com/dp/B08N5G1L5P?tag=youraffiliateid-20" target="_blank">Trivia Book 1</a></li>
                    <li><a href="https://www.amazon.com/dp/B09XJ7R2K8?tag=youraffiliateid-20" target="_blank">Trivia Game Set</a></li>
                </ul>
            `;
            resultsContainer.innerHTML = `<p>Total Points: ${points}</p>${affiliateLinks}`;
            resultsContainer.classList.remove('d-none');
            shareBtn.classList.remove('d-none');
            return;
        }

        if (currentQuestionIndex % 3 === 0 && currentQuestionIndex > 0) {
            document.getElementById('ad-container').innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block; text-align:center;"
                     data-ad-format="auto"
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            `;
        } else {
            document.getElementById('ad-container').innerHTML = '';
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
            correctAnswers += 1;
            resultsContainer.innerHTML = '<p class="text-success">Correct! +10 points</p>';
        } else {
            points += 5;
            resultsContainer.innerHTML = `<p class="text-warning">Incorrect. Correct answer: ${correctAnswer}. +5 points</p>`;
        }
        localStorage.setItem('points', points);
        localStorage.setItem('correctAnswers', correctAnswers);
        updatePointsDisplay();
        checkBadges();
        checkThemes();
        currentQuestionIndex++;
        setTimeout(displayQuestion, 1000);
    }

    // Share score and badges
    shareBtn.addEventListener('click', () => {
        const badgeText = badges.length ? `Unlocked badges: ${badges.join(', ')}` : 'No badges yet';
        if (navigator.share) {
            navigator.share({
                title: 'My Trivia Score',
                text: `I scored ${points} points in Trivia Quiz! ${badgeText}. Streak: ${streak} days. Try it:`,
                url: window.location.href
            }).catch(err => console.error('Share failed:', err));
        } else {
            alert(`Score: ${points} points! ${badgeText}. Streak: ${streak} days`);
        }
    });

    // Start the quiz
    fetchQuestions();
});
