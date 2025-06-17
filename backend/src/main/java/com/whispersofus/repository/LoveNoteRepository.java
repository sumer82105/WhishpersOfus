package com.whispersofus.repository;

import com.whispersofus.model.LoveNote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoveNoteRepository extends MongoRepository<LoveNote, String> {
    
    // Find notes by receiver
    Page<LoveNote> findByReceiverIdOrderByCreatedAtDesc(String receiverId, Pageable pageable);
    
    // Find notes by sender
    Page<LoveNote> findBySenderIdOrderByCreatedAtDesc(String senderId, Pageable pageable);
    
    // Find unread notes for a specific receiver
    List<LoveNote> findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(String receiverId);
    
    // Count unread notes for a specific receiver
    long countByReceiverIdAndIsReadFalse(String receiverId);
    
    // Find notes between two users
    @Query("{ $or: [ { $and: [ { 'senderId': ?0 }, { 'receiverId': ?1 } ] }, { $and: [ { 'senderId': ?1 }, { 'receiverId': ?0 } ] } ] }")
    Page<LoveNote> findNotesBetweenUsers(String userId1, String userId2, Pageable pageable);
    
    // Find notes by emotion tag
    List<LoveNote> findByEmotionTagOrderByCreatedAtDesc(String emotionTag);
    
    // Find notes by sender or receiver
    @Query("{ $or: [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] }")
    Page<LoveNote> findByUserInvolvement(String userId, Pageable pageable);
} 