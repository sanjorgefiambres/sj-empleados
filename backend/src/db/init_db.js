/**
 * Script simple para crear tablas y seed inicial
 * Ejecutar: node src/db/init_db.js
 */

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();
    console.log("Conectado a PostgreSQL ✅");

    // ==========================
    // Crear tablas
    // ==========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150),
        phone VARCHAR(50),
        dni VARCHAR(20),
        position VARCHAR(100),
        hired_at DATE DEFAULT CURRENT_DATE,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL,
        late_minutes INT DEFAULT 0,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(employee_id, date)
      );

      CREATE TABLE IF NOT EXISTS attendance_flags (
        id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        lost_presentismo BOOLEAN DEFAULT FALSE,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(employee_id, period_start, period_end)
      );

      CREATE TABLE IF NOT EXISTS sanctions (
        id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        type VARCHAR(50) NOT NULL,
        reason TEXT,
        duration_days INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS payslips (
        id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        gross NUMERIC(12,2) NOT NULL DEFAULT 0,
        net NUMERIC(12,2) NOT NULL DEFAULT 0,
        file_path VARCHAR(255),
        signed BOOLEAN DEFAULT FALSE,
        signed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(employee_id, period_start, period_end)
      );
    `);

    console.log("Tablas creadas ✅");

    // ==========================
    // Seed inicial
    // ==========================
    await client.query(`
      INSERT INTO employees (first_name, last_name, email, phone, dni, position, hired_at)
      VALUES
      ('Juan', 'Pérez', 'juan.perez@email.com', '+549111111111', '12345678', 'Cajero', '2024-01-15'),
      ('María', 'González', 'maria.gonzalez@email.com', '+549122222222', '87654321', 'Repositor', '2024-03-10'),
      ('Carlos', 'Ramírez', 'carlos.ramirez@email.com', '+549133333333', '11223344', 'Encargado', '2023-12-01')
      ON CONFLICT DO NOTHING;

      INSERT INTO sanctions (employee_id, date, type, reason, duration_days)
      VALUES
      (1, '2025-09-15', 'apercibimiento', 'Llegada tarde repetida', 0),
      (2, '2025-09-20', 'suspension', 'Falta injustificada', 2)
      ON CONFLICT DO NOTHING;

      INSERT INTO payslips (employee_id, period_start, period_end, gross, net, file_path, signed)
      VALUES
      (1, '2025-09-01', '2025-09-30', 80000, 72000, 'uploads/payslip_juan_sep2025.pdf', true),
      (2, '2025-09-01', '2025-09-30', 75000, 67500, 'uploads/payslip_maria_sep2025.pdf', true)
      ON CONFLICT DO NOTHING;

      INSERT INTO attendance_flags (employee_id, period_start, period_end, lost_presentismo, reason)
      VALUES
      (3, '2025-09-01', '2025-09-30', TRUE, 'Más de 3 faltas injustificadas')
      ON CONFLICT DO NOTHING;

      INSERT INTO attendance (employee_id, date, status, late_minutes)
      VALUES
      (1, '2025-09-01', 'present', 5),
      (1, '2025-09-02', 'late', 15),
      (2, '2025-09-01', 'absent', 0),
      (3, '2025-09-01', 'present', 0)
      ON CONFLICT DO NOTHING;
    `);

    console.log("Seed inicial insertado ✅");

  } catch (err) {
    console.error("Error ejecutando script:", err);
  } finally {
    await client.end();
    console.log("Conexión cerrada ✅");
  }
}

main();
