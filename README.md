# All Ong's - Plataforma de Solidariedade Conectada

O All Ong's é uma solução digital full-stack projetada para ser a ponte definitiva entre doadores, voluntários e Organizações Não Governamentais (ONGs). A plataforma simplifica e democratiza o processo de doação, centralizando causas sociais e permitindo que instituições publiquem e gerenciem suas campanhas de captação de recursos com total transparência e engajamento.

Este repositório contém a solução completa dividida em duas partes principais:
1. **`allongs-app`**: Aplicativo móvel moderno construído com React Native e Expo.
2. **`allongs-backend`**: API RESTful robusta desenvolvida em Deno (TypeScript) com Express e PostgreSQL.

---

## Tecnologias Utilizadas

A stack de desenvolvimento foi selecionada para garantir escalabilidade, performance e uma excelente experiência de uso no mobile:

| Camada | Tecnologia | Finalidade |
| :--- | :--- | :--- |
| **Mobile** | [React Native](https://reactnative.dev/) | Desenvolvimento de app nativo multiplataforma |
| **Mobile Framework** | [Expo](https://expo.dev/) | Suite de ferramentas e serviços de build rápidos |
| **Estilização Mobile** | [NativeWind (v4)](https://www.nativewind.dev/) | Utility-first styling utilizando conceitos de Tailwind CSS |
| **Navegação** | [React Navigation](https://reactnavigation.org/) | Gerenciamento dinâmico de telas e guias (tabs) |
| **Backend** | [Deno](https://deno.com/) & [Express](https://expressjs.com/) | Construção da API REST ágil e escalável com TypeScript nativo |
| **Banco de Dados** | [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional robusto para integridade dos dados |
| **Autenticação** | [JWT (JSON Web Token)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) | Sessões seguras e criptografia robusta de senhas |
| **Containerização** | [Docker Compose](https://www.docker.com/) | Orquestração local do banco de dados relacional |

---

## Principais Funcionalidades

### Jornada do Doador / Voluntário
*   **Feed Inicial Personalizado:** Visualização de campanhas urgentes e causas recomendadas.
*   **Busca e Exploração:** Busca de campanhas e ONGs por nome ou categorias (Meio Ambiente, Causa Animal, Social, Saúde, Educação).
*   **Detalhamento de Campanhas:** Telas completas que mostram a meta de arrecadação, porcentagem atingida, número de doadores e impacto previsto.
*   **Fluxo de Doação Simulado:** Escolha de método de pagamento (Pix / Cartão) com geração de comprovante e registro em tempo real.
*   **Histórico de Contribuições:** Timeline detalhada de doações passadas e comprovantes emitidos.

### Jornada da Instituição (ONG)
*   **Painel Administrativo:** Dashboard com indicadores de performance (total arrecadado, campanhas ativas, volume de doadores).
*   **Gestão de Campanhas:** Criação rápida de novas campanhas definindo metas financeiras, urgência, descrição, categoria e imagens descritivas.
*   **Histórico de Arrecadação:** Acompanhamento em tempo real de quem doou e o valor exato recebido em cada causa.
*   **Perfil Institucional:** Página editável para apresentar a história da ONG, redes sociais, data de fundação e impacto geral.

---

## Arquitetura de Pastas

```bash
allongs-mobile/
├── README.md               # Este arquivo de documentação
├── allongs-app/            # Aplicativo Móvel (React Native/Expo)
│   ├── src/
│   │   ├── components/     # Componentes visuais reutilizáveis
│   │   ├── contexts/       # Provedores de Estado Global (AuthContext, etc.)
│   │   ├── navigation/     # Configuração de rotas (Tabs, Stack de telas)
│   │   ├── screens/        # Telas separadas por perfis (auth, donor, ong)
│   │   ├── services/       # Conexão com APIs externas (Axios client)
│   │   └── theme/          # Variáveis globais de cores e fontes
│   └── tsconfig.json       # Configuração TypeScript do aplicativo
└── allongs-backend/        # API REST do Servidor
    ├── docker-compose.yml  # Orquestração do banco Postgres local
    ├── src/
    │   ├── database.ts     # Inicialização e schemas de tabelas SQL
    │   ├── seed.ts         # Script para popular dados fictícios iniciais
    │   ├── routes/         # Rotas divididas por módulos (auth, campaigns, etc.)
    │   └── server.ts       # Ponto de entrada Express
    └── .env                # Configurações de ambiente locais
```

---

## Como Executar o Projeto Localmente

Siga o passo a passo abaixo para rodar toda a aplicação localmente no seu ambiente de desenvolvimento.

> [!IMPORTANT]
> Certifique-se de ter instalado em sua máquina:
> * **Deno** (v2.0 ou superior)
> * **Docker Desktop**
> * Um celular com o app **Expo Go** instalado (ou emulador Android/iOS)

---

### 1. Inicializando o Backend & Banco de Dados

1. Navegue até o diretório do backend:
   ```bash
   cd allongs-backend
   ```

2. Crie ou verifique o arquivo `.env` na raiz do backend com a seguinte estrutura padrão:
   ```env
   PORT=3001
   JWT_SECRET=allongs_super_secret_key_change_in_production
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/allongs
   ```

3. Suba os containers do banco de dados e da API via Docker:
   ```bash
   docker-compose up -d
   ```

   A API rodará no endereço: `http://localhost:3001`

---

### 2. Inicializando o Aplicativo Mobile (allongs-app)

1. Em um novo terminal, navegue até a raiz do aplicativo:
   ```bash
   cd allongs-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o Expo de forma local:
   ```bash
   npx expo start --offline
   ```

4. No terminal, será gerado um QR Code:
   * **Android:** Abra o aplicativo **Expo Go** e escaneie o QR Code.
   * **iOS:** Abra a câmera do seu iPhone e aponte para o QR Code (certifique-se de ter o app **Expo Go** instalado).
   * **Web:** Pressione a tecla `w` no terminal para testar diretamente na versão web do navegador.

---

## Credenciais de Acesso (Teste Rápido)

Após rodar o script de seed (com `deno task seed` ou executando a API no docker que pode rodar o seed), utilize as seguintes contas fictícias pré-configuradas para explorar os fluxos completos da plataforma:

### Perfil Doador / Voluntário
*   **E-mail:** `doador@allongs.com`
*   **Senha:** `doador123456`

### Perfil ONG (Instituto Raízes Verdes)
*   **E-mail:** `contato@raizesverdes.org.br`
*   **Senha:** `ong123456`

---

## Modelo de Dados (PostgreSQL)

O banco de dados relacional é estruturado em 4 tabelas fundamentais:

```mermaid
erDiagram
    USERS ||--o{ CAMPAIGNS : "cria"
    USERS ||--o{ DONATIONS : "realiza"
    USERS ||--o| VOLUNTEERS : "detalha perfil"
    CAMPAIGNS ||--o{ DONATIONS : "recebe"

    USERS {
        uuid id PK
        string name
        string email
        string password_hash
        string user_type "('doador', 'ong')"
        string avatar_url
        string org_name
        string org_description
        string org_since
        timestamp created_at
    }

    CAMPAIGNS {
        uuid id PK
        string title
        string description
        string category
        decimal goal_amount
        decimal raised_amount
        string image_url
        string icon
        uuid ong_id FK
        boolean is_urgent
        boolean is_public
        integer percentage_complete
        integer donor_count
        timestamp created_at
    }

    DONATIONS {
        uuid id PK
        decimal amount
        string payment_method
        uuid user_id FK
        uuid campaign_id FK
        string transaction_id
        string impact_text
        timestamp created_at
    }

    VOLUNTEERS {
        uuid id PK
        uuid user_id FK
        string_array skills
        string_array availability
        string bio
        timestamp created_at
    }
```

---

## Próximos Passos & Roadmap

- [ ] Implementar notificações push de campanhas urgentes.
- [ ] Integração com gateway de pagamentos real para doações reais em Pix e cartão de crédito.
- [ ] Upload de imagens direto para um serviço de storage S3 para fotos de campanhas criadas.
- [ ] Sistema de matching de habilidades para tarefas voluntárias presenciais e remotas.

---

Desenvolvido com carinho para transformar ideias em impacto social real.
