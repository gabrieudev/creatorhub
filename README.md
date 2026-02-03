<h1 align="center" style="font-weight: bold;">CreatorHub</h1>

<div align="center">
    <img src="./apps/web/public/logo.png">
</div>

<p align="center">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun">
  <img src="https://img.shields.io/badge/turborepo-%23EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn">
  <img src="https://img.shields.io/badge/Drizzle-%23000000?style=for-the-badge&logo=drizzle&logoColor=C5F74F" alt="Drizzle">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</p>

<p align="center">
 <a href="#estrutura">Estrutura do projeto</a> • 
 <a href="#inicio">Primeiros Passos</a> • 
 <a href="#interacao">Interação</a> •
 <a href="#contribuir">Contribuir</a>
</p>

<p align="center">
  <b>CreatorHub é uma plataforma SaaS tudo-em-um para gestão profissional de criadores de conteúdo e equipes, reunindo planejamento, produção, colaboração, publicação e faturamento. Oferece calendário editorial multi-plataforma, workflows e checklists, controle de receitas e previsões, dashboards e relatórios, CRM para marcas, contratos e invoices, split automático de ganhos, integrações com plataformas e gateways de pagamento, além de recursos de segurança, automação e opções premium para escalar de creators solo a agências.
  </b>
</p>

<h2 id="estrutura">📂 Estrutura do projeto</h2>

```yaml
├── apps/
│   ├── fumadocs/ # Documentação
│   ├── web/      # Projeto frontend (Next.js + Shadcn UI)
│   └── server/   # Projeto backend (Fastify + Drizzle)
│
├── packages/
│   ├── auth/     # Autenticação com Better Auth
│   ├── db/       # Banco de dados Postgres
│   └── env/      # Variáveis de ambiente
```

<h2 id="inicio">🚀 Primeiros Passos</h2>

<h3>Pré-requisitos</h3>

- [Bun](https://bun.com/docs/installation)

<h3>Clonando</h3>

```bash
git clone https://github.com/gabrieudev/creatorhub.git
```

<h3>Variáveis de Ambiente</h3>

Crie arquivos `.env` nos seguintes diretórios:

`/apps/server`

```bash
BETTER_AUTH_SECRET=SECRET_BETTER_AUTH
BETTER_AUTH_URL=SERVER_BASE_URL
CORS_ORIGIN=WEB_BASE_URL
DATABASE_URL=DATABASE_URL
DATABASE_URL_DIRECT=DATABASE_URL_DIRECT
PORT=PORT
```

`/apps/web`

```bash
NEXT_PUBLIC_SERVER_URL=SERVER_BASE_URL
```

<h3>Inicializando</h3>

Execute os seguintes comandos:

```bash
cd creatorhub
bun install
bun run dev
```

<h2 id="interacao">🌐 Interação</h2>

Agora, você poderá interagir com a aplicação das seguintes formas:

- Interface: [http://localhost:3001](http://localhost:3001)
- Servidor: [http://localhost:3000](http://localhost:3000)
- Documentação: [http://localhost:4000](http://localhost:4000)

<h2 id="contribuir">📫 Contribuir</h2>

Contribuições são muito bem vindas! Caso queira contribuir, faça um fork do repositório e crie um pull request.

1. `git clone https://github.com/gabrieudev/creatorhub.git`
2. `git checkout -b feature/NOME`
3. Siga os padrões de commits.
4. Abra um Pull Request explicando o problema resolvido ou a funcionalidade desenvolvida. Se houver, anexe screenshots das modificações visuais e aguarde a revisão!
