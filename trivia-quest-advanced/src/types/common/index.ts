// Common Types
export interface AppState {
  loading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    warning: string;
    info: string;
    success: string;
  };
}

// Re-export all types for convenience
export * from '../auth';
export * from '../quests';
export * from '../quiz';
export * from '../profile';
export * from '../multiplayer';
export * from '../planetary-system';
