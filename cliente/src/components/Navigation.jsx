// src/components/Navigation.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navigation = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-leather-lg border-b border-leather-200 sticky top-0 z-50 glass-leather">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-leather rounded-lg shadow-leather mr-3 group-hover:shadow-cognac transition-all duration-200">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-serif font-bold text-leather-900 group-hover:text-cognac-700 transition-colors duration-200">
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
              className="text-leather-700 hover:text-cognac-700 font-medium transition-colors duration-200 relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cognac-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/productos" 
              className="text-leather-700 hover:text-cognac-700 font-medium transition-colors duration-200 relative group"
            >
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cognac-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/categorias" 
              className="text-leather-700 hover:text-cognac-700 font-medium transition-colors duration-200 relative group"
            >
              Categorías
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cognac-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/nosotros" 
              className="text-leather-700 hover:text-cognac-700 font-medium transition-colors duration-200 relative group"
            >
              Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cognac-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <button className="p-2 text-leather-600 hover:text-cognac-600 transition-colors duration-200 relative focus-leather rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 7v10a2 2 0 01-2 2H9a2 2 0 01-2-2V7" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-cognac-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                0
              </span>
            </button>

            {/* Favoritos */}
            <button className="p-2 text-leather-600 hover:text-cognac-600 transition-colors duration-200 focus-leather rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Usuario */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-leather-800">
                  Hola, {user.email.split('@')[0]}
                </p>
                <p className="text-xs text-leather-600">Bienvenido</p>
              </div>
              
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-leather rounded-full shadow-leather">
                <span className="text-white text-sm font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <button 
                onClick={onLogout}
                className="btn-leather text-sm px-3 py-2"
              >
                Salir
              </button>
            </div>

            {/* Menú móvil toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-leather-600 hover:text-cognac-600 focus-leather rounded-lg"
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;