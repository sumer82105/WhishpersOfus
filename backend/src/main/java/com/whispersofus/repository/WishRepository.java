package com.whispersofus.repository;

import com.whispersofus.model.Wish;
import com.whispersofus.model.WishCategory;
import com.whispersofus.model.WishStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WishRepository extends MongoRepository<Wish, String> {
    
    // Find all wishes ordered by creation date
    List<Wish> findAllByOrderByCreatedAtDesc();
    List<Wish> findAllByOrderByCreatedAtAsc();
    
    // Find wishes by status
    List<Wish> findByStatusOrderByCreatedAtDesc(WishStatus status);
    List<Wish> findByStatusOrderByCreatedAtAsc(WishStatus status);
    
    // Find wishes by category
    List<Wish> findByCategoryOrderByCreatedAtDesc(WishCategory category);
    List<Wish> findByCategoryOrderByCreatedAtAsc(WishCategory category);
    
    // Find wishes by creator
    List<Wish> findByCreatorIdOrderByCreatedAtDesc(String creatorId);
    
    // Find wishes by status and category
    List<Wish> findByStatusAndCategoryOrderByCreatedAtDesc(WishStatus status, WishCategory category);
    
    // Find recent wishes
    @Query("{ 'createdAt': { $gte: ?0 } }")
    List<Wish> findRecentWishes(LocalDateTime since);
    
    // Find fulfilled wishes in date range
    @Query("{ 'status': 'FULFILLED', 'fulfilledAt': { $gte: ?0, $lte: ?1 } }")
    List<Wish> findFulfilledWishesInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Count wishes by status
    long countByStatus(WishStatus status);
    
    // Count wishes by category
    long countByCategory(WishCategory category);
    
    // Count wishes by creator
    long countByCreatorId(String creatorId);
    
    // Find wishes containing text in title or description
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<Wish> findByTitleOrDescriptionContainingIgnoreCase(String searchText);
} 