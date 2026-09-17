package com.claimit.controller;

import com.claimit.dto.AiQuestionRequest;
import com.claimit.dto.AiResponse;
import com.claimit.service.AiAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiAssistantService aiAssistantService;

    public AiController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/ask")
    public ResponseEntity<AiResponse> askQuestion(@RequestBody AiQuestionRequest request) {
        AiResponse response = aiAssistantService.answerQuestion(request);
        return ResponseEntity.ok(response);
    }
}
