package com.whispersofus.controller;

import com.whispersofus.dto.ApiResponse;
import com.whispersofus.dto.PartnerRequestDto;
import com.whispersofus.dto.PartnerRequestResponseDto;
import com.whispersofus.model.PartnerRequest;
import com.whispersofus.model.User;
import com.whispersofus.service.PartnerService;
import com.whispersofus.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for partner-related operations
 * Provides endpoints for sending partner requests, responding to requests, and managing partnerships
 */
@RestController
@RequestMapping("/partners")
@RequiredArgsConstructor
@Slf4j
public class PartnerController {
    
    private final PartnerService partnerService;
    private final UserService userService;
    
    /**
     * Send a partner request to another user
     * @param firebaseUid The Firebase UID of the authenticated user
     * @param requestDto The partner request data
     * @return Response containing the created partner request
     */
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<PartnerRequest>> sendPartnerRequest(
            @RequestHeader("Firebase-UID") String firebaseUid,
            @RequestBody PartnerRequestDto requestDto) {
        
        log.info("Received partner request from user with Firebase UID: {}", firebaseUid);
        
        try {
            // Get sender user by Firebase UID
            Optional<User> senderOpt = userService.findByFirebaseUid(firebaseUid);
            if (senderOpt.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("Sender user not found"));
            }
            
            String senderId = senderOpt.get().getId();
            String receiverId = requestDto.getReceiverId();
            
            // Validate receiver exists
            if (!userService.existsById(receiverId)) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("Receiver user not found"));
            }
            
            PartnerRequest partnerRequest = partnerService.sendPartnerRequest(senderId, receiverId);
            
            return ResponseEntity.ok(ApiResponse.success("Partner request sent successfully", partnerRequest));
            
        } catch (IllegalArgumentException e) {
            log.warn("Failed to send partner request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error sending partner request", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("An unexpected error occurred"));
        }
    }
    
    /**
     * Respond to a partner request (accept or reject)
     * @param firebaseUid The Firebase UID of the authenticated user
     * @param responseDto The response data
     * @return Response containing the updated partner request
     */
    @PostMapping("/respond")
    public ResponseEntity<ApiResponse<PartnerRequest>> respondToPartnerRequest(
            @RequestHeader("Firebase-UID") String firebaseUid,
            @RequestBody PartnerRequestResponseDto responseDto) {
        
        log.info("Received partner request response from user with Firebase UID: {}", firebaseUid);
        
        try {
            // Get responder user by Firebase UID
            Optional<User> responderOpt = userService.findByFirebaseUid(firebaseUid);
            if (responderOpt.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("Responder user not found"));
            }
            
            String responderId = responderOpt.get().getId();
            String requestId = responseDto.getRequestId();
            boolean accepted = responseDto.isAccepted();
            
            PartnerRequest updatedRequest = partnerService.respondToPartnerRequest(requestId, accepted, responderId);
            
            String message = accepted ? "Partner request accepted successfully" : "Partner request rejected";
            return ResponseEntity.ok(ApiResponse.success(message, updatedRequest));
            
        } catch (IllegalArgumentException e) {
            log.warn("Failed to respond to partner request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error responding to partner request", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("An unexpected error occurred"));
        }
    }
    
    /**
     * Get the current user's partner
     * @param firebaseUid The Firebase UID of the authenticated user
     * @return Response containing the partner user if exists
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getMyPartner(@RequestHeader("Firebase-UID") String firebaseUid) {
        log.debug("Getting partner for user with Firebase UID: {}", firebaseUid);
        
        try {
            // Get current user by Firebase UID
            Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("User not found"));
            }
            
            String userId = userOpt.get().getId();
            Optional<User> partnerOpt = partnerService.getPartner(userId);
            
            if (partnerOpt.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Partner found", partnerOpt.get()));
            } else {
                return ResponseEntity.ok(ApiResponse.success("No partner found", null));
            }
            
        } catch (Exception e) {
            log.error("Unexpected error getting partner", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("An unexpected error occurred"));
        }
    }
    
    /**
     * Get all pending partner requests received by the current user
     * @param firebaseUid The Firebase UID of the authenticated user
     * @return Response containing the list of pending requests
     */
    @GetMapping("/requests/pending")
    public ResponseEntity<ApiResponse<List<PartnerRequest>>> getPendingRequests(@RequestHeader("Firebase-UID") String firebaseUid) {
        log.debug("Getting pending partner requests for user with Firebase UID: {}", firebaseUid);
        
        try {
            // Get current user by Firebase UID
            Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("User not found"));
            }
            
            String userId = userOpt.get().getId();
            List<PartnerRequest> pendingRequests = partnerService.getPendingReceivedRequests(userId);
            
            return ResponseEntity.ok(ApiResponse.success("Pending requests retrieved successfully", pendingRequests));
            
        } catch (Exception e) {
            log.error("Unexpected error getting pending requests", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("An unexpected error occurred"));
        }
    }
    
    /**
     * Get all partner requests received by the current user
     * @param firebaseUid The Firebase UID of the authenticated user
     * @return Response containing the list of received requests
     */
    @GetMapping("/requests/received")
    public ResponseEntity<ApiResponse<List<PartnerRequest>>> getReceivedRequests(@RequestHeader("Firebase-UID") String firebaseUid) {
        log.debug("Getting received partner requests for user with Firebase UID: {}", firebaseUid);
        
        try {
            // Get current user by Firebase UID
            Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("User not found"));
            }
            
            String userId = userOpt.get().getId();
            List<PartnerRequest> receivedRequests = partnerService.getReceivedRequests(userId);
            
            return ResponseEntity.ok(ApiResponse.success("Received requests retrieved successfully", receivedRequests));
            
        } catch (Exception e) {
            log.error("Unexpected error getting received requests", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("An unexpected error occurred"));
        }
    }
    
    /**
     * Get all partner requests sent by the current user
     * @param firebaseUid The Firebase UID of the authenticated user
     * @return Response containing the list of sent requests
     */
    @GetMapping("/requests/sent")
    public ResponseEntity<ApiResponse<List<PartnerRequest>>> getSentRequests(@RequestHeader("Firebase-UID") String firebaseUid) {
        log.debug("Getting sent partner requests for user with Firebase UID: {}", firebaseUid);
        
        try {
            // Get current user by Firebase UID
            Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("User not found"));
            }
            
            String userId = userOpt.get().getId();
            List<PartnerRequest> sentRequests = partnerService.getSentRequests(userId);
            
            return ResponseEntity.ok(ApiResponse.success("Sent requests retrieved successfully", sentRequests));
            
        } catch (Exception e) {
            log.error("Unexpected error getting sent requests", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("An unexpected error occurred"));
        }
    }
} 