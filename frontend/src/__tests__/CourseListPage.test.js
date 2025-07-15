/* eslint-disable no-undef */
// src/__tests__/CourseListPage.test.js

import React from 'react';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import CourseListPage from '../pages/CourseListPage';

// Mock de axios
jest.mock('axios');

 
describe('CourseListPage', () => {
  it('muestra lista de cursos tras llamada a API', async () => {
    // Mockea la respuesta de axios.get
    axios.get.mockResolvedValue({
      data: { success: true, data: [{ id: 1, name: 'Math', category: 'Sci' }] }
    });

    // Renderiza el componente dentro de contexto y router
    render(
      <AuthContext.Provider value={{ user: { role: 'student' } }}>
        <BrowserRouter>
          <CourseListPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    // findByText combina espera y getByText
    const courseItem = await screen.findByText(/Math\s*–?\s*Sci/i);
     
    expect(courseItem).toBeInTheDocument();
  });
});
