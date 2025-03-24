const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Increase timeout for database operations
jest.setTimeout(30000);

// Connect to the in-memory database before running tests
beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.disconnect(); // Disconnect from any existing connection
    await mongoose.connect(uri);
    console.log('Connected to in-memory database');
  } catch (error) {
    console.error('Error connecting to in-memory database:', error);
    throw error;
  }
});

// Clear all test data after each test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    console.log('Cleared test data');
  } catch (error) {
    console.error('Error clearing test data:', error);
    throw error;
  }
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
    console.log('Closed database connection');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}); 