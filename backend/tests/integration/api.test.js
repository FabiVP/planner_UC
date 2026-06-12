const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  app = require('../../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe('API Integration Tests', () => {
  let authToken;

  describe('GET /api/health', () => {
    test('Debe retornar health check exitoso', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('database');
      expect(res.body.database).toHaveProperty('state');
    });
  });

  describe('GET /api/sustainability', () => {
    test('Debe retornar métricas de sostenibilidad', async () => {
      const res = await request(app).get('/api/sustainability');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalRequests');
    });
  });

  describe('POST /api/auth/register', () => {
    test('Debe registrar un nuevo usuario', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@test.com', password: 'password123', role: 'coordinador' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('test@test.com');
      authToken = res.body.token;
    });

    test('Debe rechazar registro duplicado', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@test.com', password: 'password123', role: 'coordinador' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    test('Debe autenticar con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('Debe rechazar credenciales inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/profile', () => {
    test('Debe retornar perfil con token válido', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    test('Debe rechazar acceso sin token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('CRUD /api/courses', () => {
    let courseId;

    test('POST /api/courses - Debe crear un curso', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'CS101',
          name: 'Introducción',
          credits: 4,
          type: 'teorico',
          semester: 1,
          sessionsPerWeek: 2,
          hoursPerSession: 2,
          mandatory: true,
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('course');
      courseId = res.body.course._id;
    });

    test('GET /api/courses - Debe listar cursos', async () => {
      const res = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('courses');
      expect(Array.isArray(res.body.courses)).toBe(true);
    });

    test('GET /api/courses/:id - Debe obtener curso por ID', async () => {
      const res = await request(app)
        .get(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('code', 'CS101');
    });

    test('PUT /api/courses/:id - Debe actualizar curso', async () => {
      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'CS101', name: 'Introducción Actualizada', credits: 4, type: 'teorico', semester: 1 });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Curso actualizado.');
    });

    test('DELETE /api/courses/:id - Debe eliminar curso', async () => {
      const res = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Curso eliminado.');
    });

    test('GET /api/courses/:id - Debe retornar 404 para curso eliminado', async () => {
      const res = await request(app)
        .get(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/not-found', () => {
    test('Debe retornar 404 para rutas inexistentes', async () => {
      const res = await request(app).get('/api/not-found');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/teachers', () => {
    test('Debe acceder con autenticación', async () => {
      const res = await request(app)
        .get('/api/teachers')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
    });

    test('Debe rechazar sin autenticación', async () => {
      const res = await request(app).get('/api/teachers');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/students', () => {
    test('Debe acceder con autenticación', async () => {
      const res = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
    });

    test('Debe rechazar sin autenticación', async () => {
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/classrooms', () => {
    test('Debe acceder con autenticación', async () => {
      const res = await request(app)
        .get('/api/classrooms')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
    });
  });
});
