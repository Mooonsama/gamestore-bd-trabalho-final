-- Consultas demonstrando Álgebra Relacional

-- 1. SELEÇÃO (σ) - Jogos do gênero RPG lançados após 2015
-- σ(genero='RPG' AND data_lancamento > '2015-01-01')(jogo)
SELECT id, nome, genero, data_lancamento, valor
FROM jogo 
WHERE genero = 'RPG' AND data_lancamento > '2015-01-01';

-- 2. PROJEÇÃO (π) - Nome, gênero e média de avaliação dos jogos
-- π(nome, genero, media_avaliacao)(jogo_com_media)
SELECT nome, genero, media_avaliacao
FROM jogo_com_media;

-- 3. JUNÇÃO NATURAL (⋈) - Usuários com suas compras e jogos
-- usuario ⋈ compra ⋈ jogo
SELECT p.nome as usuario, j.nome as jogo, c.data_compra, c.valor_pago
FROM usuario u
NATURAL JOIN pessoa p
NATURAL JOIN compra c
NATURAL JOIN jogo j
ORDER BY p.nome, c.data_compra;

-- 4. JUNÇÃO EXTERNA ESQUERDA - Jogos sem avaliação
-- jogo ⟕ avaliacao
SELECT j.nome, j.genero, COUNT(a.id_jogo) as total_avaliacoes
FROM jogo j
LEFT OUTER JOIN avaliacao a ON j.id = a.id_jogo
GROUP BY j.id, j.nome, j.genero
HAVING COUNT(a.id_jogo) = 0;

-- 5. AGREGAÇÃO com GROUP BY/HAVING - Média por gênero >= 8
-- γ(genero; AVG(media_avaliacao))(jogo_com_media) σ(AVG(media_avaliacao) >= 8)
SELECT genero, ROUND(AVG(media_avaliacao), 2) as media_genero
FROM jogo_com_media
GROUP BY genero
HAVING AVG(media_avaliacao) >= 8
ORDER BY media_genero DESC;

-- 6. UNIÃO (∪) - Títulos de jogos RPG unidos com jogos de Ação
-- π(nome)(σ(genero='RPG')(jogo)) ∪ π(nome)(σ(genero='Ação')(jogo))
SELECT nome FROM jogo WHERE genero = 'RPG'
UNION
SELECT nome FROM jogo WHERE genero = 'Ação'
ORDER BY nome;

-- 7. INTERSEÇÃO (∩) - Jogos comprados E avaliados por usuário específico
-- π(id_jogo)(σ(id_usuario='12345678901')(compra)) ∩ π(id_jogo)(σ(id_usuario='12345678901')(avaliacao))
SELECT j.nome
FROM jogo j
WHERE j.id IN (
    SELECT c.id_jogo FROM compra c WHERE c.id_usuario = '12345678901'
    INTERSECT
    SELECT a.id_jogo FROM avaliacao a WHERE a.id_usuario = '12345678901'
);

-- 8. DIFERENÇA (−) - Jogos comprados por Ana exceto os avaliados por Ana
-- π(id_jogo)(σ(id_usuario='12345678901')(compra)) − π(id_jogo)(σ(id_usuario='12345678901')(avaliacao))
SELECT j.nome
FROM jogo j
WHERE j.id IN (
    SELECT c.id_jogo FROM compra c WHERE c.id_usuario = '12345678901'
    EXCEPT
    SELECT a.id_jogo FROM avaliacao a WHERE a.id_usuario = '12345678901'
);

-- 9. SUBCONSULTA com EXISTS - Jogos com pelo menos 5 avaliações >= 9
-- σ(EXISTS(σ(nota >= 9 AND COUNT(*) >= 5)(avaliacao)))(jogo)
SELECT j.nome, j.genero
FROM jogo j
WHERE EXISTS (
    SELECT 1
    FROM avaliacao a
    WHERE a.id_jogo = j.id
    AND a.nota >= 9
    GROUP BY a.id_jogo
    HAVING COUNT(*) >= 2  -- Ajustado para 2 pois temos poucos dados
);

-- 10. DIVISÃO RELACIONAL - Usuários que compraram TODOS os jogos de uma desenvolvedora específica
-- Usuários que compraram todos os jogos da CD Projekt (CNPJ: 34567890000177)
-- π(id_usuario)(compra) ÷ π(id)(σ(id_desenvolvedora='34567890000177')(jogo))
SELECT DISTINCT p.nome
FROM pessoa p
JOIN usuario u ON p.cpf = u.cpf
WHERE NOT EXISTS (
    SELECT j.id
    FROM jogo j
    WHERE j.id_desenvolvedora = '34567890000177'
    AND NOT EXISTS (
        SELECT 1
        FROM compra c
        WHERE c.id_usuario = u.cpf
        AND c.id_jogo = j.id
    )
);

-- 11. FUNÇÃO DE JANELA - Ranking de jogos por gênero baseado na média de avaliação
-- RANK() OVER (PARTITION BY genero ORDER BY media_avaliacao DESC)
SELECT 
    nome,
    genero,
    media_avaliacao,
    RANK() OVER (PARTITION BY genero ORDER BY media_avaliacao DESC) as ranking_no_genero
FROM jogo_com_media
WHERE media_avaliacao > 0
ORDER BY genero, ranking_no_genero;

-- 12. CONSULTA COMPLEXA - Top 5 usuários que mais gastaram com jogos bem avaliados (nota >= 8)
SELECT 
    p.nome,
    COUNT(DISTINCT c.id_jogo) as jogos_comprados,
    SUM(c.valor_pago) as total_gasto,
    ROUND(AVG(a.nota), 2) as media_notas_dadas
FROM pessoa p
JOIN usuario u ON p.cpf = u.cpf
JOIN compra c ON u.cpf = c.id_usuario
JOIN avaliacao a ON u.cpf = a.id_usuario AND c.id_jogo = a.id_jogo
WHERE a.nota >= 8
GROUP BY p.cpf, p.nome
ORDER BY total_gasto DESC
LIMIT 5;

-- 13. CONSULTA com CASE - Classificação de jogos por faixa de preço
SELECT 
    nome,
    valor,
    CASE 
        WHEN valor = 0 THEN 'Gratuito'
        WHEN valor <= 50 THEN 'Barato'
        WHEN valor <= 150 THEN 'Médio'
        WHEN valor <= 250 THEN 'Caro'
        ELSE 'Premium'
    END as faixa_preco,
    media_avaliacao
FROM jogo_com_media
ORDER BY valor;

-- 14. CONSULTA TEMPORAL - Evolução das compras por mês
SELECT 
    EXTRACT(YEAR FROM data_compra) as ano,
    EXTRACT(MONTH FROM data_compra) as mes,
    COUNT(*) as total_compras,
    SUM(valor_pago) as receita_mensal
FROM compra
GROUP BY EXTRACT(YEAR FROM data_compra), EXTRACT(MONTH FROM data_compra)
ORDER BY ano, mes;

-- 15. CONSULTA com SUBCONSULTA CORRELACIONADA - Jogos com avaliação acima da média do gênero
SELECT j.nome, j.genero, jm.media_avaliacao
FROM jogo j
JOIN jogo_com_media jm ON j.id = jm.id
WHERE jm.media_avaliacao > (
    SELECT AVG(jm2.media_avaliacao)
    FROM jogo_com_media jm2
    WHERE jm2.genero = j.genero
    AND jm2.media_avaliacao > 0
)
ORDER BY j.genero, jm.media_avaliacao DESC;