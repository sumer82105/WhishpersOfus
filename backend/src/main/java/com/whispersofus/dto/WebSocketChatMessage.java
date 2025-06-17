package com.whispersofus.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketChatMessage {
    private String id;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String content;
    private String messageType;
    private LocalDateTime timestamp;
    private String chatRoomId;
    
    // Message types for WebSocket
    public enum Type {
        CHAT,
        JOIN,
        LEAVE,
        TYPING,
        STOP_TYPING
    }
    
    private Type type = Type.CHAT;
} 