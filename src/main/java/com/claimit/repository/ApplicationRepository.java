package com.claimit.repository;

import com.claimit.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<Application> findByUserIdAndSchemeId(Long userId, Long schemeId);
    long countByUserIdAndStatus(Long userId, String status);
}
