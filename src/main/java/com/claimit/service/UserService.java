package com.claimit.service;

import com.claimit.dto.UserProfileRequest;
import com.claimit.model.User;
import com.claimit.model.UserProfile;
import com.claimit.repository.UserProfileRepository;
import com.claimit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;

    public UserService(UserRepository userRepository, UserProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<UserProfile> getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    public User getOrCreateDemoUser() {
        return userRepository.findFirstByIsDemoTrue().orElseGet(() -> {
            User demo = new User("Demo Student", "demo.student@claimit.org", "+91 98765 43210", true);
            UserProfile profile = new UserProfile();
            profile.setAge(20);
            profile.setGender("Male");
            profile.setState("Telangana");
            profile.setDistrict("Hyderabad");
            profile.setOccupation("Student");
            profile.setEducationLevel("Undergraduate");
            profile.setAnnualIncome(BigDecimal.valueOf(250000));
            profile.setCategory("OBC");
            profile.setHasDisability(false);
            profile.setEmploymentStatus("Unemployed");
            profile.setInstitutionName("Osmania University College of Engineering");
            profile.setCourse("B.Tech Computer Science");
            profile.setStudyYear(3);
            profile.setCgpa(BigDecimal.valueOf(8.20));
            demo.setProfile(profile);
            return userRepository.save(demo);
        });
    }

    @Transactional
    public User saveOrUpdateUserProfile(UserProfileRequest request, Long existingUserId) {
        User user;
        if (existingUserId != null && userRepository.existsById(existingUserId)) {
            user = userRepository.findById(existingUserId).get();
            if (request.getFullName() != null) user.setFullName(request.getFullName());
            if (request.getEmail() != null) user.setEmail(request.getEmail());
            if (request.getPhone() != null) user.setPhone(request.getPhone());
        } else {
            String email = request.getEmail() != null && !request.getEmail().isBlank() 
                    ? request.getEmail() 
                    : "user_" + System.currentTimeMillis() + "@claimit.local";
            
            user = userRepository.findByEmail(email).orElse(new User(
                    request.getFullName() != null ? request.getFullName() : "Anonymous Beneficiary",
                    email,
                    request.getPhone(),
                    Boolean.TRUE.equals(request.getIsDemo())
            ));
        }

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile();
        }

        profile.setAge(request.getAge() != null ? request.getAge() : 20);
        profile.setGender(request.getGender() != null ? request.getGender() : "Other");
        profile.setState(request.getState() != null ? request.getState() : "Telangana");
        profile.setDistrict(request.getDistrict() != null ? request.getDistrict() : "Hyderabad");
        profile.setOccupation(request.getOccupation() != null ? request.getOccupation() : "Student");
        profile.setEducationLevel(request.getEducationLevel() != null ? request.getEducationLevel() : "Undergraduate");
        profile.setAnnualIncome(request.getAnnualIncome() != null ? request.getAnnualIncome() : BigDecimal.valueOf(250000));
        profile.setCategory(request.getCategory() != null ? request.getCategory() : "General");
        profile.setHasDisability(Boolean.TRUE.equals(request.getHasDisability()));
        profile.setEmploymentStatus(request.getEmploymentStatus() != null ? request.getEmploymentStatus() : "Unemployed");
        profile.setInstitutionName(request.getInstitutionName());
        profile.setCourse(request.getCourse());
        profile.setStudyYear(request.getStudyYear());
        profile.setCgpa(request.getCgpa());

        user.setProfile(profile);
        return userRepository.save(user);
    }
}
