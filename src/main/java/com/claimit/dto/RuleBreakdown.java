package com.claimit.dto;

public class RuleBreakdown {

    private String ruleName; // e.g. "Age Requirement", "Income Requirement"
    private boolean satisfied;
    private boolean verified;
    private String details; // e.g. "Age 20 is within range (16 - 30)"
    private String statusText; // "✓ Satisfied", "✗ Not met", "⚠ Information not verified"

    public RuleBreakdown() {}

    public RuleBreakdown(String ruleName, boolean satisfied, boolean verified, String details, String statusText) {
        this.ruleName = ruleName;
        this.satisfied = satisfied;
        this.verified = verified;
        this.details = details;
        this.statusText = statusText;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public boolean isSatisfied() {
        return satisfied;
    }

    public void setSatisfied(boolean satisfied) {
        this.satisfied = satisfied;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getStatusText() {
        return statusText;
    }

    public void setStatusText(String statusText) {
        this.statusText = statusText;
    }
}
