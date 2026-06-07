package com.claramed.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "etapas")
public class Etapa {

    @Id
    private Integer id;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Column(nullable = false, length = 32)
    private String icone;
}
