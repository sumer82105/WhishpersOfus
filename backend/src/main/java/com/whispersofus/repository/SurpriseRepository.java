package com.whispersofus.repository;

import com.whispersofus.model.Surprise;
import com.whispersofus.model.ContentType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurpriseRepository extends MongoRepository<Surprise, String> {
    
    // Find all surprises ordered by creation date
    List<Surprise> findAllByOrderByCreatedAtDesc();
    
    // Find unlocked surprises
    List<Surprise> findByIsUnlockedTrueOrderByUnlockDateDesc();
    
    // Find locked surprises
    List<Surprise> findByIsUnlockedFalseOrderByCreatedAtDesc();
    
    // Find surprises by creator
    List<Surprise> findByCreatorIdOrderByCreatedAtDesc(String creatorId);
    
    // Find surprises by content type
    List<Surprise> findByContentTypeOrderByCreatedAtDesc(ContentType contentType);
    
    // Count unlocked surprises
    long countByIsUnlockedTrue();
    
    // Count total surprises
    long countByCreatorId(String creatorId);
} 