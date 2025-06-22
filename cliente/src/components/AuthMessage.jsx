import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AuthMessage = ({ isOpen, onClose, title, description }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay slightly to allow the component to mount before transitioning
      const timer = setTimeout(() => setShow(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/register');
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl max-w-sm w-full p-8 relative text-center transform transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-16 h-16 bg-orange-100/50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-amber-800" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        <h2 className="text-2xl font-light text-orange-950 mb-2">
          {title || "¡Guarda tus favoritos!"}
        </h2>
        <p className="text-base text-gray-600 mb-8 font-light">
          {description || "Crea una cuenta o inicia sesión para guardar y ver tus productos preferidos."}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRegister}
            className="w-full bg-orange-950 text-white py-3 px-4 rounded-md font-light tracking-wider hover:bg-orange-900 transition-colors"
          >
            Crear Cuenta
          </button>
          <button
            onClick={handleLogin}
            className="w-full border border-gray-300 text-orange-950 py-3 px-4 rounded-md font-light tracking-wider hover:bg-gray-100 transition-all"
          >
            Ya tengo Cuenta
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full text-center text-gray-400 hover:text-gray-600 text-xs mt-6 tracking-wide"
        >
          CONTINUAR SIN GUARDAR
        </button>
      </div>
    </div>
  );
};

export default AuthMessage;
