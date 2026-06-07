# 🗄️ Configuração do SQL Server para ClaraMed

Este guia cobre a configuração do banco de dados SQL Server tanto **localmente** quanto no **Somee** (hospedagem gratuita para hackathons).

---

## 📦 Opção 1: SQL Server Local (Desenvolvimento)

### Pré-requisitos
- SQL Server Express 2019+ instalado
- SQL Server Management Studio (SSMS) ou Azure Data Studio

### Passo a passo

1. **Abra o SSMS e conecte no servidor local:**
   ```
   Servidor: localhost\SQLEXPRESS
   Autenticação: Autenticação do Windows
   ```

2. **Crie o banco de dados:**
   ```sql
   CREATE DATABASE ClaraMedDB;
   GO
   
   USE ClaraMedDB;
   GO
   ```

3. **Crie as tabelas:**
   ```sql
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

   -- Índices para desempenho
   CREATE INDEX idx_pacientes_prioridade ON pacientes(prioridade);
   CREATE INDEX idx_pacientes_etapa ON pacientes(etapa_atual);
   CREATE INDEX idx_pacientes_ajuda ON pacientes(precisa_ajuda);
   ```

4. **Insira os dados iniciais:**
   ```sql
   -- Usuário de teste (senha BCrypt de '123456')
   INSERT INTO usuarios (nome, email, senha, cargo) 
   VALUES ('Dr. Ricardo Souza', 'medico@claramed.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Médico Plantonista');

   -- Pacientes de exemplo
   INSERT INTO pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES
   ('pac-001', 'Maria Silva', 45, 1, 'urgente', '08:15', 0),
   ('pac-002', 'João Santos', 32, 3, 'normal', '09:02', 1),
   ('pac-003', 'Ana Oliveira', 67, 4, 'emergência', '07:45', 0),
   ('pac-004', 'Carlos Ferreira', 28, 2, 'normal', '09:30', 0),
   ('pac-005', 'Lúcia Mendes', 55, 6, 'urgente', '08:50', 1),
   ('pac-006', 'Pedro Almeida', 72, 5, 'emergência', '07:30', 0),
   ('pac-007', 'Fernanda Costa', 19, 7, 'normal', '10:10', 0),
   ('pac-008', 'Roberto Lima', 60, 8, 'urgente', '06:55', 0);
   ```

5. **Configure a string de conexão no backend:**
   
   Edite `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=ClaraMedDB;encrypt=false
   spring.datasource.username=sa
   spring.datasource.password=SUA_SENHA_AQUI
   spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
   
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
   
   jwt.secret=claramed-jwt-secret-key-2024-ultra-segura-para-producao
   jwt.expiration=86400000
   ```

---

## ☁️ Opção 2: Somee (Hospedagem Gratuita)

### Pré-requisitos
- Conta criada em [somee.com](https://somee.com) (gratuita)

### Passo a passo

1. **Crie uma conta no Somee:**
   - Acesse https://somee.com
   - Clique em "Cadastrar-se" → "Plano Gratuito"
   - Preencha o formulário de cadastro

2. **Crie um banco de dados SQL Server:**
   - No painel do Somee, vá em **"Bancos de Dados" → "MS SQL"**
   - Clique em **"Criar novo banco de dados"**
   - Nome sugerido: `ClaraMedDB`
   - Anote as credenciais geradas:
     - **Servidor:** `[seu-usuario].somee.com`
     - **Banco de Dados:** `[seu-usuario]_ClaraMedDB`
     - **Usuário:** `[seu-usuario]_ClaraMedDB_admin`
     - **Senha:** `[senha-gerada]`

3. **Execute o script SQL no painel do Somee:**
   - No painel do banco, clique em **"Gerenciar Banco de Dados" → "Janela de Consulta"**
   - Cole e execute o seguinte script completo:

   ```sql
   -- Tabela de usuários
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

   -- Índices
   CREATE INDEX idx_pacientes_prioridade ON pacientes(prioridade);
   CREATE INDEX idx_pacientes_etapa ON pacientes(etapa_atual);
   CREATE INDEX idx_pacientes_ajuda ON pacientes(precisa_ajuda);

   -- Dados iniciais de usuário (senha: 123456)
   INSERT INTO usuarios (nome, email, senha, cargo) 
   VALUES ('Dr. Ricardo Souza', 'medico@claramed.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Médico Plantonista');

   -- Dados iniciais de pacientes
   INSERT INTO pacientes (id, nome, idade, etapa_atual, prioridade, horario_chegada, precisa_ajuda) VALUES
   ('pac-001', 'Maria Silva', 45, 1, 'urgente', '08:15', 0),
   ('pac-002', 'João Santos', 32, 3, 'normal', '09:02', 1),
   ('pac-003', 'Ana Oliveira', 67, 4, 'emergência', '07:45', 0),
   ('pac-004', 'Carlos Ferreira', 28, 2, 'normal', '09:30', 0),
   ('pac-005', 'Lúcia Mendes', 55, 6, 'urgente', '08:50', 1),
   ('pac-006', 'Pedro Almeida', 72, 5, 'emergência', '07:30', 0),
   ('pac-007', 'Fernanda Costa', 19, 7, 'normal', '10:10', 0),
   ('pac-008', 'Roberto Lima', 60, 8, 'urgente', '06:55', 0);
   ```

4. **Configure o backend para produção:**

   Crie `backend/src/main/resources/application-prod.properties`:
   ```properties
   spring.datasource.url=jdbc:sqlserver://[seu-usuario].somee.com:1433;databaseName=[seu-usuario]_ClaraMedDB;encrypt=true;trustServerCertificate=true
   spring.datasource.username=[seu-usuario]_ClaraMedDB_admin
   spring.datasource.password=[senha-gerada]
   spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
   
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=false
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
   
   jwt.secret=${JWT_SECRET:claramed-jwt-secret-prod-2024}
   jwt.expiration=86400000
   
   # CORS para frontend hospedado
   cors.allowed.origins=${CORS_ORIGIN:https://seu-frontend.vercel.app}
   ```

5. **Execute o backend em modo produção:**
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=prod
   ```

---

## 🔐 Credenciais Padrão

**Login da equipe médica:**
- E-mail: `medico@claramed.com`
- Senha: `123456`

**Pacientes de teste:**
- IDs disponíveis: `pac-001` até `pac-008`
- Acesso via QR Code: `http://localhost:5173/paciente/pac-001`

---

## 📊 Verificação do Banco

Execute para confirmar que os dados foram inseridos:

```sql
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
```

---

## 🚨 Solução de Problemas

### Erro de conexão no Somee
- Verifique se o firewall permite conexões na porta 1433
- Confirme que `encrypt=true` e `trustServerCertificate=true` estão na string de conexão

### Erro de autenticação
- Verifique se a senha BCrypt foi inserida corretamente no banco
- Hash padrão para '123456': `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

### Backend não encontra o banco
- Confirme que o `spring.jpa.hibernate.ddl-auto=update` está configurado
- Verifique os logs do Spring Boot para mensagens de erro detalhadas

---

## 📝 Notas Importantes

1. **Segurança:** Nunca faça commit de credenciais reais no Git. Use variáveis de ambiente em produção.
2. **Limites gratuitos do Somee:** 
   - 1 banco SQL Server por conta
   - 20 MB de espaço
   - Ideal para hackathons e MVPs
3. **Desempenho:** Para produção real, considere Azure SQL Database ou AWS RDS.

---

**Criado para ClaraMed** - Plataforma de Comunicação Hospitalar Inteligente 🏥
