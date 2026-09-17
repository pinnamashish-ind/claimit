package com.claimit.controller;

import com.claimit.dto.EligibilityMatchResult;
import com.claimit.dto.UserProfileRequest;
import com.claimit.model.Scheme;
import com.claimit.model.User;
import com.claimit.model.UserProfile;
import com.claimit.service.EligibilityService;
import com.claimit.service.SchemeService;
import com.claimit.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/eligibility")
@CrossOrigin(origins = "*")
public class EligibilityController {

    private final EligibilityService eligibilityService;
    private final SchemeService schemeService;
    private final UserService userService;

    public EligibilityController(EligibilityService eligibilityService,
                                 SchemeService schemeService,
                                 UserService userService) {
        this.eligibilityService = eligibilityService;
        this.schemeService = schemeService;
        this.userService = userService;
    }

    /**
     * Checks eligibility on-the-fly without requiring a saved database profile
     */
    @PostMapping("/check")
    public ResponseEntity<List<EligibilityMatchResult>> checkEligibility(@RequestBody UserProfileRequest request) {
        UserProfile tempProfile = new UserProfile();
        tempProfile.setAge(request.getAge());
        tempProfile.setGender(request.getGender());
        tempProfile.setState(request.getState());
        tempProfile.setDistrict(request.getDistrict());
        tempProfile.setOccupation(request.getOccupation());
        tempProfile.setEducationLevel(request.getEducationLevel());
        tempProfile.setAnnualIncome(request.getAnnualIncome() != null ? request.getAnnualIncome() : BigDecimal.valueOf(250000));
        tempProfile.setCategory(request.getCategory() != null ? request.getCategory() : "General");
        tempProfile.setHasDisability(Boolean.TRUE.equals(request.getHasDisability()));
        tempProfile.setEmploymentStatus(request.getEmploymentStatus());
        tempProfile.setInstitutionName(request.getInstitutionName());
        tempProfile.setCourse(request.getCourse());
        tempProfile.setStudyYear(request.getStudyYear());
        tempProfile.setCgpa(request.getCgpa());

        List<EligibilityMatchResult> matches = eligibilityService.evaluateBenefits(tempProfile);
        return ResponseEntity.ok(matches);
    }

    /**
     * Detailed breakdown for a specific scheme against a user
     */
    @GetMapping("/scheme/{schemeId}/user/{userId}")
    public ResponseEntity<EligibilityMatchResult> evaluateSpecificScheme(
            @PathVariable Long schemeId,
            @PathVariable Long userId) {
        
        Scheme scheme = schemeService.getSchemeById(schemeId).orElse(null);
        User user = userService.getUserById(userId).orElse(null);

        if (scheme == null || user == null || user.getProfile() == null) {
            return ResponseEntity.notFound().build();
        }

        EligibilityMatchResult result = eligibilityService.evaluateSchemeForProfile(scheme, user.getProfile());
        return ResponseEntity.ok(result);
    }
}
