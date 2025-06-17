package com.whispersofus.controller;

import com.whispersofus.dto.LoveNoteRequest;
import com.whispersofus.dto.ReactionRequest;
import com.whispersofus.model.LoveNote;
import com.whispersofus.model.User;
import com.whispersofus.service.LoveNoteService;
import com.whispersofus.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/love-notes")
@RequiredArgsConstructor
@Slf4j
public class LoveNoteController {
    
    private final LoveNoteService loveNoteService;
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<LoveNote> createLoveNote(@Valid @RequestBody LoveNoteRequest request,
                                                   @RequestHeader("Firebase-UID") String firebaseUid,
                                                   @RequestParam(required = false) String receiverId) {
        Optional<User> senderOpt = userService.findByFirebaseUid(firebaseUid);
        if (senderOpt.isEmpty()) {
            System.out.println("Sender not found");
            return ResponseEntity.badRequest().build();
        }
        
        // If no receiverId provided, find the partner (assuming 2-person relationship)
        String finalReceiverId = receiverId;
        if (finalReceiverId == null) {
            // For now, we'll use a default logic - in a real app you'd have partner mapping
            List<User> allUsers = userService.findAllUsers();
            Optional<User> partner = allUsers.stream()
                .filter(user -> !user.getId().equals(senderOpt.get().getId()))
                .findFirst();
            if (partner.isPresent()) {
                System.out.println("partner found");
                finalReceiverId = partner.get().getId();
            } else {
                System.out.println("partner not found");
                return ResponseEntity.badRequest().build();
            }
        }
        
        LoveNote loveNote = loveNoteService.createLoveNote(
            senderOpt.get().getId(), 
            finalReceiverId,
            request.getContent(), 
            request.getEmotionTag()
        );
        
        return ResponseEntity.ok(loveNote);
    }
    
    @GetMapping
    public ResponseEntity<Page<LoveNote>> getAllLoveNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<LoveNote> loveNotes = loveNoteService.getAllLoveNotes(pageable);
        return ResponseEntity.ok(loveNotes);
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<LoveNote>> getUnreadNotes(@RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<LoveNote> unreadNotes = loveNoteService.getUnreadNotes(userOpt.get().getId());
        return ResponseEntity.ok(unreadNotes);
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadNotesCount(@RequestHeader("Firebase-UID") String firebaseUid) {
        Optional<User> userOpt = userService.findByFirebaseUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        long count = loveNoteService.getUnreadNotesCount(userOpt.get().getId());
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<LoveNote> markAsRead(@PathVariable String id) {
        try {
            LoveNote loveNote = loveNoteService.markNoteAsRead(id);
            return ResponseEntity.ok(loveNote);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/reaction")
    public ResponseEntity<LoveNote> addReaction(@PathVariable String id, 
                                              @Valid @RequestBody ReactionRequest request) {
        try {
            LoveNote loveNote = loveNoteService.addReaction(id, request.getReactionEmoji());
            return ResponseEntity.ok(loveNote);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LoveNote> getLoveNote(@PathVariable String id) {
        Optional<LoveNote> loveNote = loveNoteService.findById(id);
        return loveNote.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoveNote(@PathVariable String id) {
        try {
            loveNoteService.deleteLoveNote(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 