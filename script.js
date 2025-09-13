document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const badgesContainer = document.getElementById('badges-container');
    const shareBtn = document.getElementById('share-btn');
    const themeSelect = document.getElementById('theme-select');
    const currentUser = localStorage.getItem('currentUser');
    let questions = [];
    let currentQuestionIndex = 0;
    let points = parseInt(localStorage.getItem(`points_${currentUser}`)) || 0;
    let correctAnswers = parseInt(localStorage.getItem(`correctAnswers_${currentUser}`)) || 0;
    let badges = JSON.parse(localStorage.getItem(`badges_${currentUser}`)) || [];
    let themes = JSON.parse(localStorage.getItem(`themes_${currentUser}`)) || ['default'];
    let currentTheme = localStorage.getItem(`currentTheme_${currentUser}`) || 'default';
    let lastPlayed = localStorage.getItem(`lastPlayed_${currentUser}`);
    let streak = parseInt(localStorage.getItem(`streak_${currentUser}`)) || 0;

    function updatePointsDisplay() {
        document.getElementById('points').textContent = points;
    }

    function updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        if (lastPlayed) {
            const last = new Date(lastPlayed);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - last) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak += 1;
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
                streak = 1;
            }
        } else {
            streak = 1;
        }
        localStorage.setItem(`lastPlayed_${currentUser}`, today);
        localStorage.setItem(`streak_${currentUser}`, streak);
        localStorage.setItem(`points_${currentUser}`, points);
        checkStreakBadges();
        updatePointsDisplay();
    }

    const badgeDefinitions = [
        { name: 'Beginner', correctNeeded: 10, description: 'Answer 10 questions correctly' },
        { name: 'Trivia Star', correctNeeded: 25, description: 'Answer 25 questions correctly' },
        { name: 'Quiz Master', correctNeeded: 50, description: 'Answer 50 questions correctly' }
    ];

    const challengeBadgeDefinitions = [
        { name: 'Daily Challenger', correctNeeded: 5, period: 'daily', description: 'Complete 5 correct answers daily' },
        { name: 'Weekly Warrior', correctNeeded: 20, period: 'weekly', description: 'Complete 20 correct answers weekly' },
        { name: 'Monthly Master', correctNeeded: 50, period: 'monthly', description: 'Complete 50 correct answers monthly' }
    ];

    const streakBadgeDefinitions = [
        { name: 'Streak Starter', streakNeeded: 3, description: 'Play 3 days in a row' },
        { name: 'Streak Legend', streakNeeded: 7, description: 'Play 7 days in a row' },
        { name: 'Streak Master', streakNeeded: 15, description: 'Play 15 days in a row' }
    ];

    function checkBadges() {
        badgeDefinitions.forEach(badge => {
            if (correctAnswers >= badge.correctNeeded && !badges.includes(badge.name)) {
                badges.push(badge.name);
                localStorage.setItem(`badges_${currentUser}`, JSON.stringify(badges));
                resultsContainer.innerHTML += `<p class="text-info animate__animated animate__tada">Unlocked badge: ${badge.name}!</p>`;
                document.getElementById('achievementSound').play().catch(() => {});
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        });
        displayBadges();
    }

    function checkChallengeBadges() {
        const today = new Date().toISOString().split('T')[0];
        const thisWeek = new Date().toLocaleDateString('en-US', { week: 'long' });
        const thisMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const dailyStats = JSON.parse(localStorage.getItem(`dailyStats_${currentUser}_${today}`)) || { correct: 0 };
        const weeklyStats = JSON.parse(localStorage.getItem(`weeklyStats_${currentUser}_${thisWeek}`)) || { correct: 0 };
        const monthlyStats = JSON.parse(localStorage.getItem(`monthlyStats_${currentUser}_${thisMonth}`)) || { correct: 0 };

        challengeBadgeDefinitions.forEach(badge => {
            const stats = badge.period === 'daily' ? dailyStats : badge.period === 'weekly' ? weeklyStats : monthlyStats;
            if (stats.correct >= badge.correctNeeded && !badges.includes(badge.name)) {
                badges.push(badge.name);
                localStorage.setItem(`badges_${currentUser}`, JSON.stringify(badges));
                resultsContainer.innerHTML += `<p class="text-info animate__animated animate__tada">Unlocked badge: ${badge.name}!</p>`;
                document.getElementById('achievementSound').play().catch(() => {});
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        });
        localStorage.setItem(`dailyStats_${currentUser}_${today}`, JSON.stringify(dailyStats));
        localStorage.setItem(`weeklyStats_${currentUser}_${thisWeek}`, JSON.stringify(weeklyStats));
        localStorage.setItem(`monthlyStats_${currentUser}_${thisMonth}`, JSON.stringify(monthlyStats));
        displayBadges();
    }

    function checkStreakBadges() {
        streakBadgeDefinitions.forEach(badge => {
            if (streak >= badge.streakNeeded && !badges.includes(badge.name)) {
                badges.push(badge.name);
                localStorage.setItem(`badges_${currentUser}`, JSON.stringify(badges));
                resultsContainer.innerHTML += `<p class="text-info animate__animated animate__tada">Unlocked badge: ${badge.name}!</p>`;
                document.getElementById('achievementSound').play().catch(() => {});
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        });
        displayBadges();
    }

    function checkThemes() {
        const themeDefinitions = [
            { name: 'default', pointsNeeded: 0, description: 'Default Theme' },
            { name: 'dark', pointsNeeded: 100, description: 'Dark Mode' },
            { name: 'retro', pointsNeeded: 250, description: 'Retro 80s Theme' },
            { name: 'neon', pointsNeeded: 500, description: 'Neon Glow Theme' }
        ];
        themeDefinitions.forEach(theme => {
            if (points >= theme.pointsNeeded && !themes.includes(theme.name)) {
                themes.push(theme.name);
                localStorage.setItem(`themes_${currentUser}`, JSON.stringify(themes));
                resultsContainer.innerHTML += `<p class="text-info animate__animated animate__tada">Unlocked theme: ${theme.description}!</p>`;
            }
        });
        updateThemeSelector();
    }

    function updateThemeSelector() {
        themeSelect.innerHTML = themes.map(theme => `
            <option value="${theme}" ${theme === currentTheme ? 'selected' : ''}>
                ${themeDefinitions.find(t => t.name === theme).description}
            </option>
        `).join('');
        document.body.className = `${currentTheme}-theme bg-gradient`;
    }

    function displayBadges() {
        badgesContainer.classList.remove('d-none');
        badgesContainer.innerHTML = `
            <h4 class="badge-title text-info">Your Badges</h4>
            <div class="d-flex flex-wrap badge-container">
                ${badges.length ? badges.map(badge => `
                    <div class="badge-card m-2 p-2 border rounded animate__animated animate__fadeIn">
                        <strong class="text-warning">${badge}</strong>
                        <p class="text-white">${badgeDefinitions.find(b => b.name === badge)?.description || challengeBadgeDefinitions.find(b => b.name === badge)?.description || streakBadgeDefinitions.find(b => b.name === badge).description}</p>
                    </div>
                `).join('') : '<p class="text-white">No badges yet. Keep playing!</p>'}
            </div>
            <p class="text-white">Current Streak: <span class="streak-text text-warning">${streak}</span> days</p>
        `;
    }

    async function fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            questions = data.results.map(q => ({
                question: decodeHTML(q.question),
                answers: [...q.incorrect_answers, q.correct_answer].map(decodeHTML).sort(() => Math.random() - 0.5),
                correct_answer: decodeHTML(q.correct_answer)
            }));
            if (questions.length === 0) throw new Error('No questions received');
            updateStats();
            displayQuestion();
        } catch (error) {
            quizContainer.innerHTML = `<p class="text-danger">Error loading questions: ${error.message}. Retrying in 5 seconds...</p>`;
            setTimeout(fetchQuestions, 5000);
        }
    }

    function updateStats() {
        const today = new Date().toISOString().split('T')[0];
        const thisWeek = new Date().toLocaleDateString('en-US', { week: 'long' });
        const thisMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        let dailyStats = JSON.parse(localStorage.getItem(`dailyStats_${currentUser}_${today}`)) || { correct: 0 };
        let weeklyStats = JSON.parse(localStorage.getItem(`weeklyStats_${currentUser}_${thisWeek}`)) || { correct: 0 };
        let monthlyStats = JSON.parse(localStorage.getItem(`monthlyStats_${currentUser}_${thisMonth}`)) || { correct: 0 };
        dailyStats.correct += 1;
        weeklyStats.correct += 1;
        monthlyStats.correct += 1;
        localStorage.setItem(`dailyStats_${currentUser}_${today}`, JSON.stringify(dailyStats));
        localStorage.setItem(`weeklyStats_${currentUser}_${thisWeek}`, JSON.stringify(weeklyStats));
        localStorage.setItem(`monthlyStats_${currentUser}_${thisMonth}`, JSON.stringify(monthlyStats));
        checkChallengeBadges();
    }

    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            quizContainer.innerHTML = '<p class="text-white animate__animated animate__bounceIn">Quest complete! Check your points.</p>';
            const affiliateLinks = `
                <p class="text-white">Love trivia? Check out these:</p>
                <ul class="text-white">
                    <li><a href="https://www.amazon.com/dp/B08N5G1L5P?tag=youraffiliateid-20" target="_blank" class="text-info">Trivia Book 1</a></li>
                    <li><a href="https://www.amazon.com/dp/B09XJ7R2K8?tag=youraffiliateid-20" target="_blank" class="text-info">Trivia Game Set</a></li>
                </ul>
            `;
            resultsContainer.innerHTML = `<p class="text-white">Total Points: <span class="points-text text-warning">${points}</span></p>${affiliateLinks}`;
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
            <h3 class="question-title text-white animate__animated animate__zoomIn">${q.question}</h3>
            <form id="quiz-form">
                ${q.answers.map((answer, index) => `
                    <div class="form-check answer-option animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.2}s">
                        <input class="form-check-input" type="radio" name="answer" id="answer${index}" value="${answer}">
                        <label class="form-check-label text-white" for="answer${index}">${answer}</label>
                    </div>
                `).join('')}
                <button type="submit" class="btn btn-primary mt-3 animate__animated animate__pulse">Submit</button>
            </form>
        `;

        document.getElementById('quiz-form').addEventListener('submit', (e) => {
            e.preventDefault();
            checkAnswer();
        });
    }

    function checkAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            resultsContainer.innerHTML = '<p class="text-danger animate__animated animate__shakeX">Please select an answer!</p>';
            return;
        }

        const userAnswer = selectedAnswer.value;
        const correctAnswer = questions[currentQuestionIndex].correct_answer;
        if (userAnswer === correctAnswer) {
            points += 10;
            correctAnswers += 1;
            resultsContainer.innerHTML = '<p class="text-success animate__animated animate__tada">Correct! +10 points</p>';
        } else {
            points += 5;
            resultsContainer.innerHTML = `<p class="text-warning animate__animated animate__wobble">Incorrect. Correct answer: ${correctAnswer}. +5 points</p>`;
        }
        localStorage.setItem(`points_${currentUser}`, points);
        localStorage.setItem(`correctAnswers_${currentUser}`, correctAnswers);
        updateStats();
        updatePointsDisplay();
        checkBadges();
        checkThemes();
        currentQuestionIndex++;
        setTimeout(displayQuestion, 1000);
    }

    shareBtn.addEventListener('click', () => {
        const badgeText = badges.length ? `Unlocked badges: ${badges.join(', ')}` : 'No badges yet';
        if (navigator.share) {
            navigator.share({
                title: 'My Trivia Score',
                text: `I scored ${points} points in Trivia Quest! ${badgeText}. Streak: ${streak} days. Try it:`,
                url: window.location.href
            }).catch(err => console.error('Share failed:', err));
        } else {
            alert(`Score: ${points} points! ${badgeText}. Streak: ${streak} days`);
        }
    });

    updateStreak();
    fetchQuestions();
});