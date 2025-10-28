import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // carga las variables del archivo .env

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necesario para Railway
  },
});

pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL en Railway');
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión con la base de datos:', err);
});

export default pool;
