// src/routes/testDbRoute.js

const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      ok: true,
      mensaje: "Conexión exitosa",
      horaServidor: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "Error al conectar", error });
  }
});

module.exports = router;