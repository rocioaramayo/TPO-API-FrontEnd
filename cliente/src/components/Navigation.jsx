// src/components/Navigation.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import DescuentosAdminPanel from "../components/DescuentosAdminPanel";


const Navigation = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDescuentosPanel, setShowDescuentosPanel] = useState(false);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const panelRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showDescuentosPanel) return;
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowDescuentosPanel(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDescuentosPanel]);

  return (
    <nav className="bg-white shadow-sm border-b border-leather-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
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
          <div className="hidden md:flex items-center space-x-8">
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
              to="/categorias" 
              className="text-leather-700 hover:text-leather-800 font-medium transition-colors duration-200 relative group"
            >
              Categorías
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
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center space-x-4">
{user ? (
              <>
                {/* Carrito */}
                <button className="relative flex items-center justify-center p-2 text-leather-600 hover:text-leather-700 transition-colors duration-200">
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
                  0
                </span>
              </button>


                {/* Favoritos */}
                <Link 
                  to="/favoritos"
                  className="p-2 text-leather-600 hover:text-leather-700 transition-colors duration-200 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                {/* Usuario autenticado */}
                <div className="flex items-center space-x-3 relative">
                  <div
                    className="hidden sm:block text-right cursor-pointer"
                    onClick={() => user && user.role?.toLowerCase() === 'admin' && setShowDescuentosPanel(v => !v)}
                  >
                    <p className="text-sm font-medium text-leather-800">
                      Hola, {user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-leather-600">Bienvenido</p>
                  </div>
                  <div
                    className="flex items-center justify-center w-8 h-8 bg-leather-800 rounded-full shadow-sm cursor-pointer"
                    onClick={() => user && user.role?.toLowerCase() === 'admin' && setShowDescuentosPanel(v => !v)}
                  >
                    <span className="text-white text-sm font-medium">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="bg-leather-800 text-white hover:bg-leather-900 text-sm px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    Salir
                  </button>
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
                to="/categorias" 
                className="text-leather-700 hover:text-cognac-700 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link 
                to="/nosotros" 
                className="text-leather-700 hover:text-cognac-700 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
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
      </div>
    </nav>
  );
};


export default Navigation;