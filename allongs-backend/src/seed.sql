-- ============================================================
-- Allongs default seed — dados reais do banco de produção
-- Encoding: UTF-8
-- ============================================================

-- Limpa dados existentes (mantém estrutura das tabelas)
TRUNCATE TABLE public.donations CASCADE;
TRUNCATE TABLE public.volunteers CASCADE;
TRUNCATE TABLE public.campaigns CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- ─── Usuários (ONGs + Doador) ───
-- Senha das ONGs: ong123456
-- Senha do doador: doador123456

INSERT INTO public.users (id, name, email, password_hash, user_type, avatar_url, org_name, org_description, org_since, created_at) VALUES
(
  'fc88a11f-e944-48d0-833a-2676290a8f60',
  'Instituto Raízes Verdes',
  'contato@raizesverdes.org.br',
  '$2a$10$afupxnBOVETVL/E6VpTOJ.fHhbfZ3JS2QSbM.0L.ZP2OL16hr98aa',
  'ong',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWioOD5Vo_icDxrxzGvNDCdLjGzdEHNo4jYIwnmFkmEnht45I_ON2yMjViG7Kws6sPgefJ80aSuLLrY4MVao9ER9abuxLslwm_tLv_FdieTT_C5TOw9pC2mO25vV-W1nayd1oaxG6G5sFQgTtHukRuc-oDrUxZJoS0UKEUI0olqqEYYdarIMQlPqrbn7Qrh9trGNFtHbvF90KnfhhyWqQfqC-eyjrey7gRwkLR8igBixwq3kH12wQ6N7IuBuMuSHj3k8xb1Owrhw',
  'Instituto Raízes Verdes',
  'O Instituto Raízes Verdes trabalha pela preservação ambiental e educação ecológica em comunidades vulneráveis. Desde 2018, já impactamos mais de 15 mil pessoas com projetos de reflorestamento, água limpa e agricultura sustentável.',
  '2018',
  '2026-05-29 14:31:21.292260'
),
(
  'f1effe07-b810-4706-bd6d-4a388fe59fe2',
  'Patas e Esperança',
  'contato@patasesperanca.org.br',
  '$2a$10$afupxnBOVETVL/E6VpTOJ.fHhbfZ3JS2QSbM.0L.ZP2OL16hr98aa',
  'ong',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPjTLSTBuQhFKJH60_qYSBmvgaHNcmgrfdLVcf_bbbXDncsGyXl65tmw-jgGn8b1AwGb5IxKVazbdQaL_jfjboCwLm0sAtUbl5w_7YNoIqo4ynmxl1qD1ZNzPJbT99Hv0dDVjsymrzSlVepRfomob3K1ZRkMANw9GYVKuzkwfQouXFChSZfJDScIBWUU04UBBlpeS4GegMEdqeplcYTfPWnkOffYpHeY08UA2axgEI_p62hBqDVTT-BRsJnCGSwqjw1cW1NeEApw',
  'Patas e Esperança',
  'A Patas e Esperança é uma ONG dedicada ao resgate, reabilitação e adoção responsável de animais abandonados. Atuamos em centros urbanos oferecendo atendimento veterinário gratuito e programas de conscientização sobre posse responsável.',
  '2015',
  '2026-05-29 14:31:21.362310'
),
(
  '5655946b-6739-413c-8a5c-789c63ac1ece',
  'Instituto Saúde Global',
  'contato@saudeglobal.org.br',
  '$2a$10$afupxnBOVETVL/E6VpTOJ.fHhbfZ3JS2QSbM.0L.ZP2OL16hr98aa',
  'ong',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAngfupqUISTraP-v4HNL6SzPr4YNTgM4XvLWeuyC-IUm2KJIRHwkh5THB01ajnL-VWRqfcvFdNnyyTsXm7x46F3VFjYrwn-E4otSnIpZxiSQeAkPKyPFm20eOcOZbeJKxKvvvz3czTj0XWofaWSfSkqLBJsRJYRNk7BOPTBDgDsO8CspAAfM91YtobYIA_z_3y1evEYzog-Z3b3bB0bG3wSrsJjiV8UG4jXHkTiyd5OF-1mhrDRqPd8oxZxiYGDTX_2JegguCmKg',
  'Instituto Saúde Global',
  'O Instituto Saúde Global atua na distribuição de medicamentos essenciais e kits de diagnóstico para comunidades rurais sem acesso à saúde. Desde 2016, já atendemos mais de 50 mil pacientes em regiões remotas do Brasil.',
  '2016',
  '2026-05-29 14:31:21.388393'
),
(
  '2b9c804b-c4bf-4ff3-ac3b-25ed229745d8',
  'Educar para Transformar',
  'contato@educarparatransformar.org.br',
  '$2a$10$afupxnBOVETVL/E6VpTOJ.fHhbfZ3JS2QSbM.0L.ZP2OL16hr98aa',
  'ong',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCvxYzim6MpPIf1AvNPzTF6ceVTylZomUZCrLIWmHrXIYxcbobq_lhdhFTUnRb1KoEujKjG79hHdFnhUqeI_D35CXvSvkhNcO9g0NMZuGTx8OqVQGZNQG8feRWBtyYGmFRAA0Xs1476wp1Ftf1EzneV9rW_4A8hUejl3UII7935D3kd1ZhJQjXJaloyffjRe4Y3mLwiBqfytkeZ_Pjw5lx0Ge8s1mBzWiMb8ha1fQB3fz_rbYPytw_3n7ocsNsYz2_-WlYN56AZBA',
  'Educar para Transformar',
  'A Educar para Transformar leva educação de qualidade para crianças e jovens em situação de vulnerabilidade. Oferecemos material escolar, acesso digital, reforço pedagógico e programas de alfabetização em comunidades carentes.',
  '2017',
  '2026-05-29 14:31:21.413741'
),
(
  'da8ec310-02c5-4ecb-a9f1-7c429ff235f5',
  'Guardiões da Floresta',
  'contato@guardioesdafloresta.org.br',
  '$2a$10$afupxnBOVETVL/E6VpTOJ.fHhbfZ3JS2QSbM.0L.ZP2OL16hr98aa',
  'ong',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCPwcydoYf7h58o3U3oMGaXUjQMNNhKGmGbN84N2gxvnWDIUijINh8gE-wQRvmPLLsNlBvOXDPYDxf2OPkuVHNF0lzUYlk2Rx4w6sFCuPDH3HJFaqjVb_Q6WaGd5YFVe_9_Z9zDDOBjrqGnb91xyJHdqlC0w6DQMXswjXsHYr_YF9S2q-VTDnmRQ4Vr1WqgIR-4TA',
  'Guardiões da Floresta',
  'Os Guardiões da Floresta trabalham na proteção de ecossistemas ameaçados e na conservação de espécies em risco de extinção. Com patrulhas especializadas e programas de reflorestamento, já protegemos mais de 200 mil hectares de mata nativa.',
  '2014',
  '2026-05-29 14:31:21.446686'
),
(
  'd54dbebb-5181-416b-a96b-88609065cf69',
  'Oceanos Limpos Brasil',
  'contato@oceanoslimpos.org.br',
  '$2a$10$afupxnBOVETVL/E6VpTOJ.fHhbfZ3JS2QSbM.0L.ZP2OL16hr98aa',
  'ong',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHGo5HOzsJjqGpUCD4TpDpzxKmh7HgtDi5CM1h1NOdC841Y-EdUVFEVZbVha4UvAeSr6gosiVLIV2ygOduHVB4fjfm8vajTIed76ZM_9Lidpi3CL57fPp7U5IWvcHZ1fyUSU6yAGM_lqSNWHthVPlUHFquhKA-Ue0RV4nDdKmyjIZynLC9UwO9KVmvsJLYBTA1yXrdc7gzztKuSScxfF6xmIiqsFq3x_hfdFc08QLhDRbT8ArHj2nA3MJlmDkKiroNHuGdZcDMAw',
  'Oceanos Limpos Brasil',
  'A Oceanos Limpos Brasil é pioneira na limpeza e proteção dos oceanos brasileiros. Desenvolvemos tecnologias inovadoras de filtragem de microplásticos e promovemos ações de conscientização sobre a preservação da vida marinha.',
  '2019',
  '2026-05-29 14:31:21.472107'
),
(
  'caf31877-9999-4502-a583-6e891be0e887',
  'Mesa Solidária',
  'contato@mesasolidaria.org.br',
  '$2a$10$afupxnBOVETVL/E6VpTOJ.fHhbfZ3JS2QSbM.0L.ZP2OL16hr98aa',
  'ong',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDeC98fod1AlzpI-l493Izg4xoLBezmm1zdQ2hztrWfDKEr5KW8xaNLn03_Cs-ZDaoa5iUNDp7JhJvLr3ZbqjQ2BM2Rgcp8GBQ0-H6bGdKCaQaxdVBSOkxT6rvk2cmzJbqOZnRMkIbUuFdrv7pORLQKcEFMKHxtZyI03JzBDu-jNll98RXycmM1mNr2D_8hNTM2iAY4JLFkrqJjNMw9Hx0UGu2-cqYYWu6X_M3B3i7Xg1027MKjPqrKiatTQasaTOotjar-J08-Jg',
  'Mesa Solidária',
  'A Mesa Solidária combate a fome e a insegurança alimentar levando refeições nutritivas e gratuitas para famílias em situação de vulnerabilidade. Já servimos mais de 500 mil refeições desde a nossa fundação.',
  '2020',
  '2026-05-29 14:31:21.505549'
),
(
  '6df9ae64-01ce-42f4-865e-4c5324a80414',
  'Usuário Doador',
  'doador@allongs.com',
  '$2a$10$KZUaU6C1n6BTGpxW9aBnQ.HyDIoucPk3Pdn4GeLJUIRP0evXdMSeC',
  'doador',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCT8nB1bj2pXC855FDP9Gtx7r-TAXU1JTgD6ncyQx0Ib0SBS5piLGlOjr4cEWmsNT-QMVgwdd6q1aK9RKa7EVki2-qrMASwIDz28DEJf4j0Vb-pQ1gRUzl0rbEvrUax1XgE7jWCutCW5d8O5CH9T61PApz74udrJT1e24Yb-yZz2WsZ1I75aVH83517DvWYo5chzvPeaiia1kMjwESwH-QViCklhSwRfBCa950mZr_GrkJHdtlqliR2jn9pUgrV4Avw26KPjrmrRQ',
  NULL,
  NULL,
  NULL,
  '2026-05-29 14:31:21.615373'
);

