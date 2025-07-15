// src/pages/CourseFormPage.jsx (Título 2)
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function CourseFormPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();              // undefined = nuevo curso
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [error, setError] = useState('');

  // Si hay id, cargamos datos para edición
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await api.get(`/courses/${id}`);
          setForm(data.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Error cargando curso');
        }
      })();
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/courses/${id}`, form);
      } else {
        await api.post('/courses', form);
      }
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.message);
    }
  };

  if (!user || !['admin','professor'].includes(user.role)) {
    return <p>No tienes permiso para ver esta sección.</p>;
  }

  return (
    <div>
      <h1>{id ? 'Editar Curso' : 'Crear Curso'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Categoría:</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
}
