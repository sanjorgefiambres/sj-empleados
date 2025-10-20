# 🧾 SJ - Gestor de Empleados (sj-empleados)

Proyecto **sj-empleados** — sistema de gestión de empleados para supermercados (React + Node + PostgreSQL).
Repositorio pensado para deploy en Railway y versionado en GitHub: `sanjorgefiambres/sj-empleados`.

Resumen de contenido:
- Backend: Express, notificaciones (email/WhatsApp via Nodemailer/Twilio), script `npm run setup` para crear tablas + seed.
- Frontend: React (Vite) con páginas básicas para empleados, asistencias, sanciones y recibos.
- `.env.example` con variables a completar.
- `init_db.js` en backend para crear la base y poblarla con datos de ejemplo.

## Quickstart local

1. Clonar el repo
```bash
git clone https://github.com/sanjorgefiambres/sj-empleados.git
cd sj-empleados/backend
```

2. Instalar dependencias y ejecutar setup
```bash
npm install
cp .env.example .env
# editar .env con DATABASE_URL y credenciales
npm run setup
npm start
```

3. En otra terminal, levantar frontend
```bash
cd ../frontend
npm install
npm run dev
```

## Deploy en Railway

1. Crear proyecto en Railway y conectar repo `sanjorgefiambres/sj-empleados`.
2. Añadir plugin PostgreSQL y copiar `DATABASE_URL` al set de variables del servicio backend.
3. Agregar variables del `.env.example` en Railway con tus credenciales reales.
4. Crear servicio frontend en Railway (build: `npm install && npm run build`, start: `npm run preview`) y poner `VITE_API_URL` apuntando al backend.
5. Ejecutar `npm run setup` en el backend (Railway Console) para crear tablas y seed.

---
