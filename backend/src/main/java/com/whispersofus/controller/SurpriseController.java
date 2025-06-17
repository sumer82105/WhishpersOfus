package com.whispersofus.controller;

import com.whispersofus.dto.SurpriseRequest;
import com.whispersofus.model.Surprise;
import com.whispersofus.model.ContentType;
import com.whispersofus.model.User;
import com.whispersofus.service.SurpriseService;
import com.whispersofus.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/surprises")
@RequiredArgsConstructor
@Slf4j
public class SurpriseController {
    
    private final SurpriseService surpriseService;
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<Surprise> createSurprise(@Valid @RequestBody SurpriseRequest request,
                                                  @RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            log.warn("User not found for Firebase UID: {}", firebaseUid);
            return ResponseEntity.badRequest().build();
        }
        
        Surprise surprise = surpriseService.createSurprise(
            userOpt.get().getId(),
            request.getTitle(),
            request.getDescription(),
            request.getUnlockCondition(),
            request.getContentUrl(),
            request.getContentType()
        );
        
        return ResponseEntity.ok(surprise);
    }
    
    @GetMapping
    public ResponseEntity<List<Surprise>> getAllSurprises() {
        List<Surprise> surprises = surpriseService.getAllSurprises();
        return ResponseEntity.ok(surprises);
    }
    
    @GetMapping("/unlocked")
    public ResponseEntity<List<Surprise>> getUnlockedSurprises() {
        List<Surprise> unlockedSurprises = surpriseService.getUnlockedSurprises();
        return ResponseEntity.ok(unlockedSurprises);
    }
    
    @GetMapping("/locked")
    public ResponseEntity<List<Surprise>> getLockedSurprises() {
        List<Surprise> lockedSurprises = surpriseService.getLockedSurprises();
        return ResponseEntity.ok(lockedSurprises);
    }
    
    @GetMapping("/my-surprises")
    public ResponseEntity<List<Surprise>> getMySurprises(@RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Surprise> mySurprises = surpriseService.getSurprisesByCreator(userOpt.get().getId());
        return ResponseEntity.ok(mySurprises);
    }
    
    @GetMapping("/content-type/{type}")
    public ResponseEntity<List<Surprise>> getSurprisesByContentType(@PathVariable String type) {
        try {
            ContentType contentType = ContentType.valueOf(type.toUpperCase());
            List<Surprise> surprises = surpriseService.getSurprisesByContentType(contentType);
            return ResponseEntity.ok(surprises);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid content type: {}", type);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/unlocked/count")
    public ResponseEntity<Long> getUnlockedCount() {
        long count = surpriseService.getUnlockedCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/my-count")
    public ResponseEntity<Long> getMyCount(@RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        long count = surpriseService.getTotalCountByCreator(userOpt.get().getId());
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Surprise> getSurprise(@PathVariable String id) {
        Optional<Surprise> surprise = surpriseService.findById(id);
        return surprise.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/unlock")
    public ResponseEntity<Surprise> unlockSurprise(@PathVariable String id) {
        try {
            Surprise surprise = surpriseService.unlockSurprise(id);
            return ResponseEntity.ok(surprise);
        } catch (RuntimeException e) {
            log.error("Failed to unlock surprise: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Surprise> updateSurprise(@PathVariable String id,
                                                  @Valid @RequestBody SurpriseRequest request,
                                                  @RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verify the user owns this surprise
        Optional<Surprise> existingSurprise = surpriseService.findById(id);
        if (existingSurprise.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingSurprise.get().getCreatorId().equals(userOpt.get().getId())) {
            log.warn("User {} attempted to update surprise {} owned by {}", 
                    userOpt.get().getId(), id, existingSurprise.get().getCreatorId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            Surprise surprise = surpriseService.updateSurprise(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getUnlockCondition(),
                request.getContentUrl(),
                request.getContentType()
            );
            return ResponseEntity.ok(surprise);
        } catch (RuntimeException e) {
            log.error("Failed to update surprise: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurprise(@PathVariable String id,
                                              @RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verify the user owns this surprise
        Optional<Surprise> existingSurprise = surpriseService.findById(id);
        if (existingSurprise.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingSurprise.get().getCreatorId().equals(userOpt.get().getId())) {
            log.warn("User {} attempted to delete surprise {} owned by {}", 
                    userOpt.get().getId(), id, existingSurprise.get().getCreatorId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            surpriseService.deleteSurprise(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Failed to delete surprise: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
} 