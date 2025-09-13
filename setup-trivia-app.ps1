# PowerShell script to create trivia-quiz-app file structure

# Define project directory
$projectDir = "trivia-quiz-app"

# Create main directory
New-Item -ItemType Directory -Path $projectDir -Force

# Create assets subdirectories
New-Item -ItemType Directory -Path "$projectDir/assets/badges" -Force
New-Item -ItemType Directory -Path "$projectDir/assets/themes" -Force

# Create index.html with basic Bootstrap template
$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trivia Quiz Game</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Trivia Quiz Game</h1>
        <div id="quiz-container"></div>
        <div id="results-container" class="d-none"></div>
        <div id="badges-container" class="d-none"></div>
        <button id="share-btn" class="btn btn-primary d-none">Share Score</button>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
"@
Set-Content -Path "$projectDir/index.html" -Value $indexHtml

# Create styles.css with basic styling
$stylesCss = @"
/* Custom styles for Trivia Quiz Game */
body {
    font-family: Arial, sans-serif;
}
#quiz-container, #results-container, #badges-container {
    margin: 20px 0;
}
.badge-icon {
    width: 50px;
    height: 50px;
}
"@
Set-Content -Path "$projectDir/styles.css" -Value $stylesCss

# Create script.js with basic structure
$scriptJs = @"
// Trivia Quiz Game Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Trivia Quiz Game Loaded');
    // TODO: Add API calls, quiz logic, gamification
});
"@
Set-Content -Path "$projectDir/script.js" -Value $scriptJs

# Create README.md with project description
$readmeMd = @"
# Trivia Quiz Game

A simple, gamified trivia quiz web app built with HTML, CSS, and JavaScript. Uses the Open Trivia Database API for questions, with points, badges, and unlockable themes stored in LocalStorage. Hosted on GitHub Pages.

## Features
- Answer trivia questions and earn points
- Unlock badges for milestones (e.g., 10 correct answers)
- Unlockable themes (e.g., dark mode)
- Social sharing for scores
- Monetized with AdSense and affiliate links

## Setup
1. Clone repo
2. Open `index.html` in a browser or host on GitHub Pages
3. Start answering questions!

## License
MIT
"@
Set-Content -Path "$projectDir/README.md" -Value $readmeMd

Write-Host "File structure created successfully in $projectDir!"