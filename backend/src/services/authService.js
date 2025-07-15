const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../models/userModel');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '8h';

/**
 * Registra un nuevo usuario
 * @param {Object} userData { name, email, password, role }
 * @returns {Promise<Object>} usuario creado (sin password)
 */
async function register({ name, email, password, role }) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await createUser({ name, email, password: hashed, role });
  delete newUser.password;
  return newUser;
}

/**
 * Autentica credenciales y genera JWT
 * @param {String} email
 * @param {String} password
 * @returns {Promise<String>} token JWT
 */
async function login(email, password) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('Credenciales inválidas');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Credenciales inválidas');
  const payload = { id: user.id, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

module.exports = { register, login };