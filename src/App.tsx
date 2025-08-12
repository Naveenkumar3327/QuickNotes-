import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';

function AppContent() {
  const { state } = useApp();

  return (
    <Router>
      <div className="App">
        {state.user ? <Dashboard /> : <AuthPage />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;