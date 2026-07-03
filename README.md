# Personal Expenses — Frontend (Íris)

Aplicação React (Vite) para controle de despesas pessoais, consumindo a [Personal Expenses API](../Personal-Expenses-Backend) que fica na pasta ao lado deste projeto.

## Tecnologias

- React 19 + React Router DOM 7
- Axios (instância única com interceptors de autenticação)
- Context API — `AuthContext` (sessão), `ThemeContext` (dark mode), `ToastContext` (notificações)
- Hooks customizados: `useAuth`, `useCategorias`, `useDespesas`, `useTheme`, `useToast`
- Tailwind CSS 3 (tokens de cor/tipografia/sombra em CSS vars, dark mode via classe `.dark` persistida em `localStorage`)
- Vite 8 + ESLint 10

## Estrutura

```
src/
 ├── components/
 │    ├── ui/            # Button, Input, Select, Modal, Card, StatusBadge, Toast,
 │    │                  # Skeleton, EmptyState, ErrorState, ThemeToggle
 │    ├── layout/        # Sidebar, MobileTopBar, MobileTabBar, AppLayout, PageHeader
 │    └── ErrorMessage/
 ├── contexts/            # AuthContext, ThemeContext, ToastContext (+ *Instance.js)
 ├── hooks/               # useAuth, useCategorias, useDespesas, useTheme, useToast
 ├── pages/
 │    ├── Login/, Register/, Dashboard/, Categorias/, Estatisticas/
 │    └── Despesas/
 │         └── components/  # FiltrosDespesas, TabelaDespesas, ModalDespesa, VisualizarDespesa
 ├── routes/              # AppRoutes (rotas públicas e protegidas)
 ├── services/            # api.js (instância axios + interceptors)
 ├── styles/              # global.css (tokens de design)
 └── utils/               # format.js, categoryColors.js
```

## Como rodar o projeto completo (backend + frontend)

Os dois projetos ficam lado a lado na mesma pasta:

```
Trabalho Final/
 ├── Personal-Expenses-Backend/
 └── Personal-Expenses-Frontend/   ← você está aqui
```

### 1. Backend (`../Personal-Expenses-Backend`)

Pré-requisito: um servidor MySQL rodando localmente, com um banco chamado `personal_expenses` criado.

```bash
cd ../Personal-Expenses-Backend
npm install
```

Copie `.env.example` para `.env` e preencha (valores de exemplo para ambiente local):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=personal_expenses
DB_PORT=3306

JWT_SECRET=uma_chave_qualquer
JWT_EXPIRES_IN=1d
```

Rode as migrations (criam as tabelas `Users`, `Categories`, `Expenses`, e adicionam as colunas `color` em Categories e `comprovanteUrl` em Expenses) e os seeders (criam 1 usuário, 3 categorias e 3 despesas de exemplo):

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

A API sobe em `http://localhost:3000` (porta fixa no código), com CORS liberado e uploads servidos em `/uploads`.

Usuário de teste criado pelo seeder:
- **E-mail:** `natalia@email.com`
- **Senha:** `123456`

### 2. Frontend (esta pasta)

Em outro terminal:

```bash
npm install
cp .env.example .env
```

O `.env.example` já vem com `VITE_API_URL=http://localhost:3000` — mantenha assim se o backend estiver rodando na porta padrão.

```bash
npm run dev
```

Acesse `http://localhost:5173`. Entre com o usuário do seeder (`natalia@email.com` / `123456`) ou crie uma conta nova em **Criar agora**.

## Scripts

**Frontend** (`npm run <script>` dentro desta pasta):
- `dev` — servidor de desenvolvimento (Vite)
- `build` — build de produção
- `lint` — checagem de lint (ESLint)
- `preview` — pré-visualiza o build de produção

**Backend** (dentro de `Personal-Expenses-Backend`):
- `dev` — inicia o servidor (`node src/app.js`)
- não há scripts de `build`/`lint` no backend (projeto Node puro, sem bundler)

## Funcionalidades

- **Autenticação**: login, cadastro, persistência de sessão (token + nome/e-mail em `localStorage`) e logout. Requisições com token expirado/inválido (401) redirecionam automaticamente para o login.
- **Dashboard**: total de gastos, quantidade de despesas, gastos por categoria (gráfico de barras + donut) e últimas despesas cadastradas.
- **Categorias**: CRUD completo, com cor própria por categoria (7 opções, usada em gráficos, badges e no grid).
- **Despesas**: CRUD completo, com tela de visualização somente-leitura, filtros por categoria/status/intervalo de data/faixa de valor, busca por descrição, ordenação por coluna (descrição/data/valor), paginação e upload de comprovante (PNG/JPG/PDF, até 5 MB).
- **Estatísticas**: evolução de gastos por período (30 dias/6 meses/1 ano), ranking por categoria e insight textual.
- **Extras**: dark mode persistido, estados de loading (skeleton)/vazio/erro com retry em todas as telas, navegação responsiva (sidebar fixa no desktop, tab bar inferior no mobile).

## Endpoints consumidos da API

| Recurso | Rotas |
|---|---|
| Autenticação | `POST /users`, `POST /auth/login` |
| Categorias | `GET/POST /categories`, `PUT/DELETE /categories/:id` |
| Despesas | `GET/POST /expenses`, `PUT/DELETE /expenses/:id`, `POST /expenses/upload` |
| Dashboard | `GET /dashboard/total-expenses`, `GET /dashboard/expenses-count`, `GET /dashboard/expenses-by-category` |

Filtros aceitos em `GET /expenses`: `categoryId`, `status`, `dataInicio`, `dataFim`, `valueMin`, `valueMax` (todos via query string, opcionais).

---