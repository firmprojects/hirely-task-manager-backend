import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Missing FIREBASE_PROJECT_ID');
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Missing FIREBASE_CLIENT_EMAIL');
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Missing FIREBASE_PRIVATE_KEY');
}

// Initialize Firebase Admin only if it hasn't been initialized
const app = !getApps().length
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  : getApps()[0];

export const auth = getAuth(app);

// Export a function to create a user (for use in API routes)
export const createUser = async (id: string, email: string, name: string) => {
  const user = await auth.createUser({
    uid: id,
    email,
    displayName: name,
  });
  return user;
};
