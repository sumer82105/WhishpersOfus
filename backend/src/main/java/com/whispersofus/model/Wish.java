package com.whispersofus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "wishes")
public class Wish {
    @Id
    private String id;
    
    @Field("creator_id")
    private String creatorId;
    
    private String title;
    
    private String description;
    
    @Field("photo_url")
    private String photoUrl;
    
    private WishCategory category;
    
    private WishStatus status = WishStatus.PENDING;
    
    @Field("fulfillment_note")
    private String fulfillmentNote;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("fulfilled_at")
    private LocalDateTime fulfilledAt;
    
    // Constructors
    public Wish() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Wish(String creatorId, String title, String description, WishCategory category) {
        this();
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.category = category;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getCreatorId() {
        return creatorId;
    }
    
    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPhotoUrl() {
        return photoUrl;
    }
    
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    
    public WishCategory getCategory() {
        return category;
    }
    
    public void setCategory(WishCategory category) {
        this.category = category;
    }
    
    public WishStatus getStatus() {
        return status;
    }
    
    public void setStatus(WishStatus status) {
        this.status = status;
        if (status == WishStatus.FULFILLED && fulfilledAt == null) {
            this.fulfilledAt = LocalDateTime.now();
        }
    }
    
    public String getFulfillmentNote() {
        return fulfillmentNote;
    }
    
    public void setFulfillmentNote(String fulfillmentNote) {
        this.fulfillmentNote = fulfillmentNote;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getFulfilledAt() {
        return fulfilledAt;
    }
    
    public void setFulfilledAt(LocalDateTime fulfilledAt) {
        this.fulfilledAt = fulfilledAt;
    }
} 