package com.whispersofus.service;

import com.whispersofus.model.PartnerRequest;
import com.whispersofus.model.PartnerRequestStatus;
import com.whispersofus.model.User;
import com.whispersofus.model.UserPartner;
import com.whispersofus.repository.PartnerRequestRepository;
import com.whispersofus.repository.UserPartnerRepository;
import com.whispersofus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for managing partner relationships and requests
 * Handles all business logic for partner operations including sending requests,
 * accepting/rejecting requests, and managing partnerships
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PartnerService {
    
    private final PartnerRequestRepository partnerRequestRepository;
    private final UserPartnerRepository userPartnerRepository;
    private final UserRepository userRepository;
    
    /**
     * Send a partner request from one user to another
     * @param senderId The ID of the user sending the request
     * @param receiverId The ID of the user receiving the request
     * @return The created partner request
     * @throws IllegalArgumentException if the request cannot be sent
     */
    @Transactional
    public PartnerRequest sendPartnerRequest(String senderId, String receiverId) {
        log.info("Attempting to send partner request from {} to {}", senderId, receiverId);
        
        // Validate users exist
        if (!userRepository.existsById(senderId)) {
            throw new IllegalArgumentException("Sender user not found");
        }
        if (!userRepository.existsById(receiverId)) {
            throw new IllegalArgumentException("Receiver user not found");
        }
        
        // Cannot send request to self
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send partner request to yourself");
        }
        
        // Check if sender already has a partner
        if (userPartnerRepository.existsByUserId(senderId)) {
            throw new IllegalArgumentException("You already have a partner");
        }
        
        // Check if receiver already has a partner
        if (userPartnerRepository.existsByUserId(receiverId)) {
            throw new IllegalArgumentException("User already has a partner");
        }
        
        // Check if there's already a pending request between these users
        Optional<PartnerRequest> existingRequest = partnerRequestRepository.findPendingRequestBetweenUsers(senderId, receiverId);
        if (existingRequest.isPresent()) {
            throw new IllegalArgumentException("A pending partner request already exists between these users");
        }
        
        // Create and save the partner request
        PartnerRequest partnerRequest = new PartnerRequest(senderId, receiverId);
        PartnerRequest savedRequest = partnerRequestRepository.save(partnerRequest);
        
        log.info("Partner request sent successfully from {} to {} with ID {}", senderId, receiverId, savedRequest.getId());
        return savedRequest;
    }
    
    /**
     * Respond to a partner request (accept or reject)
     * @param requestId The ID of the partner request
     * @param accepted Whether the request is accepted or rejected
     * @param responderId The ID of the user responding to the request
     * @return The updated partner request
     * @throws IllegalArgumentException if the request cannot be processed
     */
    @Transactional
    public PartnerRequest respondToPartnerRequest(String requestId, boolean accepted, String responderId) {
        log.info("User {} responding to partner request {} with decision: {}", responderId, requestId, accepted);
        
        // Find the partner request
        Optional<PartnerRequest> requestOpt = partnerRequestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            throw new IllegalArgumentException("Partner request not found");
        }
        
        PartnerRequest partnerRequest = requestOpt.get();
        
        // Validate that the responder is the receiver of the request
        if (!partnerRequest.getReceiverId().equals(responderId)) {
            throw new IllegalArgumentException("You are not authorized to respond to this request");
        }
        
        // Validate that the request is still pending
        if (partnerRequest.getStatus() != PartnerRequestStatus.PENDING) {
            throw new IllegalArgumentException("This partner request has already been responded to");
        }
        
        // Check if either user already has a partner (in case they got one since the request was sent)
        if (userPartnerRepository.existsByUserId(partnerRequest.getSenderId()) || 
            userPartnerRepository.existsByUserId(partnerRequest.getReceiverId())) {
            // Update request status to rejected since one of them already has a partner
            partnerRequest.setStatus(PartnerRequestStatus.REJECTED);
            partnerRequestRepository.save(partnerRequest);
            throw new IllegalArgumentException("One of the users already has a partner");
        }
        
        // Update request status
        if (accepted) {
            partnerRequest.setStatus(PartnerRequestStatus.ACCEPTED);
            
            // Create the partnership
            UserPartner userPartner = new UserPartner(partnerRequest.getSenderId(), partnerRequest.getReceiverId());
            userPartnerRepository.save(userPartner);
            
            log.info("Partnership created between {} and {}", partnerRequest.getSenderId(), partnerRequest.getReceiverId());
        } else {
            partnerRequest.setStatus(PartnerRequestStatus.REJECTED);
            log.info("Partner request {} rejected", requestId);
        }
        
        return partnerRequestRepository.save(partnerRequest);
    }
    
    /**
     * Get the partner of a user
     * @param userId The ID of the user
     * @return Optional containing the partner User if exists
     */
    public Optional<User> getPartner(String userId) {
        log.debug("Getting partner for user {}", userId);
        
        Optional<UserPartner> partnershipOpt = userPartnerRepository.findByUserId(userId);
        if (partnershipOpt.isEmpty()) {
            return Optional.empty();
        }
        
        UserPartner partnership = partnershipOpt.get();
        String partnerId = partnership.getPartnerOf(userId);
        
        if (partnerId == null) {
            log.warn("Invalid partnership data for user {}", userId);
            return Optional.empty();
        }
        
        return userRepository.findById(partnerId);
    }
    
    /**
     * Get all partner requests received by a user
     * @param userId The ID of the user
     * @return List of received partner requests
     */
    public List<PartnerRequest> getReceivedRequests(String userId) {
        log.debug("Getting received partner requests for user {}", userId);
        return partnerRequestRepository.findByReceiverId(userId);
    }
    
    /**
     * Get all partner requests sent by a user
     * @param userId The ID of the user
     * @return List of sent partner requests
     */
    public List<PartnerRequest> getSentRequests(String userId) {
        log.debug("Getting sent partner requests for user {}", userId);
        return partnerRequestRepository.findBySenderId(userId);
    }
    
    /**
     * Get all pending partner requests received by a user
     * @param userId The ID of the user
     * @return List of pending received partner requests
     */
    public List<PartnerRequest> getPendingReceivedRequests(String userId) {
        log.debug("Getting pending received partner requests for user {}", userId);
        return partnerRequestRepository.findByReceiverIdAndStatus(userId, PartnerRequestStatus.PENDING);
    }
    
    /**
     * Check if a user has a partner
     * @param userId The ID of the user
     * @return true if the user has a partner, false otherwise
     */
    public boolean hasPartner(String userId) {
        return userPartnerRepository.existsByUserId(userId);
    }
    
    /**
     * Check if two users are partners
     * @param user1Id The ID of the first user
     * @param user2Id The ID of the second user
     * @return true if they are partners, false otherwise
     */
    public boolean arePartners(String user1Id, String user2Id) {
        return userPartnerRepository.findByBothUsers(user1Id, user2Id).isPresent();
    }
} 