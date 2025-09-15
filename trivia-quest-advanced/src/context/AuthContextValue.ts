import { createContext } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null; // TODO: Define a proper User type
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
