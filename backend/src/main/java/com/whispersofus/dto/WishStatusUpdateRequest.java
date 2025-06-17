package com.whispersofus.dto;

import com.whispersofus.model.WishStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WishStatusUpdateRequest {
    
    @NotNull(message = "Status is required")
    private WishStatus status;
    
    @Size(max = 1000, message = "Fulfillment note cannot exceed 1000 characters")
    private String fulfillmentNote;
} 