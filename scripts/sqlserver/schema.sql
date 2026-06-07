-- ========================================================
-- ClaraMed - Script de Criação do Banco de Dados
-- SQL Server 2019+
-- ========================================================

-- Criar banco (execute apenas localmente, no Somee o banco já existe)
-- CREATE DATABASE ClaraMedDB;
-- GO
-- USE ClaraMedDB;
-- GO

-- ========================================================
-- TABELAS
-- ========================================================

-- Tabela de usuários da equipe médica
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    senha NVARCHAR(255) NOT NULL,
    cargo NVARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

-- Tabela de pacientes
CREATE TABLE pacientes (
    id NVARCHAR(50) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    idade INT NOT NULL,
    etapa_atual INT NOT NULL DEFAULT 1,
    prioridade NVARCHAR(20) NOT NULL CHECK (prioridade IN ('normal', 'urgente', 'emergência')),
    horario_chegada NVARCHAR(10) NOT NULL,
    precisa_ajuda BIT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);

-- ========================================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================================

CREATE INDEX idx_pacientes_prioridade ON pacientes(prioridade);
CREATE INDEX idx_pacientes_etapa ON pacientes(etapa_atual);
CREATE INDEX idx_pacientes_ajuda ON pacientes(precisa_ajuda);

-- ========================================================
-- DADOS DE SEED (DESENVOLVIMENTO E TESTES)
-- ========================================================

-- Usuário de teste
-- Email: medico@claramed.com
-- Senha: 123456 (hash BCrypt)
INSERT INTO usuarios (nome, email, senha, cargo) 
VALUES ('Dr. Ricardo Souza', 'medico@claramed.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Médico Plantonista');

-- Pacientes de exemplo com variação de etapas e prioridades
INSERT INTO pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES
('pac-001', 'Maria Silva', 45, 1, 'urgente', '08:15', 0),
('pac-002', 'João Santos', 32, 3, 'normal', '09:02', 1),
('pac-003', 'Ana Oliveira', 67, 4, 'emergência', '07:45', 0),
('pac-004', 'Carlos Ferreira', 28, 2, 'normal', '09:30', 0),
('pac-005', 'Lúcia Mendes', 55, 6, 'urgente', '08:50', 1),
('pac-006', 'Pedro Almeida', 72, 5, 'emergência', '07:30', 0),
('pac-007', 'Fernanda Costa', 19, 7, 'normal', '10:10', 0),
('pac-008', 'Roberto Lima', 60, 8, 'urgente', '06:55', 0);

-- ========================================================
-- QUERIES DE VERIFICAÇÃO
-- ========================================================

-- Contar usuários
SELECT COUNT(*) AS total_usuarios FROM usuarios;

-- Contar pacientes
SELECT COUNT(*) AS total_pacientes FROM pacientes;

-- Listar todos os pacientes
SELECT id, nome, idade, etapa_atual, prioridade, precisa_ajuda 
FROM pacientes 
ORDER BY horario_chegada;

-- Pacientes com alertas ativos
SELECT id, nome, etapa_atual 
FROM pacientes 
WHERE precisa_ajuda = 1;
