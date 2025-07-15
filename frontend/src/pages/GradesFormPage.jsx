// src/pages/GradesFormPage.jsx 
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function GradesFormPage() {
  const { user } = useContext(AuthContext);
  const { id: enrollmentId, gradeId } = useParams(); // gradeId solo en edición
  const navigate = useNavigate();
  const [score, setScore] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (gradeId) {
      (async () => {
        try {
          const { data } = await api.get(`/grades/${gradeId}`);
          setScore(data.data.score);
        } catch (err) {
          setError(err.response?.data?.message || 'Error cargando nota');
        }
      })();
    }
  }, [gradeId]);

  if (!user || !['admin','professor'].includes(user.role)) {
    return <p>No tienes permiso para asignar o editar notas.</p>;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { enrollmentId: Number(enrollmentId), score: Number(score) };
      if (gradeId) {
        await api.put(`/grades/${gradeId}`, payload);
      } else {
        await api.post('/grades', payload);
      }
      navigate(`/enrollments/${enrollmentId}/grades`);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h1>{gradeId ? 'Editar Nota' : 'Asignar Nota'} Inscripción #{enrollmentId}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nota (0–100):</label>
          <input
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={e => setScore(e.target.value)}
            required
          />
        </div>
        <button type="submit">{gradeId ? 'Actualizar' : 'Asignar'}</button>
      </form>
      <button onClick={() => navigate(`/enrollments/${enrollmentId}/grades`)}>
        Volver al listado
      </button>
    </div>
  );
}
