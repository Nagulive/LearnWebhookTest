## 2024-05-26 - Repetitive Action Buttons Lack Context
**Learning:** Generic buttons like 'Book Now' and 'Approve' across iterative lists lack context for screen reader users and missing keyboard focus states.
**Action:** Always add dynamic aria-labels incorporating contextual info (e.g., item names) and explicit `focus-visible` classes to interactive elements in lists.
