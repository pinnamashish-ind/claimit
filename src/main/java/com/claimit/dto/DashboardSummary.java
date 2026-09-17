package com.claimit.dto;

import com.claimit.model.Application;
import com.claimit.model.Notification;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardSummary {

    private String userName;
    private int potentialBenefitsCount;
    private int strongMatchesCount;
    private int applicationsStartedCount;
    private int upcomingDeadlinesCount;
    private BigDecimal totalPotentialBenefit;
    private String totalPotentialBenefitFormatted;
    private List<EligibilityMatchResult> topMatches = new ArrayList<>();
    private List<Application> userApplications = new ArrayList<>();
    private List<Notification> notifications = new ArrayList<>();

    public DashboardSummary() {}

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getPotentialBenefitsCount() {
        return potentialBenefitsCount;
    }

    public void setPotentialBenefitsCount(int potentialBenefitsCount) {
        this.potentialBenefitsCount = potentialBenefitsCount;
    }

    public int getStrongMatchesCount() {
        return strongMatchesCount;
    }

    public void setStrongMatchesCount(int strongMatchesCount) {
        this.strongMatchesCount = strongMatchesCount;
    }

    public int getApplicationsStartedCount() {
        return applicationsStartedCount;
    }

    public void setApplicationsStartedCount(int applicationsStartedCount) {
        this.applicationsStartedCount = applicationsStartedCount;
    }

    public int getUpcomingDeadlinesCount() {
        return upcomingDeadlinesCount;
    }

    public void setUpcomingDeadlinesCount(int upcomingDeadlinesCount) {
        this.upcomingDeadlinesCount = upcomingDeadlinesCount;
    }

    public BigDecimal getTotalPotentialBenefit() {
        return totalPotentialBenefit;
    }

    public void setTotalPotentialBenefit(BigDecimal totalPotentialBenefit) {
        this.totalPotentialBenefit = totalPotentialBenefit;
    }

    public String getTotalPotentialBenefitFormatted() {
        return totalPotentialBenefitFormatted;
    }

    public void setTotalPotentialBenefitFormatted(String totalPotentialBenefitFormatted) {
        this.totalPotentialBenefitFormatted = totalPotentialBenefitFormatted;
    }

    public List<EligibilityMatchResult> getTopMatches() {
        return topMatches;
    }

    public void setTopMatches(List<EligibilityMatchResult> topMatches) {
        this.topMatches = topMatches;
    }

    public List<Application> getUserApplications() {
        return userApplications;
    }

    public void setUserApplications(List<Application> userApplications) {
        this.userApplications = userApplications;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }
}
