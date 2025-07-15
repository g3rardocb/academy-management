// src/pages/EnrollmentListPage.jsx 
import { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, Link } from 'react-router-dom';

export default function EnrollmentListPage() {
  const { user } = useContext(AuthContext);
  const { id: courseId } = useParams(); // Listar inscripciones de este curso
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/enrollments?courseId=${courseId}`);
        setEnrollments(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error cargando inscripciones');
      }
    })();
  }, [courseId]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div>
      <h1>Inscripciones Curso #{courseId}</h1>
      {user && ['admin','professor'].includes(user.role) && (
        <Link to={`/courses/${courseId}/enrollments/new`}>
          <button>Agregar Inscripción</button>
        </Link>
      )}
      <ul>
        {enrollments.map(e => (
          <li key={e.id}>
            Estudiante #{e.studentId} – Inscrito el {new Date(e.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <Link to="/courses">
        <button>Volver a Cursos</button>
      </Link>
    </div>
  );
}
