# Consultas SQL - Álgebra Relacional

Este arquivo contém exemplos de consultas que demonstram os operadores da Álgebra Relacional implementados no banco GameStore.

## 1. Seleção (σ) - Jogos por Gênero

```sql
-- σ(genero='RPG')(jogo)
SELECT * FROM jogo WHERE genero = 'RPG';
```

## 2. Projeção (π) - Nome e Gênero dos Jogos

```sql
-- π(nome, genero)(jogo)
SELECT nome, genero FROM jogo;
```

## 3. Junção (⋈) - Usuários e suas Compras

```sql
-- usuario ⋈ compra ⋈ jogo
SELECT u.nome, j.nome as jogo, c.data_compra, c.valor_pago
FROM usuario u
JOIN pessoa p ON u.cpf = p.cpf
JOIN compra c ON u.cpf = c.id_usuario
JOIN jogo j ON c.id_jogo = j.id;
```

## 4. Junção Externa (⟕) - Jogos sem Avaliação

```sql
-- jogo ⟕ avaliacao
SELECT j.nome, COUNT(a.id_jogo) as total_avaliacoes
FROM jogo j
LEFT JOIN avaliacao a ON j.id = a.id_jogo
GROUP BY j.id, j.nome
HAVING COUNT(a.id_jogo) = 0;
```

## 5. Agregação - Média por Gênero ≥ 8

```sql
SELECT genero, AVG(media_avaliacao) as media_genero
FROM view_jogos_com_media
GROUP BY genero
HAVING AVG(media_avaliacao) >= 8.0;
```

## 6. União (∪) - Jogos RPG ∪ Ação

```sql
-- σ(genero='RPG')(jogo) ∪ σ(genero='Ação')(jogo)
SELECT nome FROM jogo WHERE genero = 'RPG'
UNION
SELECT nome FROM jogo WHERE genero = 'Ação';
```

## 7. Interseção (∩) - Jogos Comprados ∩ Avaliados por Usuário

```sql
-- Jogos comprados por Ana ∩ Jogos avaliados por Ana
SELECT j.nome
FROM jogo j
WHERE j.id IN (
    SELECT c.id_jogo FROM compra c 
    JOIN pessoa p ON c.id_usuario = p.cpf 
    WHERE p.email = 'ana.silva@email.com'
)
AND j.id IN (
    SELECT a.id_jogo FROM avaliacao a 
    JOIN pessoa p ON a.id_usuario = p.cpf 
    WHERE p.email = 'ana.silva@email.com'
);
```

## 8. Diferença (-) - Comprados por Ana EXCETO Avaliados por Ana

```sql
SELECT j.nome
FROM jogo j
WHERE j.id IN (
    SELECT c.id_jogo FROM compra c 
    JOIN pessoa p ON c.id_usuario = p.cpf 
    WHERE p.email = 'ana.silva@email.com'
)
AND j.id NOT IN (
    SELECT a.id_jogo FROM avaliacao a 
    JOIN pessoa p ON a.id_usuario = p.cpf 
    WHERE p.email = 'ana.silva@email.com'
);
```

## 9. Subconsulta EXISTS - Jogos com pelo menos 5 avaliações ≥ 9

```sql
SELECT j.nome
FROM jogo j
WHERE EXISTS (
    SELECT 1
    FROM avaliacao a
    WHERE a.id_jogo = j.id
    AND a.nota >= 9
    GROUP BY a.id_jogo
    HAVING COUNT(*) >= 5
);
```

## 10. Divisão Relacional - Usuários que compraram TODOS os jogos de uma desenvolvedora

```sql
-- Usuários que compraram todos os jogos da CD Projekt
SELECT DISTINCT p.nome
FROM pessoa p
JOIN usuario u ON p.cpf = u.cpf
WHERE NOT EXISTS (
    SELECT j.id
    FROM jogo j
    JOIN desenvolvedora d ON j.id_desenvolvedora = d.cnpj
    WHERE d.nome = 'CD Projekt'
    AND NOT EXISTS (
        SELECT 1
        FROM compra c
        WHERE c.id_usuario = u.cpf
        AND c.id_jogo = j.id
    )
);
```

## 11. Função de Janela - Ranking por Gênero

```sql
SELECT 
    nome,
    genero,
    media_avaliacao,
    RANK() OVER (PARTITION BY genero ORDER BY media_avaliacao DESC) as ranking_genero
FROM view_jogos_com_media
WHERE media_avaliacao IS NOT NULL;
```

## 12. Consulta Complexa - Top 3 Jogos Mais Comprados por Gênero

```sql
WITH jogos_vendas AS (
    SELECT 
        j.id,
        j.nome,
        j.genero,
        COUNT(c.id_jogo) as total_vendas,
        ROW_NUMBER() OVER (PARTITION BY j.genero ORDER BY COUNT(c.id_jogo) DESC) as rn
    FROM jogo j
    LEFT JOIN compra c ON j.id = c.id_jogo
    GROUP BY j.id, j.nome, j.genero
)
SELECT nome, genero, total_vendas
FROM jogos_vendas
WHERE rn <= 3
ORDER BY genero, rn;
```

## 13. Análise Temporal - Evolução das Compras por Mês

```sql
SELECT 
    DATE_TRUNC('month', data_compra) as mes,
    COUNT(*) as total_compras,
    SUM(valor_pago) as receita_total
FROM compra
GROUP BY DATE_TRUNC('month', data_compra)
ORDER BY mes;
```

## 14. Usuários Mais Ativos (Compras + Avaliações)

```sql
SELECT 
    p.nome,
    COUNT(DISTINCT c.id_jogo) as jogos_comprados,
    COUNT(DISTINCT a.id_jogo) as jogos_avaliados,
    COUNT(DISTINCT c.id_jogo) + COUNT(DISTINCT a.id_jogo) as atividade_total
FROM pessoa p
JOIN usuario u ON p.cpf = u.cpf
LEFT JOIN compra c ON u.cpf = c.id_usuario
LEFT JOIN avaliacao a ON u.cpf = a.id_usuario
GROUP BY p.cpf, p.nome
ORDER BY atividade_total DESC
LIMIT 10;
```

## 15. Desenvolvedoras com Melhor Avaliação Média

```sql
SELECT 
    d.nome as desenvolvedora,
    COUNT(j.id) as total_jogos,
    AVG(v.media_avaliacao) as media_desenvolvedora,
    COUNT(DISTINCT c.id_jogo) as total_vendas
FROM desenvolvedora d
JOIN jogo j ON d.cnpj = j.id_desenvolvedora
LEFT JOIN view_jogos_com_media v ON j.id = v.id
LEFT JOIN compra c ON j.id = c.id_jogo
GROUP BY d.cnpj, d.nome
HAVING COUNT(j.id) >= 2
ORDER BY media_desenvolvedora DESC NULLS LAST;
```

---

**Nota**: Todas essas consultas podem ser executadas diretamente no banco após a execução dos scripts de seed, e demonstram os principais operadores da Álgebra Relacional aplicados ao domínio da GameStore.