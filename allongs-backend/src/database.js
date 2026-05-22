const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('doador', 'ong')),
        avatar_url TEXT,
        org_name VARCHAR(255),
        org_description TEXT,
        org_since VARCHAR(10),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        goal_amount DECIMAL(12,2) DEFAULT 0,
        raised_amount DECIMAL(12,2) DEFAULT 0,
        image_url TEXT,
        icon VARCHAR(50) DEFAULT 'volunteer_activism',
        ong_id UUID REFERENCES users(id) ON DELETE CASCADE,
        is_urgent BOOLEAN DEFAULT FALSE,
        is_public BOOLEAN DEFAULT TRUE,
        percentage_complete INTEGER DEFAULT 0,
        donor_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        amount DECIMAL(12,2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'pix',
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
        transaction_id VARCHAR(50) NOT NULL,
        impact_text TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS volunteers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        skills TEXT[] DEFAULT '{}',
        availability TEXT[] DEFAULT '{}',
        bio TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Database tables created successfully');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDatabase };
