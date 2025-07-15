// src/config/db.js

// src/config/db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT,
  max:                 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

module.exports = pool; // exporta la instancia, no un objeto con pool


