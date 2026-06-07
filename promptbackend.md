Tarefa: Desenvolver o backend do sistema web ClaraMed em sprints, usando Java Spring Boot + SQL Server.
Contexto: O ClaraMed é uma plataforma de comunicação inteligente para pronto atendimento hospitalar. O frontend já está pronto em React, com mocks simulando todas as chamadas à API. O backend precisa entregar os endpoints que o frontend já espera, respeitando exatamente os contratos abaixo. Autenticação via JWT. Deploy no Railway ou Render.
Entidades do banco:

Paciente: id (UUID), nome, idade, etapaAtual (int), prioridade (normal/urgente/emergência), horarioChegada, precisaAjuda (boolean)
Equipe: id, nome, email, senha (hash), cargo
Etapa: id (1-8), label, descricao, icone

Endpoints que o frontend espera — respeitar exatamente:
POST   /auth/login                          → recebe { email, senha }, retorna { user, token }
GET    /pacientes/{id}                      → retorna dados do paciente pelo ID ou token
POST   /pacientes/{id}/ajuda               → marca precisaAjuda = true
GET    /equipe/pacientes                    → retorna lista completa de pacientes
GET    /equipe/alertas                      → retorna pacientes com precisaAjuda = true
DELETE /equipe/alertas/{pacienteId}        → marca precisaAjuda = false
PUT    /equipe/pacientes/{id}/etapa        → recebe { etapaId }, atualiza etapaAtual
Restrições:

Rotas /equipe/* protegidas por JWT — rejeitar sem token válido
Rota /pacientes/{id} pública — sem JWT (acessada via QR Code)
Rota POST /pacientes/{id}/ajuda pública — sem JWT
CORS liberado para o domínio do frontend (Vercel/Netlify)
Senhas com hash BCrypt
Retornar sempre JSON
Popular o banco com dados iniciais (seeds) equivalentes aos mocks do frontend

Seeds obrigatórios — banco deve iniciar com esses dados:
Usuário da equipe:

email: medico@claramed.com, senha: 123456, nome: Dr. Ricardo Souza, cargo: Médico Plantonista

8 pacientes iniciais com os mesmos IDs do frontend: pac-001 até pac-008, com os mesmos nomes, idades, etapas e prioridades do mock.
As 8 etapas fixas do atendimento: Recepção, Triagem, Aguardando Atendimento, Em Atendimento, Exames, Aguardando Resultado, Retorno Médico, Alta.
Sprints:
Sprint 1 — Configuração base
Criar o projeto Spring Boot com as dependências: Spring Web, Spring Data JPA, Spring Security, JWT (jjwt), SQL Server Driver, Lombok. Configurar application.properties com conexão ao SQL Server. Criar as entidades JPA (Paciente, Equipe, Etapa). Criar os repositórios. Rodar e validar a conexão com o banco.
Sprint 2 — Autenticação JWT
Implementar o endpoint POST /auth/login. Gerar token JWT com validade de 8 horas. Criar o filtro JWT para validar token nas requisições. Proteger as rotas /equipe/* com Spring Security. Liberar as rotas públicas /pacientes/* e /auth/*. Testar com Postman ou Insomnia.
Sprint 3 — Endpoints do paciente
Implementar GET /pacientes/{id} retornando os dados do paciente em JSON. Implementar POST /pacientes/{id}/ajuda marcando precisaAjuda = true. Criar seeds iniciais com os 8 pacientes e as 8 etapas. Testar integração com o frontend rodando localmente.
Sprint 4 — Endpoints da equipe
Implementar GET /equipe/pacientes, GET /equipe/alertas, DELETE /equipe/alertas/{id} e PUT /equipe/pacientes/{id}/etapa. Garantir que todas as rotas /equipe/* exigem JWT válido. Configurar CORS para aceitar requisições do frontend. Testar o fluxo completo com o frontend.
Sprint 5 — Deploy
Configurar variáveis de ambiente para produção (DB_URL, DB_USER, DB_PASS, JWT_SECRET). Fazer o deploy no Railway ou Render. Validar todos os endpoints em produção. Passar a URL da API pro frontend trocar o VITE_API_URL no .env.