// src/__tests__/EnrollmentFormPage.test.jsx (Título 2)
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import EnrollmentFormPage from '../pages/EnrollmentFormPage';
import { rest } from 'msw';
import { server } from '../mocks/server';
import { expect, it, describe } from '@jest/globals';

const API_URL = 'http://localhost:3000/api';

function renderForm(courseId) {
  const route = `/courses/${courseId}/enrollments/new`;
  window.history.pushState({}, 'Test', route);

  return render(
    <AuthContext.Provider value={{ user: { role: 'admin' } }}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path="/courses/:id/enrollments/new"
            element={<EnrollmentFormPage />}
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('EnrollmentFormPage', () => {
  const courseId = 7;

  it('permite enviar formulario y redirige al listado', async () => {
    // Mockear POST exitoso
    server.use(
      rest.post(`${API_URL}/enrollments`, (req, res, ctx) => {
        expect(req.body).toEqual({ courseId, studentId: 15 });
        return res(ctx.status(201), ctx.json({ success: true, data: { id: 99 } }));
      })
    );

    renderForm(courseId);

    fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /Inscribir/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe(`/courses/${courseId}/enrollments`);
    });
  });

  it('muestra validación de error del servidor', async () => {
    server.use(
      rest.post(`${API_URL}/enrollments`, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({ errors: [{ msg: 'studentId invalido' }] }))
      )
    );

    renderForm(courseId);

    fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Inscribir/i }));

    await waitFor(() => {
      expect(screen.getByText('studentId invalido')).toBeInTheDocument();
    });
  });
});
