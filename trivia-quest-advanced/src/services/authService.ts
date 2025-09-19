import { auth, db } from '../firebase.ts';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

export const authService = {
  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        stats: {
          totalQuizzes: 0,
          totalScore: 0,
          bestScore: 0,
          averageAccuracy: 0,
          longestStreak: 0,
          correctAnswers: 0
        },
        profile: {
          avatar: '😊',
          bio: ''
        }
      });
      
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Failed to create account'
      };
    }
  },
  
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Failed to sign in'
      };
    }
  },
  
  async signOut(): Promise<AuthResult> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Failed to sign out'
      };
    }
  },
  
  async getUserProfile(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
};