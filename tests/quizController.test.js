const request = require('supertest');
const app = require('../app');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('Quiz Controller Tests', () => {
  let token;
  let user;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    
    // Create test user and generate token
    user = await User.create({
      username: 'quizmaster',
      email: 'quiz@example.com',
      password: 'password123'
    });
    
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await Quiz.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Quiz.deleteMany({});
  });

  describe('POST /api/quizzes', () => {
    it('should create a new quiz', async () => {
      const quizData = {
        title: 'Test Quiz',
        description: 'A test quiz',
        questions: [
          {
            text: 'What is 1+1?',
            options: ['1', '2', '3', '4'],
            correctAnswer: 1
          }
        ]
      };

      const res = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${token}`)
        .send(quizData);

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('title', 'Test Quiz');
      expect(res.body.data.user).toBe(user._id.toString());
    });

    it('should not create quiz without authentication', async () => {
      const res = await request(app)
        .post('/api/quizzes')
        .send({
          title: 'Test Quiz',
          description: 'A test quiz',
          questions: []
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/quizzes', () => {
    beforeEach(async () => {
      // Create some test quizzes
      await Quiz.create([
        {
          title: 'Quiz 1',
          description: 'First quiz',
          user: user._id,
          questions: []
        },
        {
          title: 'Quiz 2',
          description: 'Second quiz',
          user: user._id,
          questions: []
        }
      ]);
    });

    it('should get all quizzes', async () => {
      const res = await request(app)
        .get('/api/quizzes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should filter quizzes by title', async () => {
      const res = await request(app)
        .get('/api/quizzes')
        .query({ title: 'Quiz 1' })
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Quiz 1');
    });
  });
}); 