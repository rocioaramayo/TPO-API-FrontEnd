// src/App.jsx
import {useEffect, useState} from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/usersSlice';
import { clearCart } from './store/slices/cartSlice';
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
import AdminProfilePage from "./pages/admin/AdminProfilePage.jsx";
import ConfirmacionPedido from './pages/ConfirmacionPedido';
import AuthMessage from './components/AuthMessage';
import { Provider } from 'react-redux';
import { store } from './store/store';

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  
  const location = useLocation();

  const [cartOpen, setCartOpen] = useState(false);
  const [authModalInfo, setAuthModalInfo] = useState({ isOpen: false, title: '', description: '' });

  // Función para manejar el logout
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  const handleOpenCart = () => setCartOpen(true);
  const handleCloseCart = () => setCartOpen(false);

  const showAuthModal = () => {
    setAuthModalInfo({
      isOpen: true,
      title: 'Inicia sesión para comprar',
      description: 'Debes tener una cuenta para añadir productos al carrito.'
    });
  };

  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <Login />
            </>
          } 
        />

        <Route
          path="/perfil"
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
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
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <Register />
            </>
          } 
        />
        
        <Route 
          path="/" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <Home 
                logout={handleLogout} 
                onCartClick={handleOpenCart}
                onAuthRequired={showAuthModal}
              />
            </>
          }
        />
        
        {/* RUTAS DE PRODUCTOS */}
        <Route 
          path="/productos/:id" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <ProductDetail onCartClick={handleOpenCart} onAuthRequired={showAuthModal} />
            </>
          }  
        />
        
        <Route 
          path="/productos" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <Productos onAddToCart={handleOpenCart} onAuthRequired={showAuthModal}/>
            </>
          } 
        />
        
        <Route 
          path="/nosotros" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <Nosotros />
            </>
          } 
        />

        <Route 
          path="/favoritos" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <Favoritos />
            </>
          } 
        />

        <Route 
          path="/admin/*" 
          element={
          <>
              <AdminNavigation />
              <AdminPanel/>
          </>} 
        />
        
        {/* Páginas legales y de ayuda */}
        <Route path="/contacto" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
            <Contacto />
          </>
        } />
        <Route path="/preguntas-frecuentes" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
            <PreguntasFrecuentes />
          </>
        } />
        <Route path="/terminos-condiciones" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
            <TerminosCondiciones />
          </>
        } />
        <Route path="/politica-privacidad" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
            <PoliticaPrivacidad />
          </>
        } />
        <Route path="/garantia" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
            <Garantia />
          </>
        } />
        <Route path="/cuidado-del-cuero" element={
          <>
            <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
            <CuidadoDelCuero />
          </>
        } />
        <Route 
          path="/checkout" 
          element={
            <>
              <Navigation onLogout={handleLogout} onCartClick={handleOpenCart} />
              <CheckoutPage user={user} />
            </>
          }
        />
        <Route path="/confirmacion-pedido/:compraId" element={<ConfirmacionPedido user={user} />} />
      </Routes>
      <CartSidebar
        isOpen={cartOpen}
        onClose={handleCloseCart}
      />
      <AuthMessage 
        isOpen={authModalInfo.isOpen} 
        onClose={() => setAuthModalInfo({ isOpen: false, title: '', description: '' })}
        title={authModalInfo.title}
        description={authModalInfo.description}
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