# GameStore - Sistema Completo de Loja de Jogos

Sistema completo de loja de jogos desenvolvido com **PostgreSQL**, **Node.js/TypeScript** e **Next.js**, implementando o modelo ERE corrigido do TP1.



## 🏗️ Arquitetura

  - **Backend**: Node.js + TypeScript + Express + Prisma ORM
  - **Frontend**: Next.js + TypeScript + Tailwind CSS
  - **Banco de Dados**: PostgreSQL 15+
  - **Containerização**: Docker + Docker Compose



## 📋 Pré-requisitos

  - Docker e Docker Compose instalados
  - Git (para clonar o repositório)



## 🚀 Como Executar

### 1\. Clone o repositório

```bash
git clone <url-do-repositorio>
cd BD\ trabalho\ final
```

### 2\. Inicie os serviços

```bash
docker-compose up -d
```

Este comando irá:

  - Criar e inicializar o banco PostgreSQL
  - Executar automaticamente os scripts SQL na ordem correta
  - Construir e iniciar a API
  - Construir e iniciar o frontend

### 3\. Aguarde a inicialização

  - O banco de dados será inicializado com todos os dados de teste
  - A API estará disponível em: `http://localhost:3001`
  - O frontend estará disponível em: `http://localhost:3000`

### 4\. Acesse a aplicação

Abra seu navegador e acesse: `http://localhost:3000`



## 👥 Usuários de Teste

### Usuários Comuns

  - **Email**: `ana.silva@email.com` | **Senha**: `senha123`
  - **Email**: `bruno.santos@email.com` | **Senha**: `senha123`
  - **Email**: `carla.oliveira@email.com` | **Senha**: `senha123`

### Administradores

  - **Email**: `admin.master@gamestore.com` | **Senha**: `admin123` (todas as permissões)
  - **Email**: `admin.jogos@gamestore.com` | **Senha**: `admin123` (gerenciar jogos)
  - **Email**: `admin.users@gamestore.com` | **Senha**: `admin123` (gerenciar usuários)



## 🗄️ Estrutura do Banco de Dados

### Modelo ERE → Relacional Implementado

1.  **pessoa** (supertipo)

      - PK: `cpf` (VARCHAR(11))
      - Atributos: `nome`, `email`, `telefone`, `data_nascimento`, `rede_social`, `senha_hash`

2.  **usuario** (especialização)

      - PK/FK: `cpf` → `pessoa.cpf`

3.  **administrador** (especialização)

      - PK/FK: `cpf` → `pessoa.cpf`
      - Atributo: `permissoes` (TEXT[])

4.  **desenvolvedora**

      - PK: `cnpj` (VARCHAR(14))
      - Atributos: `nome`, `nacionalidade`

5.  **jogo**

      - PK: `id` (SERIAL)
      - FK: `id_desenvolvedora` → `desenvolvedora.cnpj`
      - Atributos: `nome`, `genero`, `descricao`, `data_lancamento`, `valor`

6.  **cartao\_bancario** (entidade fraca)

      - PK composta: (`id_usuario`, `numero`)
      - FK: `id_usuario` → `usuario.cpf`
      - Atributos: `bandeira`, `validade_mes`, `validade_ano`, `codigo_seguranca`

7.  **compra** (relação N:N)

      - PK: (`id_usuario`, `id_jogo`, `data_compra`)
      - FKs: `id_usuario` → `usuario.cpf`, `id_jogo` → `jogo.id`
      - Atributo: `valor_pago`

8.  **avaliacao**

      - PK: (`id_usuario`, `id_jogo`)
      - FKs: `id_usuario` → `usuario.cpf`, `id_jogo` → `jogo.id`
      - Atributos: `nota` (0-10), `texto`, `data_publicacao`

9.  **gerencia**

      - PK: (`id_admin`, `id_jogo`, `data_inicio`)
      - FKs: `id_admin` → `administrador.cpf`, `id_jogo` → `jogo.id`
      - Atributos: `data_fim`

10. **curiosidade\_jogo**

      - PK: `id` (SERIAL)
      - FK: `id_jogo` → `jogo.id`
      - Atributo: `texto`



## 🔧 Funcionalidades Implementadas

### Frontend (Next.js)

  - ✅ Lista de jogos com filtro por gênero
  - ✅ Detalhes do jogo com avaliações
  - ✅ Sistema de login/logout
  - ✅ Compra de jogos (usuários)
  - ✅ Sistema de avaliações (usuários)
  - ✅ Histórico de compras
  - ✅ Painel administrativo básico
  - ✅ Design responsivo com Tailwind CSS

### Backend (Node.js + Express)

  - ✅ API REST com TypeScript
  - ✅ Autenticação JWT
  - ✅ Validação com Zod
  - ✅ Middleware de autorização
  - ✅ Integração com PostgreSQL via Prisma
  - ✅ Tratamento de erros
  - ✅ CORS configurado

### Banco de Dados (PostgreSQL)

  - ✅ Schema completo com constraints
  - ✅ Índices para performance
  - ✅ Triggers para validações
  - ✅ Views para cálculos
  - ✅ Dados de teste realistas
  - ✅ Consultas de Álgebra Relacional



## 📈 Dados de Teste

O sistema inclui:

  - 8 desenvolvedoras
  - 20 jogos variados
  - 12 usuários + 3 administradores
  - 40 compras distribuídas no tempo
  - 60 avaliações cobrindo toda a faixa de notas
  - 15 vínculos de gestão sem sobreposição
  - Cartões bancários e curiosidades dos jogos



## 🔍 Consultas SQL Demonstrativas

