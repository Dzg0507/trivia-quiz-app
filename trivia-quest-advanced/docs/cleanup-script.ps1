# Project Cleanup Script
# This script will help consolidate your project structure

# Create a backup first
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force
Copy-Item -Path "src" -Destination $backupDir -Recurse

# Create directories if they don't exist
New-Item -ItemType Directory -Path "src/components/auth" -Force
New-Item -ItemType Directory -Path "src/components/quiz" -Force
New-Item -ItemType Directory -Path "src/components/profile" -Force
New-Item -ItemType Directory -Path "src/components/quests" -Force
New-Item -ItemType Directory -Path "src/components/multiplayer" -Force
New-Item -ItemType Directory -Path "src/components/common" -Force
New-Item -ItemType Directory -Path "src/components/planetary-system" -Force

# Move files from features to components
# Auth
if (Test-Path "src/features/auth/components") {
    Copy-Item -Path "src/features/auth/components/*" -Destination "src/components/auth/" -Recurse -Force
}

# Quiz
if (Test-Path "src/features/quiz/components") {
    Copy-Item -Path "src/features/quiz/components/*" -Destination "src/components/quiz/" -Recurse -Force
}

# Profile
if (Test-Path "src/features/profile/components") {
    Copy-Item -Path "src/features/profile/components/*" -Destination "src/components/profile/" -Recurse -Force
}

# Quests
if (Test-Path "src/features/quests/components") {
    Copy-Item -Path "src/features/quests/components/*" -Destination "src/components/quests/" -Recurse -Force
}

# Multiplayer
if (Test-Path "src/features/multiplayer/components") {
    Copy-Item -Path "src/features/multiplayer/components/*" -Destination "src/components/multiplayer/" -Recurse -Force
}

# Planetary System
if (Test-Path "src/planetary-system") {
    Copy-Item -Path "src/planetary-system/*" -Destination "src/components/planetary-system/" -Recurse -Force
}

# Move shared components
if (Test-Path "src/shared/components") {
    Copy-Item -Path "src/shared/components/*" -Destination "src/components/common/" -Recurse -Force
}

# Move hooks
if (Test-Path "src/features/auth/hooks") {
    Copy-Item -Path "src/features/auth/hooks/*" -Destination "src/hooks/" -Recurse -Force
}

if (Test-Path "src/features/quiz/hooks") {
    Copy-Item -Path "src/features/quiz/hooks/*" -Destination "src/hooks/" -Recurse -Force
}

if (Test-Path "src/features/profile/hooks") {
    Copy-Item -Path "src/features/profile/hooks/*" -Destination "src/hooks/" -Recurse -Force
}

if (Test-Path "src/features/quests/hooks") {
    Copy-Item -Path "src/features/quests/hooks/*" -Destination "src/hooks/" -Recurse -Force
}

if (Test-Path "src/features/multiplayer/hooks") {
    Copy-Item -Path "src/features/multiplayer/hooks/*" -Destination "src/hooks/" -Recurse -Force
}

if (Test-Path "src/shared/hooks") {
    Copy-Item -Path "src/shared/hooks/*" -Destination "src/hooks/" -Recurse -Force
}

# Move services
if (Test-Path "src/features/auth/services") {
    Copy-Item -Path "src/features/auth/services/*" -Destination "src/services/" -Recurse -Force
}

if (Test-Path "src/features/quiz/services") {
    Copy-Item -Path "src/features/quiz/services/*" -Destination "src/services/" -Recurse -Force
}

if (Test-Path "src/features/profile/services") {
    Copy-Item -Path "src/features/profile/services/*" -Destination "src/services/" -Recurse -Force
}

if (Test-Path "src/features/quests/services") {
    Copy-Item -Path "src/features/quests/services/*" -Destination "src/services/" -Recurse -Force
}

if (Test-Path "src/features/multiplayer/services") {
    Copy-Item -Path "src/features/multiplayer/services/*" -Destination "src/services/" -Recurse -Force
}

if (Test-Path "src/shared/services") {
    Copy-Item -Path "src/shared/services/*" -Destination "src/services/" -Recurse -Force
}

# Move types
if (Test-Path "src/features/auth/types") {
    Copy-Item -Path "src/features/auth/types/*" -Destination "src/types/auth/" -Recurse -Force
}

if (Test-Path "src/features/quiz/types") {
    Copy-Item -Path "src/features/quiz/types/*" -Destination "src/types/quiz/" -Recurse -Force
}

if (Test-Path "src/features/profile/types") {
    Copy-Item -Path "src/features/profile/types/*" -Destination "src/types/profile/" -Recurse -Force
}

if (Test-Path "src/features/quests/types") {
    Copy-Item -Path "src/features/quests/types/*" -Destination "src/types/quests/" -Recurse -Force
}

if (Test-Path "src/features/multiplayer/types") {
    Copy-Item -Path "src/features/multiplayer/types/*" -Destination "src/types/multiplayer/" -Recurse -Force
}

# Move utils
if (Test-Path "src/features/auth/utils") {
    Copy-Item -Path "src/features/auth/utils/*" -Destination "src/utils/" -Recurse -Force
}

if (Test-Path "src/features/quiz/utils") {
    Copy-Item -Path "src/features/quiz/utils/*" -Destination "src/utils/" -Recurse -Force
}

if (Test-Path "src/features/profile/utils") {
    Copy-Item -Path "src/features/profile/utils/*" -Destination "src/utils/" -Recurse -Force
}

if (Test-Path "src/features/quests/utils") {
    Copy-Item -Path "src/features/quests/utils/*" -Destination "src/utils/" -Recurse -Force
}

if (Test-Path "src/features/multiplayer/utils") {
    Copy-Item -Path "src/features/multiplayer/utils/*" -Destination "src/utils/" -Recurse -Force
}

if (Test-Path "src/shared/utils") {
    Copy-Item -Path "src/shared/utils/*" -Destination "src/utils/" -Recurse -Force
}

# Remove directories that are no longer needed
# Only run this after you've verified everything works
Remove-Item -Path "src/features" -Recurse -Force
Remove-Item -Path "src/shared" -Recurse -Force
Remove-Item -Path "src/examples" -Recurse -Force
Remove-Item -Path "src/planetary-system" -Recurse -Force

Write-Host "Project cleanup completed. Please check your project structure and run tests to ensure everything works."
Write-Host "A backup of your original src directory has been created in $backupDir"
Write-Host "If everything works, you can remove the commented lines at the end of this script and run it again to remove the old directories."