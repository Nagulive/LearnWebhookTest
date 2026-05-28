## 2024-05-26 - Repetitive Action Buttons Lack Context
**Learning:** Generic buttons like 'Book Now' and 'Approve' across iterative lists lack context for screen reader users and missing keyboard focus states.
**Action:** Always add dynamic aria-labels incorporating contextual info (e.g., item names) and explicit `focus-visible` classes to interactive elements in lists.
## 2024-05-18 - [Tying Loading States to Item IDs]
**Learning:** [When dealing with lists of items where actions can be performed independently (like approving a specific hall), using a global loading boolean can freeze all buttons or allow concurrent actions on different items without feedback. Tying the loading state to the specific item ID (`approvingId`) is crucial for providing precise context-aware feedback (`Approving...`) and preventing unwanted concurrent actions on that specific item while leaving others interactive. This greatly improves accessibility with `aria-busy` tied correctly.]
**Action:** [Always use ID-based state tracking for list item actions instead of a generic `isLoading` boolean to ensure localized feedback and precise accessibility attributes.]
