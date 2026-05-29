import bcrypt from 'bcryptjs';
import { pool, initDatabase } from './database';
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  await initDatabase();

  const client = await pool.connect();
  try {
    // Clean tables
    await client.query('DELETE FROM donations');
    await client.query('DELETE FROM volunteers');
    await client.query('DELETE FROM campaigns');
    await client.query('DELETE FROM users');

    console.log('🧹 Tables cleaned');

    const ongPassword = await bcrypt.hash('ong123456', 10);

    // ─── ONG 1: Instituto Raízes Verdes ───
    const ong1Result = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, org_name, org_description, org_since, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'Instituto Raízes Verdes',
        'contato@raizesverdes.org.br',
        ongPassword,
        'ong',
        'Instituto Raízes Verdes',
        'O Instituto Raízes Verdes trabalha pela preservação ambiental e educação ecológica em comunidades vulneráveis. Desde 2018, já impactamos mais de 15 mil pessoas com projetos de reflorestamento, água limpa e agricultura sustentável.',
        '2018',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBWioOD5Vo_icDxrxzGvNDCdLjGzdEHNo4jYIwnmFkmEnht45I_ON2yMjViG7Kws6sPgefJ80aSuLLrY4MVao9ER9abuxLslwm_tLv_FdieTT_C5TOw9pC2mO25vV-W1nayd1oaxG6G5sFQgTtHukRuc-oDrUxZJoS0UKEUI0olqqEYYdarIMQlPqrbn7Qrh9trGNFtHbvF90KnfhhyWqQfqC-eyjrey7gRwkLR8igBixwq3kH12wQ6N7IuBuMuSHj3k8xb1Owrhw'
      ]
    );
    const ong1Id = ong1Result.rows[0].id;

    // ─── ONG 2: Patas e Esperança ───
    const ong2Result = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, org_name, org_description, org_since, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'Patas e Esperança',
        'contato@patasesperanca.org.br',
        ongPassword,
        'ong',
        'Patas e Esperança',
        'A Patas e Esperança é uma ONG dedicada ao resgate, reabilitação e adoção responsável de animais abandonados. Atuamos em centros urbanos oferecendo atendimento veterinário gratuito e programas de conscientização sobre posse responsável.',
        '2015',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBPjTLSTBuQhFKJH60_qYSBmvgaHNcmgrfdLVcf_bbbXDncsGyXl65tmw-jgGn8b1AwGb5IxKVazbdQaL_jfjboCwLm0sAtUbl5w_7YNoIqo4ynmxl1qD1ZNzPJbT99Hv0dDVjsymrzSlVepRfomob3K1ZRkMANw9GYVKuzkwfQouXFChSZfJDScIBWUU04UBBlpeS4GegMEdqeplcYTfPWnkOffYpHeY08UA2axgEI_p62hBqDVTT-BRsJnCGSwqjw1cW1NeEApw'
      ]
    );
    const ong2Id = ong2Result.rows[0].id;

    // ─── ONG 3: Instituto Saúde Global ───
    const ong3Result = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, org_name, org_description, org_since, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'Instituto Saúde Global',
        'contato@saudeglobal.org.br',
        ongPassword,
        'ong',
        'Instituto Saúde Global',
        'O Instituto Saúde Global atua na distribuição de medicamentos essenciais e kits de diagnóstico para comunidades rurais sem acesso à saúde. Desde 2016, já atendemos mais de 50 mil pacientes em regiões remotas do Brasil.',
        '2016',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAngfupqUISTraP-v4HNL6SzPr4YNTgM4XvLWeuyC-IUm2KJIRHwkh5THB01ajnL-VWRqfcvFdNnyyTsXm7x46F3VFjYrwn-E4otSnIpZxiSQeAkPKyPFm20eOcOZbeJKxKvvvz3czTj0XWofaWSfSkqLBJsRJYRNk7BOPTBDgDsO8CspAAfM91YtobYIA_z_3y1evEYzog-Z3b3bB0bG3wSrsJjiV8UG4jXHkTiyd5OF-1mhrDRqPd8oxZxiYGDTX_2JegguCmKg'
      ]
    );
    const ong3Id = ong3Result.rows[0].id;

    // ─── ONG 4: Educar para Transformar ───
    const ong4Result = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, org_name, org_description, org_since, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'Educar para Transformar',
        'contato@educarparatransformar.org.br',
        ongPassword,
        'ong',
        'Educar para Transformar',
        'A Educar para Transformar leva educação de qualidade para crianças e jovens em situação de vulnerabilidade. Oferecemos material escolar, acesso digital, reforço pedagógico e programas de alfabetização em comunidades carentes.',
        '2017',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCvxYzim6MpPIf1AvNPzTF6ceVTylZomUZCrLIWmHrXIYxcbobq_lhdhFTUnRb1KoEujKjG79hHdFnhUqeI_D35CXvSvkhNcO9g0NMZuGTx8OqVQGZNQG8feRWBtyYGmFRAA0Xs1476wp1Ftf1EzneV9rW_4A8hUejl3UII7935D3kd1ZhJQjXJaloyffjRe4Y3mLwiBqfytkeZ_Pjw5lx0Ge8s1mBzWiMb8ha1fQB3fz_rbYPytw_3n7ocsNsYz2_-WlYN56AZBA'
      ]
    );
    const ong4Id = ong4Result.rows[0].id;

    // ─── ONG 5: Guardiões da Floresta ───
    const ong5Result = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, org_name, org_description, org_since, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'Guardiões da Floresta',
        'contato@guardioesdafloresta.org.br',
        ongPassword,
        'ong',
        'Guardiões da Floresta',
        'Os Guardiões da Floresta trabalham na proteção de ecossistemas ameaçados e na conservação de espécies em risco de extinção. Com patrulhas especializadas e programas de reflorestamento, já protegemos mais de 200 mil hectares de mata nativa.',
        '2014',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCPwcydoYf7h58o3U3oMGaXUjQMNNhKGmGbN84N2gxvnWDIUijINh8gE-wQRvmPLLsNlBvOXDPYDxf2OPkuVHNF0lzUYlk2Rx4w6sFCuPDH3HJFaqjVb_Q6WaGd5YFVe_9_Z9zDDOBjrqGnb91xyJHdqlC0w6DQMXswjXsHYr_YF9S2q-VTDnmRQ4Vr1WqgIR-4TA'
      ]
    );
    const ong5Id = ong5Result.rows[0].id;

    // ─── ONG 6: Oceanos Limpos Brasil ───
    const ong6Result = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, org_name, org_description, org_since, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'Oceanos Limpos Brasil',
        'contato@oceanoslimpos.org.br',
        ongPassword,
        'ong',
        'Oceanos Limpos Brasil',
        'A Oceanos Limpos Brasil é pioneira na limpeza e proteção dos oceanos brasileiros. Desenvolvemos tecnologias inovadoras de filtragem de microplásticos e promovemos ações de conscientização sobre a preservação da vida marinha.',
        '2019',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAHGo5HOzsJjqGpUCD4TpDpzxKmh7HgtDi5CM1h1NOdC841Y-EdUVFEVZbVha4UvAeSr6gosiVLIV2ygOduHVB4fjfm8vajTIed76ZM_9Lidpi3CL57fPp7U5IWvcHZ1fyUSU6yAGM_lqSNWHthVPlUHFquhKA-Ue0RV4nDdKmyjIZynLC9UwO9KVmvsJLYBTA1yXrdc7gzztKuSScxfF6xmIiqsFq3x_hfdFc08QLhDRbT8ArHj2nA3MJlmDkKiroNHuGdZcDMAw'
      ]
    );
    const ong6Id = ong6Result.rows[0].id;

    // ─── ONG 7: Mesa Solidária ───
    const ong7Result = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, org_name, org_description, org_since, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'Mesa Solidária',
        'contato@mesasolidaria.org.br',
        ongPassword,
        'ong',
        'Mesa Solidária',
        'A Mesa Solidária combate a fome e a insegurança alimentar levando refeições nutritivas e gratuitas para famílias em situação de vulnerabilidade. Já servimos mais de 500 mil refeições desde a nossa fundação.',
        '2020',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDeC98fod1AlzpI-l493Izg4xoLBezmm1zdQ2hztrWfDKEr5KW8xaNLn03_Cs-ZDaoa5iUNDp7JhJvLr3ZbqjQ2BM2Rgcp8GBQ0-H6bGdKCaQaxdVBSOkxT6rvk2cmzJbqOZnRMkIbUuFdrv7pORLQKcEFMKHxtZyI03JzBDu-jNll98RXycmM1mNr2D_8hNTM2iAY4JLFkrqJjNMw9Hx0UGu2-cqYYWu6X_M3B3i7Xg1027MKjPqrKiatTQasaTOotjar-J08-Jg'
      ]
    );
    const ong7Id = ong7Result.rows[0].id;

    console.log('✅ 7 ONGs created');

    // Create donor user
    const donorPassword = await bcrypt.hash('doador123456', 10);
    const donorResult = await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        'Usuário Doador',
        'doador@allongs.com',
        donorPassword,
        'doador',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCT8nB1bj2pXC855FDP9Gtx7r-TAXU1JTgD6ncyQx0Ib0SBS5piLGlOjr4cEWmsNT-QMVgwdd6q1aK9RKa7EVki2-qrMASwIDz28DEJf4j0Vb-pQ1gRUzl0rbEvrUax1XgE7jWCutCW5d8O5CH9T61PApz74udrJT1e24Yb-yZz2WsZ1I75aVH83517DvWYo5chzvPeaiia1kMjwESwH-QViCklhSwRfBCa950mZr_GrkJHdtlqliR2jn9pUgrV4Avw26KPjrmrRQ'
      ]
    );
    const donorId = donorResult.rows[0].id;

    console.log('✅ Donor user created');

    // Create campaigns — each associated with its thematic ONG
    const campaigns = [
      {
        title: 'Reflorestamento da Encosta Norte',
        description: 'Projeto de reflorestamento para restaurar a biodiversidade da Encosta Norte, plantando 10.000 mudas nativas em áreas degradadas.',
        category: 'Meio Ambiente',
        goal_amount: 20000,
        raised_amount: 16000,
        is_urgent: true,
        percentage_complete: 80,
        donor_count: 324,
        icon: 'park',
        ong_id: ong1Id,
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      },
      {
        title: 'Cozinha Solidária Comunitária',
        description: 'Alimentando famílias em vulnerabilidade com refeições nutritivas e gratuitas em comunidades de baixa renda.',
        category: 'Social',
        goal_amount: 15000,
        raised_amount: 8750,
        is_urgent: true,
        percentage_complete: 58,
        donor_count: 186,
        icon: 'restaurant',
        ong_id: ong7Id,
        image_url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
      },
      {
        title: 'Patrulhas Florestais de Emergência',
        description: 'Protegendo tigres de Sumatra com patrulhas especializadas contra caça ilegal e desmatamento.',
        category: 'Causa Animal',
        goal_amount: 50000,
        raised_amount: 31500,
        is_urgent: false,
        percentage_complete: 63,
        donor_count: 412,
        icon: 'pets',
        ong_id: ong5Id,
        image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
      },
      {
        title: 'Filtros de Microplásticos',
        description: 'Instalação de filtros avançados para proteger recifes de coral da contaminação por microplásticos.',
        category: 'Meio Ambiente',
        goal_amount: 35000,
        raised_amount: 12250,
        is_urgent: false,
        percentage_complete: 35,
        donor_count: 189,
        icon: 'water_drop',
        ong_id: ong6Id,
        image_url: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80',
      },
      {
        title: '1 Milhão de Árvores',
        description: 'Projeto ambicioso de plantar 1 milhão de árvores no corredor ecológico amazônico para combater o desmatamento.',
        category: 'Meio Ambiente',
        goal_amount: 100000,
        raised_amount: 67000,
        is_urgent: true,
        percentage_complete: 67,
        donor_count: 856,
        icon: 'forest',
        ong_id: ong5Id,
        image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80',
      },
      {
        title: 'Raízes da Mudança',
        description: 'Apoio a viveiros comunitários costeiros, combatendo a erosão e gerando renda local sustentável.',
        category: 'Social',
        goal_amount: 25000,
        raised_amount: 9750,
        is_urgent: false,
        percentage_complete: 39,
        donor_count: 142,
        icon: 'eco',
        ong_id: ong1Id,
        image_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      },
      {
        title: 'Patas e Abrigo Esperança',
        description: 'Ração e atendimento veterinário para animais resgatados em abrigos comunitários.',
        category: 'Causa Animal',
        goal_amount: 18000,
        raised_amount: 11700,
        is_urgent: true,
        percentage_complete: 65,
        donor_count: 298,
        icon: 'pets',
        ong_id: ong2Id,
        image_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
      },
      {
        title: 'Acesso Global de Saúde',
        description: 'Fornecimento de medicamentos essenciais e kits de diagnóstico para comunidades rurais sem acesso à saúde.',
        category: 'Saúde',
        goal_amount: 45000,
        raised_amount: 28800,
        is_urgent: false,
        percentage_complete: 64,
        donor_count: 521,
        icon: 'medical_services',
        ong_id: ong3Id,
        image_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
      },
      {
        title: 'Pequenos Estudantes Intl',
        description: 'Material escolar e acesso digital para crianças em situação de vulnerabilidade educacional.',
        category: 'Educação',
        goal_amount: 30000,
        raised_amount: 18900,
        is_urgent: false,
        percentage_complete: 63,
        donor_count: 367,
        icon: 'school',
        ong_id: ong4Id,
        image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      },
    ];

    for (const c of campaigns) {
      await client.query(
        `INSERT INTO campaigns (title, description, category, goal_amount, raised_amount, image_url, icon, ong_id, is_urgent, is_public, percentage_complete, donor_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [c.title, c.description, c.category, c.goal_amount, c.raised_amount, c.image_url, c.icon, c.ong_id, c.is_urgent, true, c.percentage_complete, c.donor_count]
      );
    }

    console.log(`✅ ${campaigns.length} campaigns seeded`);

    // Create some donations for the donor
    const campaignRows = await client.query('SELECT id, title FROM campaigns LIMIT 3');
    const sampleDonations = [
      { amount: 250, campaign_id: campaignRows.rows[0]?.id, payment_method: 'pix', transaction_id: '#AO-4920001', impact_text: 'Esta doação permitirá o plantio de 42 mudas nativas.' },
      { amount: 100, campaign_id: campaignRows.rows[1]?.id, payment_method: 'cartao', transaction_id: '#AO-4811002', impact_text: 'Esta doação garantirá 27 refeições nutritivas.' },
      { amount: 500, campaign_id: campaignRows.rows[2]?.id, payment_method: 'pix', transaction_id: '#AO-4765003', impact_text: 'Esta doação financiará 5 dias de patrulha especializada.' },
    ];

    for (const d of sampleDonations) {
      if (d.campaign_id) {
        await client.query(
          `INSERT INTO donations (amount, payment_method, user_id, campaign_id, transaction_id, impact_text)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [d.amount, d.payment_method, donorId, d.campaign_id, d.transaction_id, d.impact_text]
        );
      }
    }

    console.log('✅ Sample donations seeded');
    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────────');
    console.log('ONG Login (any ONG): contato@raizesverdes.org.br / ong123456');
    console.log('Donor Login: doador@allongs.com / doador123456');
    console.log('─────────────────────────────────────');

  } catch (err: any) {
    console.error('Seed error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
