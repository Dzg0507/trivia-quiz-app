# Phase 3: Component Reorganization
# This script reorganizes components into a feature-based structure

# Create backup directory
$backupDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced\refactor-backups\phase3"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup directory: $backupDir" -ForegroundColor Green

# Define the root directory
$rootDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced"

# Backup original files
Write-Host "Backing up original files..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\components\*" -Destination $backupDir -Recurse -Force
Write-Host "Backup completed." -ForegroundColor Green

# Step 1: Create the new directory structure
Write-Host "Creating new directory structure..." -ForegroundColor Yellow

# Create feature directories
$featureDirs = @(
    "src/features/auth/components",
    "src/features/auth/hooks",
    "src/features/auth/services",
    "src/features/quests/components",
    "src/features/quests/hooks",
    "src/features/quests/services",
    "src/features/quiz/components",
    "src/features/quiz/hooks",
    "src/features/quiz/services",
    "src/features/profile/components",
    "src/features/profile/hooks",
    "src/features/profile/services",
    "src/features/multiplayer/components",
    "src/features/multiplayer/hooks",
    "src/features/multiplayer/services",
    "src/features/planetary-system/components",
    "src/features/planetary-system/planets",
    "src/features/planetary-system/shaders",
    "src/features/planetary-system/ui",
    "src/features/planetary-system/store",
    "src/shared/components",
    "src/shared/hooks",
    "src/shared/utils",
    "src/shared/services"
)

foreach ($dir in $featureDirs) {
    New-Item -ItemType Directory -Path "$rootDir\$dir" -Force | Out-Null
}

Write-Host "Created new directory structure." -ForegroundColor Green

# Step 2: Move components to their respective feature directories
Write-Host "Moving components to feature directories..." -ForegroundColor Yellow

# Auth feature
Write-Host "Moving auth components..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\components\Login.tsx" -Destination "$rootDir\src\features\auth\components\" -Force
Write-Host "Moved Login.tsx to src/features/auth/components/" -ForegroundColor Cyan

# Quests feature
Write-Host "Moving quest components..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\components\QuestMenu.tsx" -Destination "$rootDir\src\features\quests\components\" -Force
Copy-Item -Path "$rootDir\src\components\Quests.tsx" -Destination "$rootDir\src\features\quests\components\" -Force
Copy-Item -Path "$rootDir\src\components\QuestWorld.tsx" -Destination "$rootDir\src\features\quests\components\" -Force
Write-Host "Moved quest components to src/features/quests/components/" -ForegroundColor Cyan

# Quiz feature
Write-Host "Moving quiz components..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\components\Quiz.tsx" -Destination "$rootDir\src\features\quiz\components\" -Force
Copy-Item -Path "$rootDir\src\components\QuizPage.tsx" -Destination "$rootDir\src\features\quiz\components\" -Force
Write-Host "Moved quiz components to src/features/quiz/components/" -ForegroundColor Cyan

# Profile feature
Write-Host "Moving profile components..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\components\Profile.tsx" -Destination "$rootDir\src\features\profile\components\" -Force
Copy-Item -Path "$rootDir\src\components\Achievements.tsx" -Destination "$rootDir\src\features\profile\components\" -Force
Copy-Item -Path "$rootDir\src\components\Leaderboard.tsx" -Destination "$rootDir\src\features\profile\components\" -Force
Write-Host "Moved profile components to src/features/profile/components/" -ForegroundColor Cyan

# Multiplayer feature
Write-Host "Moving multiplayer components..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\components\MultiplayerGame.tsx" -Destination "$rootDir\src\features\multiplayer\components\" -Force
Copy-Item -Path "$rootDir\src\components\MultiplayerLobby.tsx" -Destination "$rootDir\src\features\multiplayer\components\" -Force
Write-Host "Moved multiplayer components to src/features/multiplayer/components/" -ForegroundColor Cyan

