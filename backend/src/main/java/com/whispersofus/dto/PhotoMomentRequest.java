package com.whispersofus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PhotoMomentRequest {
    
    @NotBlank(message = "Photo URL cannot be empty")
    private String photoUrl;
    
    @Size(max = 500, message = "Caption cannot exceed 500 characters")
    private String caption;
    
    @Size(max = 255, message = "Location cannot exceed 255 characters")
    private String location;
    
    private LocalDateTime takenAt;
} 