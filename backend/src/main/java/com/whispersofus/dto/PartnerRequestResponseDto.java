package com.whispersofus.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * DTO for responding to partner requests
 * Used when accepting or rejecting a partner request
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartnerRequestResponseDto {
    private String requestId;
    private boolean accepted;
} 