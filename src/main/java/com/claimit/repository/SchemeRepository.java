package com.claimit.repository;

import com.claimit.model.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByIsActiveTrue();
    List<Scheme> findByCategoryIgnoreCaseAndIsActiveTrue(String category);
    Optional<Scheme> findByCode(String code);

    @Query("SELECT DISTINCT s.category FROM Scheme s WHERE s.isActive = true")
    List<String> findDistinctCategories();
}
