// src/App.jsx
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Navigation from './components/Navigation.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  // Función para manejar el logout
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />
      
      <Routes>
        <Route 
          path="/login" 
          element={
            <Login 
              setUser={setUser} 
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
            />
          } 
        />
        <Route 
          path="/register" 
          element={
            <Register 
              setUser={setUser} 
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
            />
          } 
        />
        <Route 
          path="/" 
          element={
            <Home user={user} logout={handleLogout} />
          } 
        />
      </Routes>
      
      <p className="text-center text-sm text-leather-500 mt-4">
        La ruta actual es: {location.pathname}
      </p>
    </>
  );
};

export default App;