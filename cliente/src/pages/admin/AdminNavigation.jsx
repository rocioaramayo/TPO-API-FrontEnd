// src/components/Navigation.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
// import DescuentosAdminPanel from "../components/DescuentosAdminPanel";


const AdminNavigation = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDescuentosPanel, setShowDescuentosPanel] = useState(false);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const panelRef = useRef();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!showDescuentosPanel) return;
  //   function handleClickOutside(event) {
  //     if (panelRef.current && !panelRef.current.contains(event.target)) {
  //       setShowDescuentosPanel(false);
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [showDescuentosPanel]);

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
          

          {/* Usuario y acciones */}
          <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Link
                  to="/"
                  className="bg-leather-800 text-white hover:bg-leather-900 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Volver a inicio
                </Link>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default AdminNavigation;