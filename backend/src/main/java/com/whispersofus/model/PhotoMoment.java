package com.whispersofus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "photo_moments")
public class PhotoMoment {
    @Id
    private String id;
    
    @Field("uploader_id")
    private String uploaderId;
    
    @Field("photo_url")
    private String photoUrl;
    
    private String caption;
    
    private String location;
    
    @Field("taken_at")
    private LocalDateTime takenAt;
    
    @Field("is_favorite")
    private boolean isFavorite = false;
    
    @Field("uploaded_at")
    private LocalDateTime uploadedAt;
    
    // Constructors
    public PhotoMoment() {
        this.uploadedAt = LocalDateTime.now();
    }
    
    public PhotoMoment(String uploaderId, String photoUrl, String caption) {
        this();
        this.uploaderId = uploaderId;
        this.photoUrl = photoUrl;
        this.caption = caption;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUploaderId() {
        return uploaderId;
    }
    
    public void setUploaderId(String uploaderId) {
        this.uploaderId = uploaderId;
    }
    
    public String getPhotoUrl() {
        return photoUrl;
    }
    
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    
    public String getCaption() {
        return caption;
    }
    
    public void setCaption(String caption) {
        this.caption = caption;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public LocalDateTime getTakenAt() {
        return takenAt;
    }
    
    public void setTakenAt(LocalDateTime takenAt) {
        this.takenAt = takenAt;
    }
    
    public boolean isFavorite() {
        return isFavorite;
    }
    
    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
} 