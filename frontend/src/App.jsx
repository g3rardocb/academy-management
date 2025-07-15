// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CourseListPage from './pages/CourseListPage';
import CourseFormPage from './pages/CourseFormPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import EnrollmentListPage from './pages/EnrollmentListPage';
import EnrollmentFormPage from './pages/EnrollmentFormPage';
import GradesListPage from './pages/GradesListPage';
import GradesFormPage from './pages/GradesFormPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas abiertas */}
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute roles={['admin','professor']} />}>
            <Route path="/courses/new" element={<CourseFormPage />} />
            <Route path="/courses/:id/edit" element={<CourseFormPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<CourseListPage />} />

          {/* Inscripciones */}
          <Route path="/courses/:id/enrollments" element={<EnrollmentListPage />} />
          <Route element={<ProtectedRoute roles={['admin','professor']} />}>
            <Route path="/courses/:id/enrollments/new" element={<EnrollmentFormPage />} />
          </Route>
          <Route path="/enrollments/:id/grades" element={<GradesListPage />} />
          <Route element={<ProtectedRoute roles={['admin','professor']} />}>
          <Route path="/enrollments/:id/grades/new" element={<GradesFormPage />} />
          <Route path="/enrollments/:id/grades/:gradeId/edit" element={<GradesFormPage />} />
  </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
