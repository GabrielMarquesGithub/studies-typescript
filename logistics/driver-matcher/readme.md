# Base 

Boilerplate base para um projeto fastify.

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Configuração e Execução](#configuração-e-execução)
  - [Teste](#teste)
  - [Comandos Úteis](#comandos-úteis)

## Tecnologias Utilizadas
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Fastify](https://www.fastify.io/)
- **Validação:** [Zod](https://zod.dev/)
- **Testes:** [Vitest](https://vitest.dev/)
- **Documentação da API:** OpenAPI (Swagger) gerado automaticamente a partir dos schemas Zod.


## Começando

Siga estas instruções para obter uma cópia do projeto em execução na sua máquina local para desenvolvimento e teste.

### Pré-requisitos

- Node.js
- npm 

### Configuração e Execução

1.  **Clone o repositório:**
    ````bash
    git clone https://github.com/GabrielMarquesGithub/base
    cd base
    ````

2.  **Instale as dependências**: 
    ````bash
    npm install
    ````

3.  **Configure as variáveis de ambiente:**
    Copie o arquivo de exemplo para criar o arquivo `.env` local.
    ````bash
    cp .env.example .env
    ````
    Agora, preencha as variáveis no arquivo `.env`.
    
    > **⚠️ Atenção à obrigatoriedade**
    >
    > **TODAS** as variáveis são necessárias para a execução da aplicação.

4.  **Execute a aplicação:**
    
    **Modo desenvolvimento:**
    Inicia a aplicação com hot reload e logs detalhados.
    ````bash
    npm run dev
    ````
    
    **Modo produção:**
    Compila o TypeScript e inicia a aplicação otimizada.
    ````bash
    npm run build
    npm run start
    ````

### Testes

-  **Executar testes:**
    Roda a suíte de testes completa
    ````bash
    npm run test
    ````

-  **Executar testes no modo watch:**
    Mantém a execução ativa observando alterações nos arquivos para feedback instantâneo.
    ````bash
    npm run test:watch
    ````

### Comandos Úteis

-   **Gerar documentação OpenAPI:**
    Cria o arquivo `docs/base-api.json` compatível com a especificação OpenAPI.
    ````bash
    npm run build:docs
    ````

-   **Verificar código:**
    Analisa o projeto em busca de erros de sintaxe e padrões de código.
    ````bash
    npm run lint:check
    ````

-   **Corrigir código automaticamente:**
    Tenta corrigir automaticamente problemas de formatação e estilo encontrados.
    ````bash
    npm run lint:fix
    ````



