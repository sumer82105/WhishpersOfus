package com.whispersofus.service;

import com.whispersofus.controller.WishController.WishStats;
import com.whispersofus.model.Wish;
import com.whispersofus.model.WishCategory;
import com.whispersofus.model.WishStatus;
import com.whispersofus.repository.WishRepository;
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
public class WishService {
    
    private final WishRepository wishRepository;
    
    public Wish createWish(String title, String description, String photoUrl, WishCategory category) {
        log.info("Creating new wish: {}", title);
        
        Wish wish = new Wish();
        wish.setTitle(title);
        wish.setDescription(description);
        wish.setPhotoUrl(photoUrl);
        wish.setCategory(category);
        wish.setStatus(WishStatus.PENDING);
        
        return wishRepository.save(wish);
    }
    
    public List<Wish> getAllWishes() {
        return wishRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Wish> getWishesByStatus(WishStatus status) {
        return wishRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public List<Wish> getWishesByCategory(WishCategory category) {
        return wishRepository.findByCategoryOrderByCreatedAtDesc(category);
    }
    
    public Optional<Wish> findById(String id) {
        return wishRepository.findById(id);
    }
    
    public Wish updateWishStatus(String id, WishStatus status, String fulfillmentNote) {
        Optional<Wish> wishOpt = wishRepository.findById(id);
        if (wishOpt.isPresent()) {
            Wish wish = wishOpt.get();
            wish.setStatus(status);
            if (fulfillmentNote != null && !fulfillmentNote.trim().isEmpty()) {
                wish.setFulfillmentNote(fulfillmentNote);
            }
            
            log.info("Updating wish status: {} to {}", id, status);
            return wishRepository.save(wish);
        }
        throw new RuntimeException("Wish not found with id: " + id);
    }
    
    public Wish updateWish(String id, String title, String description, String photoUrl, WishCategory category) {
        Optional<Wish> wishOpt = wishRepository.findById(id);
        if (wishOpt.isPresent()) {
            Wish wish = wishOpt.get();
            wish.setTitle(title);
            wish.setDescription(description);
            wish.setPhotoUrl(photoUrl);
            wish.setCategory(category);
            
            log.info("Updating wish: {}", id);
            return wishRepository.save(wish);
        }
        throw new RuntimeException("Wish not found with id: " + id);
    }
    
    public void deleteWish(String id) {
        log.info("Deleting wish: {}", id);
        wishRepository.deleteById(id);
    }
    
    public WishStats getWishStats() {
        long totalWishes = wishRepository.count();
        long pendingWishes = wishRepository.countByStatus(WishStatus.PENDING);
        long fulfilledWishes = wishRepository.countByStatus(WishStatus.FULFILLED);
        long cancelledWishes = wishRepository.countByStatus(WishStatus.CANCELLED);
        
        return new WishStats(totalWishes, pendingWishes, fulfilledWishes, cancelledWishes);
    }
} 