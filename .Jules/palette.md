## 2024-05-26 - Repetitive Action Buttons Lack Context
**Learning:** Generic buttons like 'Book Now' and 'Approve' across iterative lists lack context for screen reader users and missing keyboard focus states.
**Action:** Always add dynamic aria-labels incorporating contextual info (e.g., item names) and explicit `focus-visible` classes to interactive elements in lists.

## 2024-05-27 - Re-fetch Flicker on Async Action Buttons
**Learning:** When a button triggers an async state change (like deleting or approving an item) that removes the item from the list, resetting the loading state *before* awaiting the subsequent list re-fetch causes a jarring visual flicker where the button briefly reverts to its original state before disappearing.
**Action:** Always await the re-fetch or state update function inside the initial async action's `try` block before finally resetting the button's loading state.

## 2024-05-27 - Global Loading State During Refetch
**Learning:** Reusing the initial global `isLoading` state during a background refetch (like fetching list after approving an item) causes the entire data list to unmount and flashes the loading skeleton, resulting in a severe UX regression (layout shift).
**Action:** Differentiate between initial load and subsequent refetches (e.g., pass an `isInitialLoad` flag or use a separate `isFetching` state) to preserve the list while it is updating in the background.
