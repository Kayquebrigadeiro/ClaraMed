package com.claramed.backend.controller;

import com.claramed.backend.dto.ApiError;
import com.claramed.backend.entity.Paciente;
import com.claramed.backend.repository.PacienteRepository;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    private final PacienteRepository pacienteRepository;

    public PacienteController(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPaciente(@PathVariable String id) {
        return pacienteRepository.findById(id)
            .<ResponseEntity<Object>>map(paciente -> ResponseEntity.ok((Object) paciente))
            .orElseGet(() -> ResponseEntity.status(404).body((Object) new ApiError("Paciente não encontrado.")));
    }

    @PostMapping("/{id}/ajuda")
    public ResponseEntity<Object> pedirAjuda(@PathVariable String id) {
        return pacienteRepository.findById(id)
            .<ResponseEntity<Object>>map(paciente -> {
                paciente.setPrecisaAjuda(true);
                pacienteRepository.save(paciente);
                return ResponseEntity.ok((Object) Map.of("success", true, "paciente", paciente));
            })
            .orElseGet(() -> ResponseEntity.status(404).body((Object) new ApiError("Paciente não encontrado.")));
    }
}
