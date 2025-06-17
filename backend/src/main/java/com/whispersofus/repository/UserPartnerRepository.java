package com.whispersofus.repository;

import com.whispersofus.model.UserPartner;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for UserPartner entity
 * Provides data access methods for user partnership operations
 */
@Repository
public interface UserPartnerRepository extends MongoRepository<UserPartner, String> {
    
    /**
     * Find the partnership where the user is either user1 or user2
     * @param userId The ID of the user to find partnership for
     * @return Optional containing the partnership if it exists
     */
    @Query("{'$or': [{'user1Id': ?0}, {'user2Id': ?0}]}")
    Optional<UserPartner> findByUserId(String userId);
    
    /**
     * Find partnership between two specific users
     * @param user1Id The ID of the first user
     * @param user2Id The ID of the second user
     * @return Optional containing the partnership if it exists
     */
    @Query("{'$or': [{'user1Id': ?0, 'user2Id': ?1}, {'user1Id': ?1, 'user2Id': ?0}]}")
    Optional<UserPartner> findByBothUsers(String user1Id, String user2Id);
    
    /**
     * Check if a user has an active partnership
     * @param userId The ID of the user to check
     * @return true if the user has a partnership, false otherwise
     */
    @Query(value = "{'$or': [{'user1Id': ?0}, {'user2Id': ?0}]}", exists = true)
    boolean existsByUserId(String userId);
} 