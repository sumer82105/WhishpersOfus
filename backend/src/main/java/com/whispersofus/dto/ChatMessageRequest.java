package com.whispersofus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChatMessageRequest {
    
    @Size(max = 50, message = "Receiver ID cannot exceed 50 characters")
    private String receiverId;
    
    @NotBlank(message = "Message content cannot be empty")
    @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    private String content;
    
    @Size(max = 20, message = "Message type cannot exceed 20 characters")
    private String messageType;
} 