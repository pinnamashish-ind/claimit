package com.claimit.service;

import com.claimit.model.Scheme;
import com.claimit.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepository.findByIsActiveTrue();
    }

    public Optional<Scheme> getSchemeById(Long id) {
        return schemeRepository.findById(id);
    }

    public List<Scheme> getSchemesByCategory(String category) {
        return schemeRepository.findByCategoryIgnoreCaseAndIsActiveTrue(category);
    }

    public List<String> getAllCategories() {
        return schemeRepository.findDistinctCategories();
    }
}
