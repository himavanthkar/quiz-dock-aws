const request = require('supertest');
const { app } = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', testUser.username);
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not register user with existing email', async () => {
      await User.create(testUser);

      const res = await request(app)
        .post('/api/users/register')
        .send(testUser)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Invalid credentials');
    });
  });
}); 