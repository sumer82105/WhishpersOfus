package com.whispersofus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReactionRequest {
    
    @NotBlank(message = "Reaction emoji cannot be empty")
    @Size(max = 10, message = "Reaction emoji cannot exceed 10 characters")
    private String reactionEmoji;
} 