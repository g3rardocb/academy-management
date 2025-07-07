import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import axiosInstance from '../api/axiosInstance';

export default function LoginPage() {
  const { login } = useAuth();

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
      // Llamada real al backend
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      // Suponiendo que el backend responde con:
      // { user: { ... }, token: '...' }
      const userData = {
        ...response.data.user,
        token: response.data.token
      };

      login(userData);
      setError('');
      alert('¡Login exitoso! Usuario autenticado.');

      // Redireccionar (opcional)
      // navigate("/student/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}
