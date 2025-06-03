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
import AdminNavigation from './pages/admin/AdminNavigation.jsx';
import Contacto from './pages/Contacto.jsx';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes.jsx';
import TerminosCondiciones from './pages/TerminosCondiciones.jsx';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.jsx';
import ProfilePage from "./components/ProfilePage.jsx";
import CartSidebar from "./components/CartSidebar";
import CheckoutPage from './pages/CheckoutPage.jsx';
import AdminProfilePage from "./pages/admin/AdminProfilePage.jsx"; // ⬅️ arriba junto a los otros imports

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
    console.log('Producto al agregar al carrito:', product);
    if (!user) {
      alert("Debés iniciar sesión para agregar productos al carrito");
      return;
    }

    const newItem = {
      id: product.id, // Agregado el id de producto
      name: product.nombre || product.name || "Producto",
      price: product.precio || product.price || 0,
      fotos: product.fotos || [],
      stock: product.stock || product.stockDisponible || 99,
      quantity: 1,
    };
    console.log('Item que va al carrito:', newItem);

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
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
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
      <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
      {user?.role === "ADMIN" ? (
        <AdminProfilePage user={user} onLogout={handleLogout} />
      ) : (
        <ProfilePage user={user} onLogout={handleLogout} />
      )}
    </>
  }
/>

          <Route
          path="/register" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
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
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Home user={user} logout={handleLogout} />
            </>


          }
        />
        {/* RUTAS DE PRODUCTOS */}
        <Route 
          path="/productos/:id" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <ProductDetail user={user} onAddToCart={handleAddToCart} />
          </>}  
        />
        <Route 
          path="/productos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Productos user={user} />
          </>} 
        />
        <Route 
          path="/nosotros" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Nosotros />
          </>} 
        />

        <Route 
          path="/favoritos" 
          element={
          <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Favoritos user={user} />
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
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <Contacto />
          </>
        } />
        <Route path="/preguntas-frecuentes" element={
          <>
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <PreguntasFrecuentes />
          </>
        } />
        <Route path="/terminos-condiciones" element={
          <>
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <TerminosCondiciones />
          </>
        } />
        <Route path="/politica-privacidad" element={
          <>
            <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <PoliticaPrivacidad />
          </>
        } />
        <Route 
          path="/checkout" 
          element={
            <>
              <Navigation user={user} onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <CheckoutPage
                cartItems={cartItems}
                setCartItems={setCartItems}
                user={user}
              />
            </>
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
    </>
  );
};

export default App;
// Deducir tipo mime a partir del nombre del archivo (si existe)
function guessMimeType(foto) {
  if (foto?.nombre) {
    const ext = foto.nombre.split('.').pop().toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
  }
  // Si empieza con "/9j/" probablemente es JPEG
  if (foto?.file && foto.file.startsWith("/9j/")) return "image/jpeg";
  // Default
  return "image/jpeg";
}