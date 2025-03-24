const axios = require('axios');

// Test login with Harry Potter credentials
async function testLogin() {
  try {
    console.log('Testing login with Harry Potter credentials...');
    const response = await axios.post('http://localhost:5001/api/users/login', {
      email: 'harry@hogwarts.edu',
      password: 'gryffindor123'
    });
    console.log('Login successful!');
    console.log('Response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login failed!');
    console.error('Error:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Test getting user profile
async function testGetProfile(token) {
  if (!token) {
    console.log('Skipping profile test because login failed');
    return;
  }
  
  try {
    console.log('\nTesting get profile...');
    const response = await axios.get('http://localhost:5001/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Get profile successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Get profile failed!');
    console.error('Error:', error.response ? error.response.data : error.message);
    
    // Try with the correct endpoint
    try {
      console.log('\nRetrying with correct endpoint...');
      const response = await axios.get('http://localhost:5001/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Get profile successful!');
      console.log('Response:', response.data);
    } catch (retryError) {
      console.error('Retry also failed!');
      console.error('Error:', retryError.response ? retryError.response.data : retryError.message);
    }
  }
}

// Run the tests
async function runTests() {
  const token = await testLogin();
  await testGetProfile(token);
}

runTests(); 