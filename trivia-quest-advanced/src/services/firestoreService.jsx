import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
export const firestoreService = {
  getUserDocRef: (userId) => doc(db, 'users', userId),
  getUserData: async (userId) => {
    if (!userId) return null;
    const docRef = firestoreService.getUserDocRef(userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },
  setUserData: async (userId, data, merge = true) => {
    if (!userId) return;
    const docRef = firestoreService.getUserDocRef(userId);
    await setDoc(docRef, data, { merge });
  },
  getLeaderboardData: async (topN = 10) => {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, orderBy('points', 'desc'), limit(topN));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
  initializeUserDoc: async (userId, initialData = {}) => {
    const userDocRef = firestoreService.getUserDocRef(userId);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, { achievements: [], points: 0, badges: [], streak: 0, profile: {}, ...initialData }, { merge: true });
    }
  },
};