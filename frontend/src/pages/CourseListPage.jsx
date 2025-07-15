// src/pages/CourseListPage.jsx (Título 2)
import { useEffect, useState } from 'react';
import api from '../api/api';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error cargando cursos');
      }
    })();
  }, []);

  if (error) return <div>{error}</div>;
  return (
    <div>
      <h1>Listado de Cursos</h1>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.name} – {c.category}</li>
        ))}
      </ul>
    </div>
  );
}
