import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../services/api";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/empleados`).then((res) => setEmpleados(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1>Empleados</h1>
      <table>
        <thead><tr><th>Nombre</th><th>Puesto</th><th>DNI</th></tr></thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.id}><td>{e.nombre}</td><td>{e.puesto}</td><td>{e.dni}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
