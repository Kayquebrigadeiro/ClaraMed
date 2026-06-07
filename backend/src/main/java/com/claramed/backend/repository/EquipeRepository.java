package com.claramed.backend.repository;

import com.claramed.backend.entity.Equipe;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipeRepository extends JpaRepository<Equipe, UUID> {
    Optional<Equipe> findByEmail(String email);
}
