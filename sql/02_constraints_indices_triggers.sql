-- Índices para otimização de consultas
CREATE INDEX idx_jogo_nome ON jogo(nome);
CREATE INDEX idx_jogo_genero ON jogo(genero);
CREATE INDEX idx_jogo_desenvolvedora ON jogo(id_desenvolvedora);
CREATE INDEX idx_desenvolvedora_nome ON desenvolvedora(nome);
CREATE INDEX idx_compra_usuario ON compra(id_usuario);
CREATE INDEX idx_compra_jogo ON compra(id_jogo);
CREATE INDEX idx_compra_data ON compra(data_compra);
CREATE INDEX idx_avaliacao_jogo ON avaliacao(id_jogo);
CREATE INDEX idx_avaliacao_nota ON avaliacao(nota);
CREATE INDEX idx_gerencia_admin ON gerencia(id_admin);
CREATE INDEX idx_gerencia_jogo ON gerencia(id_jogo);

-- Trigger para impedir sobreposição de períodos de gestão
CREATE OR REPLACE FUNCTION check_gerencia_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se há sobreposição com outros períodos do mesmo admin/jogo
    IF EXISTS (
        SELECT 1 FROM gerencia g
        WHERE g.id_admin = NEW.id_admin 
        AND g.id_jogo = NEW.id_jogo
        AND g.data_inicio != NEW.data_inicio
        AND (
            -- Novo período inicia durante período existente
            (NEW.data_inicio BETWEEN g.data_inicio AND COALESCE(g.data_fim, '9999-12-31'))
            OR
            -- Novo período termina durante período existente
            (COALESCE(NEW.data_fim, '9999-12-31') BETWEEN g.data_inicio AND COALESCE(g.data_fim, '9999-12-31'))
            OR
            -- Novo período engloba período existente
            (NEW.data_inicio <= g.data_inicio AND COALESCE(NEW.data_fim, '9999-12-31') >= COALESCE(g.data_fim, '9999-12-31'))
        )
    ) THEN
        RAISE EXCEPTION 'Período de gestão sobrepõe com período existente para o mesmo administrador e jogo';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_gerencia_overlap
    BEFORE INSERT OR UPDATE ON gerencia
    FOR EACH ROW
    EXECUTE FUNCTION check_gerencia_overlap();

-- Trigger para validar que compra só pode ser feita após lançamento do jogo
CREATE OR REPLACE FUNCTION check_compra_data_lancamento()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM jogo j
        WHERE j.id = NEW.id_jogo
        AND j.data_lancamento > DATE(NEW.data_compra)
    ) THEN
        RAISE EXCEPTION 'Não é possível comprar jogo antes da data de lançamento';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_compra_data_lancamento
    BEFORE INSERT OR UPDATE ON compra
    FOR EACH ROW
    EXECUTE FUNCTION check_compra_data_lancamento();

-- Trigger para validar que avaliação só pode ser feita após compra
CREATE OR REPLACE FUNCTION check_avaliacao_compra()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM compra c
        WHERE c.id_usuario = NEW.id_usuario
        AND c.id_jogo = NEW.id_jogo
        AND DATE(c.data_compra) <= NEW.data_publicacao
    ) THEN
        RAISE EXCEPTION 'Usuário deve comprar o jogo antes de avaliá-lo';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_avaliacao_compra
    BEFORE INSERT OR UPDATE ON avaliacao
    FOR EACH ROW
    EXECUTE FUNCTION check_avaliacao_compra();