# RTL-LTR Extension Debug and Fix Plan

## Issues Identified

- [x] TypeScript error: `DirectionConfig` not exported from `direction.types.ts` - RESOLVED: DirectionConfig is in direction.entity.ts
- [x] Missing `clearAll` method in repository interface and implementation - RESOLVED: Already implemented
- [x] Export/import functions in popup inconsistent with hook implementation - RESOLVED: Implemented in popup
- [x] Storage API inconsistency (sync vs local) - RESOLVED: Uses local storage consistently
- [x] Popup initialization logic causing white screen - RESOLVED: Created popup component

## Fixes to Implement

- [x] Fix import in `src/presentation/popup/index.tsx`: Change `DirectionConfig` to `DirectionState` - RESOLVED: Created popup without using DirectionConfig
- [x] Add `clearAll` method to `src/core/repositories/direction-repository.interface.ts` - RESOLVED: Already present
- [x] Implement `clearAll` in `src/infrastructure/repositories/storage-direction.repository.ts` - RESOLVED: Already implemented
- [x] Update export/import in popup to use hook's functions properly - RESOLVED: Implemented
- [x] Make storage consistent (use local storage in hook) - RESOLVED: Uses local storage
- [x] Simplify popup initialization logic - RESOLVED: Created simple popup

## Testing

- [x] Run full build (npm run build) - PASSED: No build errors
- [x] Added Clear All button to popup for testing clearAll functionality
- [ ] Test extension popup displays correctly
- [ ] Verify toggle direction functionality
- [ ] Verify URL management functionality
- [ ] Verify export/import functionality
- [ ] Test clearAll functionality: Clear all configs and verify storage is empty
- [ ] Check for runtime errors in hook using clearAll
- [ ] Verify direction toggling and URL management work after clearing storage
- [ ] Ensure extension loads properly and handles storage operations without errors
