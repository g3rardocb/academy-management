// src/pages/GradesListPage.jsx 
import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function GradesListPage() {
  const { user } = useContext(AuthContext);
  const { id: enrollmentId } = useParams(); // Listar notas de esta inscripción
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/grades?enrollmentId=${enrollmentId}`);
        setGrades(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error cargando calificaciones');
      }
    })();
  }, [enrollmentId]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div>
      <h1>Calificaciones Inscripción #{enrollmentId}</h1>
      {user && ['admin','professor'].includes(user.role) && (
        <Link to={`/enrollments/${enrollmentId}/grades/new`}>
          <button>Asignar Nota</button>
        </Link>
      )}
      <ul>
        {grades.map(g => (
          <li key={g.id}>
            Nota: {g.score} — Fecha: {new Date(g.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <button onClick={() => window.history.back()}>Volver</button>
    </div>
  );
}
