// src/__tests__/GradesListPage.test.jsx (Título 2)
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import GradesListPage from '../pages/GradesListPage';
import { rest } from 'msw';
import { server } from '../mocks/server';
import { describe, it, expect } from '@jest/globals';

const API_URL = 'http://localhost:3000/api';

describe('GradesListPage', () => {
  const enrollmentId = 12;
  const route = `/enrollments/${enrollmentId}/grades`;

  it('muestra las calificaciones obtenidas del API', async () => {
    server.use(
      rest.get(`${API_URL}/grades`, (req, res, ctx) => {
        expect(req.url.searchParams.get('enrollmentId')).toBe(String(enrollmentId));
        return res(
          ctx.status(200),
          ctx.json({ success: true, data: [
            { id: 3, score: 85, createdAt: '2025-07-05T00:00:00Z' }
          ] })
        );
      })
    );

    render(
      <AuthContext.Provider value={{ user: { role: 'student' } }}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/enrollments/:id/grades" element={<GradesListPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(`Calificaciones Inscripción #${enrollmentId}`)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Nota: 85/)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si falla la carga', async () => {
    server.use(
      rest.get(`${API_URL}/grades`, (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ message: 'Fallo servidor' }))
      )
    );

    render(
      <AuthContext.Provider value={{ user: { role: 'professor' } }}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/enrollments/:id/grades" element={<GradesListPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error cargando calificaciones')).toBeInTheDocument();
    });
  });
});
