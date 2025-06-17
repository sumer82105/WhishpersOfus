package com.whispersofus.model;

/**
 * Enum representing the status of a partner request
 * Used to track the lifecycle of partner requests between users
 */
public enum PartnerRequestStatus {
    PENDING,    // Request has been sent but not yet responded to
    ACCEPTED,   // Request has been accepted by the receiver
    REJECTED    // Request has been rejected by the receiver
} 