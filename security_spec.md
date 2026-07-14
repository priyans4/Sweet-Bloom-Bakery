# Security Specification & Test-Driven Development (TDD) for Cake Shop Firestore

## 1. Data Invariants
- A user's profile, shipping addresses, and orders must reside entirely inside `/users/{userId}` and can only be accessed or modified by that authenticated user (`request.auth.uid == userId`).
- Addresses and Orders must have well-formed document IDs that match standard alphanumeric characters (`isValidId`).
- An order can never be modified or deleted by another user.
- A user's private PII (such as street address, email, and phone) is strictly limited to their own authenticated session. No blanket reading of user profiles is permitted.

## 2. The "Dirty Dozen" Payloads (Designed to Fail)
Here are 12 JSON payloads designed to violate Identity, Integrity, or State boundaries. Our firestore security rules must reject all of these.

1. **Malicious Profile Read (No Auth)**: Attempting to get `/users/user-123` with `request.auth = null`.
2. **Profile Spoofing (Impersonation)**: Authenticated as `user-abc`, trying to create or update profile `/users/user-123`.
3. **Malicious Address Create (No Auth)**: Trying to write an address to `/users/user-123/addresses/addr-1` without credentials.
4. **Address Injection (Cross-User)**: Authenticated as `user-abc`, trying to add an address to `/users/user-xyz/addresses/addr-1`.
5. **Junk Address ID (ID Poisoning)**: Trying to write `/users/user-123/addresses/VERY-LONG-JUNK-CHARACTER-STRING-THAT-IS-OVER-128-CHARS-TO-EXHAUST-RESOURCES-AND-CAUSE-DENIAL-OF-WALLET`.
6. **Malicious Order Read (No Auth)**: Reading orders at `/users/user-123/orders/order-1` anonymously.
7. **Cross-User Order Sneak**: Authenticated as `user-abc`, listing orders of `user-xyz` (`/users/user-xyz/orders`).
8. **Shadow Field Injection**: Attempting to add extra unauthorized system parameters or giant payloads into a profile.
9. **Order Deletion/Sabotage (Cross-User)**: Authenticated as `user-abc`, deleting `/users/user-xyz/orders/order-1`.
10. **Malicious Order Insertion**: Authenticated as `user-abc`, pushing a fake order into `user-xyz`'s subcollection.
11. **Anonymized Wildcard Access**: Attempting to read `/users/user-123/addresses` while authenticated, but not as `user-123`.
12. **Null Profile Writing**: Trying to save a profile with empty or invalid field types (e.g., name is boolean).

---

## 3. The Test Runner Spec (`firestore.rules.test.ts`)
```typescript
import { assertFails, initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";

// This spec documents the expected test executions for checking rules security
// verifying that all 12 malicious payloads are blocked with PERMISSION_DENIED.
```
