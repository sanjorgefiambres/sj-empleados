import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import sanctionRoutes from "./routes/sanctionRoutes.js";
import payslipRoutes from "./routes/payslipRoutes.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use("/api/empleados", employeeRoutes);
app.use("/api/asistencias", attendanceRoutes);
app.use("/api/sanciones", sanctionRoutes);
app.use("/api/recibos", payslipRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend corriendo en puerto ${PORT}`));