-- ─── Campanhas ───
INSERT INTO public.campaigns (id, title, description, category, goal_amount, raised_amount, image_url, icon, ong_id, is_urgent, is_public, percentage_complete, donor_count, created_at) VALUES
(
  '985718f4-da37-42c7-9fc8-a419fada5a40',
  'Reflorestamento da Encosta Norte',
  'Projeto de reflorestamento para restaurar a biodiversidade da Encosta Norte, plantando 10.000 mudas nativas em áreas degradadas.',
  'Meio Ambiente', 20000.00, 16000.00,
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  'park', 'fc88a11f-e944-48d0-833a-2676290a8f60', true, true, 80, 324,
  '2026-05-29 14:31:21.648196'
),
(
  '4089dfa5-2c77-4497-9902-e76e00f7a914',
  'Cozinha Solidária Comunitária',
  'Alimentando famílias em vulnerabilidade com refeições nutritivas e gratuitas em comunidades de baixa renda.',
  'Social', 15000.00, 8800.00,
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
  'restaurant', 'caf31877-9999-4502-a583-6e891be0e887', true, true, 59, 188,
  '2026-05-29 14:31:21.680950'
),
(
  'af712ba7-92c1-4a95-8d5d-4fcbd0eff61f',
  'Acesso Global de Saúde',
  'Fornecimento de medicamentos essenciais e kits de diagnóstico para comunidades rurais sem acesso à saúde.',
  'Saúde', 45000.00, 28800.00,
  'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
  'medical_services', '5655946b-6739-413c-8a5c-789c63ac1ece', false, true, 64, 521,
  '2026-05-29 14:31:21.915670'
),
(
  '4ec7aef1-51fa-469a-9215-7420d0ccf0e6',
  'Pequenos Estudantes Intl',
  'Material escolar e acesso digital para crianças em situação de vulnerabilidade educacional.',
  'Educação', 30000.00, 18900.00,
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'school', '2b9c804b-c4bf-4ff3-ac3b-25ed229745d8', false, true, 63, 367,
  '2026-05-29 14:31:21.991362'
),
(
  '9ff1af4b-3d71-40dd-bdc7-38f8a18bb313',
  'Patrulhas Florestais de Emergência',
  'Protegendo tigres de Sumatra com patrulhas especializadas contra caça ilegal e desmatamento.',
  'Causa Animal', 50000.00, 31500.00,
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
  'pets', 'da8ec310-02c5-4ecb-a9f1-7c429ff235f5', false, true, 63, 412,
  '2026-05-29 14:31:21.713924'
),
(
  '4e69b0c6-534f-42f7-8481-77e821a64785',
  'Raízes da Mudança',
  'Apoio a viveiros comunitários costeiros, combatendo a erosão e gerando renda local sustentável.',
  'Social', 25000.00, 9750.00,
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
  'eco', 'fc88a11f-e944-48d0-833a-2676290a8f60', false, true, 39, 142,
  '2026-05-29 14:31:21.849142'
),
(
  'e9e8967a-c8a0-4605-9fa7-84b89c52b385',
  'Patas e Abrigo Esperança',
  'Ração e atendimento veterinário para animais resgatados em abrigos comunitários.',
  'Causa Animal', 18000.00, 11800.00,
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
  'pets', 'f1effe07-b810-4706-bd6d-4a388fe59fe2', true, true, 66, 299,
  '2026-05-29 14:31:21.883500'
),
(
  '6b991698-350e-4060-924b-4d2a9a4a84d0',
  '1 Milhão de Árvores',
  'Projeto ambicioso de plantar 1 milhão de árvores no corredor ecológico amazônico para combater o desmatamento.',
  'Meio Ambiente', 100000.00, 67100.00,
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80',
  'forest', 'da8ec310-02c5-4ecb-a9f1-7c429ff235f5', true, true, 67, 858,
  '2026-05-29 14:31:21.807675'
),
(
  '32883694-f794-4388-a9e0-e3e500042a31',
  'Filtros de Microplásticos',
  'Instalação de filtros avançados para proteger recifes de coral da contaminação por microplásticos.',
  'Meio Ambiente', 35000.00, 12550.00,
  'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80',
  'water_drop', 'd54dbebb-5181-416b-a96b-88609065cf69', false, true, 36, 191,
  '2026-05-29 14:31:21.773366'
);