# Planetary system feature
Write-Host "Moving planetary system components..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\planetary-system\PlanetaryApp.tsx" -Destination "$rootDir\src\features\planetary-system\components\" -Force
Copy-Item -Path "$rootDir\src\planetary-system\scene\Scene.tsx" -Destination "$rootDir\src\features\planetary-system\components\" -Force
Copy-Item -Path "$rootDir\src\planetary-system\scene\SolarSystem.tsx" -Destination "$rootDir\src\features\planetary-system\components\" -Force
Copy-Item -Path "$rootDir\src\planetary-system\scene\CameraAnimator.tsx" -Destination "$rootDir\src\features\planetary-system\components\" -Force
Copy-Item -Path "$rootDir\src\planetary-system\scene\planets\*" -Destination "$rootDir\src\features\planetary-system\planets\" -Force
Copy-Item -Path "$rootDir\src\planetary-system\shaders\*" -Destination "$rootDir\src\features\planetary-system\shaders\" -Recurse -Force
Copy-Item -Path "$rootDir\src\planetary-system\ui\*" -Destination "$rootDir\src\features\planetary-system\ui\" -Recurse -Force
Copy-Item -Path "$rootDir\src\planetary-system\States.ts" -Destination "$rootDir\src\features\planetary-system\store\" -Force
Write-Host "Moved planetary system components to src/features/planetary-system/" -ForegroundColor Cyan

# Shared components
Write-Host "Moving shared components..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\components\common\*" -Destination "$rootDir\src\shared\components\" -Force
Copy-Item -Path "$rootDir\src\components\Navbar.tsx" -Destination "$rootDir\src\shared\components\" -Force
Copy-Item -Path "$rootDir\src\components\StartScreen.tsx" -Destination "$rootDir\src\shared\components\" -Force
Write-Host "Moved shared components to src/shared/components/" -ForegroundColor Cyan

# Move hooks to their respective feature directories
Write-Host "Moving hooks to feature directories..." -ForegroundColor Yellow

# Auth hooks
Copy-Item -Path "$rootDir\src\hooks\useAuth.ts" -Destination "$rootDir\src\features\auth\hooks\" -Force
Write-Host "Moved useAuth.ts to src/features/auth/hooks/" -ForegroundColor Cyan

# Quest hooks
Copy-Item -Path "$rootDir\src\hooks\useQuestManager.tsx" -Destination "$rootDir\src\features\quests\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useQuestGenerator.tsx" -Destination "$rootDir\src\features\quests\hooks\" -Force
Write-Host "Moved quest hooks to src/features/quests/hooks/" -ForegroundColor Cyan

# Quiz hooks
Copy-Item -Path "$rootDir\src\hooks\useQuizFlow.tsx" -Destination "$rootDir\src\features\quiz\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useQuizProgress.ts" -Destination "$rootDir\src\features\quiz\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useStreakTracker.tsx" -Destination "$rootDir\src\features\quiz\hooks\" -Force
Write-Host "Moved quiz hooks to src/features/quiz/hooks/" -ForegroundColor Cyan

# Profile hooks
Copy-Item -Path "$rootDir\src\hooks\useUserFirestoreData.tsx" -Destination "$rootDir\src\features\profile\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useUserStats.tsx" -Destination "$rootDir\src\features\profile\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useAchievementManager.tsx" -Destination "$rootDir\src\features\profile\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useBadgeManager.tsx" -Destination "$rootDir\src\features\profile\hooks\" -Force
Write-Host "Moved profile hooks to src/features/profile/hooks/" -ForegroundColor Cyan

# Multiplayer hooks
Copy-Item -Path "$rootDir\src\hooks\useMultiplayerGame.ts" -Destination "$rootDir\src\features\multiplayer\hooks\" -Force
Write-Host "Moved useMultiplayerGame.ts to src/features/multiplayer/hooks/" -ForegroundColor Cyan

# Shared hooks
Copy-Item -Path "$rootDir\src\hooks\useLoading.ts" -Destination "$rootDir\src\shared\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useNotifications.ts" -Destination "$rootDir\src\shared\hooks\" -Force
Copy-Item -Path "$rootDir\src\hooks\useTheme.ts" -Destination "$rootDir\src\shared\hooks\" -Force
Write-Host "Moved shared hooks to src/shared/hooks/" -ForegroundColor Cyan

# Move services to their respective feature directories
Write-Host "Moving services to feature directories..." -ForegroundColor Yellow

# Auth services
$authServicePath = "$rootDir\src\services\authService.ts"
if (Test-Path $authServicePath) {
    Copy-Item -Path $authServicePath -Destination "$rootDir\src\features\auth\services\" -Force
    Write-Host "Moved authService.ts to src/features/auth/services/" -ForegroundColor Cyan
} else {
    # Copy userServices.ts instead (created in Phase 1)
    $userServicesPath = "$rootDir\src\services\userServices.ts"
    if (Test-Path $userServicesPath) {
        Copy-Item -Path $userServicesPath -Destination "$rootDir\src\features\auth\services\" -Force
        Write-Host "Moved userServices.ts to src/features/auth/services/" -ForegroundColor Cyan
    } else {
        Write-Host "Neither authService.ts nor userServices.ts found. Skipping auth service files." -ForegroundColor Yellow
    }
}

