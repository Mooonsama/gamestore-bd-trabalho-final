-- Dados de teste para o sistema

-- Inserir gêneros
INSERT INTO genero (nome, caracteristica) VALUES
('Battle Royale', 'Jogos de sobrevivência onde jogadores competem até restar apenas um'),
('Ação/Aventura', 'Combina elementos de ação com exploração e narrativa'),
('RPG', 'Role-playing games com desenvolvimento de personagem e narrativa'),
('Ação', 'Jogos focados em combate e reflexos rápidos'),
('FPS', 'First-person shooters com visão em primeira pessoa'),
('FPS/VR', 'Jogos de tiro em primeira pessoa para realidade virtual'),
('Plataforma', 'Jogos baseados em pulos e navegação por plataformas'),
('Aventura', 'Focados em exploração e resolução de puzzles'),
('Corrida', 'Jogos de corrida e simulação automobilística'),
('FPS/Ação', 'Combinação de tiro em primeira pessoa com elementos de ação'),
('Sandbox', 'Jogos de mundo aberto com liberdade criativa'),
('Social/Dedução', 'Jogos sociais baseados em dedução e interação'),
('Party/Battle Royale', 'Jogos de festa com elementos competitivos'),
('Esportes/Corrida', 'Simulação esportiva com veículos');

-- Inserir desenvolvedoras
INSERT INTO desenvolvedora (cnpj, nome, nacionalidade) VALUES
('12345678000195', 'Epic Games', 'Estados Unidos'),
('23456789000186', 'Ubisoft', 'França'),
('34567890000177', 'CD Projekt', 'Polônia'),
('45678901000168', 'Rockstar Games', 'Estados Unidos'),
('56789012000159', 'Valve Corporation', 'Estados Unidos'),
('67890123000140', 'Nintendo', 'Japão'),
('78901234000131', 'Sony Interactive', 'Japão'),
('89012345000122', 'Microsoft Studios', 'Estados Unidos');

-- Inserir jogos
INSERT INTO jogo (nome, descricao, data_lancamento, valor, id_desenvolvedora) VALUES
('Fortnite', 'Jogo de batalha real gratuito', '2017-07-25', 0.00, '12345678000195'),
('Assassins Creed Valhalla', 'Aventura viking na Inglaterra medieval', '2020-11-10', 299.90, '23456789000186'),
('Cyberpunk 2077', 'RPG futurístico em Night City', '2020-12-10', 199.90, '34567890000177'),
('The Witcher 3', 'RPG de fantasia medieval', '2015-05-19', 149.90, '34567890000177'),
('Grand Theft Auto V', 'Jogo de mundo aberto em Los Santos', '2013-09-17', 89.90, '45678901000168'),
('Red Dead Redemption 2', 'Faroeste em mundo aberto', '2018-10-26', 249.90, '45678901000168'),
('Counter-Strike 2', 'Jogo de tiro tático competitivo', '2023-09-27', 0.00, '56789012000159'),
('Half-Life: Alyx', 'Jogo de realidade virtual', '2020-03-23', 199.90, '56789012000159'),
('Super Mario Odyssey', 'Aventura do Mario em 3D', '2017-10-27', 299.90, '67890123000140'),
('The Legend of Zelda: Breath of the Wild', 'Aventura em mundo aberto', '2017-03-03', 299.90, '67890123000140'),
('God of War', 'Aventura nórdica de Kratos', '2018-04-20', 199.90, '78901234000131'),
('Spider-Man', 'Aventura do Homem-Aranha em Nova York', '2018-09-07', 199.90, '78901234000131'),
('Halo Infinite', 'Jogo de tiro em primeira pessoa', '2021-12-08', 299.90, '89012345000122'),
('Forza Horizon 5', 'Jogo de corrida em mundo aberto', '2021-11-09', 249.90, '89012345000122'),
('Far Cry 6', 'Jogo de tiro em primeira pessoa', '2021-10-07', 199.90, '23456789000186'),
('Watch Dogs: Legion', 'Jogo de hackers em Londres', '2020-10-29', 179.90, '23456789000186'),
('Minecraft', 'Jogo de construção e sobrevivência', '2011-11-18', 89.90, '89012345000122'),
('Among Us', 'Jogo de dedução social', '2018-06-15', 19.90, '12345678000195'),
('Fall Guys', 'Jogo de festa e competição', '2020-08-04', 0.00, '12345678000195'),
('Rocket League', 'Futebol com carros', '2015-07-07', 0.00, '12345678000195');

