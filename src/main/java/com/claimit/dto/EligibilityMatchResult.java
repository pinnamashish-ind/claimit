package com.claimit.dto;

import com.claimit.model.Scheme;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class EligibilityMatchResult {

    private Scheme scheme;
    private int matchPercentage;
    private String qualificationStatus; // "Strongly Eligible", "Potentially Eligible", "Partial Match"
    private List<RuleBreakdown> breakdowns = new ArrayList<>();
    private List<String> missingFields = new ArrayList<>();
    private BigDecimal potentialBenefitAmount;
    private String potentialBenefitFormatted;
    private String qualificationSummary;

    public EligibilityMatchResult() {}

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }

    public int getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(int matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public String getQualificationStatus() {
        return qualificationStatus;
    }

    public void setQualificationStatus(String qualificationStatus) {
        this.qualificationStatus = qualificationStatus;
    }

    public List<RuleBreakdown> getBreakdowns() {
        return breakdowns;
    }

    public void setBreakdowns(List<RuleBreakdown> breakdowns) {
        this.breakdowns = breakdowns;
    }

    public List<String> getMissingFields() {
        return missingFields;
    }

    public void setMissingFields(List<String> missingFields) {
        this.missingFields = missingFields;
    }

    public BigDecimal getPotentialBenefitAmount() {
        return potentialBenefitAmount;
    }

    public void setPotentialBenefitAmount(BigDecimal potentialBenefitAmount) {
        this.potentialBenefitAmount = potentialBenefitAmount;
    }

    public String getPotentialBenefitFormatted() {
        return potentialBenefitFormatted;
    }

    public void setPotentialBenefitFormatted(String potentialBenefitFormatted) {
        this.potentialBenefitFormatted = potentialBenefitFormatted;
    }

    public String getQualificationSummary() {
        return qualificationSummary;
    }

    public void setQualificationSummary(String qualificationSummary) {
        this.qualificationSummary = qualificationSummary;
    }
}
