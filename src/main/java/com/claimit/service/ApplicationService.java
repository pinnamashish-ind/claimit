package com.claimit.service;

import com.claimit.dto.ApplicationRequest;
import com.claimit.model.Application;
import com.claimit.model.Notification;
import com.claimit.model.Scheme;
import com.claimit.model.User;
import com.claimit.repository.ApplicationRepository;
import com.claimit.repository.NotificationRepository;
import com.claimit.repository.SchemeRepository;
import com.claimit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final NotificationRepository notificationRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              UserRepository userRepository,
                              SchemeRepository schemeRepository,
                              NotificationRepository notificationRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.schemeRepository = schemeRepository;
        this.notificationRepository = notificationRepository;
    }

    public List<Application> getUserApplications(Long userId) {
        return applicationRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    @Transactional
    public Application saveOrUpdateApplication(ApplicationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + request.getUserId()));
        Scheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new IllegalArgumentException("Scheme not found with ID: " + request.getSchemeId()));

        Optional<Application> existing = applicationRepository.findByUserIdAndSchemeId(request.getUserId(), request.getSchemeId());
        Application app = existing.orElseGet(Application::new);

        app.setUser(user);
        app.setScheme(scheme);
        if (request.getStatus() != null) {
            app.setStatus(request.getStatus());
        }
        if (request.getReferenceNumber() != null) {
            app.setReferenceNumber(request.getReferenceNumber());
        }
        if (request.getNotes() != null) {
            app.setNotes(request.getNotes());
        }
        if ("Submitted".equalsIgnoreCase(request.getStatus()) && app.getAppliedDate() == null) {
            app.setAppliedDate(LocalDate.now());
        }

        Application saved = applicationRepository.save(app);

        // Add a notification on status change
        Notification notification = new Notification(
                user.getId(),
                "Application Status Updated: " + scheme.getTitle(),
                "Your application status for " + scheme.getTitle() + " is now set to '" + app.getStatus() + "'.",
                "status_update"
        );
        notificationRepository.save(notification);

        return saved;
    }

    @Transactional
    public Application updateStatus(Long applicationId, String newStatus, String notes) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + applicationId));
        app.setStatus(newStatus);
        if (notes != null) {
            app.setNotes(notes);
        }
        if ("Submitted".equalsIgnoreCase(newStatus) && app.getAppliedDate() == null) {
            app.setAppliedDate(LocalDate.now());
        }
        return applicationRepository.save(app);
    }
}
