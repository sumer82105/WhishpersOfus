package com.whispersofus.controller;

import com.whispersofus.dto.WebSocketChatMessage;
import com.whispersofus.model.ChatMessage;
import com.whispersofus.model.MessageType;
import com.whispersofus.model.User;
import com.whispersofus.service.ChatMessageService;
import com.whispersofus.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final UserService userService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public WebSocketChatMessage sendMessage(@Payload WebSocketChatMessage chatMessage) {
        try {
            log.info("Received WebSocket message from {}: {}", chatMessage.getSenderId(), chatMessage.getContent());
            
            // Get sender information
            Optional<User> senderOpt = userService.findByFirebaseUid(chatMessage.getSenderId());
            if (senderOpt.isEmpty()) {
                log.warn("Sender not found: {}", chatMessage.getSenderId());
                return chatMessage;
            }
            
            User sender = senderOpt.get();
            chatMessage.setSenderName(sender.getName());
            chatMessage.setTimestamp(LocalDateTime.now());
            
            // IMPORTANT: Update senderId to use database ID instead of Firebase UID
            // This ensures frontend can properly align messages sent vs received
            chatMessage.setSenderId(sender.getId());
            
            // Save message to database
            if (chatMessage.getType() == WebSocketChatMessage.Type.CHAT) {
                // Find receiver (for private chat, find the partner)
                String receiverId = chatMessage.getReceiverId();
                if (receiverId == null) {
                    // Auto-find partner for private chat
                    receiverId = findPartnerUserId(sender.getId());
                }
                
                if (receiverId != null) {
                    ChatMessage savedMessage = chatMessageService.sendMessage(
                        sender.getId(),
                        receiverId,
                        chatMessage.getContent(),
                        MessageType.valueOf(chatMessage.getMessageType().toUpperCase())
                    );
                    chatMessage.setId(savedMessage.getId());
                    chatMessage.setReceiverId(receiverId);
                    
                    log.info("Message saved to database with ID: {}", savedMessage.getId());
                }
            }
            
            return chatMessage;
            
        } catch (Exception e) {
            log.error("Error processing WebSocket message: {}", e.getMessage(), e);
            return chatMessage;
        }
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public WebSocketChatMessage addUser(@Payload WebSocketChatMessage chatMessage) {
        try {
            log.info("User joined chat: {}", chatMessage.getSenderId());
            
            // Get user information
            Optional<User> userOpt = userService.findByFirebaseUid(chatMessage.getSenderId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                chatMessage.setSenderName(user.getName());
                // Update senderId to use database ID for consistency
                chatMessage.setSenderId(user.getId());
            }
            
            chatMessage.setType(WebSocketChatMessage.Type.JOIN);
            chatMessage.setTimestamp(LocalDateTime.now());
            chatMessage.setContent(chatMessage.getSenderName() + " joined the chat");
            
            return chatMessage;
            
        } catch (Exception e) {
            log.error("Error adding user to chat: {}", e.getMessage(), e);
            return chatMessage;
        }
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload WebSocketChatMessage chatMessage) {
        try {
            log.debug("User typing: {}", chatMessage.getSenderId());
            
            // Convert Firebase UID to database user ID for consistency
            Optional<User> userOpt = userService.findByFirebaseUid(chatMessage.getSenderId());
            if (userOpt.isPresent()) {
                chatMessage.setSenderId(userOpt.get().getId());
            }
            
            chatMessage.setType(WebSocketChatMessage.Type.TYPING);
            chatMessage.setTimestamp(LocalDateTime.now());
            
            // Send typing indicator to all users except sender
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
            
        } catch (Exception e) {
            log.error("Error handling typing indicator: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/chat.stopTyping")
    public void handleStopTyping(@Payload WebSocketChatMessage chatMessage) {
        try {
            log.debug("User stopped typing: {}", chatMessage.getSenderId());
            
            // Convert Firebase UID to database user ID for consistency
            Optional<User> userOpt = userService.findByFirebaseUid(chatMessage.getSenderId());
            if (userOpt.isPresent()) {
                chatMessage.setSenderId(userOpt.get().getId());
            }
            
            chatMessage.setType(WebSocketChatMessage.Type.STOP_TYPING);
            chatMessage.setTimestamp(LocalDateTime.now());
            
            // Send stop typing indicator to all users except sender
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
            
        } catch (Exception e) {
            log.error("Error handling stop typing indicator: {}", e.getMessage(), e);
        }
    }

    // Private method to find partner user ID
    private String findPartnerUserId(String currentUserId) {
        try {
            return userService.findAllUsers().stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .findFirst()
                .map(User::getId)
                .orElse(null);
        } catch (Exception e) {
            log.error("Error finding partner user: {}", e.getMessage(), e);
            return null;
        }
    }
} 