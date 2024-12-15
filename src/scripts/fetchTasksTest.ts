const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function fetchTasks() {
    try {
        // Fetch all tasks
        const tasks = await prisma.task.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('Tasks fetched successfully:');
        console.log(JSON.stringify(tasks, null, 2));

        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test
fetchTasks()
    .then(() => {
        console.log('Test completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test failed:', error);
        process.exit(1);
    });
