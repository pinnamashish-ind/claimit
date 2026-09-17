package com.claimit.service;

import com.claimit.dto.EligibilityMatchResult;
import com.claimit.dto.RuleBreakdown;
import com.claimit.model.EligibilityRule;
import com.claimit.model.Scheme;
import com.claimit.model.UserProfile;
import com.claimit.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EligibilityService {

    private final SchemeRepository schemeRepository;

    public EligibilityService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    /**
     * Evaluates all active schemes against the given user profile
     * using a weighted rule-based multi-criteria algorithm.
     */
    public List<EligibilityMatchResult> evaluateBenefits(UserProfile profile) {
        List<Scheme> allSchemes = schemeRepository.findByIsActiveTrue();
        List<EligibilityMatchResult> results = new ArrayList<>();

        for (Scheme scheme : allSchemes) {
            EligibilityMatchResult result = evaluateSchemeForProfile(scheme, profile);
            // Include matches with at least 40% compatibility
            if (result.getMatchPercentage() >= 40) {
                results.add(result);
            }
        }

        // Sort descending by match percentage, then deadline
        results.sort((a, b) -> {
            int cmp = Integer.compare(b.getMatchPercentage(), a.getMatchPercentage());
            if (cmp != 0) return cmp;
            if (a.getScheme().getDeadline() == null) return 1;
            if (b.getScheme().getDeadline() == null) return -1;
            return a.getScheme().getDeadline().compareTo(b.getScheme().getDeadline());
        });

        return results;
    }

    /**
     * Evaluates a single scheme against a profile
     */
    public EligibilityMatchResult evaluateSchemeForProfile(Scheme scheme, UserProfile profile) {
        EligibilityMatchResult result = new EligibilityMatchResult();
        result.setScheme(scheme);

        List<EligibilityRule> rules = scheme.getEligibilityRules();
        List<RuleBreakdown> breakdowns = new ArrayList<>();
        List<String> missingFields = new ArrayList<>();

        if (rules == null || rules.isEmpty()) {
            // General scheme without strict rules
            result.setMatchPercentage(80);
            result.setQualificationStatus("Potentially Eligible");
            result.setQualificationSummary("Open to eligible citizens meeting general public welfare criteria.");
            RuleBreakdown general = new RuleBreakdown("General Criterion", true, true, 
                    "No specialized restriction registered. Verified for public access.", "✓ Satisfied");
            breakdowns.add(general);
            result.setBreakdowns(breakdowns);
            calculateBenefitDisplay(scheme, result);
            return result;
        }

        // We will evaluate each rule (usually one main rule set per scheme)
        EligibilityRule rule = rules.get(0);

        int totalWeight = 0;
        int earnedScore = 0;

        // 1. Occupation Check (Weight: 25)
        totalWeight += 25;
        if (profile == null || profile.getOccupation() == null || profile.getOccupation().isBlank()) {
            missingFields.add("Occupation");
            breakdowns.add(new RuleBreakdown("Occupation Requirement", false, false,
                    "Occupation was not provided in profile", "⚠ Information not verified"));
        } else {
            String allowedOcc = rule.getAllowedOccupations();
            if (allowedOcc == null || allowedOcc.isBlank() || isTokenMatch(profile.getOccupation(), allowedOcc)) {
                earnedScore += 25;
                breakdowns.add(new RuleBreakdown("Occupation Requirement", true, true,
                        "Target occupation matched: " + profile.getOccupation(), "✓ Satisfied"));
            } else {
                breakdowns.add(new RuleBreakdown("Occupation Requirement", false, true,
                        "Requires: " + allowedOcc + " (Your profile: " + profile.getOccupation() + ")", "✗ Not met"));
            }
        }

        // 2. Annual Income Check (Weight: 25)
        totalWeight += 25;
        if (profile == null || profile.getAnnualIncome() == null) {
            missingFields.add("Annual Family Income");
            breakdowns.add(new RuleBreakdown("Income Requirement", false, false,
                    "Income details not provided", "⚠ Information not verified"));
        } else {
            BigDecimal maxInc = rule.getMaxAnnualIncome();
            if (maxInc == null || profile.getAnnualIncome().compareTo(maxInc) <= 0) {
                earnedScore += 25;
                String limitText = maxInc != null ? "under ceiling of ₹" + formatIndianNumber(maxInc.longValue()) : "no upper income cap";
                breakdowns.add(new RuleBreakdown("Income Requirement", true, true,
                        "Income ₹" + formatIndianNumber(profile.getAnnualIncome().longValue()) + " is " + limitText, "✓ Satisfied"));
            } else {
                breakdowns.add(new RuleBreakdown("Income Requirement", false, true,
                        "Income ₹" + formatIndianNumber(profile.getAnnualIncome().longValue()) + " exceeds maximum ceiling of ₹" + formatIndianNumber(maxInc.longValue()), "✗ Not met"));
            }
        }

        // 3. State / Domicile Check (Weight: 20)
        totalWeight += 20;
        if (profile == null || profile.getState() == null || profile.getState().isBlank()) {
            missingFields.add("State");
            breakdowns.add(new RuleBreakdown("State / Domicile", false, false,
                    "State of residence was not provided", "⚠ Information not verified"));
        } else {
            String allowedStates = rule.getAllowedStates();
            if (allowedStates == null || allowedStates.isBlank() || isStateMatch(profile.getState(), allowedStates)) {
                earnedScore += 20;
                breakdowns.add(new RuleBreakdown("State / Domicile", true, true,
                        "State matched: " + profile.getState() + (allowedStates != null && allowedStates.contains("All India") ? " (Central / Pan-India scheme)" : ""), "✓ Satisfied"));
            } else {
                breakdowns.add(new RuleBreakdown("State / Domicile", false, true,
                        "Scheme restricted to: " + allowedStates + " (Your state: " + profile.getState() + ")", "✗ Not met"));
            }
        }

        // 4. Education Level Check (Weight: 15)
        totalWeight += 15;
        if (profile == null || profile.getEducationLevel() == null || profile.getEducationLevel().isBlank()) {
            missingFields.add("Education Level");
            breakdowns.add(new RuleBreakdown("Education Requirement", false, false,
                    "Education level was not provided", "⚠ Information not verified"));
        } else {
            String allowedEdu = rule.getAllowedEducations();
            if (allowedEdu == null || allowedEdu.isBlank() || isTokenMatch(profile.getEducationLevel(), allowedEdu)) {
                earnedScore += 15;
                breakdowns.add(new RuleBreakdown("Education Requirement", true, true,
                        "Education level matched: " + profile.getEducationLevel(), "✓ Satisfied"));
            } else {
                breakdowns.add(new RuleBreakdown("Education Requirement", false, true,
                        "Requires: " + allowedEdu + " (Your level: " + profile.getEducationLevel() + ")", "✗ Not met"));
            }
        }

        // 5. Age Requirement Check (Weight: 10)
        totalWeight += 10;
        if (profile == null || profile.getAge() == null || profile.getAge() <= 0) {
            missingFields.add("Age");
            breakdowns.add(new RuleBreakdown("Age Requirement", false, false,
                    "Age was not specified", "⚠ Information not verified"));
        } else {
            Integer minAge = rule.getMinAge();
            Integer maxAge = rule.getMaxAge();
            boolean minOk = minAge == null || profile.getAge() >= minAge;
            boolean maxOk = maxAge == null || profile.getAge() <= maxAge;
            if (minOk && maxOk) {
                earnedScore += 10;
                String ageRange = (minAge != null ? minAge : 0) + " to " + (maxAge != null ? maxAge : 100) + " years";
                breakdowns.add(new RuleBreakdown("Age Requirement", true, true,
                        "Age " + profile.getAge() + " is within target bracket (" + ageRange + ")", "✓ Satisfied"));
            } else {
                breakdowns.add(new RuleBreakdown("Age Requirement", false, true,
                        "Age " + profile.getAge() + " outside required bracket (" + (minAge != null ? minAge : 0) + " - " + (maxAge != null ? maxAge : "max") + ")", "✗ Not met"));
            }
        }

        // 6. Academic / Merit / Additional Criteria Check (Weight: 5)
        totalWeight += 5;
        if (rule.getMinCgpa() != null) {
            if (profile != null && profile.getCgpa() != null) {
                if (profile.getCgpa().compareTo(rule.getMinCgpa()) >= 0) {
                    earnedScore += 5;
                    breakdowns.add(new RuleBreakdown("Academic Merit (CGPA)", true, true,
                            "CGPA " + profile.getCgpa() + " satisfies minimum benchmark of " + rule.getMinCgpa(), "✓ Satisfied"));
                } else {
                    breakdowns.add(new RuleBreakdown("Academic Merit (CGPA)", false, true,
                            "CGPA " + profile.getCgpa() + " below required " + rule.getMinCgpa(), "✗ Not met"));
                }
            } else {
                missingFields.add("CGPA / Marks");
                breakdowns.add(new RuleBreakdown("Academic Merit (CGPA)", false, false,
                        "CGPA requirement is " + rule.getMinCgpa() + " (not specified in profile)", "⚠ Information not verified"));
            }
        } else {
            // No CGPA requirement, award score
            earnedScore += 5;
            breakdowns.add(new RuleBreakdown("Category & Merit Check", true, true,
                    "No restrictive cut-off required for general admission.", "✓ Satisfied"));
        }

        // Calculate final match percentage
        int matchPercentage = (int) Math.round(((double) earnedScore / totalWeight) * 100);
        result.setMatchPercentage(matchPercentage);
        result.setBreakdowns(breakdowns);
        result.setMissingFields(missingFields);

        if (matchPercentage >= 85) {
            result.setQualificationStatus("Strong Match");
            result.setQualificationSummary("High probability of eligibility based on your verified credentials.");
        } else if (matchPercentage >= 65) {
            result.setQualificationStatus("Potentially Eligible");
            result.setQualificationSummary("Key requirements matched. Secondary criteria require portal verification.");
        } else {
            result.setQualificationStatus("Partial Match");
            result.setQualificationSummary("Some criteria align, but one or more core conditions differ.");
        }

        calculateBenefitDisplay(scheme, result);
        return result;
    }

    private void calculateBenefitDisplay(Scheme scheme, EligibilityMatchResult result) {
        BigDecimal benefit = scheme.getMaxBenefitAmount();
        if (benefit == null) benefit = scheme.getMinBenefitAmount();
        if (benefit == null) benefit = BigDecimal.valueOf(15000);
        result.setPotentialBenefitAmount(benefit);
        result.setPotentialBenefitFormatted(scheme.getBenefitDisplay());
    }

    private boolean isTokenMatch(String userVal, String commaSeparated) {
        if (userVal == null || commaSeparated == null) return false;
        String[] tokens = commaSeparated.split(",");
        for (String t : tokens) {
            if (t.trim().equalsIgnoreCase(userVal.trim()) || t.trim().equalsIgnoreCase("All") || t.trim().equalsIgnoreCase("Other")) {
                return true;
            }
        }
        return false;
    }

    private boolean isStateMatch(String userState, String allowedStates) {
        if (userState == null || allowedStates == null) return false;
        if (allowedStates.contains("All India") || allowedStates.equalsIgnoreCase("All")) return true;
        String[] states = allowedStates.split(",");
        for (String s : states) {
            if (s.trim().equalsIgnoreCase(userState.trim())) return true;
        }
        return false;
    }

    private String formatIndianNumber(long num) {
        return String.format(Locale.US, "%,d", num);
    }
}
