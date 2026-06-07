package com.claramed.backend.controller;

import com.claramed.backend.dto.ApiError;
import com.claramed.backend.dto.UpdateEtapaRequest;
import com.claramed.backend.entity.Paciente;
import com.claramed.backend.repository.PacienteRepository;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/equipe")
public class EquipeController {

    private final PacienteRepository pacienteRepository;

    public EquipeController(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @GetMapping("/pacientes")
    public List<Paciente> getPacientes() {
        return pacienteRepository.findAll();
    }

    @GetMapping("/alertas")
    public List<Paciente> getAlertas() {
        return pacienteRepository.findAll().stream()
            .filter(Paciente::isPrecisaAjuda)
            .toList();
    }

    @DeleteMapping("/alertas/{pacienteId}")
    public ResponseEntity<Object> resolverAlerta(@PathVariable String pacienteId) {
        return pacienteRepository.findById(pacienteId)
            .<ResponseEntity<Object>>map(paciente -> {
                paciente.setPrecisaAjuda(false);
                pacienteRepository.save(paciente);
                return ResponseEntity.ok((Object) Map.of("success", true, "paciente", paciente));
            })
            .orElseGet(() -> ResponseEntity.status(404).body((Object) new ApiError("Paciente não encontrado.")));
    }

    @PutMapping("/pacientes/{id}/etapa")
    public ResponseEntity<Object> atualizarEtapa(@PathVariable String id, @RequestBody UpdateEtapaRequest request) {
        if (request == null || request.etapaId() == null) {
            return ResponseEntity.badRequest().body((Object) new ApiError("etapaId é obrigatório."));
        }

        return pacienteRepository.findById(id)
            .<ResponseEntity<Object>>map(paciente -> {
                paciente.setEtapaAtual(request.etapaId());
                pacienteRepository.save(paciente);
                return ResponseEntity.ok((Object) paciente);
            })
            .orElseGet(() -> ResponseEntity.status(404).body((Object) new ApiError("Paciente não encontrado.")));
    }
}
