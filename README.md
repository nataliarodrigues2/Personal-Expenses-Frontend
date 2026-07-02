# Personal Expenses — Frontend

Aplicação React (Vite) integrada à [Personal Expenses API](https://github.com/nataliarodrigues2/Personal-Expenses-API-final) para controle de despesas pessoais.

## Tecnologias

- React 19 + React Router DOM
- Axios
- Context API (autenticação / estado global)
- Hooks customizados para acesso à API (`useCategorias`, `useDespesas`)
- CSS puro (sem framework externo)

## Estrutura

```
src/
 ├── components/   # Navbar, Loading, ErrorMessage
 ├── contexts/     # AuthContext (sessão do usuário)
 ├── hooks/        # useAuth, useCategorias, useDespesas
 ├── pages/        # Login, Register, Dashboard, Categorias, Despesas
 ├── routes/       # AppRoutes (rotas públicas e protegidas)
 └── services/     # api.js (instância axios + interceptors)
```

## Como rodar o projeto completo (backend + frontend)

### 1. Backend

Clone e configure a API separadamente:

```bash
git clone https://github.com/nataliarodrigues2/Personal-Expenses-API-final.git
cd Personal-Expenses-API-final
npm install
```

Crie um banco MySQL chamado `personal_expenses`, copie `.env.example` para `.env` e preencha:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=personal_expenses
DB_PORT=3306
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d
```

Rode as migrations/seeders e suba o servidor:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

A API sobe em `http://localhost:3000` (porta fixa) com CORS liberado.

### 2. Frontend (este repositório)

```bash
npm install
```

Configure o `.env` (já incluso, ignorado pelo git) apontando para a API:

```
VITE_API_URL=http://localhost:3000
```

Suba o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:5173`, crie uma conta em **Criar conta** (ou use um usuário já existente/seedado no backend) e faça login.

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run lint` — checagem de lint
- `npm run preview` — pré-visualiza o build de produção

## Funcionalidades

- **Autenticação**: login, cadastro, persistência de sessão (token + dados do usuário em `localStorage`) e logout. Requisições com token expirado/inválido (401) redirecionam automaticamente para o login.
- **Dashboard**: total de gastos, quantidade de despesas, gastos por categoria e últimas despesas cadastradas.
- **Categorias**: CRUD completo.
- **Despesas**: CRUD completo com filtros por categoria, status, intervalo de data e faixa de valor.
