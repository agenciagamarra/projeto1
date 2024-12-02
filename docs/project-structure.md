# Quiz System - Documentação do Projeto

## Estrutura do Projeto

```
quiz-system/
├── api/                      # Backend API
│   ├── controllers/         # Controladores da API
│   ├── middlewares/        # Middlewares Express
│   ├── routes/             # Rotas da API
│   ├── utils/             # Utilitários e helpers
│   ├── config.js          # Configurações
│   ├── db.js             # Conexão com banco de dados
│   └── index.js          # Entrada da API
│
└── src/                    # Frontend React
    ├── components/        # Componentes React
    │   ├── admin/        # Componentes da área administrativa
    │   └── ui/           # Componentes de UI reutilizáveis
    ├── hooks/            # Hooks React customizados
    ├── lib/              # Bibliotecas e utilitários
    ├── pages/            # Páginas da aplicação
    │   └── admin/        # Páginas administrativas
    ├── services/         # Serviços e integrações
    ├── store/            # Gerenciamento de estado (Zustand)
    └── types/            # Definições de tipos TypeScript

## API (Backend)

### Endpoints

#### Autenticação
- POST `/api/auth/login` - Login de usuário
- POST `/api/auth/register` - Registro de novo usuário

#### Quizzes
- GET `/api/quizzes` - Lista todos os quizzes
- GET `/api/quizzes/search` - Busca quizzes
- GET `/api/quizzes/:id` - Obtém detalhes de um quiz
- POST `/api/quizzes` - Cria novo quiz (admin)
- POST `/api/quizzes/import` - Importa quiz de arquivo (admin)

#### Tentativas
- POST `/api/attempts` - Registra nova tentativa
- GET `/api/attempts/user/:userId` - Lista tentativas do usuário
- GET `/api/attempts/:id` - Obtém detalhes da tentativa

#### Usuários
- GET `/api/users` - Lista usuários (admin)
- GET `/api/users/:id` - Obtém detalhes do usuário
- PUT `/api/users/:id` - Atualiza usuário
- DELETE `/api/users/:id` - Remove usuário

### Banco de Dados

#### Tabelas

##### users
- id: BIGINT (PK)
- name: VARCHAR(255)
- email: VARCHAR(255)
- password_hash: VARCHAR(255)
- role: ENUM('admin', 'user')
- created_at: TIMESTAMP

##### quizzes
- id: BIGINT (PK)
- title: VARCHAR(255)
- subject: VARCHAR(255)
- time_limit: INT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

##### questions
- id: BIGINT (PK)
- quiz_id: BIGINT (FK)
- text: TEXT
- image_url: VARCHAR(1024)
- image_width: INT
- image_height: INT
- subject: VARCHAR(255)
- correct_option: TINYINT
- created_at: TIMESTAMP

##### question_options
- id: BIGINT (PK)
- question_id: BIGINT (FK)
- option_text: TEXT
- option_index: TINYINT

##### quiz_attempts
- id: BIGINT (PK)
- user_id: BIGINT (FK)
- quiz_id: BIGINT (FK)
- score: INT
- time_spent: INT
- completed_at: TIMESTAMP

##### attempt_answers
- id: BIGINT (PK)
- attempt_id: BIGINT (FK)
- question_id: BIGINT (FK)
- selected_option: TINYINT

## Frontend (React)

### Páginas

#### Públicas
- Home (`/`) - Página inicial
- Login (`/login`) - Login de usuário
- Register (`/register`) - Registro de usuário

#### Autenticadas
- Quiz List (`/quizzes`) - Lista de quizzes disponíveis
- Quiz Attempt (`/quiz/:id`) - Tentativa de quiz
- History (`/history`) - Histórico de tentativas
- Profile (`/profile`) - Perfil do usuário

#### Admin
- Dashboard (`/admin`) - Visão geral do sistema
- Users (`/admin/users`) - Gerenciamento de usuários
- Quizzes (`/admin/quizzes`) - Gerenciamento de quizzes

### Componentes Principais

#### UI Components
- Button - Botão customizado com variantes
- Input - Campo de entrada com validação
- Modal - Modal reutilizável
- Card - Container de conteúdo
- Badge - Indicador visual
- LoadingSpinner - Indicador de carregamento

#### Admin Components
- QuizModal - Modal de criação/edição de quiz
- QuizImportModal - Modal de importação de quiz
- UserModal - Modal de gerenciamento de usuário
- DashboardStats - Estatísticas do dashboard
- PerformanceChart - Gráfico de desempenho

### Estado Global (Zustand)

#### Auth Store
- user: Usuário atual
- isAuthenticated: Status de autenticação
- login(): Login de usuário
- logout(): Logout de usuário

### Utilitários

#### API Client
- apiClient - Cliente HTTP para comunicação com a API
- Interceptors para tratamento de erros
- Gerenciamento de tokens JWT

#### Validação
- validateQuiz() - Validação de quiz
- validateUser() - Validação de usuário
- getFieldError() - Obtém erro de campo específico

#### Formatação
- formatTime() - Formata tempo em segundos
- formatDate() - Formata data

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MySQL
- JWT para autenticação
- Zod para validação
- Multer para upload de arquivos

### Frontend
- React
- TypeScript
- Tailwind CSS
- Zustand para estado global
- React Router para navegação
- Lucide React para ícones

## Segurança

### Autenticação
- JWT (JSON Web Tokens)
- Senhas hasheadas com bcrypt
- Middleware de autenticação para rotas protegidas

### Autorização
- Roles: admin e user
- Middleware de autorização para rotas admin
- Validação de permissões no frontend

## Funcionalidades

### Quiz
- Criação de quiz com questões múltipla escolha
- Suporte a imagens nas questões
- Temporizador para tentativas
- Cálculo automático de pontuação
- Importação de quiz via arquivo

### Usuários
- Registro e autenticação
- Perfis com histórico de tentativas
- Painel administrativo para gestão
- Análise de desempenho

### Análise
- Estatísticas por usuário
- Desempenho por matéria
- Tempo médio de conclusão
- Taxa de acerto por questão

## Deployment

### API
- Porta: 3002
- Ambiente: Node.js
- Banco de dados: MySQL
- Variáveis de ambiente necessárias:
  - PORT
  - JWT_SECRET
  - DB_HOST
  - DB_USER
  - DB_PASS
  - DB_NAME

### Frontend
- Build com Vite
- Hospedagem estática
- Configuração de CORS
- Variáveis de ambiente:
  - VITE_API_URL

## Desenvolvimento

### Requisitos
- Node.js >= 18
- MySQL >= 8.0
- npm ou yarn

### Instalação
1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure variáveis de ambiente
4. Execute migrações do banco
5. Inicie o servidor: `npm start`

### Scripts
- `npm start` - Inicia a aplicação
- `npm run dev` - Modo desenvolvimento
- `npm run build` - Build de produção
- `npm run db:migrate` - Executa migrações

## Manutenção

### Logs
- Logs de erro no console
- Tratamento global de erros
- Validação de dados de entrada

### Backup
- Backup diário do banco de dados
- Versionamento de código
- Documentação atualizada

### Monitoramento
- Status do servidor
- Uso de memória
- Tempo de resposta
- Erros e exceções
```