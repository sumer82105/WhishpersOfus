package com.whispersofus.service;

import com.whispersofus.model.Surprise;
import com.whispersofus.model.ContentType;
import com.whispersofus.repository.SurpriseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SurpriseService {
    
    private final SurpriseRepository surpriseRepository;
    
    public Surprise createSurprise(String creatorId, String title, String description, 
                                 String unlockCondition, String contentUrl, String contentTypeStr) {
        log.info("Creating new surprise by creator: {}", creatorId);
        
        Surprise surprise = new Surprise();
        surprise.setCreatorId(creatorId);
        surprise.setTitle(title);
        surprise.setDescription(description);
        surprise.setUnlockCondition(unlockCondition);
        surprise.setContentUrl(contentUrl);
        
        // Convert string to ContentType enum
        if (contentTypeStr != null) {
            try {
                ContentType contentType = ContentType.valueOf(contentTypeStr.toUpperCase());
                surprise.setContentType(contentType);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid content type: {}, using default MESSAGE", contentTypeStr);
                surprise.setContentType(ContentType.MESSAGE);
            }
        }
        
        return surpriseRepository.save(surprise);
    }
    
    public List<Surprise> getAllSurprises() {
        return surpriseRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Surprise> getUnlockedSurprises() {
        return surpriseRepository.findByIsUnlockedTrueOrderByUnlockDateDesc();
    }
    
    public List<Surprise> getLockedSurprises() {
        return surpriseRepository.findByIsUnlockedFalseOrderByCreatedAtDesc();
    }
    
    public List<Surprise> getSurprisesByCreator(String creatorId) {
        return surpriseRepository.findByCreatorIdOrderByCreatedAtDesc(creatorId);
    }
    
    public List<Surprise> getSurprisesByContentType(ContentType contentType) {
        return surpriseRepository.findByContentTypeOrderByCreatedAtDesc(contentType);
    }
    
    public Optional<Surprise> findById(String id) {
        return surpriseRepository.findById(id);
    }
    
    public Surprise unlockSurprise(String surpriseId) {
        Optional<Surprise> surpriseOpt = surpriseRepository.findById(surpriseId);
        if (surpriseOpt.isPresent()) {
            Surprise surprise = surpriseOpt.get();
            if (!surprise.isUnlocked()) {
                surprise.setUnlocked(true);
                log.info("Unlocking surprise: {}", surpriseId);
                return surpriseRepository.save(surprise);
            } else {
                log.warn("Surprise {} is already unlocked", surpriseId);
                return surprise;
            }
        }
        throw new RuntimeException("Surprise not found with id: " + surpriseId);
    }
    
    public Surprise updateSurprise(String id, String title, String description, 
                                 String unlockCondition, String contentUrl, String contentTypeStr) {
        Optional<Surprise> surpriseOpt = surpriseRepository.findById(id);
        if (surpriseOpt.isPresent()) {
            Surprise surprise = surpriseOpt.get();
            
            if (title != null) surprise.setTitle(title);
            if (description != null) surprise.setDescription(description);
            if (unlockCondition != null) surprise.setUnlockCondition(unlockCondition);
            if (contentUrl != null) surprise.setContentUrl(contentUrl);
            
            if (contentTypeStr != null) {
                try {
                    ContentType contentType = ContentType.valueOf(contentTypeStr.toUpperCase());
                    surprise.setContentType(contentType);
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid content type: {}, keeping existing", contentTypeStr);
                }
            }
            
            log.info("Updating surprise: {}", id);
            return surpriseRepository.save(surprise);
        }
        throw new RuntimeException("Surprise not found with id: " + id);
    }
    
    public void deleteSurprise(String surpriseId) {
        log.info("Deleting surprise: {}", surpriseId);
        surpriseRepository.deleteById(surpriseId);
    }
    
    public long getUnlockedCount() {
        return surpriseRepository.countByIsUnlockedTrue();
    }
    
    public long getTotalCountByCreator(String creatorId) {
        return surpriseRepository.countByCreatorId(creatorId);
    }
} 