package com.claimit.controller;

import com.claimit.dto.ApplicationRequest;
import com.claimit.model.Application;
import com.claimit.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<Application> createOrUpdateApplication(@RequestBody ApplicationRequest request) {
        Application saved = applicationService.saveOrUpdateApplication(request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Application>> getUserApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String notes = payload.get("notes");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Application updated = applicationService.updateStatus(id, status, notes);
        return ResponseEntity.ok(updated);
    }
}
