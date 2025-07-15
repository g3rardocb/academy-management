import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import CourseFormPage from '../pages/CourseFormPage';

// Jest globals (if needed for linting)
/* global describe, it, expect */

// Mock de ruta /courses/new
function renderWithRouter(ui, { route = '/courses/new' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <AuthContext.Provider value={{ user: { role: 'admin' } }}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/courses/new" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('CourseFormPage', () => {
  it('permite crear un curso y navega al listado', async () => {
    renderWithRouter(<CourseFormPage />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'History' } });
    fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Arts' } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Desc' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear/i }));

    // Como usamos MSW, no habrá error y la función navigate será invocada sin crashear.
    await waitFor(() => {
      expect(window.location.pathname).toBe('/courses');
    });
  });
});