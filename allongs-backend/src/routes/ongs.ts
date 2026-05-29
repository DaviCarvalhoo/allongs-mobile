import express, { Request, Response } from 'express';
import { pool } from '../database';

const router = express.Router();

// GET /api/ongs — List all ONGs with campaign counts and totals
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.org_name,
        u.org_description,
        u.org_since,
        u.avatar_url,
        u.created_at,
        COUNT(c.id) as campaign_count,
        COALESCE(SUM(c.raised_amount), 0) as total_raised,
        COALESCE(SUM(c.donor_count), 0) as total_donors
      FROM users u
      LEFT JOIN campaigns c ON c.ong_id = u.id AND c.is_public = TRUE
      WHERE u.user_type = 'ong'
      GROUP BY u.id
      ORDER BY total_raised DESC
    `);

    res.json(result.rows);
  } catch (err: any) {
    console.error('List ONGs error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/ongs/:id — ONG details with its campaigns
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    // Get ONG info
    const ongResult = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.org_name,
        u.org_description,
        u.org_since,
        u.avatar_url,
        u.created_at
      FROM users u
      WHERE u.id = $1 AND u.user_type = 'ong'
    `, [req.params.id]);

    if (ongResult.rows.length === 0) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    const ong = ongResult.rows[0];

    // Get ONG campaigns
    const campaignsResult = await pool.query(`
      SELECT * FROM campaigns
      WHERE ong_id = $1 AND is_public = TRUE
      ORDER BY created_at DESC
    `, [req.params.id]);

    // Get ONG stats
    const statsResult = await pool.query(`
      SELECT 
        COALESCE(SUM(d.amount), 0) as total_raised,
        COUNT(DISTINCT d.user_id) as total_donors,
        COUNT(d.id) as donation_count
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      WHERE c.ong_id = $1
    `, [req.params.id]);

    res.json({
      ...ong,
      campaigns: campaignsResult.rows,
      stats: {
        total_raised: parseFloat(statsResult.rows[0].total_raised),
        total_donors: parseInt(statsResult.rows[0].total_donors),
        donation_count: parseInt(statsResult.rows[0].donation_count),
        campaign_count: campaignsResult.rows.length,
      }
    });
  } catch (err: any) {
    console.error('ONG detail error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
