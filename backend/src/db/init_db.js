import pool from "./connection.js";

const createTables = `
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  dni VARCHAR(20),
  puesto VARCHAR(100),
  fecha_ingreso DATE,
  presentismo BOOLEAN DEFAULT true
);
CREATE TABLE IF NOT EXISTS sanctions (
  id SERIAL PRIMARY KEY,
  empleado_id INTEGER REFERENCES employees(id),
  tipo VARCHAR(50),
  motivo TEXT,
  fecha DATE DEFAULT CURRENT_DATE
);
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  empleado_id INTEGER REFERENCES employees(id),
  fecha DATE,
  estado VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS payslips (
  id SERIAL PRIMARY KEY,
  empleado_id INTEGER REFERENCES employees(id),
  mes VARCHAR(20),
  monto NUMERIC,
  firmado BOOLEAN DEFAULT false
);
`;

const seedData = `
INSERT INTO employees (nombre, dni, puesto, fecha_ingreso) VALUES
('Juan Pérez', '12345678', 'Repositor', '2023-01-15'),
('María Gómez', '22345678', 'Cajera', '2022-09-10'),
('Carlos López', '32345678', 'Encargado', '2021-06-05');
`;

const setup = async () => {
  try {
    await pool.query(createTables);
    await pool.query(seedData);
    console.log("✅ Tablas creadas e inicializadas correctamente");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al inicializar la base:", err);
    process.exit(1);
  }
};

setup();
