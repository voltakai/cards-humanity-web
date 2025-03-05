import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import ProtectedRoute from './components/ProtectedRoute';
import GameLobby from './components/GameLobby';
import GameRoom from './components/GameRoom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <div className="app-container">
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<GameLobby />} />
                <Route path="/game/:gameId" element={<GameRoom />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 