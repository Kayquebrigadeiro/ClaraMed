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
@Table(name = "pacientes")
public class Paciente {

    @Id
    @Column(nullable = false, length = 20, updatable = false)
    private String id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false)
    private Integer idade;

    @Column(nullable = false)
    private Integer etapaAtual;

    @Column(nullable = false, length = 20)
    private String prioridade;

    @Column(nullable = false, length = 5)
    private String horarioChegada;

    @Column(nullable = false)
    private boolean precisaAjuda;
}
