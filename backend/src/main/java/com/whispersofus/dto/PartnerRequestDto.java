package com.whispersofus.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * DTO for partner request operations
 * Used when sending a partner request to another user
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartnerRequestDto {
    private String receiverId;
} 