package com.claimit.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "eligibility_rules")
public class EligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @JsonBackReference
    private Scheme scheme;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(name = "allowed_states", columnDefinition = "TEXT")
    private String allowedStates; // e.g. "Telangana,All India"

    @Column(name = "allowed_occupations", columnDefinition = "TEXT")
    private String allowedOccupations; // e.g. "Student,Job Seeker"

    @Column(name = "allowed_educations", columnDefinition = "TEXT")
    private String allowedEducations; // e.g. "Undergraduate,Diploma"

    @Column(name = "max_annual_income", precision = 12, scale = 2)
    private BigDecimal maxAnnualIncome;

    @Column(name = "allowed_categories", columnDefinition = "TEXT")
    private String allowedCategories; // e.g. "General,OBC,SC,ST"

    @Column(name = "requires_disability")
    private Boolean requiresDisability;

    @Column(name = "min_cgpa", precision = 4, scale = 2)
    private BigDecimal minCgpa;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    public EligibilityRule() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    public String getAllowedStates() {
        return allowedStates;
    }

    public void setAllowedStates(String allowedStates) {
        this.allowedStates = allowedStates;
    }

    public String getAllowedOccupations() {
        return allowedOccupations;
    }

    public void setAllowedOccupations(String allowedOccupations) {
        this.allowedOccupations = allowedOccupations;
    }

    public String getAllowedEducations() {
        return allowedEducations;
    }

    public void setAllowedEducations(String allowedEducations) {
        this.allowedEducations = allowedEducations;
    }

    public BigDecimal getMaxAnnualIncome() {
        return maxAnnualIncome;
    }

    public void setMaxAnnualIncome(BigDecimal maxAnnualIncome) {
        this.maxAnnualIncome = maxAnnualIncome;
    }

    public String getAllowedCategories() {
        return allowedCategories;
    }

    public void setAllowedCategories(String allowedCategories) {
        this.allowedCategories = allowedCategories;
    }

    public Boolean getRequiresDisability() {
        return requiresDisability;
    }

    public void setRequiresDisability(Boolean requiresDisability) {
        this.requiresDisability = requiresDisability;
    }

    public BigDecimal getMinCgpa() {
        return minCgpa;
    }

    public void setMinCgpa(BigDecimal minCgpa) {
        this.minCgpa = minCgpa;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
}
