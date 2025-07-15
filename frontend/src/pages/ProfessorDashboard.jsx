
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Panel de Profesor</h2>
      <p>Bienvenido, {user.name}.</p>
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Cerrar Sesión
      </button>
    </div>
  );
}
