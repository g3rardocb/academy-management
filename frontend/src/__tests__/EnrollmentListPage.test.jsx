// src/__tests__/EnrollmentListPage.test.jsx 
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import EnrollmentListPage from '../pages/EnrollmentListPage';
import { rest } from 'msw';
import { server } from '../mocks/server';

// Add these imports if your environment does not provide globals
import { describe, it, expect } from '@jest/globals';

const API_URL = 'http://localhost:3000/api';

describe('EnrollmentListPage', () => {
  const courseId = 5;
  const route = `/courses/${courseId}/enrollments`;

  it('muestra las inscripciones obtenidas del API', async () => {
    // Mockear respuesta del endpoint
    server.use(
      rest.get(`${API_URL}/enrollments`, (req, res, ctx) => {
        // Verificar query param
        expect(req.url.searchParams.get('courseId')).toBe(String(courseId));
        return res(
          ctx.status(200),
          ctx.json({ success: true, data: [
            { id: 1, studentId: 10, createdAt: '2025-07-01T00:00:00Z' }
          ] })
        );
      })
    );

    render(
      <AuthContext.Provider value={{ user: { role: 'professor' } }}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/courses/:id/enrollments" element={<EnrollmentListPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(`Inscripciones Curso #${courseId}`)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Estudiante #10/)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si falla la carga', async () => {
    server.use(
      rest.get(`${API_URL}/enrollments`, (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ message: 'Error interno' }))
      )
    );

    render(
      <AuthContext.Provider value={{ user: { role: 'admin' } }}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/courses/:id/enrollments" element={<EnrollmentListPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error cargando inscripciones')).toBeInTheDocument();
    });
  });
});
