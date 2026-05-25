import express, { Request, Response } from 'express';
import { pool } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// GET /api/users/profile
router.get('/profile', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, user_type, avatar_url, org_name, org_description, org_since, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/users/profile
router.put('/profile', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, avatar_url, org_name, org_description } = req.body;

    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        avatar_url = COALESCE($2, avatar_url),
        org_name = COALESCE($3, org_name),
        org_description = COALESCE($4, org_description)
      WHERE id = $5
      RETURNING id, name, email, user_type, avatar_url, org_name, org_description, org_since, created_at`,
      [name, avatar_url, org_name, org_description, req.userId]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
