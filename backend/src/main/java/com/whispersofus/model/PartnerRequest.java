package com.whispersofus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

/**
 * Entity representing a partner request between two users
 * Tracks requests sent from one user to another for establishing a partner relationship
 */
@Document(collection = "partner_requests")
public class PartnerRequest {
    @Id
    private String id;
    
    @Indexed
    @Field("sender_id")
    private String senderId;
    
    @Indexed
    @Field("receiver_id")
    private String receiverId;
    
    private PartnerRequestStatus status;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public PartnerRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = PartnerRequestStatus.PENDING;
    }
    
    public PartnerRequest(String senderId, String receiverId) {
        this();
        this.senderId = senderId;
        this.receiverId = receiverId;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getSenderId() {
        return senderId;
    }
    
    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }
    
    public String getReceiverId() {
        return receiverId;
    }
    
    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }
    
    public PartnerRequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(PartnerRequestStatus status) {
        this.status = status;
        this.onUpdate();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Lifecycle methods
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 