-- Inserir associações jogo-gênero (N:N)
INSERT INTO jogo_genero (id_jogo, id_genero) VALUES
-- Fortnite: Battle Royale
(1, 1),
-- Assassins Creed Valhalla: Ação/Aventura
(2, 2),
-- Cyberpunk 2077: RPG + Ação
(3, 3), (3, 4),
-- The Witcher 3: RPG + Aventura
(4, 3), (4, 8),
-- Grand Theft Auto V: Ação
(5, 4),
-- Red Dead Redemption 2: Ação/Aventura
(6, 2),
-- Counter-Strike 2: FPS
(7, 5),
-- Half-Life: Alyx: FPS/VR + Aventura
(8, 6), (8, 8),
-- Super Mario Odyssey: Plataforma + Aventura
(9, 7), (9, 8),
-- Zelda BOTW: Aventura + RPG
(10, 8), (10, 3),
-- God of War: Ação/Aventura
(11, 2),
-- Spider-Man: Ação/Aventura
(12, 2),
-- Halo Infinite: FPS + Ação
(13, 5), (13, 4),
-- Forza Horizon 5: Corrida
(14, 9),
-- Far Cry 6: FPS/Ação
(15, 10),
-- Watch Dogs Legion: Ação/Aventura
(16, 2),
-- Minecraft: Sandbox + Aventura
(17, 11), (17, 8),
-- Among Us: Social/Dedução
(18, 12),
-- Fall Guys: Party/Battle Royale
(19, 13),
-- Rocket League: Esportes/Corrida
(20, 14);

