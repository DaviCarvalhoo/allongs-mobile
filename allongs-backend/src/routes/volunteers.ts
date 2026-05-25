import express, { Request, Response } from 'express';
import { pool } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// POST /api/volunteers — Register as volunteer
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { skills, availability, bio } = req.body;

    // Check if already registered
    const existing = await pool.query('SELECT id FROM volunteers WHERE user_id = $1', [req.userId]);
    if (existing.rows.length > 0) {
      // Update existing
      const result = await pool.query(
        `UPDATE volunteers SET skills = $1, availability = $2, bio = $3 WHERE user_id = $4 RETURNING *`,
        [skills || [], availability || [], bio || null, req.userId]
      );
      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO volunteers (user_id, skills, availability, bio)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, skills || [], availability || [], bio || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Volunteer registration error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
