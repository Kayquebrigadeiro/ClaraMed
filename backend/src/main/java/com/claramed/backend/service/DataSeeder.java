package com.claramed.backend.service;

import com.claramed.backend.entity.Equipe;
import com.claramed.backend.entity.Etapa;
import com.claramed.backend.entity.Paciente;
import com.claramed.backend.repository.EquipeRepository;
import com.claramed.backend.repository.EtapaRepository;
import com.claramed.backend.repository.PacienteRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final PacienteRepository pacienteRepository;
    private final EquipeRepository equipeRepository;
    private final EtapaRepository etapaRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataSeeder(
        PacienteRepository pacienteRepository,
        EquipeRepository equipeRepository,
        EtapaRepository etapaRepository,
        BCryptPasswordEncoder passwordEncoder
    ) {
        this.pacienteRepository = pacienteRepository;
        this.equipeRepository = equipeRepository;
        this.etapaRepository = etapaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedEtapas();
        seedEquipe();
        seedPacientes();
    }

    private void seedEtapas() {
        List<Etapa> etapas = List.of(
            new Etapa(1, "Recepção", "Você foi registrado(a) na recepção. Em breve será chamado(a) para a triagem.", "🏥"),
            new Etapa(2, "Triagem", "Você está na triagem. A equipe vai verificar seus sinais vitais e prioridade de atendimento.", "🩺"),
            new Etapa(3, "Aguardando Atendimento", "Você está na fila de atendimento. Por favor, aguarde na sala de espera.", "⏳"),
            new Etapa(4, "Em Atendimento", "Você está sendo atendido(a) pelo médico(a). Fique tranquilo(a).", "👨‍⚕️"),
            new Etapa(5, "Exames", "Seus exames foram solicitados. Você será encaminhado(a) ao setor correspondente.", "🔬"),
            new Etapa(6, "Aguardando Resultado", "Seus exames estão sendo analisados. Por favor, aguarde na sala de espera.", "📋"),
            new Etapa(7, "Retorno Médico", "O médico(a) vai conversar com você sobre os resultados. Aguarde ser chamado(a).", "🗣️"),
            new Etapa(8, "Alta", "Seu atendimento foi finalizado. Procure a recepção para orientações de saída.", "✅")
        );

        for (Etapa etapa : etapas) {
            etapaRepository.findById(etapa.getId()).orElseGet(() -> etapaRepository.save(etapa));
        }
    }

    private void seedEquipe() {
        equipeRepository.findByEmail("medico@claramed.com").orElseGet(() ->
            equipeRepository.save(
                Equipe.builder()
                    .nome("Dr. Ricardo Souza")
                    .email("medico@claramed.com")
                    .senhaHash(passwordEncoder.encode("123456"))
                    .cargo("Médico Plantonista")
                    .build()
            )
        );
    }

    private void seedPacientes() {
        List<Paciente> pacientes = List.of(
            Paciente.builder().id("pac-001").nome("Maria Silva").idade(45).etapaAtual(1).prioridade("urgente").horarioChegada("08:15").precisaAjuda(false).build(),
            Paciente.builder().id("pac-002").nome("João Santos").idade(32).etapaAtual(3).prioridade("normal").horarioChegada("09:02").precisaAjuda(true).build(),
            Paciente.builder().id("pac-003").nome("Ana Oliveira").idade(67).etapaAtual(4).prioridade("emergência").horarioChegada("07:45").precisaAjuda(false).build(),
            Paciente.builder().id("pac-004").nome("Carlos Ferreira").idade(28).etapaAtual(2).prioridade("normal").horarioChegada("09:30").precisaAjuda(false).build(),
            Paciente.builder().id("pac-005").nome("Lúcia Mendes").idade(55).etapaAtual(6).prioridade("urgente").horarioChegada("08:50").precisaAjuda(true).build(),
            Paciente.builder().id("pac-006").nome("Pedro Almeida").idade(72).etapaAtual(5).prioridade("emergência").horarioChegada("07:30").precisaAjuda(false).build(),
            Paciente.builder().id("pac-007").nome("Fernanda Costa").idade(19).etapaAtual(7).prioridade("normal").horarioChegada("10:10").precisaAjuda(false).build(),
            Paciente.builder().id("pac-008").nome("Roberto Lima").idade(60).etapaAtual(8).prioridade("urgente").horarioChegada("06:55").precisaAjuda(false).build()
        );

        for (Paciente paciente : pacientes) {
            pacienteRepository.findById(paciente.getId()).orElseGet(() -> pacienteRepository.save(paciente));
        }
    }
}
