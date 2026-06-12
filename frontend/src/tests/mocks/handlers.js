import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api';

export const handlers = [
  http.get(`${API_URL}/dashboard/stats`, () => {
    return HttpResponse.json({
      stats: {
        courses: { total: 10, active: 8, newThisWeek: 2 },
        teachers: { total: 5, withRestrictions: 3, fullTime: 4, partTime: 1 },
        classrooms: { total: 8, available: 6, maintenance: 2 },
        students: { total: 50 },
        generations: { total: 3, successful: 2, thisMonth: 1, successfulThisWeek: 0 },
      },
    });
  }),

  http.get(`${API_URL}/auth/profile`, () => {
    return HttpResponse.json({
      user: { id: '123', name: 'Test User', email: 'test@example.com', role: 'coordinador' },
    });
  }),

  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        message: 'Inicio de sesión exitoso.',
        token: 'mock-token-123',
        user: { id: '123', name: 'Test User', email: 'test@example.com', role: 'coordinador' },
      });
    }
    if (body.email === 'admin@uni.edu' && body.password === 'admin123') {
      return HttpResponse.json({
        message: 'Inicio de sesión exitoso.',
        token: 'admin-token',
        user: { id: '1', name: 'Admin User', email: 'admin@uni.edu', role: 'coordinador' },
      });
    }
    return HttpResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
  }),

  http.get(`${API_URL}/notifications`, () => {
    return HttpResponse.json({
      notifications: [
        { _id: '1', title: 'Test', message: 'Test notification', read: false, type: 'info' },
      ],
      unreadCount: 1,
    });
  }),

  http.get(`${API_URL}/generations`, () => {
    return HttpResponse.json({ generations: [] });
  }),
];

export const errorHandlers = [
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }),

  http.get(`${API_URL}/notifications`, () => {
    return HttpResponse.error();
  }),
];
