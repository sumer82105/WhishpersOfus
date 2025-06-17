package com.whispersofus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SurpriseRequest {
    
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @NotBlank(message = "Unlock condition cannot be empty")
    @Size(max = 500, message = "Unlock condition cannot exceed 500 characters")
    private String unlockCondition;
    
    @Size(max = 2000, message = "Content URL cannot exceed 2000 characters")
    private String contentUrl;
    
    @NotBlank(message = "Content type cannot be empty")
    private String contentType;
} 