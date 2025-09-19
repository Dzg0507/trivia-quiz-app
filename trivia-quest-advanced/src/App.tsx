import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
// import { appRoutes } from './config/routes';
// import ProtectedRoute from './components/auth/ProtectedRoute'; // Import ProtectedRoute
import SpaceMenu from './components/planetary-system/SpaceMenu'; // Import SpaceMenu
import './app.css';

// const RoutesComponent = ({ routes }) => {
//   return (
//     <Routes>
//       {routes.map((route, index) => (
//         <Route
//           key={index}
//           path={route.path}
//           element={
//             <ProtectedRoute isProtected={route.protected}>
//               {route.element}
//             </ProtectedRoute>
//           }
//         />
//       ))}
//     </Routes>
//   );
// };

const App = () => {
  return (
    <Router>
      <AppProvider>
        <SpaceMenu /> {/* Render SpaceMenu directly */}
      </AppProvider>
    </Router>
  );
};

export default App;