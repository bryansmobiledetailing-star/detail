# Firebase Security Specification

## Data Invariants
1. **Users**:
   - A user can only read and write their own profile (unless an admin).
   - Roles can only be assigned by the system or another admin (not self-assigned during creation).
   - `email_verified` must be true for most operations.

2. **Bookings**:
   - Users can read their own bookings.
   - Admins can read all bookings.
   - Creation requires a valid `userId` (the current user).
   - `squareBookingId` is immutable once set.
   - Only admins can update the status of a booking.

3. **Quotes**:
   - Quotes are mostly write-only for the common user (lead generation).
   - Only admins can read all quotes.

4. **Reviews**:
   - Read-only for everyone.
   - System/Admin can write (cache).

## The "Dirty Dozen" Payloads

### 1. Identity Spoofing (Users)
- **Payload**: `{ "uid": "victim_uid", "email": "me@attacker.com", "role": "admin" }`
- **Target**: `users/attacker_uid`
- **Result**: `PERMISSION_DENIED` - Should only set own UID and cannot self-assign admin role.

### 2. Role Escalation (Users)
- **Payload**: `{ "role": "admin" }`
- **Target**: `users/my_uid` (update)
- **Result**: `PERMISSION_DENIED` - `role` field should be immutable for non-admins.

### 3. Unauthorized Reading (Bookings)
- **Action**: `get(bookings/someone_elses_booking)`
- **Result**: `PERMISSION_DENIED` - Non-admin cannot read other users' bookings.

### 4. Overwriting Someone Else's Booking (Bookings)
- **Payload**: `{ "customer": { "firstName": "Attacker" }, "userId": "attacker_uid" }`
- **Target**: `bookings/victim_booking_id`
- **Result**: `PERMISSION_DENIED` - Only owner or admin can update.

### 5. Status Hijacking (Bookings)
- **Payload**: `{ "status": "completed" }`
- **Target**: `bookings/my_booking_id` (update)
- **Result**: `PERMISSION_DENIED` - Status updates restricted to admins.

### 6. Resource Poisoning (Document ID)
- **ID**: `a-very-long-id-string-exceeding-128-characters-...`
- **Result**: `PERMISSION_DENIED` - `isValidId()` should block long IDs.

### 7. Denial of Wallet (Large Payload)
- **Payload**: `{ "content": "1MB string..." }`
- **Target**: `reviews/new_review`
- **Result**: `PERMISSION_DENIED` - Size checks should block huge strings.

### 8. Orphaned Record (Bookings)
- **Payload**: `{ "userId": "non_existent_uid", ... }`
- **Target**: `bookings/new_id`
- **Result**: `PERMISSION_DENIED` - Validation should check if user document exists.

### 9. Temporal Hijacking (Quotes)
- **Payload**: `{ "createdAt": "2020-01-01T00:00:00Z" }`
- **Target**: `quotes/new_quote`
- **Result**: `PERMISSION_DENIED` - Must use `request.time`.

### 10. Blanket Query Attack (Bookings)
- **Query**: `collection('bookings')` (no where clause)
- **Result**: `PERMISSION_DENIED` - Rules must force `userId == request.auth.uid`.

### 11. Ghost Field Injection (Quotes)
- **Payload**: `{ "name": "...", "email": "...", "vehicle": "...", "isAdmin": true }`
- **Result**: `PERMISSION_DENIED` - Strict schema (hasOnly) should block `isAdmin` field.

### 12. Unverified Email Access
- **Account**: Authenticated but `email_verified: false`.
- **Action**: `create(bookings/...)`
- **Result**: `PERMISSION_DENIED` - `email_verified == true` mandate.
