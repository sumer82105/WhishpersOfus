package com.whispersofus.service;

import com.whispersofus.model.Memory;
import com.whispersofus.model.MemoryType;
import com.whispersofus.repository.MemoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemoryService {
    
    private final MemoryRepository memoryRepository;
    
    public Memory createMemory(String title, String description, LocalDate memoryDate, 
                              String photoUrl, String location, MemoryType type, Boolean isMilestone) {
        log.info("Creating new memory: {}", title);
        
        Memory memory = new Memory();
        memory.setTitle(title);
        memory.setDescription(description);
        memory.setMemoryDate(memoryDate);
        if (photoUrl != null) {
            memory.setPhotoUrls(List.of(photoUrl));
        }
        memory.setLocation(location);
        memory.setType(type);
        memory.setMilestone(isMilestone != null ? isMilestone : false);
        
        return memoryRepository.save(memory);
    }
    
    public List<Memory> getAllMemories() {
        return memoryRepository.findAllByOrderByMemoryDateAsc();
    }
    
    public List<Memory> getAllMemoriesDescending() {
        return memoryRepository.findAllByOrderByMemoryDateDesc();
    }
    
    public List<Memory> getMilestones() {
        return memoryRepository.findByIsMilestoneTrueOrderByMemoryDateAsc();
    }
    
    public List<Memory> getMemoriesByType(MemoryType type) {
        return memoryRepository.findByTypeOrderByMemoryDateDesc(type);
    }
    
    public List<Memory> getMemoriesInDateRange(LocalDate startDate, LocalDate endDate) {
        return memoryRepository.findByMemoryDateBetween(startDate, endDate);
    }
    
    public List<Memory> getMemoriesFromDate(LocalDate startDate) {
        LocalDate endDate = LocalDate.now();
        return memoryRepository.findByMemoryDateBetween(startDate, endDate);
    }
    
    public Optional<Memory> findById(String id) {
        return memoryRepository.findById(id);
    }
    
    public Memory updateMemory(String id, String title, String description, LocalDate memoryDate, 
                              String photoUrl, String location, MemoryType type, Boolean isMilestone) {
        Optional<Memory> memoryOpt = memoryRepository.findById(id);
        if (memoryOpt.isPresent()) {
            Memory memory = memoryOpt.get();
            memory.setTitle(title);
            memory.setDescription(description);
            memory.setMemoryDate(memoryDate);
            if (photoUrl != null) {
                memory.setPhotoUrls(List.of(photoUrl));
            }
            memory.setLocation(location);
            memory.setType(type);
            memory.setMilestone(isMilestone != null ? isMilestone : false);
            memory.onUpdate();
            
            log.info("Updating memory: {}", id);
            return memoryRepository.save(memory);
        }
        throw new RuntimeException("Memory not found with id: " + id);
    }
    
    public void deleteMemory(String id) {
        log.info("Deleting memory: {}", id);
        memoryRepository.deleteById(id);
    }
} 