package com.whispersofus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

/**
 * Entity representing a partnership between two users
 * Once a partner request is accepted, this entity stores the active partnership
 */
@Document(collection = "user_partners")
public class UserPartner {
    @Id
    private String id;
    
    @Indexed
    @Field("user1_id")
    private String user1Id;
    
    @Indexed
    @Field("user2_id")
    private String user2Id;
    
    @Field("linked_at")
    private LocalDateTime linkedAt;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public UserPartner() {
        this.createdAt = LocalDateTime.now();
        this.linkedAt = LocalDateTime.now();
    }
    
    public UserPartner(String user1Id, String user2Id) {
        this();
        this.user1Id = user1Id;
        this.user2Id = user2Id;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUser1Id() {
        return user1Id;
    }
    
    public void setUser1Id(String user1Id) {
        this.user1Id = user1Id;
    }
    
    public String getUser2Id() {
        return user2Id;
    }
    
    public void setUser2Id(String user2Id) {
        this.user2Id = user2Id;
    }
    
    public LocalDateTime getLinkedAt() {
        return linkedAt;
    }
    
    public void setLinkedAt(LocalDateTime linkedAt) {
        this.linkedAt = linkedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    /**
     * Helper method to check if a user is part of this partnership
     * @param userId The user ID to check
     * @return true if the user is either user1 or user2 in this partnership
     */
    public boolean containsUser(String userId) {
        return user1Id.equals(userId) || user2Id.equals(userId);
    }
    
    /**
     * Helper method to get the partner of a given user
     * @param userId The user ID to get the partner for
     * @return The partner's user ID, or null if the user is not part of this partnership
     */
    public String getPartnerOf(String userId) {
        if (user1Id.equals(userId)) {
            return user2Id;
        } else if (user2Id.equals(userId)) {
            return user1Id;
        }
        return null;
    }
} 