# Quiz services
$triviaApiPath = "$rootDir\src\services\triviaApi.ts"
if (Test-Path $triviaApiPath) {
    Copy-Item -Path $triviaApiPath -Destination "$rootDir\src\features\quiz\services\" -Force
    Write-Host "Moved triviaApi.ts to src/features/quiz/services/" -ForegroundColor Cyan
} else {
    Write-Host "triviaApi.ts not found. Skipping quiz service files." -ForegroundColor Yellow
}

# Shared services
$sharedServicesMoved = $false

$firestoreServicePath = "$rootDir\src\services\firestoreService.ts"
if (Test-Path $firestoreServicePath) {
    Copy-Item -Path $firestoreServicePath -Destination "$rootDir\src\shared\services\" -Force
    $sharedServicesMoved = $true
}

$localDataStoragePath = "$rootDir\src\services\localDataStorage.ts"
if (Test-Path $localDataStoragePath) {
    Copy-Item -Path $localDataStoragePath -Destination "$rootDir\src\shared\services\" -Force
    $sharedServicesMoved = $true
}

$notificationServicePath = "$rootDir\src\services\notificationService.ts"
if (Test-Path $notificationServicePath) {
    Copy-Item -Path $notificationServicePath -Destination "$rootDir\src\shared\services\" -Force
    $sharedServicesMoved = $true
}

$shareServicePath = "$rootDir\src\services\shareService.ts"
if (Test-Path $shareServicePath) {
    Copy-Item -Path $shareServicePath -Destination "$rootDir\src\shared\services\" -Force
    $sharedServicesMoved = $true
}

if ($sharedServicesMoved) {
    Write-Host "Moved shared services to src/shared/services/" -ForegroundColor Cyan
} else {
    Write-Host "No shared services found to move." -ForegroundColor Yellow
}

# Move utils to shared/utils
Write-Host "Moving utils to shared/utils..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\utils\*" -Destination "$rootDir\src\shared\utils\" -Force
Write-Host "Moved utils to src/shared/utils/" -ForegroundColor Cyan

# Step 3: Create index.ts files for each feature directory
Write-Host "Creating index.ts files for each feature directory..." -ForegroundColor Yellow

# Auth feature index.ts
$authServicePath = "$rootDir\src\features\auth\services\authService.ts"
$userServicesPath = "$rootDir\src\features\auth\services\userServices.ts"

if (Test-Path $authServicePath) {
    $authIndexContent = @"
// Auth feature exports
export * from './components/Login';
export * from './hooks/useAuth';
export * from './services/authService';
"@
} elseif (Test-Path $userServicesPath) {
    $authIndexContent = @"
// Auth feature exports
export * from './components/Login';
export * from './hooks/useAuth';
export * from './services/userServices';
"@
} else {
    $authIndexContent = @"
// Auth feature exports
export * from './components/Login';
export * from './hooks/useAuth';
"@
}

Set-Content -Path "$rootDir\src\features\auth\index.ts" -Value $authIndexContent

# Quests feature index.ts
$questsIndexContent = @"
// Quests feature exports
export * from './components/QuestMenu';
export * from './components/Quests';
export * from './components/QuestWorld';
export * from './hooks/useQuestManager';
export * from './hooks/useQuestGenerator';
"@
Set-Content -Path "$rootDir\src\features\quests\index.ts" -Value $questsIndexContent

# Quiz feature index.ts
$quizIndexContent = @"
// Quiz feature exports
export * from './components/Quiz';
export * from './components/QuizPage';
export * from './hooks/useQuizFlow';
export * from './hooks/useQuizProgress';
export * from './hooks/useStreakTracker';
export * from './services/triviaApi';
"@
Set-Content -Path "$rootDir\src\features\quiz\index.ts" -Value $quizIndexContent

# Profile feature index.ts
$profileIndexContent = @"
// Profile feature exports
export * from './components/Profile';
export * from './components/Achievements';
export * from './components/Leaderboard';
export * from './hooks/useUserFirestoreData';
export * from './hooks/useUserStats';
export * from './hooks/useAchievementManager';
export * from './hooks/useBadgeManager';
"@
Set-Content -Path "$rootDir\src\features\profile\index.ts" -Value $profileIndexContent

