package com.whispersofus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "love_notes")
public class LoveNote {
    @Id
    private String id;
    
    @Field("sender_id")
    private String senderId;
    
    @Field("receiver_id")
    private String receiverId;
    
    private String content;
    
    @Field("emotion_tag")
    private EmotionTag emotionTag;
    
    @Field("reaction_emoji")
    private String reactionEmoji;
    
    @Field("is_read")
    private boolean isRead = false;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("read_at")
    private LocalDateTime readAt;
    
    // Constructors
    public LoveNote() {
        this.createdAt = LocalDateTime.now();
    }
    
    public LoveNote(String senderId, String receiverId, String content, EmotionTag emotionTag) {
        this();
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.emotionTag = emotionTag;
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
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public EmotionTag getEmotionTag() {
        return emotionTag;
    }
    
    public void setEmotionTag(EmotionTag emotionTag) {
        this.emotionTag = emotionTag;
    }
    
    public String getReactionEmoji() {
        return reactionEmoji;
    }
    
    public void setReactionEmoji(String reactionEmoji) {
        this.reactionEmoji = reactionEmoji;
    }
    
    public boolean isRead() {
        return isRead;
    }
    
    public void setRead(boolean read) {
        isRead = read;
        if (read && readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getReadAt() {
        return readAt;
    }
    
    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
} 