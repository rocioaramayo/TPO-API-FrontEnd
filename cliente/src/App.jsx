// src/App.jsx
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Navigation from './components/Navigation.jsx';
import Productos from './pages/Productos.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Nosotros from './pages/Nosotros.jsx';
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
    {/* Este esta afuera de routes para q aparesca simpre*/}
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
        {/* RUTAS DE PRODUCTOS */}
         <Route 
          path="/productos/:id" 
          element={<ProductDetail />} 
        />
        <Route 
          path="/productos" 
          element={<Productos />} 
        />
        <Route 
          path="/nosotros" 
          element={<Nosotros />} 
        />
      </Routes>
      {/*Este es solo para tener en claro en dd estamos, dsp borramos*/}
      <p className="text-center text-sm text-leather-500 mt-4">
        La ruta actual es: {location.pathname}
      </p>
    </>
  );
};

export default App;