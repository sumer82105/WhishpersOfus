# Chat Message Alignment Fix

## Problem Description
Users were experiencing an issue where sent messages appeared on the left side (receiver side) when sent via WebSocket, but after refreshing the page, they appeared correctly on the right side (sender side).

## Root Cause Analysis

The issue was caused by **inconsistent user ID usage** between WebSocket real-time messages and database-stored messages:

### The Flow:
1. **Frontend sends message**: Uses Firebase UID as `senderId`
2. **Backend WebSocket controller**: 
   - Receives message with Firebase UID
   - Converts Firebase UID to database user ID for saving to database
   - **BUT** broadcasts WebSocket message still containing Firebase UID
3. **Frontend receives WebSocket message**: 
   - Message contains Firebase UID as `senderId`
   - Compares with `user?.id` (which is database user ID)
   - Firebase UID ≠ Database user ID → Message appears on left (wrong side)
4. **After page refresh**:
   - Messages loaded from database contain database user IDs
   - Comparison works correctly → Messages appear on right (correct side)

## Solution Applied

### Backend Changes (`WebSocketChatController.java`)

1. **Updated `sendMessage()` method**:
   ```java
   // IMPORTANT: Update senderId to use database ID instead of Firebase UID
   // This ensures frontend can properly align messages sent vs received
   chatMessage.setSenderId(sender.getId());
   ```

2. **Updated `addUser()` method**:
   ```java
   // Update senderId to use database ID for consistency
   chatMessage.setSenderId(user.getId());
   ```

3. **Updated typing indicators**:
   ```java
   // Convert Firebase UID to database user ID for consistency
   Optional<User> userOpt = userService.findByFirebaseUid(chatMessage.getSenderId());
   if (userOpt.isPresent()) {
       chatMessage.setSenderId(userOpt.get().getId());
   }
   ```

### Frontend Changes (`Chats.tsx`)

Updated typing indicator comparisons to use database user ID:
```typescript
// Before: wsMessage.senderId !== firebaseUser?.uid
// After: wsMessage.senderId !== user?.id
```

## Result
✅ **Fixed**: Messages now appear on the correct side immediately when sent via WebSocket  
✅ **Consistent**: Real-time and database-loaded messages use the same ID format  
✅ **Backwards Compatible**: No breaking changes to existing functionality  

## Testing
1. Send a message via WebSocket - should appear on right side immediately
2. Refresh page - message should remain on right side
3. Typing indicators should work correctly for both users
4. Chat alignment should be consistent across all scenarios

---
*This fix ensures consistent user identification across the entire chat system.* 