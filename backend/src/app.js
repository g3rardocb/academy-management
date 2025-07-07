

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const testDbRoute = require("./routes/testDbRoute");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", testDbRoute);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API del Sistema de Gestión de Cursos Online funcionando");
});

module.exports = app;