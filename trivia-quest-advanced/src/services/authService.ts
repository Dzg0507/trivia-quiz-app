import { auth } from '../firebase.ts';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

export const authService = {
  signup: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, message: 'Signup successful!', user: userCredential.user };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  },

  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, message: 'Login successful!', user: userCredential.user };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  },

  logout: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      await signOut(auth);
      return { success: true, message: 'Logout successful!' };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },
};