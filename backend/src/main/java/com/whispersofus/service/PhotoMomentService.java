package com.whispersofus.service;

import com.whispersofus.dto.PhotoMomentStatsResponse;
import com.whispersofus.model.PhotoMoment;
import com.whispersofus.repository.PhotoMomentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PhotoMomentService {
    
    private final PhotoMomentRepository photoMomentRepository;
    
    public PhotoMoment createPhotoMoment(String photoUrl, String caption, String location, LocalDateTime takenAt) {
        log.info("Creating new photo moment with URL: {}", photoUrl);
        
        PhotoMoment photoMoment = new PhotoMoment();
        photoMoment.setPhotoUrl(photoUrl);
        photoMoment.setCaption(caption);
        photoMoment.setLocation(location);
        photoMoment.setTakenAt(takenAt != null ? takenAt : LocalDateTime.now());
        
        return photoMomentRepository.save(photoMoment);
    }
    
    public Page<PhotoMoment> getAllPhotoMoments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return photoMomentRepository.findAllByOrderByUploadedAtDesc(pageable);
    }
    
    public List<PhotoMoment> getFavoritePhotos() {
        return photoMomentRepository.findByIsFavoriteTrueOrderByUploadedAtDesc();
    }
    
    public List<PhotoMoment> getRecentPhotos(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return photoMomentRepository.findRecentPhotoMoments(since);
    }
    
    public List<PhotoMoment> getPhotosByLocation(String location) {
        return photoMomentRepository.findByLocationContainingIgnoreCaseOrderByUploadedAtDesc(location);
    }
    
    public Optional<PhotoMoment> findById(String id) {
        return photoMomentRepository.findById(id);
    }
    
    public PhotoMoment toggleFavorite(String id) {
        Optional<PhotoMoment> photoOpt = photoMomentRepository.findById(id);
        if (photoOpt.isPresent()) {
            PhotoMoment photo = photoOpt.get();
            photo.setFavorite(!photo.isFavorite());
            
            log.info("Toggling favorite status for photo: {} to {}", id, photo.isFavorite());
            return photoMomentRepository.save(photo);
        }
        throw new RuntimeException("Photo moment not found with id: " + id);
    }
    
    public PhotoMoment updatePhotoMoment(String id, String photoUrl, String caption, String location, LocalDateTime takenAt) {
        Optional<PhotoMoment> photoOpt = photoMomentRepository.findById(id);
        if (photoOpt.isPresent()) {
            PhotoMoment photo = photoOpt.get();
            photo.setPhotoUrl(photoUrl);
            photo.setCaption(caption);
            photo.setLocation(location);
            photo.setTakenAt(takenAt != null ? takenAt : photo.getTakenAt());
            
            log.info("Updating photo moment: {}", id);
            return photoMomentRepository.save(photo);
        }
        throw new RuntimeException("Photo moment not found with id: " + id);
    }
    
    public void deletePhotoMoment(String id) {
        log.info("Deleting photo moment: {}", id);
        photoMomentRepository.deleteById(id);
    }
    
    public PhotoMomentStatsResponse getPhotoStats() {
        long totalPhotos = photoMomentRepository.count();
        long favoritePhotos = photoMomentRepository.countByIsFavoriteTrue();
        
        // Photos uploaded this month
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        List<PhotoMoment> thisMonthPhotos = photoMomentRepository.findRecentPhotoMoments(startOfMonth);
        long photosThisMonth = thisMonthPhotos.size();
        
        return new PhotoMomentStatsResponse(totalPhotos, favoritePhotos, photosThisMonth);
    }
} 