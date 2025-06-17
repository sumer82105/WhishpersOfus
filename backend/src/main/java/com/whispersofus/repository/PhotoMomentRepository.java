package com.whispersofus.repository;

import com.whispersofus.model.PhotoMoment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PhotoMomentRepository extends MongoRepository<PhotoMoment, String> {
    
    // Find all photo moments ordered by upload date
    Page<PhotoMoment> findAllByOrderByUploadedAtDesc(Pageable pageable);
    
    // Find photo moments by uploader
    List<PhotoMoment> findByUploaderIdOrderByUploadedAtDesc(String uploaderId);
    
    // Find favorite photo moments
    List<PhotoMoment> findByIsFavoriteTrueOrderByUploadedAtDesc();
    
    // Find photo moments with pagination
    Page<PhotoMoment> findByUploaderIdOrderByUploadedAtDesc(String uploaderId, Pageable pageable);
    
    // Find recent photo moments
    @Query("{ 'uploadedAt': { $gte: ?0 } }")
    List<PhotoMoment> findRecentPhotoMoments(LocalDateTime since);
    
    // Find photo moments by location
    List<PhotoMoment> findByLocationContainingIgnoreCaseOrderByUploadedAtDesc(String location);
    
    // Count favorite photos
    long countByIsFavoriteTrue();
    
    // Count photos by uploader
    long countByUploaderId(String uploaderId);
} 