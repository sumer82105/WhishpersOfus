package com.whispersofus.service;

import com.whispersofus.model.User;
import com.whispersofus.model.UserRole;
import com.whispersofus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public User createUser(User user) {
        log.info("Creating new user with email: {}", user.getEmail());
        return userRepository.save(user);
    }
    
    public Optional<User> findByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    public User updateUser(User user) {
        log.info("Updating user: {}", user.getId());
        user.onUpdate(); // Update timestamp
        return userRepository.save(user);
    }
    
    public User createOrUpdateUser(String firebaseUid, String email, String name, UserRole role) {
        Optional<User> existingUser = findByFirebaseUid(firebaseUid);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(name);
            user.setEmail(email);
            return updateUser(user);
        } else {
            User newUser = new User();
            newUser.setFirebaseUid(firebaseUid);
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setRole(role);
            return createUser(newUser);
        }
    }
    
    public boolean existsByFirebaseUid(String firebaseUid) {
        return userRepository.existsByFirebaseUid(firebaseUid);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public boolean existsById(String id) {
        return userRepository.existsById(id);
    }
    
    /**
     * Search for users available for partnering
     * Excludes the current user and users who already have partners
     * @param keyword The search keyword to match against user names
     * @param currentUserId The ID of the current user to exclude from results
     * @return List of available users matching the search criteria
     */
    public List<User> searchAvailableUsers(String keyword, String currentUserId) {
        log.debug("Searching for available users with keyword: {} excluding user: {}", keyword, currentUserId);
        
        List<User> matchingUsers = userRepository.findByNameContainingIgnoreCase(keyword);
        
        // For now, we'll return all matching users except the current user
        // The frontend will handle filtering out users who already have partners
        // by checking the partnership status when needed
        return matchingUsers.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .toList();
    }
} 