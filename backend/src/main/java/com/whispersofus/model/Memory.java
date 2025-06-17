package com.whispersofus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "memories")
public class Memory {
    @Id
    private String id;
    
    @Field("creator_id")
    private String creatorId;
    
    private String title;
    
    private String description;
    
    @Field("memory_date")
    private LocalDate memoryDate;
    
    private MemoryType type;
    
    @Field("photo_urls")
    private List<String> photoUrls;
    
    private String location;
    
    @Field("is_milestone")
    private boolean isMilestone = false;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Memory() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Memory(String creatorId, String title, String description, LocalDate memoryDate, MemoryType type) {
        this();
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.memoryDate = memoryDate;
        this.type = type;
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
    
    public LocalDate getMemoryDate() {
        return memoryDate;
    }
    
    public void setMemoryDate(LocalDate memoryDate) {
        this.memoryDate = memoryDate;
    }
    
    public MemoryType getType() {
        return type;
    }
    
    public void setType(MemoryType type) {
        this.type = type;
    }
    
    public List<String> getPhotoUrls() {
        return photoUrls;
    }
    
    public void setPhotoUrls(List<String> photoUrls) {
        this.photoUrls = photoUrls;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public boolean isMilestone() {
        return isMilestone;
    }
    
    public void setMilestone(boolean milestone) {
        isMilestone = milestone;
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