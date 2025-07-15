// src/__tests__/ProtectedRoute.test.jsx (Título 2)
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Import Jest globals for environments that require explicit imports
import { describe, it, expect } from '@jest/globals';

function renderProtected(initialEntries, userValue) {
  return render(
    <AuthContext.Provider value={userValue}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          {/* Ruta protegida que renderiza <div>OK</div> si pasa */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/protected" element={<div>OK</div>} />
          </Route>
          {/* Rutas de login y home para verificar redirección */}
          <Route path="/login" element={<div>LOGIN PAGE</div>} />
          <Route path="/" element={<div>HOME PAGE</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('ProtectedRoute', () => {
  it('redirige a /login si no hay usuario', () => {
    renderProtected(['/protected'], { user: null });
    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
  });

  it('redirige a / si el usuario no tiene el rol permitido', () => {
    renderProtected(['/protected'], { user: { role: 'student' } });
    expect(screen.getByText('HOME PAGE')).toBeInTheDocument();
  });

  it('muestra el contenido protegido si el usuario tiene rol admin', () => {
    renderProtected(['/protected'], { user: { role: 'admin' } });
    expect(screen.getByText('OK')).toBeInTheDocument();
  });
});