# Multiplayer feature index.ts
$multiplayerIndexContent = @"
// Multiplayer feature exports
export * from './components/MultiplayerGame';
export * from './components/MultiplayerLobby';
export * from './hooks/useMultiplayerGame';
"@
Set-Content -Path "$rootDir\src\features\multiplayer\index.ts" -Value $multiplayerIndexContent

# Planetary system feature index.ts
$planetarySystemIndexContent = @"
// Planetary system feature exports
export * from './components/PlanetaryApp';
export * from './components/Scene';
export * from './components/SolarSystem';
export * from './components/CameraAnimator';
export * from './store/States';
"@
Set-Content -Path "$rootDir\src\features\planetary-system\index.ts" -Value $planetarySystemIndexContent

# Shared components index.ts
$sharedComponentsIndexContent = @"
// Shared components exports
export * from './components/ErrorBoundary';
export * from './components/GlobalLoadingIndicator';
export * from './components/NotificationToast';
export * from './components/Settings';
export * from './components/Navbar';
export * from './components/StartScreen';
"@
Set-Content -Path "$rootDir\src\shared\index.ts" -Value $sharedComponentsIndexContent

Write-Host "Created index.ts files for each feature directory." -ForegroundColor Green

# Step 4: Create an example of updated imports
Write-Host "Creating an example of updated imports..." -ForegroundColor Yellow

$exampleImportsContent = @"
// Example of updated imports
// Before:
// import Login from '../components/Login';
// import { useAuth } from '../hooks/useAuth';
// import { authService } from '../services/authService';
// import { userServices } from '../services/userServices';

// After:
import { Login } from '../features/auth';
import { useAuth } from '../features/auth';
// If using authService:
import { authService } from '../features/auth';
// If using userServices (from Phase 1):
import { userServices } from '../features/auth';

// Before:
// import QuestMenu from '../components/QuestMenu';
// import { useQuestManager } from '../hooks/useQuestManager';

// After:
import { QuestMenu, useQuestManager } from '../features/quests';

// Before:
// import Quiz from '../components/Quiz';
// import { useQuizFlow } from '../hooks/useQuizFlow';
// import { fetchTriviaQuestions } from '../services/triviaApi';

// After:
import { Quiz, useQuizFlow, fetchTriviaQuestions } from '../features/quiz';

// Before:
// import Profile from '../components/Profile';
// import { useUserStats } from '../hooks/useUserStats';

// After:
import { Profile, useUserStats } from '../features/profile';

// Before:
// import MultiplayerGame from '../components/MultiplayerGame';
// import { useMultiplayerGame } from '../hooks/useMultiplayerGame';

// After:
import { MultiplayerGame, useMultiplayerGame } from '../features/multiplayer';

// Before:
// import PlanetaryApp from '../planetary-system/PlanetaryApp';
// import { useSolarSystemStore } from '../planetary-system/States';

// After:
import { PlanetaryApp, useSolarSystemStore } from '../features/planetary-system';

// Before:
// import ErrorBoundary from '../components/common/ErrorBoundary';
// import { useNotifications } from '../hooks/useNotifications';
// import { firestoreService } from '../services/firestoreService';

// After:
import { ErrorBoundary } from '../shared';
import { useNotifications } from '../shared/hooks/useNotifications';
import { firestoreService } from '../shared/services/firestoreService';
"@

New-Item -ItemType Directory -Path "$rootDir\src\examples" -Force | Out-Null
Set-Content -Path "$rootDir\src\examples\UpdatedImportsExample.tsx" -Value $exampleImportsContent

Write-Host "Created example of updated imports at src/examples/UpdatedImportsExample.tsx." -ForegroundColor Green

Write-Host "Phase 3 completed. Components have been reorganized into a feature-based structure." -ForegroundColor Green
Write-Host "The following feature directories have been created:" -ForegroundColor Cyan
Write-Host "- src/features/auth" -ForegroundColor Cyan
Write-Host "- src/features/quests" -ForegroundColor Cyan
Write-Host "- src/features/quiz" -ForegroundColor Cyan
Write-Host "- src/features/profile" -ForegroundColor Cyan
Write-Host "- src/features/multiplayer" -ForegroundColor Cyan
Write-Host "- src/features/planetary-system" -ForegroundColor Cyan
Write-Host "- src/shared" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test the application to ensure it still works with the new directory structure." -ForegroundColor Yellow
Write-Host "2. Update imports in components to use the new feature-based imports." -ForegroundColor Yellow
Write-Host "3. Once all imports are updated, you can remove the original component files." -ForegroundColor Yellow

Write-Host "`nTo rollback changes, restore files from: $backupDir" -ForegroundColor Magenta