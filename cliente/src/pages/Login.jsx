// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser, loading, setLoading, error, setError }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
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
      .then(response => response.json()
        .then(data => {
          if (!response.ok) {
            throw new Error(data.mensaje || 'Error al iniciar sesión');
          }
          return { email: credentials.email, token: data.token };
        })
      )
      .catch(error => {
        if (error.message.includes('Usuario no encontrado')) {
          setError('Usuario no encontrado');
        } else if (error.message.includes('contraseña inválida')) {
          setError('Contraseña incorrecta');  
        } else if (error.message.includes('El usuario está inactivo')) {
          setError('Tu cuenta está inactiva. Contacta al administrador.');
        } else {
          setError('Error al iniciar sesión. Intenta nuevamente.');
        }
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
    <div className="min-h-screen bg-gradient-leather-light flex items-center justify-center px-4 py-12 relative">
      {/* Fondo con textura sutil */}
      <div className="absolute inset-0 bg-leather-texture opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        {/* Tarjeta principal */}
        <div className="glass-leather rounded-2xl shadow-leather-lg p-8 animate-fade-in">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-leather rounded-full mb-4 shadow-leather">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-bold text-leather-900 mb-2">
              Cuero Argentino
            </h1>
            <p className="text-leather-600 text-sm">
              Bienvenido de vuelta
            </p>
          </div>
        
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 animate-slide-up">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
        
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-leather-800 mb-2"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="input-leather focus-leather"
                placeholder="tu@email.com"
                required
              />
            </div>
          
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-leather-800 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="input-leather focus-leather"
                placeholder="••••••••"
                required
              />
            </div>
          
            <button
              type="submit"
              disabled={loading}
              className="btn-leather w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner-leather mr-3"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        
          {/* Enlaces */}
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <p className="text-leather-600 text-sm">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  className="link-leather font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          
            {/* Botón alternativo */}
            <button 
              type="button"
              onClick={handleGoToRegister}
              className="btn-soft-leather w-full"
            >
              Crear nueva cuenta
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-leather-500 text-xs">
            © 2025 Cuero Argentino. Calidad artesanal desde 1985.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;