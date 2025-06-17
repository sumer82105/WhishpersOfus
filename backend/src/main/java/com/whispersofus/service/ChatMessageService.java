package com.whispersofus.service;

import com.whispersofus.model.ChatMessage;
import com.whispersofus.model.MessageType;
import com.whispersofus.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatMessageService {
    
    private final ChatMessageRepository chatMessageRepository;
    
    public ChatMessage sendMessage(String senderId, String receiverId, String content, MessageType messageType) {
        log.info("Sending message from {} to {}", senderId, receiverId);
        
        ChatMessage message = new ChatMessage();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setMessageType(messageType != null ? messageType : MessageType.TEXT);
        
        return chatMessageRepository.save(message);
    }
    
    public Page<ChatMessage> getMessagesBetweenUsers(String userId1, String userId2, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return chatMessageRepository.findMessagesBetweenUsers(userId1, userId2, pageable);
    }
    
    public List<ChatMessage> getUnreadMessages(String receiverId) {
        return chatMessageRepository.findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(receiverId);
    }
    
    public long getUnreadMessageCount(String receiverId) {
        return chatMessageRepository.countByReceiverIdAndIsReadFalse(receiverId);
    }
    
    public ChatMessage markMessageAsRead(String messageId) {
        Optional<ChatMessage> messageOpt = chatMessageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            ChatMessage message = messageOpt.get();
            message.setRead(true);
            log.info("Marking message as read: {}", messageId);
            return chatMessageRepository.save(message);
        }
        throw new RuntimeException("Message not found with id: " + messageId);
    }
    
    public void markMessagesAsRead(String senderId, String receiverId) {
        List<ChatMessage> unreadMessages = chatMessageRepository
            .findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(receiverId);
        
        for (ChatMessage message : unreadMessages) {
            if (message.getSenderId().equals(senderId)) {
                message.setRead(true);
                chatMessageRepository.save(message);
            }
        }
        log.info("Marked messages as read between {} and {}", senderId, receiverId);
    }
    
    public Optional<ChatMessage> getLatestMessage(String userId1, String userId2) {
        List<ChatMessage> messages = chatMessageRepository.findLatestMessageBetweenUsers(userId1, userId2);
        return messages.isEmpty() ? Optional.empty() : Optional.of(messages.get(0));
    }
    
    public void deleteMessage(String messageId) {
        log.info("Deleting message: {}", messageId);
        chatMessageRepository.deleteById(messageId);
    }
    
    public void deleteConversation(String userId1, String userId2) {
        log.info("Deleting conversation between {} and {}", userId1, userId2);
        chatMessageRepository.deleteBySenderIdAndReceiverId(userId1, userId2);
        chatMessageRepository.deleteBySenderIdAndReceiverId(userId2, userId1);
    }
} 