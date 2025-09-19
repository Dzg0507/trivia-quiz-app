# Trivia Quest Advanced Refactoring Scripts

This directory contains PowerShell scripts to automate the refactoring process for the Trivia Quest Advanced application. The refactoring is divided into phases to make the process more manageable and to allow for testing between phases.

## Overview

The refactoring aims to simplify the project structure and improve code organization without losing any functionality. The process is divided into the following phases:

1. **Phase 1: Service and Hook Consolidation**
   - Combine related services and hooks
   - Update imports throughout the codebase

2. **Phase 2: Context Consolidation**
   - Implement new context structure
   - Migrate components to use the new contexts

3. **Phase 3: Component Reorganization**
   - Move components to a feature-based structure
   - Update imports and ensure everything works

4. **Phase 4: Configuration and Type Consolidation**
   - Combine related configuration and type files
   - Update imports throughout the codebase

## Usage

Each phase has its own script that can be run independently. It's recommended to run them in order and test the application after each phase.

```powershell
# Run Phase 1
.\phase1-service-hook-consolidation.ps1

# Run Phase 2
.\phase2-context-consolidation.ps1

# Run Phase 3
.\phase3-component-reorganization.ps1

# Run Phase 4
.\phase4-config-type-consolidation.ps1
```

## Important Notes

- **Backup your code** before running any scripts
- Each script creates a backup of the files it modifies
- If something goes wrong, you can restore from the backup
- Run tests after each phase to ensure everything still works
- Review the changes made by each script before proceeding to the next phase

## Rollback

If you need to rollback the changes made by a script, you can use the backup files created in the `refactor-backups` directory.

```powershell
# Rollback Phase 1
.\rollback-phase1.ps1

# Rollback Phase 2
.\rollback-phase2.ps1

# Rollback Phase 3
.\rollback-phase3.ps1

# Rollback Phase 4
.\rollback-phase4.ps1
```