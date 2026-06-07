IF OBJECT_ID(N'dbo.etapas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.etapas (
        id INT NOT NULL,
        label NVARCHAR(100) NOT NULL,
        descricao NVARCHAR(1000) NOT NULL,
        icone NVARCHAR(32) NOT NULL,
        CONSTRAINT PK_etapas PRIMARY KEY CLUSTERED (id),
        CONSTRAINT CK_etapas_id CHECK (id BETWEEN 1 AND 8)
    );
END;
GO

IF OBJECT_ID(N'dbo.equipe', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.equipe (
        id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_equipe_id DEFAULT NEWSEQUENTIALID(),
        nome NVARCHAR(150) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        senha_hash NVARCHAR(255) NOT NULL,
        cargo NVARCHAR(100) NOT NULL,
        CONSTRAINT PK_equipe PRIMARY KEY CLUSTERED (id),
        CONSTRAINT UQ_equipe_email UNIQUE (email)
    );
END;
GO

IF OBJECT_ID(N'dbo.pacientes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.pacientes (
        id NVARCHAR(20) NOT NULL,
        nome NVARCHAR(150) NOT NULL,
        idade INT NOT NULL,
        etapa_atual INT NOT NULL,
        prioridade NVARCHAR(20) NOT NULL,
        horario_chegada CHAR(5) NOT NULL,
        precisa_ajuda BIT NOT NULL CONSTRAINT DF_pacientes_precisa_ajuda DEFAULT (0),
        CONSTRAINT PK_pacientes PRIMARY KEY CLUSTERED (id),
        CONSTRAINT CK_pacientes_idade CHECK (idade BETWEEN 0 AND 120),
        CONSTRAINT CK_pacientes_prioridade CHECK (prioridade IN (N'normal', N'urgente', N'emergência')),
        CONSTRAINT CK_pacientes_horario CHECK (TRY_CONVERT(time(0), horario_chegada) IS NOT NULL),
        CONSTRAINT FK_pacientes_etapas FOREIGN KEY (etapa_atual) REFERENCES dbo.etapas (id)
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_pacientes_etapa_atual'
      AND object_id = OBJECT_ID(N'dbo.pacientes')
)
BEGIN
    CREATE INDEX IX_pacientes_etapa_atual ON dbo.pacientes (etapa_atual);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_pacientes_precisa_ajuda'
      AND object_id = OBJECT_ID(N'dbo.pacientes')
)
BEGIN
    CREATE INDEX IX_pacientes_precisa_ajuda ON dbo.pacientes (precisa_ajuda) INCLUDE (nome, etapa_atual, prioridade, horario_chegada);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_pacientes_prioridade_etapa'
      AND object_id = OBJECT_ID(N'dbo.pacientes')
)
BEGIN
    CREATE INDEX IX_pacientes_prioridade_etapa ON dbo.pacientes (prioridade, etapa_atual);
END;
GO
