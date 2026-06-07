package com.claramed.backend.repository;

import com.claramed.backend.entity.Etapa;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EtapaRepository extends JpaRepository<Etapa, Integer> {
    List<Etapa> findAllByOrderByIdAsc();
}
