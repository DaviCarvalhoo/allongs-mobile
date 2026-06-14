import { pool, initDatabase } from './database';
import * as dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
dotenv.config();

export async function seed() {
  await initDatabase();

  const client = await pool.connect();
  try {
    // Só roda o seed se o banco estiver vazio
    const userCount = await client.query('SELECT count(*) FROM users');
    if (parseInt(userCount.rows[0].count) > 0) {
      console.log('✨ Database already has data, skipping seed');
      return;
    }

    console.log('🌱 Seeding database from seed.sql...');

    // Carrega o SQL de seed (UTF-8, com dados reais e acentos corretos)
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const sqlPath = join(__dirname, 'seed.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    await client.query(sql);

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────────');
    console.log('ONG Login (any ONG): contato@raizesverdes.org.br / ong123456');
    console.log('Donor Login: doador@allongs.com / doador123456');
    console.log('─────────────────────────────────────');

  } catch (err: any) {
    console.error('Seed error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// @ts-ignore: Deno specific check
if (import.meta.main) {
  seed().then(() => pool.end());
}
