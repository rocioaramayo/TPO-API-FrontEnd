// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Navigation from './components/Navigation.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Efecto para redirigir si no hay usuario
  useEffect(() => {
    if (!user && location.pathname === '/') {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);

  // Función para manejar el logout
  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      {user && <Navigation user={user} onLogout={handleLogout} />}
      
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
            user ? 
              <Home user={user} logout={handleLogout} /> : 
              <div className="text-center mt-10 text-gray-600 italic">Redirigiendo...</div>

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
