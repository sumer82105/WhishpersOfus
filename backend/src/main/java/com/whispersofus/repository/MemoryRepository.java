package com.whispersofus.repository;

import com.whispersofus.model.Memory;
import com.whispersofus.model.MemoryType;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MemoryRepository extends MongoRepository<Memory, String> {
    
    // Find all memories ordered by memory date
    List<Memory> findAllByOrderByMemoryDateAsc();
    List<Memory> findAllByOrderByMemoryDateDesc();
    
    // Find memories by creator
    List<Memory> findByCreatorIdOrderByMemoryDateDesc(String creatorId);
    
    // Find milestone memories
    List<Memory> findByIsMilestoneTrueOrderByMemoryDateAsc();
    
    // Find memories by type
    List<Memory> findByTypeOrderByMemoryDateDesc(MemoryType type);
    
    // Find memories in date range
    @Query("{ 'memoryDate': { $gte: ?0, $lte: ?1 } }")
    List<Memory> findByMemoryDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find memories by year
    @Query("{ $expr: { $eq: [ { $year: '$memoryDate' }, ?0 ] } }")
    List<Memory> findByYear(int year);
    
    // Find memories with photos
    @Query("{ 'photoUrls': { $exists: true, $ne: null, $not: { $size: 0 } } }")
    List<Memory> findMemoriesWithPhotos();
} 