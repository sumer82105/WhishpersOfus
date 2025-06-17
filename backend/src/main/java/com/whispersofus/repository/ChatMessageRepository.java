package com.whispersofus.repository;

import com.whispersofus.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    
    // Find messages between two users
    @Query("{ $or: [ " +
           "{ 'senderId': ?0, 'receiverId': ?1 }, " +
           "{ 'senderId': ?1, 'receiverId': ?0 } " +
           "] }")
    Page<ChatMessage> findMessagesBetweenUsers(String userId1, String userId2, Pageable pageable);
    
    // Find unread messages for a user
    List<ChatMessage> findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(String receiverId);
    
    // Count unread messages for a user
    long countByReceiverIdAndIsReadFalse(String receiverId);
    
    // Find latest message between two users
    @Query(value = "{ $or: [ " +
           "{ 'senderId': ?0, 'receiverId': ?1 }, " +
           "{ 'senderId': ?1, 'receiverId': ?0 } " +
           "] }", 
           sort = "{ 'createdAt': -1 }")
    List<ChatMessage> findLatestMessageBetweenUsers(String userId1, String userId2);
    
    // Delete messages between users
    void deleteBySenderIdAndReceiverId(String senderId, String receiverId);
} 