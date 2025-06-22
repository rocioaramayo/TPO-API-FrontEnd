// src/components/Navigation.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/usersSlice';
import { clearFavoritos, fetchFavoritos } from '../store/slices/favoritosSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';


const Navigation = ({ onCartClick }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const cartItems = useSelector((state) => state.cart.items);
  const favoritos = useSelector((state) => state.favoritos.ids);
  const { items: categories } = useSelector((state) => state.categories);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();


  // Estado para el carrusel del banner
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
 
  // Mensajes del carrusel
  const bannerMessages = [
    "ENVÍO GRATIS A TODO EL PAÍS EN COMPRAS MAYORES A $50.000",
    "GARANTÍA DE 2 AÑOS EN TODOS NUESTROS PRODUCTOS",
    "PERSONALIZACIÓN GRATUITA EN COMPRAS SUPERIORES A $30.000",
    "CUERO 100% ARGENTINO - CALIDAD PREMIUM GARANTIZADA",
    "DESCUENTOS ESPECIALES PARA CLIENTES FRECUENTES"
  ];


  const totalCartItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const tieneFavoritos = favoritos && favoritos.length > 0;


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoritos());
    }
    dispatch(fetchCategories());
  }, [isAuthenticated, dispatch]);


  // Auto-play del carrusel cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === bannerMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);


    return () => clearInterval(interval);
  }, [bannerMessages.length]);


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


  // Funciones del carrusel
  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === bannerMessages.length - 1 ? 0 : prevIndex + 1
    );
  };


  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? bannerMessages.length - 1 : prevIndex - 1
    );
  };


  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  const handleCategoryMenuEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setIsCategoryDropdownOpen(true);
  };

  const handleCategoryMenuLeave = () => {
    const timeout = setTimeout(() => {
      setIsCategoryDropdownOpen(false);
    }, 200); // 200ms delay
    setDropdownTimeout(timeout);
  };

  const handleLinkClick = () => {
    setIsCategoryDropdownOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        {/* Banner superior con carrusel funcional */}
        <div className="bg-[#522f21] text-white text-center py-1.5 text-xs relative overflow-hidden">
          <div className="flex items-center justify-between max-w-6xl mx-auto px-4">
            <button
              onClick={prevBanner}
              className="text-white/60 hover:text-white transition-all duration-300 p-1 hover:bg-white/10 rounded-full group flex-shrink-0"
            >
              <svg className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
           
            <div className="flex-1 px-4">
              <span className="font-medium text-xs tracking-wide block animate-fade-in">
                {bannerMessages[currentBannerIndex]}
              </span>
            </div>
           
            <button
              onClick={nextBanner}
              className="text-white/60 hover:text-white transition-all duration-300 p-1 hover:bg-white/10 rounded-full group flex-shrink-0"
            >
              <svg className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>


        {/* Navegación principal */}
        <nav className="bg-white border-b border-leather-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
             
              {/* Izquierda - Buscador */}
              <div className="flex items-center flex-1">
                <form onSubmit={handleSearch} className="relative w-80">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-leather-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
                    <path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar productos de cuero..."
                    className="w-full pl-10 pr-4 py-2 text-sm border-0 focus:outline-none focus:ring-0 placeholder-leather-400 text-leather-700"
                  />
                </form>
              </div>


              {/* Centro - Logo con toro */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center group">
                  <div className="flex items-center justify-center w-8 h-8 bg-leather-100 rounded-lg mr-3">
                    <img
                      src="/foto-toro-logo.png"
                      alt="Logo"
                      className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <h1 className="text-xl font-serif font-bold text-leather-900 group-hover:text-leather-700 transition-colors duration-200" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Cuero Argentino
                    </h1>
                    <p className="text-xs text-leather-600 -mt-1 tracking-wider uppercase">Artesanía Premium</p>
                  </div>
                </Link>
              </div>


              {/* Derecha - Iconos de usuario y carrito */}
              <div className="flex items-center justify-end flex-1 space-x-6">
                {user ? (
                  <>
                    {/* Favoritos e iconos solo para no-admin */}
                    {user.role?.toLowerCase() !== 'admin' && (
                      <>
                        <NavLink
                          to="/favoritos"
                          className="relative text-leather-600 hover:text-leather-800 transition-colors duration-200"
                        >
                          <svg
                            className={`w-6 h-6 ${tieneFavoritos ? 'text-red-500 fill-current' : ''}`}
                            fill={tieneFavoritos ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {tieneFavoritos && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </NavLink>


                        <button
                          onClick={onCartClick}
                          className="relative text-leather-600 hover:text-leather-800 transition-colors duration-200"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                          </svg>
                          {totalCartItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-leather-800 text-white text-xs font-medium h-5 w-5 rounded-full flex items-center justify-center">
                              {totalCartItems}
                            </span>
                          )}
                        </button>
                      </>
                    )}


                    <div className="relative">
                      <button
                        onClick={() => setMostrarPerfil(!mostrarPerfil)}
                        className="text-leather-600 hover:text-leather-800 transition-colors duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </button>
                     
                      {mostrarPerfil && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-leather-200 py-2 z-20">
                          <div className="px-4 py-3 border-b border-leather-100">
                            <p className="text-sm font-medium text-leather-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-leather-500 truncate">{user.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/perfil"
                              className="block px-4 py-2 text-sm text-leather-700 hover:bg-leather-50 transition-colors duration-200"
                              onClick={() => setMostrarPerfil(false)}
                            >
                              Mi Perfil
                            </Link>
                            {user?.role?.toLowerCase() === 'admin' && (
                              <button
                                onClick={() => {
                                  setMostrarPerfil(false);
                                  navigate('/admin');
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-leather-700 hover:bg-leather-50 transition-colors duration-200"
                              >
                                Panel Admin
                              </button>
                            )}
                          </div>
                          <div className="py-1 border-t border-leather-100">
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              Cerrar Sesión
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-leather-600 hover:text-leather-800 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => navigate('/register')}
                      className="relative text-leather-600 hover:text-leather-800 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                      </svg>
                      <span className="absolute -top-2 -right-2 bg-leather-800 text-white text-xs font-medium h-5 w-5 rounded-full flex items-center justify-center">
                        0
                      </span>
                    </button>
                  </>
                )}


                {/* Menú móvil */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden text-leather-600 hover:text-leather-800 transition-colors duration-200"
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


            {/* Enlaces de navegación - Debajo del header principal */}
            <div className="hidden lg:flex items-center justify-center space-x-8 py-4 border-t border-leather-200/30 relative">
              <div
                onMouseEnter={handleCategoryMenuEnter}
                onMouseLeave={handleCategoryMenuLeave}
              >
                <NavLink
                  to="/productos"
                  className={({ isActive }) => `
                    flex items-center text-leather-700 hover:text-leather-900 text-sm font-medium transition-colors duration-200 pb-1
                    ${(isActive || isCategoryDropdownOpen) ? 'border-b-2 border-leather-800' : ''}
                  `}
                >
                  Productos
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </NavLink>
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-20">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                      <div className="grid grid-cols-4 gap-x-8">
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Comprar</h3>
                          <ul className="space-y-2">
                            <li><Link to="/productos" onClick={handleLinkClick} className="text-sm text-gray-600 hover:text-black">Ver Todo</Link></li>
                          </ul>
                        </div>
                        {categories.map(category => (
                          <div key={category.id}>
                            <Link
                              to={`/productos?categoriaId=${category.id}`}
                              className="block text-sm text-gray-600 hover:text-black py-1"
                              onClick={handleLinkClick}
                            >
                              {category.nombre}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <NavLink
                to="/nosotros"
                className={({ isActive }) => `
                  text-leather-700 hover:text-leather-900 text-sm font-medium transition-colors duration-200 pb-1
                  ${isActive ? 'border-b-2 border-leather-800' : ''}
                `}
              >
                Nosotros
              </NavLink>
              
              <NavLink
                to="/contacto"
                className={({ isActive }) => `
                  text-leather-700 hover:text-leather-900 text-sm font-medium transition-colors duration-200 pb-1
                  ${isActive ? 'border-b-2 border-leather-800' : ''}
                `}
              >
                Contacto
              </NavLink>

              <NavLink
                to="/cuidado-del-cuero"
                className={({ isActive }) => `
                  text-leather-700 hover:text-leather-900 text-sm font-medium transition-colors duration-200 pb-1
                  ${isActive ? 'border-b-2 border-leather-800' : ''}
                `}
              >
                Cuidado del Cuero
              </NavLink>

              <NavLink
                to="/garantia"
                className={({ isActive }) => `
                  text-leather-700 hover:text-leather-900 text-sm font-medium transition-colors duration-200 pb-1
                  ${isActive ? 'border-b-2 border-leather-800' : ''}
                `}
              >
                Garantía
              </NavLink>
            </div>
          </div>


          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-leather-200/30">
              <div className="px-4 py-4 space-y-4">
                <form onSubmit={handleSearch} className="relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-leather-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
                    <path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar productos de cuero..."
                    className="w-full pl-10 pr-4 py-3 border border-leather-200 rounded-lg text-sm placeholder-leather-400 focus:outline-none focus:ring-2 focus:ring-leather-300"
                  />
                </form>
               
                <div className="space-y-2">
                  <Link
                    to="/productos"
                    className="block py-2 text-leather-700 hover:text-leather-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Productos
                  </Link>
                  <Link
                    to="/nosotros"
                    className="block py-2 text-leather-700 hover:text-leather-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nosotros
                  </Link>
                  <Link
                    to="/contacto"
                    className="block py-2 text-leather-700 hover:text-leather-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contacto
                  </Link>
                  <Link
                    to="/cuidado-del-cuero"
                    className="block py-2 text-leather-700 hover:text-leather-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cuidado del Cuero
                  </Link>
                  <Link
                    to="/garantia"
                    className="block py-2 text-leather-700 hover:text-leather-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Garantía
                  </Link>
                </div>


                {!user && (
                  <div className="pt-4 border-t border-leather-200 space-y-2">
                    <Link
                      to="/login"
                      className="block py-2 text-leather-700 hover:text-leather-900 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="block py-2 text-leather-700 hover:text-leather-900 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Crear Cuenta
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>


        {/* Estilos CSS adicionales para la animación */}
        <style jsx="true">{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
         
          .animate-fade-in {
            animation: fade-in 0.3s ease-in-out;
          }
        `}</style>
      </div>
     
      {/* Spacer para compensar el navbar fijo */}
      <div className="h-[120px] lg:h-[130px]"></div>
    </>
  );
};


export default Navigation;

