-- Schema principal do banco de dados
-- Mapeamento ERE → Relacional

-- Tabela pessoa (supertipo)
CREATE TABLE pessoa (
    cpf VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(15),
    data_nascimento DATE,
    rede_social VARCHAR(100),
    senha_hash VARCHAR(255) NOT NULL,
    CONSTRAINT check_cpf_format CHECK (cpf ~ '^[0-9]{11}$'),
    CONSTRAINT check_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabela usuario (especialização)
CREATE TABLE usuario (
    cpf VARCHAR(11) PRIMARY KEY REFERENCES pessoa(cpf) ON DELETE CASCADE
);

-- Tabela administrador (especialização)
CREATE TABLE administrador (
    cpf VARCHAR(11) PRIMARY KEY REFERENCES pessoa(cpf) ON DELETE CASCADE,
    permissoes TEXT[] DEFAULT ARRAY['gerenciar_jogos', 'gerenciar_usuarios']
);

-- Tabela desenvolvedora
CREATE TABLE desenvolvedora (
    cnpj VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(50),
    CONSTRAINT check_cnpj_format CHECK (cnpj ~ '^[0-9]{14}$')
);

-- Tabela jogo
CREATE TABLE jogo (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    descricao TEXT,
    data_lancamento DATE NOT NULL,
    valor NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
    id_desenvolvedora VARCHAR(14) NOT NULL REFERENCES desenvolvedora(cnpj)
);

-- Tabela cartao_bancario (entidade fraca)
CREATE TABLE cartao_bancario (
    id_usuario VARCHAR(11) REFERENCES usuario(cpf) ON DELETE CASCADE,
    numero VARCHAR(16) NOT NULL,
    bandeira VARCHAR(20) NOT NULL,
    validade_mes INTEGER NOT NULL,
    validade_ano INTEGER NOT NULL,
    codigo_seguranca VARCHAR(4) NOT NULL,
    PRIMARY KEY (id_usuario, numero),
    CONSTRAINT check_numero_cartao CHECK (numero ~ '^[0-9]{16}$'),
    CONSTRAINT check_bandeira CHECK (bandeira IN ('VISA', 'MASTERCARD', 'ELO', 'AMERICAN_EXPRESS')),
    CONSTRAINT check_validade_mes CHECK (validade_mes BETWEEN 1 AND 12),
    CONSTRAINT check_validade_ano CHECK (validade_ano >= EXTRACT(YEAR FROM CURRENT_DATE)),
    CONSTRAINT check_codigo_seguranca CHECK (codigo_seguranca ~ '^[0-9]{3,4}$')
);

-- Tabela compra (relação N:N entre usuario e jogo)
CREATE TABLE compra (
    id_usuario VARCHAR(11) REFERENCES usuario(cpf),
    id_jogo INTEGER REFERENCES jogo(id),
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_pago NUMERIC(10,2) NOT NULL CHECK (valor_pago >= 0),
    PRIMARY KEY (id_usuario, id_jogo, data_compra),
    CONSTRAINT check_data_compra CHECK (data_compra <= CURRENT_TIMESTAMP)
);

-- Tabela avaliacao
CREATE TABLE avaliacao (
    id_usuario VARCHAR(11) REFERENCES usuario(cpf),
    id_jogo INTEGER REFERENCES jogo(id),
    nota INTEGER NOT NULL,
    texto TEXT,
    data_publicacao DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_usuario, id_jogo),
    CONSTRAINT check_nota CHECK (nota BETWEEN 0 AND 10)
);

-- Tabela gerencia (administrador gerencia jogo)
CREATE TABLE gerencia (
    id_admin VARCHAR(11) REFERENCES administrador(cpf),
    id_jogo INTEGER REFERENCES jogo(id),
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    data_fim DATE,
    PRIMARY KEY (id_admin, id_jogo, data_inicio),
    CONSTRAINT check_data_fim CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);

-- Tabela curiosidade_jogo (opcional)
CREATE TABLE curiosidade_jogo (
    id SERIAL PRIMARY KEY,
    id_jogo INTEGER NOT NULL REFERENCES jogo(id) ON DELETE CASCADE,
    texto TEXT NOT NULL
);