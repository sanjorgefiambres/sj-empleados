import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Empleados from "./pages/Empleados";
import Asistencias from "./pages/Asistencias";
import Sanciones from "./pages/Sanciones";
import Recibos from "./pages/Recibos";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Empleados />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/sanciones" element={<Sanciones />} />
        <Route path="/recibos" element={<Recibos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
