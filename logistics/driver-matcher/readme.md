<div align="center">

# 🚚 Driver Matcher

<p>
  Sistema de matching de motoristas para cargas logísticas, construído com <strong>Fastify</strong> e <strong>TypeScript</strong>.
</p>

<p>
  <img src="https://img.shields.io/badge/TypeScript-5.9-000000?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-5.6-000000?logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Prisma-7.0-000000?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-18.0-000000?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Vitest-4.0-000000?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Biome-2.3-000000?logo=biome&logoColor=white" alt="Biome" />
</p>

</div>

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Banco de Dados](#banco-de-dados)
  - [Docker](#docker)
  - [Prisma ORM](#prisma-orm)
  - [Migrations](#migrations)
- [Executando a Aplicação](#executando-a-aplicação)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Scripts Disponíveis](#scripts-disponíveis)

## Tecnologias Utilizadas

- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Fastify](https://www.fastify.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Conteinerização:** [Docker](https://www.docker.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Testes:** [Vitest](https://vitest.dev/)
- **Testes de Integração:** [Testcontainers](https://testcontainers.com/)
- **Validação:** [Zod](https://zod.dev/)
- **Linting:** [Biome](https://biomejs.dev/)
- **Documentação:** OpenAPI/Swagger

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 
- **npm** 
- **Docker** e **Docker Compose** 

## Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/GabrielMarquesGithub/driver-matcher.git
cd driver-matcher
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo para criar o arquivo `.env` local:

```bash
cp .env.example .env
```

> ⚠️ **TODAS** as variáveis são obrigatórias para a execução da aplicação.

## Banco de Dados

### Docker

O projeto utiliza Docker Compose para gerenciar o banco de dados PostgreSQL.

#### Iniciar os serviços

```bash
npm run services:up
```

Este comando inicia o container do PostgreSQL em background com:
- **Imagem**: `postgres:18.0-alpine3.22`
- **Healthcheck**: Verificação automática de disponibilidade
- **Volume persistente**: Dados mantidos entre reinicializações

#### Parar os serviços

```bash
# Parar sem remover os containers
npm run services:stop

# Parar e remover os containers (mantém os volumes)
npm run services:down
```

#### Verificar status dos containers

```bash
docker compose ps
```

### Prisma ORM

O projeto utiliza Prisma como ORM com suporte a multi-schema files.

#### Gerar o Prisma Client

Após clonar o projeto ou alterar os schemas, gere o client:

```bash
npm run db:client
```

O Prisma Client é gerado em `src/generated/prisma/`.

### Migrations

As migrations gerenciam o versionamento do schema do banco de dados.

#### Criar uma nova migration (desenvolvimento)

```bash
npm run migration:dev
```

Este comando:
1. Detecta alterações nos schemas Prisma
2. Gera uma nova migration SQL
3. Aplica a migration no banco de desenvolvimento
4. Regenera o Prisma Client

#### Aplicar migrations existentes (produção)

```bash
npm run migration:run
```

#### Resetar o banco de dados

```bash
npm run migration:reset
```

> ⚠️ Este comando apaga **TODOS** os dados e recria o banco do zero.

## Executando a Aplicação

### Modo Desenvolvimento

Inicia a aplicação com hot-reload, verificação de tipos em tempo real e banco de dados:

```bash
npm run dev
```

Este comando:
1. Inicia o container do PostgreSQL automaticamente
2. Executa a aplicação com `tsx watch`
3. Executa o TypeScript compiler para verificação de tipos
4. Para o container ao encerrar (Ctrl+C)

### Modo Produção

Compile o TypeScript e inicie a aplicação otimizada:

```bash
npm run build
npm run start
```

Gera o build na pasta `dist/`.

## Testes

O projeto utiliza Vitest com Testcontainers para testes de integração isolados.

### Executar testes

```bash
npm run test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Cobertura de código

A cobertura é gerada automaticamente na pasta `coverage/`.

## Documentação da API

### Swagger UI

Com a aplicação em execução, acesse:

```
http://localhost:3000/docs
```

### Gerar arquivo OpenAPI

Para gerar o arquivo de especificação OpenAPI:

```bash
npm run build:docs
```

O arquivo será criado em `docs/api.json`.

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento com hot-reload e banco de dados |
| `npm run build` | Compila o TypeScript para produção |
| `npm run start` | Inicia a aplicação em modo produção |
| `npm run test` | Executa a suíte de testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run services:up` | Inicia os containers Docker |
| `npm run services:stop` | Para os containers Docker |
| `npm run services:down` | Remove os containers Docker |
| `npm run migration:dev` | Cria e aplica uma nova migration |
| `npm run migration:run` | Aplica migrations pendentes |
| `npm run migration:reset` | Reseta o banco de dados |
| `npm run db:client` | Regenera o Prisma Client |
| `npm run build:docs` | Gera documentação OpenAPI |
| `npm run lint:check` | Verifica código com Biome |
| `npm run lint:fix` | Corrige código automaticamente |