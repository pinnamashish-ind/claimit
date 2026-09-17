package com.claimit.controller;

import com.claimit.dto.AuthResponse;
import com.claimit.dto.LoginRequest;
import com.claimit.model.User;
import com.claimit.model.UserProfile;
import com.claimit.repository.UserRepository;
import com.claimit.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Identifier is required", null, null));
        }

        // Check if demo user
        if ("demo".equalsIgnoreCase(request.getAuthType())) {
            User demo = getDemoPersonaUser(request.getDemoPersona());
            return ResponseEntity.ok(new AuthResponse(true, "Demo sign-in successful", generateToken(demo), demo));
        }

        // Lookup user by email or phone
        Optional<User> existingUser = userRepository.findByEmail(identifier);
        if (existingUser.isEmpty()) {
            existingUser = userRepository.findByPhone(identifier);
        }

        User user = existingUser.orElseGet(() -> {
            // Auto-provision citizen user for seamless onboarding
            String name = identifier.contains("@") ? identifier.split("@")[0] : "Citizen " + identifier.substring(Math.max(0, identifier.length() - 4));
            User newUser = new User(capitalize(name), identifier.contains("@") ? identifier : identifier + "@claimit.org", identifier.contains("@") ? "+91 98765 00000" : identifier, false);
            return userRepository.save(newUser);
        });

        return ResponseEntity.ok(new AuthResponse(true, "Authentication successful", generateToken(user), user));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody Map<String, Object> payload) {
        String fullName = (String) payload.getOrDefault("fullName", "Citizen");
        String email = (String) payload.getOrDefault("email", "citizen@claimit.org");
        String phone = (String) payload.getOrDefault("phone", "+91 98765 43210");
        String state = (String) payload.getOrDefault("state", "Telangana");
        String occupation = (String) payload.getOrDefault("occupation", "Student");

        Optional<User> existing = userRepository.findByEmail(email);
        User user = existing.orElseGet(() -> {
            User newUser = new User(fullName, email, phone, false);
            UserProfile profile = new UserProfile();
            profile.setState(state);
            profile.setOccupation(occupation);
            profile.setAnnualIncome(BigDecimal.valueOf(250000));
            profile.setAge(22);
            profile.setGender("Male");
            profile.setEducationLevel("Undergraduate");
            profile.setCategory("General");
            profile.setHasDisability(false);
            newUser.setProfile(profile);
            return userRepository.save(newUser);
        });

        return ResponseEntity.ok(new AuthResponse(true, "Citizen profile registered successfully", generateToken(user), user));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> request) {
        String destination = request.getOrDefault("identifier", "Aadhaar / Mobile");
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "A 6-digit OTP has been dispatched to " + mask(destination));
        resp.put("demoOtp", "123456");
        resp.put("expiresInSeconds", 300);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody LoginRequest request) {
        String otp = request.getOtp();
        if (otp == null || !otp.equals("123456")) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Invalid verification code. Please enter 123456 for instant testing.", null, null));
        }

        User user = userService.getOrCreateDemoUser();
        return ResponseEntity.ok(new AuthResponse(true, "Aadhaar / Mobile OTP verified successfully", generateToken(user), user));
    }

    @PostMapping("/demo-login")
    public ResponseEntity<AuthResponse> demoLogin(@RequestParam(defaultValue = "student") String persona) {
        User user = getDemoPersonaUser(persona);
        return ResponseEntity.ok(new AuthResponse(true, "Logged in as " + user.getFullName(), generateToken(user), user));
    }

    private User getDemoPersonaUser(String persona) {
        String role = persona != null ? persona.toLowerCase() : "student";
        switch (role) {
            case "farmer": {
                User farmer = new User("Venkat Rao", "venkat.rao@claimit.org", "+91 98480 12345", true);
                UserProfile p = new UserProfile();
                p.setAge(45);
                p.setGender("Male");
                p.setState("Andhra Pradesh");
                p.setDistrict("Guntur");
                p.setOccupation("Farmer");
                p.setAnnualIncome(BigDecimal.valueOf(180000));
                p.setCategory("General");
                p.setHasDisability(false);
                farmer.setProfile(p);
                return farmer;
            }
            case "entrepreneur": {
                User woman = new User("Sunitha Devi", "sunitha.devi@claimit.org", "+91 94401 54321", true);
                UserProfile p = new UserProfile();
                p.setAge(34);
                p.setGender("Female");
                p.setState("Telangana");
                p.setDistrict("Warangal");
                p.setOccupation("Self-Employed / Artisan");
                p.setAnnualIncome(BigDecimal.valueOf(220000));
                p.setCategory("SC");
                p.setHasDisability(false);
                woman.setProfile(p);
                return woman;
            }
            case "senior": {
                User senior = new User("Kameswari Amma", "kameswari.amma@claimit.org", "+91 99890 98765", true);
                UserProfile p = new UserProfile();
                p.setAge(68);
                p.setGender("Female");
                p.setState("Telangana");
                p.setDistrict("Karimnagar");
                p.setOccupation("Senior Citizen / Homemaker");
                p.setAnnualIncome(BigDecimal.valueOf(90000));
                p.setCategory("OBC");
                p.setHasDisability(false);
                senior.setProfile(p);
                return senior;
            }
            default:
                return userService.getOrCreateDemoUser();
        }
    }

    private String generateToken(User user) {
        return "claimit-session-" + UUID.randomUUID().toString();
    }

    private String mask(String raw) {
        if (raw == null || raw.length() < 4) return "****";
        return "******" + raw.substring(raw.length() - 4);
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "Citizen";
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }
}
