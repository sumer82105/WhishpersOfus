package com.whispersofus.dto;

/**
 * Response DTO for PhotoMoment statistics
 */
public class PhotoMomentStatsResponse {
    private long totalPhotos;
    private long favoritePhotos;
    private long photosThisMonth;
    private long photosThisWeek;
    private String mostRecentPhotoDate;
    
    public PhotoMomentStatsResponse() {}
    
    public PhotoMomentStatsResponse(long totalPhotos, long favoritePhotos, long photosThisMonth) {
        this.totalPhotos = totalPhotos;
        this.favoritePhotos = favoritePhotos;
        this.photosThisMonth = photosThisMonth;
    }
    
    public PhotoMomentStatsResponse(long totalPhotos, long favoritePhotos, long photosThisMonth, 
                                   long photosThisWeek, String mostRecentPhotoDate) {
        this.totalPhotos = totalPhotos;
        this.favoritePhotos = favoritePhotos;
        this.photosThisMonth = photosThisMonth;
        this.photosThisWeek = photosThisWeek;
        this.mostRecentPhotoDate = mostRecentPhotoDate;
    }
    
    // Getters and Setters
    public long getTotalPhotos() {
        return totalPhotos;
    }
    
    public void setTotalPhotos(long totalPhotos) {
        this.totalPhotos = totalPhotos;
    }
    
    public long getFavoritePhotos() {
        return favoritePhotos;
    }
    
    public void setFavoritePhotos(long favoritePhotos) {
        this.favoritePhotos = favoritePhotos;
    }
    
    public long getPhotosThisMonth() {
        return photosThisMonth;
    }
    
    public void setPhotosThisMonth(long photosThisMonth) {
        this.photosThisMonth = photosThisMonth;
    }
    
    public long getPhotosThisWeek() {
        return photosThisWeek;
    }
    
    public void setPhotosThisWeek(long photosThisWeek) {
        this.photosThisWeek = photosThisWeek;
    }
    
    public String getMostRecentPhotoDate() {
        return mostRecentPhotoDate;
    }
    
    public void setMostRecentPhotoDate(String mostRecentPhotoDate) {
        this.mostRecentPhotoDate = mostRecentPhotoDate;
    }
} 