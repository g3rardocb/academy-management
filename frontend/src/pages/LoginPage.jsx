
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import axiosInstance from '../api/axiosInstance';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const userData = { ...response.data.user, token: response.data.token };
      login(userData);
      setError('');
      // Redirigir según rol
      switch (userData.role) {
        case 'student':
          navigate('/student');
          break;
        case 'professor':
          navigate('/professor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión. Intenta nuevamente.';
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Contraseña:</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
