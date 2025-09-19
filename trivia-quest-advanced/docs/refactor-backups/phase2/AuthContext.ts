import React from 'react';
import { AuthContextType } from './AuthContextValue.ts';

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);