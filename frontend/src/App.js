import React, { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TodoList from './components/TodoList';
import { AuthService } from './services/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  const switchToSignup = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  if (!isAuthenticated) {
    return showLogin ? (
      <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
    ) : (
      <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
    );
  }

  return <TodoList onLogout={handleLogout} />;
}

export default App;
