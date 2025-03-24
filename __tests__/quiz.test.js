const request = require('supertest');
const { app } = require('../server');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

describe('Quiz API', () => {
  let token;
  let user;

  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  const testQuiz = {
    title: 'Test Quiz',
    description: 'A test quiz',
    category: 'general',
    questions: [
      {
        text: 'Test question',
        choices: ['A', 'B', 'C', 'D'],
        rightAnswer: 0,
        points: 10
      }
    ]
  };

  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    await Quiz.deleteMany({});

    // Create test user and get token
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    token = res.body.token;
    user = res.body.user;
  });

  describe('GET /api/quizzes', () => {
    beforeEach(async () => {
      testQuiz.creator = user.id;
      await Quiz.create(testQuiz);
    });

    it('should get all quizzes', async () => {
      const res = await request(app)
        .get('/api/quizzes')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('title', testQuiz.title);
    });
  });

  describe('POST /api/quizzes', () => {
    it('should create a new quiz', async () => {
      const res = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${token}`)
        .send(testQuiz)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', testQuiz.title);
      expect(res.body.data.creator).toBe(user.id);
    });

    it('should not create quiz without auth', async () => {
      const res = await request(app)
        .post('/api/quizzes')
        .send(testQuiz)
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Not authorized');
    });
  });
}); 