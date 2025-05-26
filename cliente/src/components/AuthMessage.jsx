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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-leather-200">
          <h3 className="text-lg font-serif font-semibold text-leather-900">
            Inicia Sesión
          </h3>
          <button
            onClick={onClose}
            className="text-leather-400 hover:text-leather-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-leather-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-leather-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-leather-900 mb-2">
              ¡Regístrate para escribir reseñas!
            </h4>
            <p className="text-leather-600">
              Crea una cuenta para compartir tu experiencia con otros clientes.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRegister}
              className="w-full bg-leather-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-leather-900 transition-colors"
            >
              Crear Cuenta Gratis
            </button>
            
            <button
              onClick={handleLogin}
              className="w-full border-2 border-leather-800 text-leather-800 py-3 px-4 rounded-lg font-medium hover:bg-leather-800 hover:text-white transition-all"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthMessage;