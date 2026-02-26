package com.tarot.controller;

import com.tarot.model.Reading;
import com.tarot.repository.ReadingRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "*")
public class ReadingController {

    private final ReadingRepository readingRepository;

    public ReadingController(ReadingRepository readingRepository) {
        this.readingRepository = readingRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<Reading> list() {
        return readingRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Reading> get(@PathVariable Long id) {
        return readingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Reading> create(@Valid @RequestBody Reading reading) {
        Reading saved = readingRepository.save(reading);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Reading> update(@PathVariable Long id, @Valid @RequestBody Reading updated) {
        return readingRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setDescription(updated.getDescription());
                    Reading saved = readingRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!readingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        readingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


