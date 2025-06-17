package com.whispersofus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoveNoteRequest {
    
    @NotBlank(message = "Content cannot be empty")
    @Size(max = 2000, message = "Content cannot exceed 2000 characters")
    private String content;
    
    @Size(max = 50, message = "Emotion tag cannot exceed 50 characters")
    private String emotionTag;
} 