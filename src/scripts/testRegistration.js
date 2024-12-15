const fetch = require('node-fetch'); // Make sure to install node-fetch if running in Node.js
const { getAuth } = require('firebase-admin/auth');
const { initializeApp, cert } = require('firebase-admin/app');
const serviceAccount = require('c:/Users/kcvon/Documents/proj/React/hireley/hirely-firebase.json'); // Updated with the correct path

initializeApp({
  credential: cert(serviceAccount),
});

const testRegistration = async () => {
  const baseUrl = 'https://hirely-task-backend.netlify.app';
  const tasksUrl = `${baseUrl}/api/tasks`;
  
  try {
    // Create a custom token for the test user
    const uid = 'test-user-123';
    const customToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTczNDI3OTgyNywiZXhwIjoxNzM0MjgzNDI3LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay14ZXhvY0BoaXJlbHktMmMyMzUuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay14ZXhvY0BoaXJlbHktMmMyMzUuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIn0.Nmh1-j8BKOErieTORvOYxQNXVijEFuYXZKb5458AJsf3lhXeJ9NrAGBe9z_xeQaz49ksEP65OJKSPiGbuEiXgvSMnizBvy2vBw_B8pVulN6Y3kz9ub-ZYSEtaLTf6HI7lJFu83DVJmKuuh7YXSoSigcopCKD4L-33eb971_pBoVorMk4Szb9-5wpTLkuLQ3dzVVEg9Zq97PAuIO8by23SMzQ84BaMo6fJssM7HdPpq_9pXoqDvjsaUJxIkmWOfpOC_64NVlR78vRr4YjezJeS1pkg3V6M9zIBL8q2mU-KhGvCjDpPfVL-bHVrQf1kfzbGwQJcCy-bxVxPLdH0ZV4rw';

    // Now use the custom token to create a task
    const payload = {
      title: 'Test Task',
      description: 'This is a test task',
      dueDate: '2024-12-15', // Today's date in YYYY-MM-DD format
    };

    const response = await fetch(tasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customToken}`,
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating task:', errorText);
      console.error('Status:', response.status);
      return;
    }

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
