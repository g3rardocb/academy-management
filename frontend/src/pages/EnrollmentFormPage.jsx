// src/pages/EnrollmentFormPage.jsx (Título 2)
import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function EnrollmentFormPage() {
  const { user } = useContext(AuthContext);
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  if (!user || !['admin','professor'].includes(user.role)) {
    return <p>No tienes permiso para inscribir.</p>;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/enrollments', { courseId: Number(courseId), studentId: Number(studentId) });
      navigate(`/courses/${courseId}/enrollments`);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h1>Inscribir Estudiante al Curso #{courseId}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID:</label>
          <input
            type="number"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Inscribir</button>
      </form>
      <button onClick={() => navigate(`/courses/${courseId}/enrollments`)}>
        Volver al listado
      </button>
    </div>
  );
}
