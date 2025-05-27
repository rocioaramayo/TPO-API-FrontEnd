// src/App.jsx
import {useEffect, useState} from 'react';
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
import ProfilePage from "./components/ProfilePage.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  
  const location = useLocation();

  // Función para manejar el logout
  const handleLogout = () => {
    setUser(null);
  };

<<<<<<< Updated upstream
    useEffect(() => {
        fetch("/api/usuarios/me")
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, []);


=======
  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart(prevCart => {
      const index = prevCart.findIndex(item => item.id === product.id);
      let newCart;
      if (index !== -1) {
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      console.log('Carrito actualizado:', newCart);
      return newCart;
    });
  };

  // Quitar producto del carrito
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Limpiar carrito
  const clearCart = () => setCart([]);

  // Cambiar cantidad de un producto en el carrito
  const updateCartQuantity = (productId, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };
>>>>>>> Stashed changes

  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
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
              path="/perfil"
              element={
                  <>
                      <Navigation user={user} onLogout={handleLogout} />
                      <ProfilePage user={user} />
                  </>
              }
          />
        <Route 
          path="/register" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
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
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
              <Home user={user} logout={handleLogout} />
            </>


          }
        />
        {/* RUTAS DE PRODUCTOS */}
        <Route 
          path="/productos/:id" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
              <ProductDetail user={user} addToCart={addToCart} />
          </>}  
        />
        <Route 
          path="/productos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
              <Productos user={user} addToCart={addToCart} />
          </>} 
        />
        <Route 
          path="/nosotros" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
              <Nosotros />
          </>} 
        />

        <Route 
          path="/favoritos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
              <Favoritos user={user} />
          </>} 
        />

        <Route 
          path="/admin/descuentos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
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
            <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
            <Contacto />
          </>
        } />
        <Route path="/preguntas-frecuentes" element={
          <>
            <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
            <PreguntasFrecuentes />
          </>
        } />
        <Route path="/terminos-condiciones" element={
          <>
            <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
            <TerminosCondiciones />
          </>
        } />
        <Route path="/politica-privacidad" element={
          <>
            <Navigation user={user} onLogout={handleLogout} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} />
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