O arquivo `sql/05_queries_algebra.sql` contém 15 consultas demonstrando:

  - Seleção ($\\sigma$)
  - Projeção ($\\pi$)
  - Junções ($\\bowtie$, $\\ljoin$)
  - Agregação (GROUP BY/HAVING)
  - Operações de conjunto ($\\cup$, $\\cap$, $-$)
  - Subconsultas (EXISTS, NOT EXISTS)
  - Divisão relacional
  - Funções de janela (RANK)



## 🔠 Endpoints da API

### Autenticação

  - `POST /api/auth/login` - Login de usuário

### Jogos

  - `GET /api/jogos` - Listar todos os jogos
  - `GET /api/jogos/:id` - Detalhes de um jogo
  - `POST /api/jogos` - Criar jogo (admin)
  - `PUT /api/jogos/:id` - Atualizar jogo (admin)
  - `DELETE /api/jogos/:id` - Excluir jogo (admin)

### Avaliações

  - `GET /api/jogos/:id/avaliacoes` - Avaliações de um jogo
  - `POST /api/jogos/:id/avaliacoes` - Criar avaliação (usuário)

### Usuários

  - `POST /api/usuarios/:id/compras` - Realizar compra
  - `GET /api/usuarios/:id/compras` - Histórico de compras
  - `POST /api/usuarios/:id/cartoes` - Cadastrar cartão
  - `GET /api/usuarios/:id/cartoes` - Listar cartões

### Health Check

  - `GET /api/health` - Status da API



## 🧪 Testando a API

### Exemplo com curl:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana.silva@email.com","senha":"senha123"}'

# Listar jogos
curl http://localhost:3001/api/jogos

# Comprar jogo (com token)
curl -X POST http://localhost:3001/api/usuarios/12345678901/compras \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"id_jogo":1,"valor_pago":0.00}'
```



## 🔒 Validações e Constraints

### Triggers Implementados

1.  **check\_gerencia\_overlap**: Impede sobreposição de períodos de gestão
2.  **check\_compra\_data\_lancamento**: Impede compra antes do lançamento
3.  **check\_avaliacao\_compra**: Exige compra antes da avaliação

### Constraints de Domínio

  - **CPF**: formato 11 dígitos
  - **CNPJ**: formato 14 dígitos
  - **Email**: formato válido
  - **Nota**: entre 0 e 10
  - **Valor**: não negativo
  - **Cartão**: validações de formato e validade



## 📁 Estrutura do Projeto

```
├── docker-compose.yml             # Orquestração dos serviços
├── sql/                           # Scripts SQL
│   ├── 01_schema.sql              # Criação das tabelas
│   ├── 02_constraints_indices_triggers.sql
│   ├── 03_views.sql               # Views calculadas
│   ├── 04_seed.sql                # Dados de teste
│   └── 05_queries_algebra.sql     # Consultas demonstrativas
├── api/                           # Backend Node.js
│   ├── src/
│   │   ├── controllers/           # Controladores REST
│   │   ├── services/              # Lógica de negócio
│   │   ├── repositories/          # Acesso a dados
│   │   ├── middlewares/           # Middlewares
│   │   ├── routes/                # Definição de rotas
│   │   └── types/                 # Tipos TypeScript
│   ├── prisma/schema.prisma       # Schema Prisma
│   └── package.json
└── web/                           # Frontend Next.js
    ├── src/
    │   ├── app/                   # Páginas (App Router)
    │   ├── components/            # Componentes React
    │   ├── hooks/                 # Hooks customizados
    │   ├── lib/                   # Utilitários
    │   └── types/                 # Tipos TypeScript
    └── package.json
```



## 🐛 Troubleshooting

### Problemas Comuns

1.  **Erro de conexão com banco**

    ```bash
    docker-compose down
    docker-compose up -d db
    # Aguarde alguns segundos
    docker-compose up -d
    ```

2.  **API não responde**

    ```bash
    docker-compose logs api
    ```

3.  **Frontend não carrega**

    ```bash
    docker-compose logs web
    ```

4.  **Resetar banco de dados**

    ```bash
    docker-compose down -v
    docker-compose up -d
    ```

### Logs dos Serviços

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f db
docker-compose logs -f api
docker-compose logs -f web
```



## 📈 Melhorias Futuras

  - Sistema de upload de imagens para jogos
  - Carrinho de compras
  - Sistema de wishlist
  - Relatórios administrativos avançados
  - Sistema de cupons de desconto
  - Integração com gateway de pagamento
  - Sistema de notificações
  - Cache com Redis
  - Testes automatizados



## 📝 Notas de Implementação

### Decisões Técnicas

  - **Prisma ORM**: Escolhido pela type-safety e facilidade de uso
  - **JWT**: Para autenticação stateless
  - **Tailwind CSS**: Para estilização rápida e consistente
  - **Zod**: Para validação de dados tanto no frontend quanto no backend
  - **Docker**: Para facilitar o *deployment* e desenvolvimento

### Conformidade com Requisitos

  - ✅ Modelo ERE corrigido implementado
  - ✅ Mapeamento relacional completo
  - ✅ Constraints e triggers funcionais
  - ✅ API REST segura
  - ✅ Frontend moderno e funcional
  - ✅ Docker Compose com 3 serviços
  - ✅ Dados de teste realistas
  - ✅ Consultas de Álgebra Relacional
  - ✅ README com instruções completas



## 🤝 Contribuição

Este projeto foi desenvolvido como trabalho acadêmico seguindo as especificações do TP1 corrigido.



**Desenvolvido com ❤️ para a disciplina de Banco de Dados**
