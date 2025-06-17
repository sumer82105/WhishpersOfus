package com.whispersofus.controller;

import com.whispersofus.model.User;
import com.whispersofus.model.UserRole;
import com.whispersofus.service.UserService;
import com.whispersofus.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(
            @RequestHeader("Firebase-UID") String firebaseUid,
            @RequestParam String email,
            @RequestParam String name) {
        
        if (userService.existsByFirebaseUid(firebaseUid)) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("User already exists with this Firebase UID"));
        }
        
        if (userService.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Email address is already registered"));
        }
        
        User user = userService.createOrUpdateUser(firebaseUid, email, name, UserRole.PARTNER);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", user));
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        return userOpt.map(user -> ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", user)))
                     .orElse(ResponseEntity.notFound()
                         .build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String id) {
        Optional<User> userOpt = userService.findById(id);
        return userOpt.map(user -> ResponseEntity.ok(ApiResponse.success("User found", user)))
                     .orElse(ResponseEntity.status(404)
                         .body(ApiResponse.error("User not found with ID: " + id)));
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<User>> getUserByEmail(@PathVariable String email) {
        Optional<User> userOpt = userService.findByEmail(email);
        return userOpt.map(user -> ResponseEntity.ok(ApiResponse.success("User found", user)))
                     .orElse(ResponseEntity.status(404)
                         .body(ApiResponse.error("User not found with email: " + email)));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }
    
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateCurrentUser(
            @RequestHeader("Firebase-UID") String firebaseUid,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String profileImageUrl) {
        
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("User not found with provided Firebase UID"));
        }
        
        if (name == null && profileImageUrl == null) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("At least one field (name or profileImageUrl) must be provided for update"));
        }
        
        User user = userOpt.get();
        if (name != null) {
            user.setName(name);
        }
        if (profileImageUrl != null) {
            user.setProfileImageUrl(profileImageUrl);
        }
        
        user = userService.updateUser(user);
        return ResponseEntity.ok(ApiResponse.success("User profile updated successfully", user));
    }
    
    @GetMapping("/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkUserExists(
            @RequestParam(required = false) String firebaseUid,
            @RequestParam(required = false) String email) {
        
        if (firebaseUid == null && email == null) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Either firebaseUid or email parameter must be provided"));
        }
        
        if (firebaseUid != null) {
            boolean exists = userService.existsByFirebaseUid(firebaseUid);
            String message = exists ? "User found with provided Firebase UID" : "No user found with provided Firebase UID";
            return ResponseEntity.ok(ApiResponse.success(message, exists));
        } else {
            boolean exists = userService.existsByEmail(email);
            String message = exists ? "User found with provided email" : "No user found with provided email";
            return ResponseEntity.ok(ApiResponse.success(message, exists));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<User>>> searchUsers(
            @RequestHeader("Firebase-UID") String firebaseUid,
            @RequestParam String q) {
        
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Search query parameter 'q' is required and cannot be empty"));
        }
        
        Optional<User> currentUserOpt = userService.findByFirebaseUid(firebaseUid);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Current user not found"));
        }
        
        String currentUserId = currentUserOpt.get().getId();
        List<User> availableUsers = userService.searchAvailableUsers(q.trim(), currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success("Available users found", availableUsers));
    }
} 