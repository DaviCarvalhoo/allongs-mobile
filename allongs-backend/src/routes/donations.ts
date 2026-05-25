import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../database';
import { authMiddleware, ongOnly } from '../middleware/auth';

const router = express.Router();

// POST /api/donations — Create donation
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { amount, payment_method, campaign_id } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor de doação inválido' });
    }

    const transactionId = '#AO-' + Math.floor(1000000 + Math.random() * 9000000);

    // Get campaign for impact text
    let impactText = 'Sua doação fará a diferença!';
    if (campaign_id) {
      const campaign = await pool.query('SELECT title, category FROM campaigns WHERE id = $1', [campaign_id]);
      if (campaign.rows.length > 0) {
        const c = campaign.rows[0];
        const impactos: { [key: string]: string } = {
          'Reflorestamento da Encosta Norte': `Esta doação permitirá o plantio de ${Math.floor(amount / 6)} mudas nativas.`,
          'Cozinha Solidária Comunitária': `Esta doação garantirá ${Math.floor(amount / 3.75)} refeições nutritivas.`,
          'Patrulhas Florestais de Emergência': `Esta doação financiará ${Math.floor(amount / 100)} dias de patrulha especializada.`,
          'Filtros de Microplásticos': `Esta doação ajudará a filtrar até ${Math.floor(amount / 12)}kg de microplásticos.`,
          '1 Milhão de Árvores': `Esta doação financiará o plantio de ${Math.floor(amount / 3)} árvores nativas.`,
          'Raízes da Mudança': 'Esta doação apoiará viveiros comunitários costeiros.',
          'Patas e Abrigo Esperança': `Esta doação fornecerá cuidados para ${Math.floor(amount / 20)} animais resgatados.`,
          'Acesso Global de Saúde': `Esta doação fornecerá medicamentos para ${Math.floor(amount / 15)} pacientes.`,
          'Pequenos Estudantes Intl': `Esta doação fornecerá material escolar para ${Math.floor(amount / 25)} crianças.`,
        };
        impactText = impactos[c.title] || impactText;
      }
    }

    const result = await pool.query(
      `INSERT INTO donations (amount, payment_method, user_id, campaign_id, transaction_id, impact_text)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [amount, payment_method || 'pix', req.userId, campaign_id || null, transactionId, impactText]
    );

    // Update campaign raised amount
    if (campaign_id) {
      await pool.query(
        `UPDATE campaigns SET
          raised_amount = raised_amount + $1,
          donor_count = donor_count + 1,
          percentage_complete = LEAST(100, ROUND(((raised_amount + $1) / NULLIF(goal_amount, 0)) * 100))
        WHERE id = $2`,
        [amount, campaign_id]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Create donation error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/donations/history — Donor's donation history
router.get('/history', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query(`
      SELECT d.*, c.title as campaign_title, c.category as campaign_category, c.icon as campaign_icon
      FROM donations d
      LEFT JOIN campaigns c ON d.campaign_id = c.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC
    `, [req.userId]);

    res.json(result.rows);
  } catch (err: any) {
    console.error('Donation history error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/donations/received — ONG's received donations
router.get('/received', authMiddleware, ongOnly, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query(`
      SELECT d.*, c.title as campaign_title, c.category as campaign_category,
             u.name as donor_name
      FROM donations d
      LEFT JOIN campaigns c ON d.campaign_id = c.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE c.ong_id = $1
      ORDER BY d.created_at DESC
    `, [req.userId]);

    res.json(result.rows);
  } catch (err: any) {
    console.error('Received donations error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/donations/stats — Donor stats
router.get('/stats', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const totalResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM donations WHERE user_id = $1',
      [req.userId]
    );

    const campaignsSupported = await pool.query(
      'SELECT COUNT(DISTINCT campaign_id) as count FROM donations WHERE user_id = $1',
      [req.userId]
    );

    res.json({
      total_donated: parseFloat(totalResult.rows[0].total),
      donation_count: parseInt(totalResult.rows[0].count),
      campaigns_supported: parseInt(campaignsSupported.rows[0].count),
    });
  } catch (err: any) {
    console.error('Donation stats error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/donations/ong-stats — ONG stats
router.get('/ong-stats', authMiddleware, ongOnly, async (req: Request, res: Response): Promise<any> => {
  try {
    const raised = await pool.query(`
      SELECT COALESCE(SUM(d.amount), 0) as total, COUNT(d.id) as donation_count
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      WHERE c.ong_id = $1
    `, [req.userId]);

    const donors = await pool.query(`
      SELECT COUNT(DISTINCT d.user_id) as count
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      WHERE c.ong_id = $1
    `, [req.userId]);

    const campaigns = await pool.query(
      'SELECT COUNT(*) as count FROM campaigns WHERE ong_id = $1',
      [req.userId]
    );

    res.json({
      total_raised: parseFloat(raised.rows[0].total),
      donation_count: parseInt(raised.rows[0].donation_count),
      active_donors: parseInt(donors.rows[0].count),
      campaign_count: parseInt(campaigns.rows[0].count),
      social_reach: '15.4k',
    });
  } catch (err: any) {
    console.error('ONG stats error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
