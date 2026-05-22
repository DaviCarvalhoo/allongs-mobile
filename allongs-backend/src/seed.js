const bcrypt = require('bcryptjs');
const { pool, initDatabase } = require('./database');
require('dotenv').config();

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

    // Create ONG user
    const ongPassword = await bcrypt.hash('ong123456', 10);
    const ongResult = await client.query(
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
    const ongId = ongResult.rows[0].id;

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

    console.log('👤 Users created');

    // Create campaigns from HTML data
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xp8ZVu7hVxdYVkafBGlU2GKl9MQbNFkLCBpTJAowH2G1KpU8bCkHwAI8x4EcKlnqDhRYQpIYOMvpvd90lbWx84Fb3zYbbzx83a3f5tDBp43M0fTfS3y_0eFefq8TIp8sQfTT4jqt7VFPJ2wQe-v86JwMFBLHSFJqFu1xIFvIlzGMKJl4r3Sk8_5PEMJEDUEltRxJvzJqWS5IpZ7-NYBKdSJpX6Y2eTcQOewW-RlTy4j0qhKIYwL8z-W1iCxj1BK8S8KK5pYg',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpVj8Ae5Y5XSFaWfYsJl9mRwcC-uPpJT3K1SaNqfMSj-K0MfDWcQ1wXoM56A_LVhTbgTgz5fNaL9kpkQFXMUHqIh3RRk8lqkJLIaLK9wuGpPMHkfDjA1pvhwcYGmfPEI5e3LI8kqN4UeZTWx0TU-y4-_H_vwpWcUJCjrQGm2LVpBJ7TkC90w3dI07xpmfXoiAz1FfxTg_n5oZ2_d5EHd-VH7MZzD8eDt8hFCFmFkj7fVcfxHZlsQk6fE2Vr',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPwcydoYf7h58o3U3oMGaXUjQMNNhKGmGbN84N2gxvnWDIUijINh8gE-wQRvmPLLsNlBvOXDPYDxf2OPkuVHNF0lzUYlk2Rx4w6sFCuPDH3HJFaqjVb_Q6WaGd5YFVe_9_Z9zDDOBjrqGnb91xyJHdqlC0w6DQMXswjXsHYr_YF9S2q-VTDnmRQ4Vr1WqgIR-4TA',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHGo5HOzsJjqGpUCD4TpDpzxKmh7HgtDi5CM1h1NOdC841Y-EdUVFEVZbVha4UvAeSr6gosiVLIV2ygOduHVB4fjfm8vajTIed76ZM_9Lidpi3CL57fPp7U5IWvcHZ1fyUSU6yAGM_lqSNWHthVPlUHFquhKA-Ue0RV4nDdKmyjIZynLC9UwO9KVmvsJLYBTA1yXrdc7gzztKuSScxfF6xmIiqsFq3x_hfdFc08QLhDRbT8ArHj2nA3MJlmDkKiroNHuGdZcDMAw',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xp8ZVu7hVxdYVkafBGlU2GKl9MQbNFkLCBpTJAowH2G1KpU8bCkHwAI8x4EcKlnqDhRYQpIYOMvpvd90lbWx84Fb3zYbbzx83a3f5tDBp43M0fTfS3y_0eFefq8TIp8sQfTT4jqt7VFPJ2wQe-v86JwMFBLHSFJqFu1xIFvIlzGMKJl4r3Sk8_5PEMJEDUEltRxJvzJqWS5IpZ7-NYBKdSJpX6Y2eTcQOewW-RlTy4j0qhKIYwL8z-W1iCxj1BK8S8KK5pYg',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnbH6U65elujI0EeCoTehN_5V1TZCmpJgXwb3H-f7Vwfj-Df8Thqn-XUvE3rF8e4HUsJ3Bl4h2k1BcGG1th7Ftr0X_GgocDaBXLYGxbVe1YyEwWsiPhF_Y6usN5tIHbShKq-2aCIIS2WWp5hE5uJYI-ftOxsREN0TLbBTnkUPulYVp52lacH_n11HSl7KST5fxvIybwVKo5SPN9hUUxfXkE5RXMQdRAZraC2gjjZQ2fCeQkjtLMXuXaCmG24RDTNXplPgmHWkM_Q',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMqlvMu5wqRP3SMtyjraWZgaUamUvf1UF36okH--z33BinFC8RloSdxkMA1tsMRHQHtcI8R7dNWVX2-8r-AQcbcICePpsf6JA9cqLvaD6kFS2lKKAZL7caC-DuQL0LqSVpvREYAWtBDKLkIbS9qG-kYTORA8tPCJgCx7DtSMa1osyz-Fn1mJcg6xHKhzorTBFMW5l7k9VlQj-Xv-P89BJrSK7Gb7csnAAfNyfQYuU2le9o1QfGJZ445Wu4JUk-l2CVBuh713p70w',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRSmK8h2OL8lL55ots-mwmImc6bfpSFo-fVIxWMROHQry8sb8DvRzO6F4LXMlh5NU9Pj4KrnzjpVa4fkXqIkfMP87JLZt7C3ptGlwiHwT0nvzs-2capEmjbguOYxrRdvqsq6mmAR1_GbNLpmdCkjPlsq-TWHRO6KKd-0mvU87g0FB58th6TIh-M15iBl8h2shAYjva0dKWu4HbDnPRrh31-qkSLSed0nqi2Gk1Kreb-Y9nmvX66ImT6Uea22zXgDAYLdnJ1vb5pg',
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
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgSYcuhM0VROLeIfjJ9EK8gNa-PlmPNdsAiFpQc_WNe6QFfyMD1q4F8GoWPgF7jtAbZ0sI7l7B-5LNokzzu-PwJZvrAEpNFwjExxu5AEBXjf-B8gl49wiknleoMacohPae7uGDNouzC8sB32Szq6yWO64W-CqlDYD0Z3zu6yJLT_6Q3bplYEjXvZ3NAcm-etbkjJQ5fax6HfpyddVRkXoT3NpZ2e7zv4cSA_Vpz5BrvrQYUtO0nDBICLQlyYffzfYg_MupcvkiQ',
      },
    ];

    for (const c of campaigns) {
      await client.query(
        `INSERT INTO campaigns (title, description, category, goal_amount, raised_amount, image_url, icon, ong_id, is_urgent, is_public, percentage_complete, donor_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [c.title, c.description, c.category, c.goal_amount, c.raised_amount, c.image_url, c.icon, ongId, c.is_urgent, true, c.percentage_complete, c.donor_count]
      );
    }

    console.log(`🌱 ${campaigns.length} campaigns seeded`);

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

    console.log('💸 Sample donations seeded');
    console.log('\n✅ Seed complete!');
    console.log('📧 ONG Login: contato@raizesverdes.org.br / ong123456');
    console.log('📧 Donor Login: doador@allongs.com / doador123456');

  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
