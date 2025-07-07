

const pool = require("../config/db").pool;

const createUser = async (name, email, hashedPassword, role) => {
  if (!name || !email || !hashedPassword || !role) {
    throw new Error("Invalid user data");
  }

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `;
  const values = [name, email, hashedPassword, role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail
};