package com.claimit.dto;

public class LoginRequest {
    private String identifier; // email, mobile, or aadhaar
    private String password;
    private String otp;
    private String authType; // "password", "otp", or "demo"
    private String demoPersona; // "student", "farmer", "entrepreneur", "senior"

    public LoginRequest() {}

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getAuthType() {
        return authType;
    }

    public void setAuthType(String authType) {
        this.authType = authType;
    }

    public String getDemoPersona() {
        return demoPersona;
    }

    public void setDemoPersona(String demoPersona) {
        this.demoPersona = demoPersona;
    }
}
