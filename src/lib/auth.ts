import { mockAuth } from './mock/services';

export async function signUp(email: string, password: string) {
  return mockAuth.signUp(email, password);
}

export async function signIn(email: string, password: string) {
  return mockAuth.signIn(email, password);
}

export async function signOut() {
  return mockAuth.signOut();
}

export async function resetPassword(email: string) {
  // Mock implementation - just return a resolved promise
  return Promise.resolve();
}

export async function signInWithGoogle() {
  // Mock Google sign in - use admin account for testing
  return mockAuth.signIn('sensaflora@gmail.com', 'admin123');
}