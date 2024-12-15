const fetch = require('node-fetch'); // Make sure to install node-fetch if running in Node.js

const testRegistration = async () => {
  const baseUrl = 'https://hirely-task-backend.netlify.app';
  const tasksUrl = `${baseUrl}/api/tasks`;
  const tokenUrl = `${baseUrl}/api/auth/token`;
  
  try {
    // First, get a Firebase ID token
    const tokenResponse = await fetch(tokenUrl);
    if (!tokenResponse.ok) {
      throw new Error(`Failed to get token: ${tokenResponse.statusText}`);
    }
    const { token } = await tokenResponse.json();

    // Now use the token to create a task
    const payload = {
      title: 'Test Task',
      description: 'This is a test task',
      dueDate: '2024-12-15', // Today's date in YYYY-MM-DD format
    };

    const response = await fetch(tasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Task created successfully:', data);
    } else {
      console.error('Error creating task:', data);
      console.error('Status:', response.status);
      console.error('Headers:', response.headers);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Run the test
testRegistration();
