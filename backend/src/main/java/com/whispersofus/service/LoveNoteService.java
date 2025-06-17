package com.whispersofus.service;

import com.whispersofus.model.LoveNote;
import com.whispersofus.model.EmotionTag;
import com.whispersofus.repository.LoveNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LoveNoteService {
    
    private final LoveNoteRepository loveNoteRepository;
    
    public LoveNote createLoveNote(String senderId, String receiverId, String content, String emotionTagStr) {
        log.info("Creating new love note from sender: {} to receiver: {}", senderId, receiverId);
        
        LoveNote loveNote = new LoveNote();
        loveNote.setSenderId(senderId);
        loveNote.setReceiverId(receiverId);
        loveNote.setContent(content);
        
        // Convert string to EmotionTag enum
        if (emotionTagStr != null) {
            try {
                EmotionTag emotionTag = EmotionTag.valueOf(emotionTagStr.toUpperCase());
                loveNote.setEmotionTag(emotionTag);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid emotion tag: {}, using default", emotionTagStr);
                loveNote.setEmotionTag(EmotionTag.LOVE);
            }
        }
        
        return loveNoteRepository.save(loveNote);
    }
    
    public Page<LoveNote> getAllLoveNotes(Pageable pageable) {
        return loveNoteRepository.findAll(pageable);
    }
    
    public Page<LoveNote> getLoveNotesByReceiver(String receiverId, Pageable pageable) {
        return loveNoteRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId, pageable);
    }
    
    public List<LoveNote> getUnreadNotes(String receiverId) {
        return loveNoteRepository.findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(receiverId);
    }
    
    public long getUnreadNotesCount(String receiverId) {
        return loveNoteRepository.countByReceiverIdAndIsReadFalse(receiverId);
    }
    
    public Optional<LoveNote> findById(String id) {
        return loveNoteRepository.findById(id);
    }
    
    public LoveNote markNoteAsRead(String noteId) {
        Optional<LoveNote> noteOpt = loveNoteRepository.findById(noteId);
        if (noteOpt.isPresent()) {
            LoveNote note = noteOpt.get();
            note.setRead(true);
            log.info("Marking love note as read: {}", noteId);
            return loveNoteRepository.save(note);
        }
        throw new RuntimeException("Love note not found with id: " + noteId);
    }
    
    public LoveNote addReaction(String noteId, String emoji) {
        Optional<LoveNote> noteOpt = loveNoteRepository.findById(noteId);
        if (noteOpt.isPresent()) {
            LoveNote note = noteOpt.get();
            note.setReactionEmoji(emoji);
            log.info("Adding reaction to love note: {}", noteId);
            return loveNoteRepository.save(note);
        }
        throw new RuntimeException("Love note not found with id: " + noteId);
    }
    
    public void deleteLoveNote(String noteId) {
        log.info("Deleting love note: {}", noteId);
        loveNoteRepository.deleteById(noteId);
    }
} 