-- Inserir pessoas (usuários e administradores)
INSERT INTO pessoa (cpf, nome, email, telefone, data_nascimento, rede_social, senha_hash) VALUES
-- Usuários
('12345678901', 'Ana Silva', 'ana.silva@email.com', '11987654321', '1995-03-15', '@ana_silva', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('23456789012', 'Bruno Santos', 'bruno.santos@email.com', '11876543210', '1992-07-22', '@bruno_santos', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('34567890123', 'Carla Oliveira', 'carla.oliveira@email.com', '11765432109', '1988-11-08', '@carla_oliveira', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('45678901234', 'Diego Costa', 'diego.costa@email.com', '11654321098', '1990-05-30', '@diego_costa', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('56789012345', 'Elena Rodrigues', 'elena.rodrigues@email.com', '11543210987', '1993-09-12', '@elena_rodrigues', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('67890123456', 'Felipe Lima', 'felipe.lima@email.com', '11432109876', '1987-01-25', '@felipe_lima', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('78901234567', 'Gabriela Ferreira', 'gabriela.ferreira@email.com', '11321098765', '1991-12-03', '@gabriela_ferreira', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('89012345678', 'Henrique Alves', 'henrique.alves@email.com', '11210987654', '1989-04-18', '@henrique_alves', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('90123456789', 'Isabela Martins', 'isabela.martins@email.com', '11109876543', '1994-08-07', '@isabela_martins', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('01234567890', 'João Pereira', 'joao.pereira@email.com', '11098765432', '1986-06-14', '@joao_pereira', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('11234567890', 'Karen Souza', 'karen.souza@email.com', '11987654322', '1992-10-20', '@karen_souza', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
('21234567890', 'Lucas Barbosa', 'lucas.barbosa@email.com', '11876543211', '1990-02-28', '@lucas_barbosa', '$2a$10$HQT.F9l5KxmRe9ZT9C5O/eOK2ZLM6w47eQNv.PRb2W8tGI0sS4wuW'),
-- Administradores
('98765432100', 'Admin Master', 'admin.master@gamestore.com', '11555666777', '1985-01-01', '@admin_master', '$2a$10$tl9f..kC1TvA9xx6OaP4je2/UygMBeLIdz/73N1xPbhHZL1Qetrmq'),
('87654321099', 'Admin Jogos', 'admin.jogos@gamestore.com', '11444555666', '1987-05-15', '@admin_jogos', '$2a$10$tl9f..kC1TvA9xx6OaP4je2/UygMBeLIdz/73N1xPbhHZL1Qetrmq'),
('76543210988', 'Admin Users', 'admin.users@gamestore.com', '11333444555', '1989-09-30', '@admin_users', '$2a$10$tl9f..kC1TvA9xx6OaP4je2/UygMBeLIdz/73N1xPbhHZL1Qetrmq');

-- Inserir usuários
INSERT INTO usuario (cpf) VALUES
('12345678901'), ('23456789012'), ('34567890123'), ('45678901234'),
('56789012345'), ('67890123456'), ('78901234567'), ('89012345678'),
('90123456789'), ('01234567890'), ('11234567890'), ('21234567890');

-- Inserir administradores
INSERT INTO administrador (cpf, permissoes) VALUES
('98765432100', ARRAY['gerenciar_jogos', 'gerenciar_usuarios', 'visualizar_relatorios']),   -- Admin Master: todas as permissões
('87654321099', ARRAY['gerenciar_jogos']),  -- Admin Jogos: apenas jogos
('76543210988', ARRAY['gerenciar_usuarios']);  -- Admin Users: apenas usuários

-- Inserir cartões bancários
INSERT INTO cartao_bancario (id_usuario, numero, bandeira, validade_mes, validade_ano, codigo_seguranca) VALUES
('12345678901', '1234567890123456', 'VISA', 12, 2025, '123'),
('12345678901', '2345678901234567', 'MASTERCARD', 6, 2026, '456'),
('23456789012', '3456789012345678', 'ELO', 9, 2025, '789'),
('34567890123', '4567890123456789', 'VISA', 3, 2027, '012'),
('45678901234', '5678901234567890', 'AMERICAN_EXPRESS', 11, 2025, '3456'),
('56789012345', '6789012345678901', 'MASTERCARD', 7, 2026, '678'),
('67890123456', '7890123456789012', 'VISA', 4, 2025, '901'),
('78901234567', '8901234567890123', 'ELO', 10, 2027, '234');

-- Inserir compras (40 compras distribuídas no tempo)
INSERT INTO compra (id_usuario, id_jogo, data_compra, valor_pago) VALUES
('12345678901', 1, '2024-01-15 14:30:00', 0.00),
('12345678901', 3, '2024-02-20 16:45:00', 199.90),
('12345678901', 5, '2024-03-10 10:20:00', 89.90),
('23456789012', 2, '2024-01-25 09:15:00', 299.90),
('23456789012', 4, '2024-02-14 20:30:00', 149.90),
('23456789012', 6, '2024-04-05 15:45:00', 249.90),
('34567890123', 7, '2024-02-01 11:00:00', 0.00),
('34567890123', 8, '2024-03-15 13:20:00', 199.90),
('34567890123', 9, '2024-04-20 17:30:00', 299.90),
('45678901234', 10, '2024-01-30 12:45:00', 299.90),
('45678901234', 11, '2024-03-25 14:15:00', 199.90),
('45678901234', 12, '2024-05-10 16:00:00', 199.90),
('56789012345', 13, '2024-02-10 08:30:00', 299.90),
('56789012345', 14, '2024-03-20 19:45:00', 249.90),
('56789012345', 15, '2024-04-15 11:30:00', 199.90),
('67890123456', 16, '2024-01-20 15:20:00', 179.90),
('67890123456', 17, '2024-02-25 10:45:00', 89.90),
('67890123456', 18, '2024-03-30 13:15:00', 19.90),
('78901234567', 19, '2024-02-05 16:30:00', 0.00),
('78901234567', 20, '2024-03-12 14:45:00', 0.00),
('78901234567', 1, '2024-04-25 12:00:00', 0.00),
('89012345678', 2, '2024-01-12 09:30:00', 299.90),
('89012345678', 3, '2024-02-18 11:45:00', 199.90),
('89012345678', 4, '2024-03-28 15:20:00', 149.90),
('90123456789', 5, '2024-01-08 13:15:00', 89.90),
('90123456789', 6, '2024-02-22 17:30:00', 249.90),
('90123456789', 7, '2024-04-10 10:45:00', 0.00),
('01234567890', 8, '2024-01-18 14:20:00', 199.90),
('01234567890', 9, '2024-03-05 16:15:00', 299.90),
('01234567890', 10, '2024-04-30 12:30:00', 299.90),
('11234567890', 11, '2024-02-12 11:45:00', 199.90),
('11234567890', 12, '2024-03-18 15:30:00', 199.90),
('11234567890', 13, '2024-05-05 09:15:00', 299.90),
('21234567890', 14, '2024-01-28 13:45:00', 249.90),
('21234567890', 15, '2024-02-28 16:20:00', 199.90),
('21234567890', 16, '2024-04-12 14:30:00', 179.90),
('12345678901', 17, '2024-05-15 10:30:00', 89.90),
('23456789012', 18, '2024-05-20 14:45:00', 19.90),
('34567890123', 19, '2024-05-25 16:15:00', 0.00),
('45678901234', 20, '2024-05-30 11:20:00', 0.00);

-- Inserir avaliações (apenas de jogos comprados)
INSERT INTO avaliacao (id_usuario, id_jogo, nota, texto, data_publicacao) VALUES
('12345678901', 1, 8, 'Jogo muito divertido, viciante!', '2024-01-20'),
('12345678901', 3, 9, 'Gráficos incríveis, história envolvente', '2024-02-25'),
('12345678901', 5, 7, 'Clássico, mas ainda diverte', '2024-03-15'),
('23456789012', 2, 8, 'Ótima ambientação viking', '2024-02-01'),
('23456789012', 4, 10, 'Obra-prima dos RPGs', '2024-02-20'),
('23456789012', 6, 9, 'História emocionante do faroeste', '2024-04-10'),
('34567890123', 7, 9, 'Melhor FPS competitivo', '2024-02-05'),
('34567890123', 8, 8, 'Experiência VR incrível', '2024-03-20'),
('34567890123', 9, 10, 'Mario nunca decepciona', '2024-04-25'),
('45678901234', 10, 10, 'Revolucionou os jogos de aventura', '2024-02-05'),
('45678901234', 11, 9, 'Kratos está de volta com tudo', '2024-03-30'),
('45678901234', 12, 8, 'Melhor jogo do Homem-Aranha', '2024-05-15'),
('56789012345', 13, 7, 'Halo voltou bem', '2024-02-15'),
('56789012345', 14, 8, 'Corridas no México são incríveis', '2024-03-25'),
('56789012345', 15, 6, 'Far Cry mais do mesmo', '2024-04-20'),
('67890123456', 16, 7, 'Conceito interessante de hackers', '2024-01-25'),
('67890123456', 17, 10, 'Criatividade sem limites', '2024-03-01'),
('67890123456', 18, 5, 'Divertido por pouco tempo', '2024-04-05'),
('78901234567', 19, 6, 'Caótico mas divertido', '2024-02-10'),
('78901234567', 20, 8, 'Futebol com carros é genial', '2024-03-17'),
('78901234567', 1, 7, 'Battle royale bem feito', '2024-04-30'),
('89012345678', 2, 9, 'Mundo aberto impressionante', '2024-01-17'),
('89012345678', 3, 6, 'Muitos bugs no lançamento', '2024-02-23'),
('89012345678', 4, 10, 'Geralt é inesquecível', '2024-04-02'),
('90123456789', 5, 8, 'GTA nunca envelhece', '2024-01-13'),
('90123456789', 6, 9, 'Arthur Morgan é um personagem incrível', '2024-02-27'),
('90123456789', 7, 8, 'CS2 trouxe novidades boas', '2024-04-15'),
('01234567890', 8, 9, 'VR do futuro', '2024-01-23'),
('01234567890', 9, 10, 'Nintendo sabe fazer jogos', '2024-03-10'),
('01234567890', 10, 10, 'Link em sua melhor aventura', '2024-05-05'),
('11234567890', 11, 8, 'God of War reinventado', '2024-02-17'),
('11234567890', 12, 9, 'Swinging por NY é incrível', '2024-03-23'),
('11234567890', 13, 7, 'Master Chief está de volta', '2024-05-10'),
('21234567890', 14, 8, 'Horizon 5 é lindo', '2024-02-03'),
('21234567890', 15, 5, 'Repetitivo demais', '2024-03-05'),
('21234567890', 16, 6, 'Ideia boa, execução mediana', '2024-04-17'),
('12345678901', 17, 10, 'Minecraft é atemporal', '2024-05-20'),
('23456789012', 18, 4, 'Hype passou rápido', '2024-05-25'),
('34567890123', 19, 3, 'Muito repetitivo', '2024-05-30'),
('45678901234', 20, 9, 'Rocket League é único', '2024-06-05');

-- Inserir gestão de jogos por administradores (15 vínculos sem sobreposição)
INSERT INTO gerencia (id_admin, id_jogo, data_inicio, data_fim) VALUES
('98765432100', 1, '2023-01-01', '2023-03-31'),
('98765432100', 2, '2023-04-01', '2023-06-30'),
('98765432100', 3, '2023-07-01', NULL),
('87654321099', 4, '2023-01-01', '2023-02-28'),
('87654321099', 5, '2023-03-01', '2023-04-30'),
('87654321099', 6, '2023-05-01', '2023-07-31'),
('87654321099', 7, '2023-08-01', NULL),
('76543210988', 8, '2023-01-15', '2023-03-15'),
('76543210988', 9, '2023-03-16', '2023-05-15'),
('76543210988', 10, '2023-05-16', NULL),
('98765432100', 11, '2023-01-01', '2023-02-28'),
('87654321099', 12, '2023-01-01', '2023-03-31'),
('76543210988', 13, '2023-02-01', '2023-04-30'),
('98765432100', 14, '2023-03-01', '2023-05-31'),
('87654321099', 15, '2023-04-01', NULL);

