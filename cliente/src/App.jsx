// src/App.jsx
import {useEffect, useState} from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/usersSlice';
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
import Garantia from './pages/Garantia.jsx';
import CuidadoDelCuero from './pages/CuidadoDelCuero.jsx';
import ProfilePage from "./components/ProfilePage.jsx";
import CartSidebar from "./components/CartSidebar";
import CheckoutPage from './pages/CheckoutPage.jsx';
import AdminProfilePage from "./pages/admin/AdminProfilePage.jsx"; // ⬅️ arriba junto a los otros imports
import ConfirmacionPedido from './pages/ConfirmacionPedido';
import { Provider } from 'react-redux';
import { store } from './store/store';

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  
  const location = useLocation();

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Función para manejar el logout
  const handleLogout = () => {
    dispatch(logout());
    setCartItems([]);
    navigate('/');
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
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
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Login />
            </>
          } 
        />

        <Route
          path="/perfil"
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              {user?.role === "ADMIN" ? (
                <AdminProfilePage onLogout={handleLogout} />
              ) : (
                <ProfilePage onLogout={handleLogout} />
              )}
            </>
          }
        />

        <Route
          path="/register" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Register />
            </>
          } 
        />
        
        <Route 
          path="/" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Home logout={handleLogout} />
            </>
          }
        />
        
        {/* RUTAS DE PRODUCTOS */}
        <Route 
          path="/productos/:id" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <ProductDetail onAddToCart={handleAddToCart} />
            </>
          }  
        />
        
        <Route 
          path="/productos" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Productos />
            </>
          } 
        />
        
        <Route 
          path="/nosotros" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Nosotros />
            </>
          } 
        />

        <Route 
          path="/favoritos" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <Favoritos />
            </>
          } 
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
            <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <Contacto />
          </>
        } />
        <Route path="/preguntas-frecuentes" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <PreguntasFrecuentes />
          </>
        } />
        <Route path="/terminos-condiciones" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <TerminosCondiciones />
          </>
        } />
        <Route path="/politica-privacidad" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <PoliticaPrivacidad />
          </>
        } />
        <Route path="/garantia" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <Garantia />
          </>
        } />
        <Route path="/cuidado-del-cuero" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
            <CuidadoDelCuero />
          </>
        } />
        <Route 
          path="/checkout" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={() => setCartOpen(true)} cartItems={cartItems.filter(item => item.quantity > 0)} />
              <CheckoutPage
                cartItems={cartItems}
                setCartItems={setCartItems}
                user={user}
              />
            </>
          }
        />
        <Route path="/confirmacion-pedido/:compraId" element={<ConfirmacionPedido user={user} />} />
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

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function guessMimeType(foto) {
  if (foto.startsWith('/9j/')) return 'image/jpeg';
  if (foto.startsWith('iVBORw0KGgo=')) return 'image/png';
  if (foto.startsWith('R0lGODlh')) return 'image/gif';
  return 'image/jpeg';
}

export default App;