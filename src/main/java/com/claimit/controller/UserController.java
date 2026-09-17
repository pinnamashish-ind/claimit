package com.claimit.controller;

import com.claimit.dto.DashboardSummary;
import com.claimit.dto.EligibilityMatchResult;
import com.claimit.dto.UserProfileRequest;
import com.claimit.model.Application;
import com.claimit.model.Notification;
import com.claimit.model.User;
import com.claimit.model.UserProfile;
import com.claimit.repository.NotificationRepository;
import com.claimit.service.ApplicationService;
import com.claimit.service.EligibilityService;
import com.claimit.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final EligibilityService eligibilityService;
    private final ApplicationService applicationService;
    private final NotificationRepository notificationRepository;

    public UserController(UserService userService,
                          EligibilityService eligibilityService,
                          ApplicationService applicationService,
                          NotificationRepository notificationRepository) {
        this.userService = userService;
        this.eligibilityService = eligibilityService;
        this.applicationService = applicationService;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public ResponseEntity<User> createUserProfile(@RequestBody UserProfileRequest request) {
        User saved = userService.saveOrUpdateUserProfile(request, null);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id, @RequestBody UserProfileRequest request) {
        User updated = userService.saveOrUpdateUserProfile(request, id);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/demo")
    public ResponseEntity<User> getDemoUser() {
        User demo = userService.getOrCreateDemoUser();
        return ResponseEntity.ok(demo);
    }

    @GetMapping("/{id}/benefits")
    public ResponseEntity<List<EligibilityMatchResult>> getUserBenefits(@PathVariable Long id) {
        User user = userService.getUserById(id).orElse(null);
        if (user == null || user.getProfile() == null) {
            return ResponseEntity.notFound().build();
        }
        List<EligibilityMatchResult> matches = eligibilityService.evaluateBenefits(user.getProfile());
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<DashboardSummary> getUserDashboard(@PathVariable Long id) {
        User user = userService.getUserById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        DashboardSummary summary = new DashboardSummary();
        summary.setUserName(user.getFullName());

        List<EligibilityMatchResult> matches = user.getProfile() != null 
                ? eligibilityService.evaluateBenefits(user.getProfile()) 
                : List.of();

        summary.setPotentialBenefitsCount(matches.size());

        int strongMatches = 0;
        BigDecimal totalPotential = BigDecimal.ZERO;
        for (EligibilityMatchResult m : matches) {
            if (m.getMatchPercentage() >= 80) {
                strongMatches++;
            }
            if (m.getPotentialBenefitAmount() != null) {
                totalPotential = totalPotential.add(m.getPotentialBenefitAmount());
            }
        }
        summary.setStrongMatchesCount(strongMatches);
        summary.setTotalPotentialBenefit(totalPotential);
        summary.setTotalPotentialBenefitFormatted("₹" + String.format(Locale.US, "%,d", totalPotential.longValue()) + "+");

        List<Application> apps = applicationService.getUserApplications(id);
        summary.setUserApplications(apps);
        long started = apps.stream().filter(a -> !"Rejected".equalsIgnoreCase(a.getStatus())).count();
        summary.setApplicationsStartedCount((int) started);

        List<Notification> notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(id);
        summary.setNotifications(notifs);
        summary.setUpcomingDeadlinesCount((int) notifs.stream().filter(n -> "deadline".equalsIgnoreCase(n.getType())).count());

        summary.setTopMatches(matches.stream().limit(6).toList());

        return ResponseEntity.ok(summary);
    }
}
