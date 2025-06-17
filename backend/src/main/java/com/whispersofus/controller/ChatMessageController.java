package com.whispersofus.controller;

import com.whispersofus.dto.ChatMessageRequest;
import com.whispersofus.model.ChatMessage;
import com.whispersofus.model.MessageType;
import com.whispersofus.model.User;
import com.whispersofus.service.ChatMessageService;
import com.whispersofus.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatMessageController {
    
    private final ChatMessageService chatMessageService;
    private final UserService userService;
    
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@Valid @RequestBody ChatMessageRequest request,
                                                  @RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> senderOpt = userService.findByFirebaseUid(firebaseUid);
        if (senderOpt.isEmpty()) {
            log.warn("Sender not found for Firebase UID: {}", firebaseUid);
            return ResponseEntity.badRequest().build();
        }
        
        // If no receiverId provided, find the partner (assuming 2-person relationship)
        String finalReceiverId = request.getReceiverId();
        if (finalReceiverId == null) {
            List<User> allUsers = userService.findAllUsers();
            Optional<User> partner = allUsers.stream()
                .filter(user -> !user.getId().equals(senderOpt.get().getId()))
                .findFirst();
            if (partner.isPresent()) {
                finalReceiverId = partner.get().getId();
            } else {
                log.warn("No partner found for user: {}", senderOpt.get().getId());
                return ResponseEntity.badRequest().build();
            }
        }
        
        // Parse message type
        MessageType messageType = MessageType.TEXT;
        if (request.getMessageType() != null) {
            try {
                messageType = MessageType.valueOf(request.getMessageType().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid message type: {}, using default TEXT", request.getMessageType());
            }
        }
        
        ChatMessage message = chatMessageService.sendMessage(
            senderOpt.get().getId(),
            finalReceiverId,
            request.getContent(),
            messageType
        );
        
        return ResponseEntity.ok(message);
    }
    
    @GetMapping("/messages")
    public ResponseEntity<Page<ChatMessage>> getMessages(@RequestHeader("Firebase-UID") String firebaseUid,
                                                        @RequestParam(required = false) String partnerId,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // If no partnerId provided, find the partner
        String finalPartnerId = partnerId;
        if (finalPartnerId == null) {
            List<User> allUsers = userService.findAllUsers();
            Optional<User> partner = allUsers.stream()
                .filter(user -> !user.getId().equals(userOpt.get().getId()))
                .findFirst();
            if (partner.isPresent()) {
                finalPartnerId = partner.get().getId();
            } else {
                return ResponseEntity.badRequest().build();
            }
        }
        
        Page<ChatMessage> messages = chatMessageService.getMessagesBetweenUsers(
            userOpt.get().getId(), finalPartnerId, page, size);
        
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<ChatMessage>> getUnreadMessages(@RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<ChatMessage> unreadMessages = chatMessageService.getUnreadMessages(userOpt.get().getId());
        return ResponseEntity.ok(unreadMessages);
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadMessageCount(@RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        long count = chatMessageService.getUnreadMessageCount(userOpt.get().getId());
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{messageId}/read")
    public ResponseEntity<ChatMessage> markAsRead(@PathVariable String messageId) {
        try {
            ChatMessage message = chatMessageService.markMessageAsRead(messageId);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            log.error("Failed to mark message as read: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(@RequestHeader("Firebase-UID") String firebaseUid,
                                                  @RequestParam(required = false) String partnerId) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Find partner if not provided
        String finalPartnerId = partnerId;
        if (finalPartnerId == null) {
            List<User> allUsers = userService.findAllUsers();
            Optional<User> partner = allUsers.stream()
                .filter(user -> !user.getId().equals(userOpt.get().getId()))
                .findFirst();
            if (partner.isPresent()) {
                finalPartnerId = partner.get().getId();
            } else {
                return ResponseEntity.badRequest().build();
            }
        }
        
        chatMessageService.markMessagesAsRead(finalPartnerId, userOpt.get().getId());
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/latest")
    public ResponseEntity<ChatMessage> getLatestMessage(@RequestHeader("Firebase-UID") String firebaseUid,
                                                       @RequestParam(required = false) String partnerId) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Find partner if not provided
        String finalPartnerId = partnerId;
        if (finalPartnerId == null) {
            List<User> allUsers = userService.findAllUsers();
            Optional<User> partner = allUsers.stream()
                .filter(user -> !user.getId().equals(userOpt.get().getId()))
                .findFirst();
            if (partner.isPresent()) {
                finalPartnerId = partner.get().getId();
            } else {
                return ResponseEntity.badRequest().build();
            }
        }
        
        Optional<ChatMessage> latestMessage = chatMessageService.getLatestMessage(
            userOpt.get().getId(), finalPartnerId);
        
        return latestMessage.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String messageId) {
        try {
            chatMessageService.deleteMessage(messageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Failed to delete message: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
} 