import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import React, { Suspense, ReactNode } from 'react';
import { appRoutes } from './config/routes';
import { AuthContext } from './context/AuthContext.tsx';
import { User } from 'firebase/auth';

// Mock components to isolate routing logic
vi.mock('./components/QuestWorld', () => ({ default: () => <div>QuestWorld Page</div> }));
vi.mock('./components/Achievements', () => ({ default: () => <div>Achievements Page</div> }));
vi.mock('./components/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('./components/StartScreen', () => ({ default: () => <div>Start Screen</div> }));

// A mock user for testing authenticated routes
const mockUser = { uid: 'test-uid', email: 'test@example.com' } as User;

// Create a mock AuthProvider to wrap our components
const MockAuthProvider = ({ user, children }: { user: User | null; children: ReactNode }) => (
  <AuthContext.Provider value={{ currentUser: user, login: vi.fn(), logout: vi.fn(), loading: false }}>
    {children}
  </AuthContext.Provider>
);

// Custom render function to wrap components with necessary providers
const renderWithProviders = (ui: React.ReactElement, { route = '/', user = null }: { route?: string; user?: User | null } = {}) => {
  return render(
    <MockAuthProvider user={user}>
      <MemoryRouter initialEntries={[route]}>
        <Suspense fallback={<div>Loading...</div>}>
          {ui}
        </Suspense>
      </MemoryRouter>
    </MockAuthProvider>
  );
};

const AppRoutes = () => (
  <Routes>
    {appRoutes.map((routeConfig, index) => (
      <Route key={index} path={routeConfig.path} element={routeConfig.element} />
    ))}
  </Routes>
);

describe('App Routing', () => {
  it('should render the Login page for the /login route', async () => {
    renderWithProviders(<AppRoutes />, { route: '/login' });
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('should render the StartScreen for the root route when a user is authenticated', async () => {
    renderWithProviders(<AppRoutes />, { route: '/', user: mockUser });
    await waitFor(() => {
      expect(screen.getByText('Start Screen')).toBeInTheDocument();
    });
  });

  it('should navigate to the Quests page', async () => {
    renderWithProviders(<AppRoutes />, { route: '/quests', user: mockUser });
    await waitFor(() => {
      expect(screen.getByText('QuestWorld Page')).toBeInTheDocument();
    });
  });

  it('should navigate to the Achievements page', async () => {
    renderWithProviders(<AppRoutes />, { route: '/achievements', user: mockUser });
    await waitFor(() => {
      expect(screen.getByText('Achievements Page')).toBeInTheDocument();
    });
  });
});
