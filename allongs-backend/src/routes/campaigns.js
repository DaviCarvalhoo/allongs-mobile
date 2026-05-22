const express = require('express');
const { pool } = require('../database');
const { authMiddleware, ongOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/campaigns — List all campaigns (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    let query = `
      SELECT c.*, u.name as ong_name, u.org_name
      FROM campaigns c
      LEFT JOIN users u ON c.ong_id = u.id
      WHERE c.is_public = TRUE
    `;
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND LOWER(c.category) = LOWER($${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (LOWER(c.title) LIKE LOWER($${paramIndex}) OR LOWER(c.description) LIKE LOWER($${paramIndex}) OR LOWER(c.category) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('List campaigns error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/campaigns/featured — Featured campaigns
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as ong_name, u.org_name
      FROM campaigns c
      LEFT JOIN users u ON c.ong_id = u.id
      WHERE c.is_public = TRUE
      ORDER BY c.raised_amount DESC
      LIMIT 4
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Featured campaigns error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/campaigns/urgent — Urgent campaigns
router.get('/urgent', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as ong_name, u.org_name
      FROM campaigns c
      LEFT JOIN users u ON c.ong_id = u.id
      WHERE c.is_urgent = TRUE AND c.is_public = TRUE
      ORDER BY c.created_at DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Urgent campaigns error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/campaigns/my — ONG's own campaigns
router.get('/my', authMiddleware, ongOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM campaigns WHERE ong_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('My campaigns error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/campaigns/:id — Campaign details
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as ong_name, u.org_name, u.org_description, u.org_since, u.avatar_url as ong_avatar
      FROM campaigns c
      LEFT JOIN users u ON c.ong_id = u.id
      WHERE c.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Campaign detail error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/campaigns — Create new campaign (ONG only)
router.post('/', authMiddleware, ongOnly, async (req, res) => {
  try {
    const { title, description, category, goal_amount, image_url, is_urgent, is_public } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const result = await pool.query(
      `INSERT INTO campaigns (title, description, category, goal_amount, image_url, ong_id, is_urgent, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description || null, category || null, goal_amount || 0, image_url || null, req.userId, is_urgent || false, is_public !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
