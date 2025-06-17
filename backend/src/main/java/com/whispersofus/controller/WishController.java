package com.whispersofus.controller;

import com.whispersofus.dto.WishRequest;
import com.whispersofus.dto.WishStatusUpdateRequest;
import com.whispersofus.model.Wish;
import com.whispersofus.model.WishCategory;
import com.whispersofus.model.WishStatus;
import com.whispersofus.service.WishService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wishes")
@RequiredArgsConstructor
@Slf4j
public class WishController {
    
    private final WishService wishService;
    
    @PostMapping
    public ResponseEntity<Wish> createWish(@Valid @RequestBody WishRequest request) {
        Wish wish = wishService.createWish(
            request.getTitle(),
            request.getDescription(),
            request.getPhotoUrl(),
            request.getCategory()
        );
        
        return ResponseEntity.ok(wish);
    }
    
    @GetMapping
    public ResponseEntity<List<Wish>> getAllWishes() {
        List<Wish> wishes = wishService.getAllWishes();
        return ResponseEntity.ok(wishes);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Wish>> getWishesByStatus(@PathVariable WishStatus status) {
        List<Wish> wishes = wishService.getWishesByStatus(status);
        return ResponseEntity.ok(wishes);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Wish>> getWishesByCategory(@PathVariable WishCategory category) {
        List<Wish> wishes = wishService.getWishesByCategory(category);
        return ResponseEntity.ok(wishes);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Wish>> getPendingWishes() {
        List<Wish> wishes = wishService.getWishesByStatus(WishStatus.PENDING);
        return ResponseEntity.ok(wishes);
    }
    
    @GetMapping("/fulfilled")
    public ResponseEntity<List<Wish>> getFulfilledWishes() {
        List<Wish> wishes = wishService.getWishesByStatus(WishStatus.FULFILLED);
        return ResponseEntity.ok(wishes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Wish> getWish(@PathVariable String id) {
        return wishService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Wish> updateWishStatus(
            @PathVariable String id, 
            @Valid @RequestBody WishStatusUpdateRequest request) {
        try {
            Wish wish = wishService.updateWishStatus(
                id, 
                request.getStatus(), 
                request.getFulfillmentNote()
            );
            return ResponseEntity.ok(wish);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Wish> updateWish(
            @PathVariable String id, 
            @Valid @RequestBody WishRequest request) {
        try {
            Wish wish = wishService.updateWish(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getPhotoUrl(),
                request.getCategory()
            );
            return ResponseEntity.ok(wish);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWish(@PathVariable String id) {
        try {
            wishService.deleteWish(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<WishStats> getWishStats() {
        WishStats stats = wishService.getWishStats();
        return ResponseEntity.ok(stats);
    }
    
    // Inner class for stats response
    public static class WishStats {
        private long totalWishes;
        private long pendingWishes;
        private long fulfilledWishes;
        private long cancelledWishes;
        
        public WishStats(long totalWishes, long pendingWishes, long fulfilledWishes, long cancelledWishes) {
            this.totalWishes = totalWishes;
            this.pendingWishes = pendingWishes;
            this.fulfilledWishes = fulfilledWishes;
            this.cancelledWishes = cancelledWishes;
        }
        
        // Getters
        public long getTotalWishes() { return totalWishes; }
        public long getPendingWishes() { return pendingWishes; }
        public long getFulfilledWishes() { return fulfilledWishes; }
        public long getCancelledWishes() { return cancelledWishes; }
    }
} 