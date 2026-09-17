package com.claimit.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(name = "title_te")
    private String titleTe;

    @Column(nullable = false)
    private String category; // Education, Agriculture, Employment, Housing, Entrepreneurship, Skill Development, Social Welfare, Women & Child Welfare

    @Column(name = "short_description", nullable = false, columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "short_description_te", columnDefinition = "TEXT")
    private String shortDescriptionTe;

    @Column(name = "detailed_description", columnDefinition = "LONGTEXT")
    private String detailedDescription;

    @Column(name = "target_beneficiaries", nullable = false)
    private String targetBeneficiaries;

    @Column(name = "min_benefit_amount", precision = 12, scale = 2)
    private BigDecimal minBenefitAmount;

    @Column(name = "max_benefit_amount", precision = 12, scale = 2)
    private BigDecimal maxBenefitAmount;

    @Column(name = "benefit_display", nullable = false)
    private String benefitDisplay; // e.g. "Up to ₹50,000 / year"

    @Column(name = "benefit_type")
    private String benefitType = "Grant";

    private LocalDate deadline;

    @Column(name = "official_portal_url", nullable = false)
    private String officialPortalUrl;

    @Column(name = "info_source", nullable = false)
    private String infoSource;

    @Column(name = "last_verified", nullable = false)
    private LocalDate lastVerified;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<EligibilityRule> eligibilityRules = new ArrayList<>();

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SchemeDocument> schemeDocuments = new ArrayList<>();

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    @JsonManagedReference
    private List<ApplicationStep> applicationSteps = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Scheme() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleTe() {
        return titleTe;
    }

    public void setTitleTe(String titleTe) {
        this.titleTe = titleTe;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getShortDescriptionTe() {
        return shortDescriptionTe;
    }

    public void setShortDescriptionTe(String shortDescriptionTe) {
        this.shortDescriptionTe = shortDescriptionTe;
    }

    public String getDetailedDescription() {
        return detailedDescription;
    }

    public void setDetailedDescription(String detailedDescription) {
        this.detailedDescription = detailedDescription;
    }

    public String getTargetBeneficiaries() {
        return targetBeneficiaries;
    }

    public void setTargetBeneficiaries(String targetBeneficiaries) {
        this.targetBeneficiaries = targetBeneficiaries;
    }

    public BigDecimal getMinBenefitAmount() {
        return minBenefitAmount;
    }

    public void setMinBenefitAmount(BigDecimal minBenefitAmount) {
        this.minBenefitAmount = minBenefitAmount;
    }

    public BigDecimal getMaxBenefitAmount() {
        return maxBenefitAmount;
    }

    public void setMaxBenefitAmount(BigDecimal maxBenefitAmount) {
        this.maxBenefitAmount = maxBenefitAmount;
    }

    public String getBenefitDisplay() {
        return benefitDisplay;
    }

    public void setBenefitDisplay(String benefitDisplay) {
        this.benefitDisplay = benefitDisplay;
    }

    public String getBenefitType() {
        return benefitType;
    }

    public void setBenefitType(String benefitType) {
        this.benefitType = benefitType;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getOfficialPortalUrl() {
        return officialPortalUrl;
    }

    public void setOfficialPortalUrl(String officialPortalUrl) {
        this.officialPortalUrl = officialPortalUrl;
    }

    public String getInfoSource() {
        return infoSource;
    }

    public void setInfoSource(String infoSource) {
        this.infoSource = infoSource;
    }

    public LocalDate getLastVerified() {
        return lastVerified;
    }

    public void setLastVerified(LocalDate lastVerified) {
        this.lastVerified = lastVerified;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<EligibilityRule> getEligibilityRules() {
        return eligibilityRules;
    }

    public void setEligibilityRules(List<EligibilityRule> eligibilityRules) {
        this.eligibilityRules = eligibilityRules;
    }

    public List<SchemeDocument> getSchemeDocuments() {
        return schemeDocuments;
    }

    public void setSchemeDocuments(List<SchemeDocument> schemeDocuments) {
        this.schemeDocuments = schemeDocuments;
    }

    public List<ApplicationStep> getApplicationSteps() {
        return applicationSteps;
    }

    public void setApplicationSteps(List<ApplicationStep> applicationSteps) {
        this.applicationSteps = applicationSteps;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
