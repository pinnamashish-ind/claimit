package com.claimit.dto;

import java.util.ArrayList;
import java.util.List;

public class AiResponse {

    private String answer;
    private String language;
    private List<String> suggestions = new ArrayList<>();
    private boolean simulated;

    public AiResponse() {}

    public AiResponse(String answer, String language, List<String> suggestions, boolean simulated) {
        this.answer = answer;
        this.language = language;
        this.suggestions = suggestions;
        this.simulated = simulated;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public boolean isSimulated() {
        return simulated;
    }

    public void setSimulated(boolean simulated) {
        this.simulated = simulated;
    }
}
