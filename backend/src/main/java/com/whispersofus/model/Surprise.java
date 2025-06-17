package com.whispersofus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "surprises")
public class Surprise {
    @Id
    private String id;
    
    @Field("creator_id")
    private String creatorId;
    
    private String title;
    
    private String description;
    
    @Field("unlock_condition")
    private String unlockCondition;
    
    @Field("content_url")
    private String contentUrl;
    
    @Field("content_type")
    private ContentType contentType;
    
    @Field("is_unlocked")
    private boolean isUnlocked = false;
    
    @Field("unlock_date")
    private LocalDateTime unlockDate;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Surprise() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Surprise(String creatorId, String title, String description, String unlockCondition, ContentType contentType) {
        this();
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.unlockCondition = unlockCondition;
        this.contentType = contentType;
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
    
    public String getUnlockCondition() {
        return unlockCondition;
    }
    
    public void setUnlockCondition(String unlockCondition) {
        this.unlockCondition = unlockCondition;
    }
    
    public String getContentUrl() {
        return contentUrl;
    }
    
    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }
    
    public ContentType getContentType() {
        return contentType;
    }
    
    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }
    
    public boolean isUnlocked() {
        return isUnlocked;
    }
    
    public void setUnlocked(boolean unlocked) {
        isUnlocked = unlocked;
        if (unlocked && unlockDate == null) {
            this.unlockDate = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getUnlockDate() {
        return unlockDate;
    }
    
    public void setUnlockDate(LocalDateTime unlockDate) {
        this.unlockDate = unlockDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 