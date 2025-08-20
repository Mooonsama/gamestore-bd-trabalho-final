-- Views para facilitar consultas e cálculos

-- View para média de avaliações por jogo
CREATE VIEW jogo_com_media AS
SELECT 
    j.id,
    j.nome,
    STRING_AGG(DISTINCT g.nome, ', ' ORDER BY g.nome) as genero,
    j.descricao,
    j.data_lancamento,
    j.valor,
    j.id_desenvolvedora,
    d.nome as nome_desenvolvedora,
    COALESCE(ROUND(AVG(a.nota::numeric), 2), 0) as media_avaliacao,
    COUNT(DISTINCT a.id_usuario) as total_avaliacoes
FROM jogo j
LEFT JOIN jogo_genero jg ON j.id = jg.id_jogo
LEFT JOIN genero g ON jg.id_genero = g.id
LEFT JOIN avaliacao a ON j.id = a.id_jogo
LEFT JOIN desenvolvedora d ON j.id_desenvolvedora = d.cnpj
GROUP BY j.id, j.nome, j.descricao, j.data_lancamento, j.valor, j.id_desenvolvedora, d.nome;

-- View para estatísticas de usuários
CREATE VIEW usuario_estatisticas AS
SELECT 
    u.cpf,
    p.nome,
    p.email,
    COUNT(DISTINCT c.id_jogo) as jogos_comprados,
    COUNT(DISTINCT a.id_jogo) as jogos_avaliados,
    COALESCE(SUM(c.valor_pago), 0) as total_gasto,
    COALESCE(AVG(a.nota), 0) as media_notas_dadas
FROM usuario u
JOIN pessoa p ON u.cpf = p.cpf
LEFT JOIN compra c ON u.cpf = c.id_usuario
LEFT JOIN avaliacao a ON u.cpf = a.id_usuario
GROUP BY u.cpf, p.nome, p.email;

-- View para jogos mais vendidos
CREATE VIEW jogos_mais_vendidos AS
SELECT 
    j.id,
    j.nome,
    STRING_AGG(DISTINCT g.nome, ', ' ORDER BY g.nome) as genero,
    j.valor,
    COUNT(c.id_jogo) as total_vendas,
    SUM(c.valor_pago) as receita_total
FROM jogo j
LEFT JOIN jogo_genero jg ON j.id = jg.id_jogo
LEFT JOIN genero g ON jg.id_genero = g.id
LEFT JOIN compra c ON j.id = c.id_jogo
GROUP BY j.id, j.nome, j.valor
ORDER BY total_vendas DESC, receita_total DESC;

-- View para desenvolvedoras com estatísticas
CREATE VIEW desenvolvedora_estatisticas AS
SELECT 
    d.cnpj,
    d.nome,
    d.nacionalidade,
    COUNT(j.id) as total_jogos,
    COALESCE(AVG(jm.media_avaliacao), 0) as media_geral_jogos,
    COALESCE(SUM(jmv.total_vendas), 0) as total_vendas_todos_jogos
FROM desenvolvedora d
LEFT JOIN jogo j ON d.cnpj = j.id_desenvolvedora
LEFT JOIN jogo_com_media jm ON j.id = jm.id
LEFT JOIN jogos_mais_vendidos jmv ON j.id = jmv.id
GROUP BY d.cnpj, d.nome, d.nacionalidade;