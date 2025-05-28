import { useNavigate } from 'react-router-dom';

const AuthMessage = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/register');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full px-6 pt-4 pb-6 relative text-center">
        
        {/* Botón cerrar arriba a la derecha */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-leather-400 hover:text-leather-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido */}
        <div className="w-14 h-14 bg-leather-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
          <svg className="w-7 h-7 text-leather-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        <h4 className="text-lg font-semibold text-leather-900 mb-1">
          ¡Inicia sesión para guardar favoritos!
        </h4>
        <p className="text-sm text-leather-600 mb-6">
          Crea una cuenta para guardar tus productos favoritos
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRegister}
            className="w-full bg-leather-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-leather-900 transition-colors"
          >
            Crear cuenta
          </button>

          <button
            onClick={handleLogin}
            className="w-full border border-leather-800 text-leather-800 py-3 px-4 rounded-lg font-medium hover:bg-leather-800 hover:text-white transition-all"
          >
            Ya tengo cuenta
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-leather-400 hover:text-leather-600 text-xs mt-2"
          >
            Continuar sin registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthMessage;
