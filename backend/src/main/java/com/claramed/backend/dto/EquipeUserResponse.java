package com.claramed.backend.dto;

import java.util.UUID;

public record EquipeUserResponse(UUID id, String nome, String email, String cargo) {
}
