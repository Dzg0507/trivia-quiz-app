import { User } from 'firebase/auth';

export interface AuthContextType {
  currentUser: User | null; // TODO: Define a proper User type
  login: (user: User) => void;
  logout: () => void;
}
