package com.whispersofus.controller;

import com.whispersofus.dto.PhotoMomentRequest;
import com.whispersofus.dto.PhotoMomentStatsResponse;
import com.whispersofus.model.PhotoMoment;
import com.whispersofus.service.PhotoMomentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/photo-moments")
@RequiredArgsConstructor
@Slf4j
public class PhotoMomentController {
    
    private final PhotoMomentService photoMomentService;
    
    @PostMapping
    public ResponseEntity<PhotoMoment> createPhotoMoment(@Valid @RequestBody PhotoMomentRequest request) {
        PhotoMoment photoMoment = photoMomentService.createPhotoMoment(
            request.getPhotoUrl(),
            request.getCaption(),
            request.getLocation(),
            request.getTakenAt()
        );
        
        return ResponseEntity.ok(photoMoment);
    }
    
    @GetMapping
    public ResponseEntity<Page<PhotoMoment>> getAllPhotoMoments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<PhotoMoment> photoMoments = photoMomentService.getAllPhotoMoments(page, size);
        return ResponseEntity.ok(photoMoments);
    }
    
    @GetMapping("/favorites")
    public ResponseEntity<List<PhotoMoment>> getFavoritePhotos() {
        List<PhotoMoment> favorites = photoMomentService.getFavoritePhotos();
        return ResponseEntity.ok(favorites);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<PhotoMoment>> getRecentPhotos(
            @RequestParam(defaultValue = "7") int days) {
        List<PhotoMoment> recentPhotos = photoMomentService.getRecentPhotos(days);
        return ResponseEntity.ok(recentPhotos);
    }
    
    @GetMapping("/location/{location}")
    public ResponseEntity<List<PhotoMoment>> getPhotosByLocation(@PathVariable String location) {
        List<PhotoMoment> photos = photoMomentService.getPhotosByLocation(location);
        return ResponseEntity.ok(photos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PhotoMoment> getPhotoMoment(@PathVariable String id) {
        return photoMomentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/favorite")
    public ResponseEntity<PhotoMoment> toggleFavorite(@PathVariable String id) {
        try {
            PhotoMoment photoMoment = photoMomentService.toggleFavorite(id);
            return ResponseEntity.ok(photoMoment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PhotoMoment> updatePhotoMoment(
            @PathVariable String id, 
            @Valid @RequestBody PhotoMomentRequest request) {
        try {
            PhotoMoment photoMoment = photoMomentService.updatePhotoMoment(
                id,
                request.getPhotoUrl(),
                request.getCaption(),
                request.getLocation(),
                request.getTakenAt()
            );
            return ResponseEntity.ok(photoMoment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhotoMoment(@PathVariable String id) {
        try {
            photoMomentService.deletePhotoMoment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<PhotoMomentStatsResponse> getPhotoStats() {
        PhotoMomentStatsResponse stats = photoMomentService.getPhotoStats();
        return ResponseEntity.ok(stats);
    }
} 