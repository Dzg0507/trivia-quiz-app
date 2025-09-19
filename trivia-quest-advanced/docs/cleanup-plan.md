# Project Cleanup Plan

## Current Issues
- Too many directories with overlapping functionality
- Duplicate structures (features, shared, components)
- Complex file organization making it hard to find things
- Tests that don't match the current structure

## Cleanup Goals
- Simplify the directory structure
- Consolidate similar files
- Remove unnecessary files
- Make the project easier to navigate

## Directory Structure Plan

### Keep These Core Directories
- `src/components/` - All UI components
- `src/context/` - All context providers
- `src/hooks/` - All custom hooks
- `src/services/` - All API and service functions
- `src/types/` - All TypeScript type definitions
- `src/utils/` - Utility functions
- `src/config/` - Configuration files

### Remove or Consolidate These Directories
- `src/features/` → Move to `src/components/`
- `src/shared/` → Move to `src/components/common/`
- `src/examples/` → Remove (not needed for production)
- `src/planetary-system/` → Move to `src/components/planetary-system/`

## File Consolidation Plan

### Components
- Move all component files from `src/features/*/components/` to `src/components/`
- Move all component files from `src/shared/components/` to `src/components/common/`
- Organize components into subdirectories by feature (auth, quiz, profile, etc.)

### Hooks
- Move all hook files from `src/features/*/hooks/` to `src/hooks/`
- Move all hook files from `src/shared/hooks/` to `src/hooks/`
- Prefix hooks with feature name if needed for clarity (e.g., `useAuthLogin.ts`)

### Services
- Move all service files from `src/features/*/services/` to `src/services/`
- Move all service files from `src/shared/services/` to `src/services/`
- Organize services by feature if needed

### Types
- Keep all types in `src/types/`
- Organize by feature if needed

### Context
- Keep all context providers in `src/context/`
- Ensure each context has a clear purpose

## Implementation Steps

1. Create backup of current project
2. Start with one feature at a time (e.g., auth)
3. Move components to appropriate directories
4. Update imports in all files
5. Test after each feature is moved
6. Remove empty directories
7. Run tests to ensure everything works

## Testing Plan

1. After each consolidation step, run:
   - `npm run lint` to check for errors
   - `npm test` to run tests
   - `npm run dev` to verify the app works

2. Fix any issues before moving to the next feature

## Benefits

- Simpler project structure
- Easier to find files
- Better organization by functionality
- Reduced duplication
- Easier onboarding for new developers
- More maintainable codebase