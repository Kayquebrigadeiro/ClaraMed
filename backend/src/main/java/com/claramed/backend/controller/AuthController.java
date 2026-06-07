package com.claramed.backend.controller;

import com.claramed.backend.dto.ApiError;
import com.claramed.backend.dto.EquipeUserResponse;
import com.claramed.backend.dto.LoginRequest;
import com.claramed.backend.dto.LoginResponse;
import com.claramed.backend.entity.Equipe;
import com.claramed.backend.repository.EquipeRepository;
import com.claramed.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final EquipeRepository equipeRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(EquipeRepository equipeRepository, JwtService jwtService, BCryptPasswordEncoder passwordEncoder) {
        this.equipeRepository = equipeRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || request.email() == null || request.senha() == null) {
            return ResponseEntity.badRequest().body(new ApiError("E-mail e senha são obrigatórios."));
        }

        Equipe equipe = equipeRepository.findByEmail(request.email()).orElse(null);
        if (equipe == null) {
            return ResponseEntity.status(401).body(new ApiError("E-mail ou senha inválidos."));
        }

        if (!passwordEncoder.matches(request.senha(), equipe.getSenhaHash())) {
            return ResponseEntity.status(401).body(new ApiError("E-mail ou senha inválidos."));
        }

        EquipeUserResponse user = new EquipeUserResponse(equipe.getId(), equipe.getNome(), equipe.getEmail(), equipe.getCargo());
        String token = jwtService.generateToken(equipe);
        return ResponseEntity.ok(new LoginResponse(user, token));
    }
}
