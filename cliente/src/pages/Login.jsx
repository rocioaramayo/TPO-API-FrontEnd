// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser, loading, setLoading, error, setError }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const login = (credentials) => {
    setLoading(true);
    setError(null);
    
    return fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then(response => {
        // Primero intentamos obtener el JSON
        return response.text().then(text => {
          let data = {};
          try {
            data = JSON.parse(text);
          } catch (e) {
            // Si no es JSON válido, usar texto plano
            data = { message: text };
          }
          
          if (!response.ok) {
            let errorMessage = 'Error al iniciar sesión';
            
            // Mapear errores específicos según el código HTTP
            switch (response.status) {
              case 403:
                if (data.message && data.message.toLowerCase().includes('inactivo')) {
                  errorMessage = 'El usuario está inactivo';
                } else if (data.message && data.message.toLowerCase().includes('access denied')) {
                  errorMessage = 'Contraseña incorrecta';
                } else {
                  errorMessage = 'No tiene permisos para acceder';
                }
                break;


              case 404:
                errorMessage = 'Usuario no encontrado';
                break;
              case 401:
                errorMessage = 'Contraseña incorrecta'; 
                break;
              case 400:
                // Usar mensaje específico del backend si existe
                if (data.mensaje) {
                  errorMessage = data.mensaje;
                } else if (data.message) {
                  errorMessage = data.message;
                } else {
                  errorMessage = 'Datos inválidos';
                }
                break;
              default:
                // Intentar usar el mensaje del backend
                if (data.mensaje) {
                  errorMessage = data.mensaje;
                } else if (data.message) {
                  errorMessage = data.message;
                } else if (response.statusText && response.statusText !== 'OK') {
                  errorMessage = response.statusText;
                }
            }
            
            throw new Error(errorMessage);
          }
          
          // Login exitoso
          return { 
            email: credentials.email, 
            token: data.token, 
            role: data.role 
          };
        });
      })
      .catch(error => {
        setError(error.message);
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login(credentials)
      .then(userData => {
        if (userData) {
          setUser(userData);
          navigate('/');
        }
      });
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-semibold text-leather-800 mb-2">
              Cuero Argentino
            </h1>
            <p className="text-base text-leather-600">
              Bienvenido de vuelta
            </p>
          </div>
        
          {/* Error message específico del backend */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}
        
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                placeholder="ejemplo@email.com"
                required
              />
            </div>
          
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.828 1.828l4.242 4.242m0 0L16.95 15.95M9.878 9.878L8.05 8.05" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-leather-600 hover:text-leather-800 underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-leather-800 text-white py-2.5 px-4 rounded font-medium hover:bg-leather-900 focus:outline-none focus:ring-2 focus:ring-leather-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-leather-700 hover:text-leather-800 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          <div className="mt-4">
            <button 
              type="button"
              onClick={handleGoToRegister}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
            >
              Crear nueva cuenta
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2025 Cuero Argentino. Calidad artesanal desde 1985.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;