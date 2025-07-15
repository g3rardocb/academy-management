
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Completa todos los campos.');
      return;
    }
    try {
      await axiosInstance.post('/auth/register', form);
      setError('');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al registrar. Intenta nuevamente.';
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre:</label><br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label><br />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Contraseña:</label><br />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={{ width: '100%' }}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          Registrar
        </button>
      </form>
    </div>
  );
}
