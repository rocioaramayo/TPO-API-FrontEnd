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
import Favoritos from './pages/Favoritos.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';
import DescuentosAdminPanel from './components/DescuentosAdminPanel';
import AdminNavigation from './pages/admin/AdminNavigation.jsx';
import Contacto from './pages/Contacto.jsx';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes.jsx';
import TerminosCondiciones from './pages/TerminosCondiciones.jsx';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.jsx';

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
         
      <Routes>
        <Route 
          path="/login" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} />
              <Login 
                setUser={setUser} 
                loading={loading}
                setLoading={setLoading}
                error={error}
                setError={setError}
              />
            </>
          } 
        />
        <Route 
          path="/register" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} />
              <Register 
                setUser={setUser} 
                loading={loading}
                setLoading={setLoading}
                error={error}
                setError={setError}
              />
            </>
            
          } 
        />
        <Route 
          path="/" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} />
              <Home user={user} logout={handleLogout} />
            </>
            
          } 
        />
        {/* RUTAS DE PRODUCTOS */}
        <Route 
          path="/productos/:id" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} />
              <ProductDetail user={user} />
          </>}  
        />
        <Route 
          path="/productos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} />
              <Productos user={user} />
          </>} 
        />
        <Route 
          path="/nosotros" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} />
              <Nosotros />
          </>} 
        />

        <Route 
          path="/favoritos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} />
              <Favoritos user={user} />
          </>} 
        />

        <Route 
          path="/admin/descuentos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} />
              <DescuentosAdminPanel user={user} fullPage={true} visible={true} onClose={() => {}} />
          </>} 
        />

        <Route 
          path="/admin/*" 
          element={
          <>
              <AdminNavigation user={user} />
              <AdminPanel user={user} />
          </>} 
        />
        {/* Páginas legales y de ayuda */}
        <Route path="/contacto" element={
          <>
            <Navigation user={user} onLogout={handleLogout} />
            <Contacto />
          </>
        } />
        <Route path="/preguntas-frecuentes" element={
          <>
            <Navigation user={user} onLogout={handleLogout} />
            <PreguntasFrecuentes />
          </>
        } />
        <Route path="/terminos-condiciones" element={
          <>
            <Navigation user={user} onLogout={handleLogout} />
            <TerminosCondiciones />
          </>
        } />
        <Route path="/politica-privacidad" element={
          <>
            <Navigation user={user} onLogout={handleLogout} />
            <PoliticaPrivacidad />
          </>
        } />
      </Routes>
      {/*Este es solo para tener en claro en dd estamos, dsp borramos*/}
      {/* <p className="text-center text-sm text-leather-500 mt-4">
        La ruta actual es: {location.pathname}
      </p> */}
    </>
  );
};

export default App;