-- ─── Doações ───
INSERT INTO public.donations (id, amount, payment_method, user_id, campaign_id, transaction_id, impact_text, created_at) VALUES
('6828f69c-4954-426a-a0a9-d66fd19ea60a', 250.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', '985718f4-da37-42c7-9fc8-a419fada5a40', '#AO-4920001', 'Esta doação permitirá o plantio de 42 mudas nativas.',              '2026-05-29 14:31:22.052266'),
('a795cb37-179d-4ace-ab85-fe1499526c7f', 100.00, 'cartao', '6df9ae64-01ce-42f4-865e-4c5324a80414', '4089dfa5-2c77-4497-9902-e76e00f7a914', '#AO-4811002', 'Esta doação garantirá 27 refeições nutritivas.',                   '2026-05-29 14:31:22.096999'),
('132546a8-8361-41e1-adb4-4b39dc327b29', 500.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', '9ff1af4b-3d71-40dd-bdc7-38f8a18bb313', '#AO-4765003', 'Esta doação financiará 5 dias de patrulha especializada.',          '2026-05-29 14:31:22.122047'),
('66811119-a2c2-4389-80ba-38168f3ccee8', 200.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', NULL,                                   '#AO-5160377', 'Sua doação fará a diferença!',                                      '2026-05-29 14:33:31.446854'),
('8f71d98b-e075-4540-9ef7-1db208bbfb03',  25.00, 'cartao', '6df9ae64-01ce-42f4-865e-4c5324a80414', '4089dfa5-2c77-4497-9902-e76e00f7a914', '#AO-3376147', 'Esta doação garantirá 6 refeições nutritivas.',                    '2026-05-29 14:33:55.602212'),
('c02d58d3-367b-413e-96c0-b26d0c382119',  25.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', '4089dfa5-2c77-4497-9902-e76e00f7a914', '#AO-3956855', 'Esta doação garantirá 6 refeições nutritivas.',                    '2026-05-29 14:45:28.058855'),
('046713f4-4fa0-43ca-85ea-a3916f537bf7',  50.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', '6b991698-350e-4060-924b-4d2a9a4a84d0', '#AO-1747340', 'Esta doação financiará o plantio de 16 árvores nativas.',          '2026-05-29 16:02:51.543721'),
('eec8f344-4a33-45f5-ad44-780077664a91', 100.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', 'e9e8967a-c8a0-4605-9fa7-84b89c52b385', '#AO-7231201', 'Esta doação fornecerá cuidados para 5 animais resgatados.',         '2026-05-29 16:03:11.805190'),
('e0a7e30d-471a-4f38-bc0a-797352fe15d9',  50.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', '6b991698-350e-4060-924b-4d2a9a4a84d0', '#AO-8622752', 'Esta doação financiará o plantio de 16 árvores nativas.',          '2026-05-29 16:26:03.197345'),
('0bbaab28-4487-4080-9faa-f64e62d4feb7', 100.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', '32883694-f794-4388-a9e0-e3e500042a31', '#AO-2712019', 'Esta doação ajudará a filtrar até 8kg de microplásticos.',         '2026-05-29 16:27:09.567831'),
('651cee74-2edc-4b86-ace6-65de86673c8b', 200.00, 'pix',    '6df9ae64-01ce-42f4-865e-4c5324a80414', '32883694-f794-4388-a9e0-e3e500042a31', '#AO-7098491', 'Esta doação ajudará a filtrar até 16kg de microplásticos.',        '2026-05-29 16:27:20.778907');
