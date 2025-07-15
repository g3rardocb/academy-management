// src/tests/authService.test.js

jest.mock('../models/userModel', () => ({
  getUserByEmail: jest.fn(),
  createUser:     jest.fn()
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const userModel = require('../models/userModel');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const { register, login } = require('../services/authService');



describe('AuthService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('login lanza error si usuario no existe', async () => {
    userModel.getUserByEmail.mockResolvedValue(null);
    await expect(login('x','y')).rejects.toThrow('Credenciales inválidas');
  });

  test('login lanza error si usuario no existe', async () => {
    userModel.getUserByEmail.mockResolvedValue(null);
    await expect(login('x','y')).rejects.toThrow('Credenciales inválidas');
  });

  test('login lanza error si contraseña no coincide', async () => {
    userModel.getUserByEmail.mockResolvedValue({ password:'hash' });
    bcrypt.compare.mockResolvedValue(false);
    await expect(login('x','y')).rejects.toThrow('Credenciales inválidas');
  });

  test('login retorna token válido', async () => {
    userModel.getUserByEmail.mockResolvedValue({ id:2, role:'admin', password:'hash' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('tokentest');
    const token = await login('e','p');
    expect(jwt.sign).toHaveBeenCalledWith({ id:2, role:'admin' }, process.env.JWT_SECRET, { expiresIn:'8h' });
    expect(token).toBe('tokentest');
  });

  // A continuación agregarías al menos 6 tests más para cubrir casos extremos,
  // validación de roles, expiración de token, etc., hasta llegar a 10 tests mínimos.
});
