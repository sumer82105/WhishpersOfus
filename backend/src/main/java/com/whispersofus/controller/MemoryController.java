package com.whispersofus.controller;

import com.whispersofus.dto.MemoryRequest;
import com.whispersofus.model.Memory;
import com.whispersofus.model.MemoryType;
import com.whispersofus.service.MemoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/memories")
@RequiredArgsConstructor
@Slf4j
public class MemoryController {
    
    private final MemoryService memoryService;
    
    @PostMapping
    public ResponseEntity<Memory> createMemory(@Valid @RequestBody MemoryRequest request) {
        Memory memory = memoryService.createMemory(
            request.getTitle(),
            request.getDescription(),
            request.getMemoryDate(),
            request.getPhotoUrl(),
            request.getLocation(),
            request.getType(),
            request.getIsMilestone()
        );
        
        return ResponseEntity.ok(memory);
    }
    
    @GetMapping
    public ResponseEntity<List<Memory>> getAllMemories(
            @RequestParam(defaultValue = "asc") String order) {
        
        List<Memory> memories;
        if ("desc".equalsIgnoreCase(order)) {
            memories = memoryService.getAllMemoriesDescending();
        } else {
            memories = memoryService.getAllMemories();
        }
        
        return ResponseEntity.ok(memories);
    }
    
    @GetMapping("/milestones")
    public ResponseEntity<List<Memory>> getMilestones() {
        List<Memory> milestones = memoryService.getMilestones();
        return ResponseEntity.ok(milestones);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Memory>> getMemoriesByType(@PathVariable MemoryType type) {
        List<Memory> memories = memoryService.getMemoriesByType(type);
        return ResponseEntity.ok(memories);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Memory>> getMemoriesInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Memory> memories = memoryService.getMemoriesInDateRange(startDate, endDate);
        return ResponseEntity.ok(memories);
    }
    
    @GetMapping("/from-date")
    public ResponseEntity<List<Memory>> getMemoriesFromDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        
        List<Memory> memories = memoryService.getMemoriesFromDate(startDate);
        return ResponseEntity.ok(memories);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Memory> getMemory(@PathVariable String id) {
        Optional<Memory> memory = memoryService.findById(id);
        return memory.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Memory> updateMemory(@PathVariable String id, 
                                              @Valid @RequestBody MemoryRequest request) {
        try {
            Memory memory = memoryService.updateMemory(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getMemoryDate(),
                request.getPhotoUrl(),
                request.getLocation(),
                request.getType(),
                request.getIsMilestone()
            );
            return ResponseEntity.ok(memory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemory(@PathVariable String id) {
        try {
            memoryService.deleteMemory(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 