package com.whispersofus.dto;

import com.whispersofus.model.MemoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MemoryRequest {
    
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    @NotNull(message = "Memory date is required")
    private LocalDate memoryDate;
    
    private String photoUrl;
    
    @Size(max = 255, message = "Location cannot exceed 255 characters")
    private String location;
    
    @NotNull(message = "Memory type is required")
    private MemoryType type;
    
    private Boolean isMilestone;
} 