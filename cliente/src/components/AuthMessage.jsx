import { useNavigate } from 'react-router-dom';

const AuthMessage = ({ isOpen, onClose, title = "¡Inicia sesión para guardar favoritos!" }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full text-center shadow-xl">
        <div className="mb-4">
          <svg className="w-12 h-12 text-leather-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-bold text-leather-900">{title}</h3>
          <p className="text-leather-600 text-sm mt-2">Crea una cuenta para guardar tus productos favoritos</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            className="w-full bg-leather-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-leather-900 transition-colors"
          >
            Crear cuenta
          </button>
          
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="w-full border border-leather-800 text-leather-800 py-2 px-4 rounded-lg font-medium hover:bg-leather-50 transition-colors"
          >
            Ya tengo cuenta
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-leather-600 py-2 text-sm hover:text-leather-800 transition-colors"
          >
            Continuar sin registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthMessage;