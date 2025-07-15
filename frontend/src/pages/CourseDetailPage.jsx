// src/pages/CourseDetailPage.jsx (Título 2)
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function CourseDetailPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error cargando curso');
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este curso?')) return;
    try {
      await api.delete(`/courses/${id}`);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Error eliminando curso');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!course) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Detalle Curso</h1>
      <p><strong>Nombre:</strong> {course.name}</p>
      <p><strong>Categoría:</strong> {course.category}</p>
      <p><strong>Descripción:</strong> {course.description}</p>

      {/* Botones según rol */}
      {user && ['admin', 'professor'].includes(user.role) && (
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/courses/${id}/edit`}>
            <button>Editar</button>
          </Link>
          <button onClick={handleDelete} style={{ marginLeft: '0.5rem' }}>
            Eliminar
          </button>
        </div>
      )}
      <button onClick={() => navigate('/courses')} style={{ marginTop: '1rem' }}>
        Volver al listado
      </button>
    </div>
  );
}
