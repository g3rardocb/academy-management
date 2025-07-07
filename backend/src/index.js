// src/index.js

// Importaciones
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const testDbRoute = require("./routes/testDbRoute");
const pool = require("./config/db");

// Inicializar app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", testDbRoute);

app.get("/", (req, res) => {
  res.send("🚀 API del Sistema de Gestión de Cursos Online funcionando");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(` Servidor corriendo en http://localhost:${port}`);
});
// Importar y usar las rutas de autenticación
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

