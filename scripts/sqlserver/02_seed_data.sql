IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 1)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (1, N'Recepção', N'Você foi registrado(a) na recepção. Em breve será chamado(a) para a triagem.', N'🏥');
IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 2)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (2, N'Triagem', N'Você está na triagem. A equipe vai verificar seus sinais vitais e prioridade de atendimento.', N'🩺');
IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 3)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (3, N'Aguardando Atendimento', N'Você está na fila de atendimento. Por favor, aguarde na sala de espera.', N'⏳');
IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 4)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (4, N'Em Atendimento', N'Você está sendo atendido(a) pelo médico(a). Fique tranquilo(a).', N'👨‍⚕️');
IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 5)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (5, N'Exames', N'Seus exames foram solicitados. Você será encaminhado(a) ao setor correspondente.', N'🔬');
IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 6)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (6, N'Aguardando Resultado', N'Seus exames estão sendo analisados. Por favor, aguarde na sala de espera.', N'📋');
IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 7)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (7, N'Retorno Médico', N'O médico(a) vai conversar com você sobre os resultados. Aguarde ser chamado(a).', N'🗣️');
IF NOT EXISTS (SELECT 1 FROM dbo.etapas WHERE id = 8)
    INSERT INTO dbo.etapas (id, label, descricao, icone) VALUES (8, N'Alta', N'Seu atendimento foi finalizado. Procure a recepção para orientações de saída.', N'✅');
GO

IF NOT EXISTS (SELECT 1 FROM dbo.equipe WHERE email = N'medico@claramed.com')
    INSERT INTO dbo.equipe (id, nome, email, senha_hash, cargo)
    VALUES (
        '11111111-1111-1111-1111-111111111111',
        N'Dr. Ricardo Souza',
        N'medico@claramed.com',
        N'$2a$10$zO6NH8Lptx79xQsZCC/c.umT9iwqLsCrjtuYO3CmplUzCXw/7I3gG',
        N'Médico Plantonista'
    );
GO

IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-001')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-001', N'Maria Silva', 45, 1, N'urgente', '08:15', 0);
IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-002')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-002', N'João Santos', 32, 3, N'normal', '09:02', 1);
IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-003')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-003', N'Ana Oliveira', 67, 4, N'emergência', '07:45', 0);
IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-004')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-004', N'Carlos Ferreira', 28, 2, N'normal', '09:30', 0);
IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-005')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-005', N'Lúcia Mendes', 55, 6, N'urgente', '08:50', 1);
IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-006')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-006', N'Pedro Almeida', 72, 5, N'emergência', '07:30', 0);
IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-007')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-007', N'Fernanda Costa', 19, 7, N'normal', '10:10', 0);
IF NOT EXISTS (SELECT 1 FROM dbo.pacientes WHERE id = N'pac-008')
    INSERT INTO dbo.pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES (N'pac-008', N'Roberto Lima', 60, 8, N'urgente', '06:55', 0);
GO
