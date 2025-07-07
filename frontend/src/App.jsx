import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/student/dashboard" element={<StudentDashboard />} />
  <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;
