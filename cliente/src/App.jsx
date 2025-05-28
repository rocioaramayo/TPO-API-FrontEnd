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
import CartSidebar from "./components/CartSidebar";
import CarritoPage from './pages/CarritoPage.jsx';


const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Eliminado useEffect que escuchaba 'updateCart'

  // Función para manejar el logout
  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Debés iniciar sesión para agregar productos al carrito");
      return;
    }

    const newItem = {
      id: product.id, // Agregado el id de producto
      name: product.nombre || product.name || "Producto",
      price: product.precio || product.price || 0,
      image: product.imagen || product.image || "https://via.placeholder.com/80?text=Sin+Imagen",
      stock: product.stock || product.stockDisponible || 99,
      quantity: 1,
    };

    setCartItems((prevItems) => {
      const existing = prevItems.find(item => item.id === newItem.id);
      if (existing) {
        if (existing.quantity >= newItem.stock) return prevItems;
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, newItem];
    });
    setCartOpen(true);
  };

  // Funciones para manejar el carrito
  const handleRemoveFromCart = (idx) => {
    setCartItems((items) => items.filter((_, i) => i !== idx));
  };

  const handleAddQty = (idx) => {
    setCartItems((items) =>
      items.map((item, i) =>
        i === idx
          ? { ...item, quantity: item.quantity < (item.stock ?? 99) ? item.quantity + 1 : item.quantity }
          : item
      )
    );
  };

  const handleSubQty = (idx) => {
    setCartItems((items) =>
      items
        .map((item, i) =>
          i === idx
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };


  return (
    <>
         
      <Routes>
        <Route 
          path="/login" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
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
                      <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
                      <ProfilePage user={user} onLogout={handleLogout} />
                  </>
              }
          />

          <Route
          path="/register" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
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
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
              <Home user={user} logout={handleLogout} />
            </>


          }
        />
        {/* RUTAS DE PRODUCTOS */}
        <Route 
          path="/productos/:id" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
              <ProductDetail user={user} onAddToCart={handleAddToCart} />
          </>}  
        />
        <Route 
          path="/productos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
              <Productos user={user} />
          </>} 
        />
        <Route 
          path="/nosotros" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
              <Nosotros />
          </>} 
        />

        <Route 
          path="/favoritos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
              <Favoritos user={user} />
          </>} 
        />

        <Route 
          path="/admin/descuentos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
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
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
            <Contacto />
          </>
        } />
        <Route path="/preguntas-frecuentes" element={
          <>
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
            <PreguntasFrecuentes />
          </>
        } />
        <Route path="/terminos-condiciones" element={
          <>
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
            <TerminosCondiciones />
          </>
        } />
        <Route path="/politica-privacidad" element={
          <>
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems} />
            <PoliticaPrivacidad />
          </>
        } />
        <Route 
          path="/carrito" 
          element={
            <CarritoPage
              cartItems={cartItems}
              setCartItems={setCartItems}
              user={user}
            />
          }
        />
      </Routes>
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        onAddQty={handleAddQty}
        onSubQty={handleSubQty}
      />
      {/*Este es solo para tener en claro en dd estamos, dsp borramos*/}
      {/* <p className="text-center text-sm text-leather-500 mt-4">
        La ruta actual es: {location.pathname}
      </p> */}
    </>
  );
};

export default App;