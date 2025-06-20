// src/components/Navigation.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/usersSlice';
import { clearFavoritos, fetchFavoritos } from '../store/slices/favoritosSlice';

const Navigation = ({ onCartClick, cartItems = [] }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const favoritos = useSelector((state) => state.favoritos.ids);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const togglePerfil = () => setMostrarPerfil(v => !v);
  const [corazonAnimado, setCorazonAnimado] = useState(false);

  const totalCartItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const tieneFavoritos = favoritos && favoritos.length > 0;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoritos());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearFavoritos());
    setMostrarPerfil(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-leather-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center min-w-[120px]">
            <Link to="/" className="flex items-center group">
              <div className="bg-white flex items-center justify-center">
                <img
                  src="/foto-toro-logo.png"
                  alt="Logo"
                  className="w-12 h-12 mr-2 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-serif font-bold text-leather-900 group-hover:text-leather-700 transition-colors duration-200">
                  Cuero Argentino
                </h1>
                <p className="text-xs text-leather-600 -mt-1">Artesanía Premium</p>
              </div>
            </Link>
          </div>

          {/* Enlaces de navegación - Desktop */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 top-0 transform -translate-x-1/2 h-full">
            <Link 
              to="/" 
              className="text-leather-700 hover:text-leather-800 font-medium transition-colors duration-200 relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leather-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/productos" 
              className="text-leather-700 hover:text-leather-800 font-medium transition-colors duration-200 relative group"
            >
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leather-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/nosotros" 
              className="text-leather-700 hover:text-leather-800 font-medium transition-colors duration-200 relative group"
            >
              Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leather-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            {user?.role?.toLowerCase() === 'admin' && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="text-leather-700 hover:text-leather-800 font-medium transition-colors duration-200 relative group px-2"
              >
                Panel Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leather-600 transition-all duration-200 group-hover:w-full"></span>
              </button>
            )}
            {/* Buscador */}
            {user?.role?.toLowerCase() !== 'admin' && (
              <form onSubmit={handleSearch} className="flex items-center ml-4">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="border border-leather-200 rounded-l px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-leather-200"
                  style={{ minWidth: 120 }}
                />
                <button type="submit" className="bg-leather-800 text-white px-2 py-1 rounded-r hover:bg-leather-900 flex items-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center space-x-4 min-w-[180px] justify-end absolute right-0 top-0 h-full">
            {user ? (
              <>
                {/* Carrito y Favoritos solo para usuarios que no son admin */}
                {user.role?.toLowerCase() !== 'admin' && (
                  <>
                    {/* Carrito */}
                    <button
                      className="relative flex items-center justify-center p-2 text-leather-600 hover:text-leather-700 transition-colors duration-200"
                      onClick={onCartClick}
                    >
                      {/* Ícono del carrito */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25H17.25a1.5 1.5 0 001.464-1.184L20.25 6.75H5.25M7.5 14.25L6.117 5.273A1.125 1.125 0 005.009 4.5H3M7.5 14.25l-1.5 6h10.5m-9 0a1.5 1.5 0 103 0m6 0a1.5 1.5 0 103 0"
                        />
                      </svg>
                      {/* Burbuja del número */}
                      <span className="absolute -top-1.5 -right-1.5 bg-leather-600 text-white text-[10px] font-semibold h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                        {totalCartItems}
                      </span>
                    </button>
                    {/* Favoritos */}
                    <NavLink
                      to="/favoritos"
                      className={({ isActive }) => `relative text-gray-600 hover:text-leather-700 p-2 rounded-full transition-colors duration-200 ${isActive ? 'bg-leather-100' : ''}`}
                    >
                      <svg className={`w-6 h-6 ${tieneFavoritos ? 'text-red-500' : ''}`} fill={tieneFavoritos ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={tieneFavoritos ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                      </svg>
                    </NavLink>
                  </>
                )}
                {/* Usuario autenticado */}
                <div className="relative">
                  <button
                      onClick={() => setMostrarPerfil(!mostrarPerfil)}
                      className="flex items-center justify-center w-8 h-8 bg-leather-800 rounded-full shadow-sm cursor-pointer"
                  >
        <span className="text-white text-sm font-medium">
          {user?.email?.charAt(0).toUpperCase() || "?"}
        </span>
                  </button>
                  {mostrarPerfil && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 py-1 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">Hola, {user.nombre}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/perfil" className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMostrarPerfil(false)}>
                          Mi Perfil
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-200">
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-800">
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Usuario no autenticado */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-leather-700 hover:text-leather-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-leather-800 text-white hover:bg-leather-900 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Menú móvil toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-leather-600 hover:text-leather-700 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-leather-200 py-4 animate-slide-up">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-leather-700 hover:text-cognac-700 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/productos" 
                className="text-leather-700 hover:text-cognac-700 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                to="/nosotros" 
                className="text-leather-700 hover:text-cognac-700 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
              {user?.role?.toLowerCase() === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="text-leather-700 hover:text-cognac-700 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200 text-left"
                >
                  Panel Admin
                </button>
              )}
              {/* Enlaces móviles para usuarios no autenticados */}
              {!user && (
                <>
                  <div className="border-t border-leather-200 pt-3 mt-3">
                    <Link 
                      to="/login" 
                      className="text-leather-700 hover:text-leather-800 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/register" 
                      className="text-white bg-leather-800 hover:bg-leather-900 font-medium py-2 px-4 rounded-lg transition-all duration-200 block mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* ELIMINAMOS ESTA PARTE TAMBIÉN ya que no se usa
        {showDescuentosPanel && (
          <div className="descuentos-panel">
            <DescuentosAdminPanel />
          </div>
        )}
        */}
      </div>
    </nav>
  );
};

export default Navigation;