package com.whispersofus.repository;

import com.whispersofus.model.PartnerRequest;
import com.whispersofus.model.PartnerRequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for PartnerRequest entity
 * Provides data access methods for partner request operations
 */
@Repository
public interface PartnerRequestRepository extends MongoRepository<PartnerRequest, String> {
    
    /**
     * Find all partner requests received by a specific user
     * @param receiverId The ID of the user who received the requests
     * @return List of partner requests received by the user
     */
    List<PartnerRequest> findByReceiverId(String receiverId);
    
    /**
     * Find all partner requests sent by a specific user
     * @param senderId The ID of the user who sent the requests
     * @return List of partner requests sent by the user
     */
    List<PartnerRequest> findBySenderId(String senderId);
    
    /**
     * Find all partner requests received by a user with a specific status
     * @param receiverId The ID of the user who received the requests
     * @param status The status of the requests to filter by
     * @return List of partner requests matching the criteria
     */
    List<PartnerRequest> findByReceiverIdAndStatus(String receiverId, PartnerRequestStatus status);
    
    /**
     * Find all partner requests sent by a user with a specific status
     * @param senderId The ID of the user who sent the requests
     * @param status The status of the requests to filter by
     * @return List of partner requests matching the criteria
     */
    List<PartnerRequest> findBySenderIdAndStatus(String senderId, PartnerRequestStatus status);
    
    /**
     * Check if a partner request exists between two users (in either direction)
     * @param senderId The ID of the sender
     * @param receiverId The ID of the receiver
     * @return Optional containing the request if it exists
     */
    @Query("{'$or': [{'senderId': ?0, 'receiverId': ?1}, {'senderId': ?1, 'receiverId': ?0}]}")
    Optional<PartnerRequest> findByBothUsers(String senderId, String receiverId);
    
    /**
     * Check if there's a pending request between two users (in either direction)
     * @param senderId The ID of the sender
     * @param receiverId The ID of the receiver
     * @return Optional containing the pending request if it exists
     */
    @Query("{'$or': [{'senderId': ?0, 'receiverId': ?1}, {'senderId': ?1, 'receiverId': ?0}], 'status': 'PENDING'}")
    Optional<PartnerRequest> findPendingRequestBetweenUsers(String senderId, String receiverId);
} 