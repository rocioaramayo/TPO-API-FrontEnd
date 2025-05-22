// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ setUser, loading, setLoading, error, setError }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const register = (userData) => {
    setLoading(true);
    setError(null);
    
    const registrationData = {
      ...userData,
      role: 'COMPRADOR'
    };
    
    return fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })
      .then(response => response.json()
        .then(data => {
          if (!response.ok) {
            throw new Error(data.mensaje || 'Error al registrarse');
          }
          return { email: userData.email, token: data.token };
        })
      )
      .catch(error => {
        if (error.message.includes('El usuario ya existe')) {
          setError('Ya existe un usuario con ese nombre de usuario o email');
        } else if (error.message.includes('Email no valido')) {
          setError('El formato del email no es válido');
        } else if (error.message.includes('menos 8 caracteres')) {
          setError('La contraseña debe tener al menos 8 caracteres');
        } else {
          setError('Error al registrarse. Intenta nuevamente.');
        }
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!userData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (userData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!userData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!userData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (userData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!userData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }
    
    if (!userData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const { confirmPassword, ...registerData } = userData;
    
    register(registerData)
      .then(user => {
        if (user) {
          setUser(user);
          navigate('/');
        }
      });
  };
  
  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Card minimalista */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header simple */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-semibold text-leather-800 mb-2">
              Crear Cuenta
            </h1>
            <p className="text-base text-leather-600">
              Únete a la familia Cuero Argentino
            </p>
          </div>
        
          {/* Error message minimalista */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}
        
          {/* Formulario limpio */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors ${formErrors.username ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="tu_usuario"
                required
              />
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
              )}
            </div>
          
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors ${formErrors.email ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="ejemplo@email.com"
                required
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
          
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="firstName" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors ${formErrors.firstName ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Juan"
                  required
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="lastName" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors ${formErrors.lastName ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Pérez"
                  required
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                )}
              </div>
            </div>
          
            {/* Contraseña */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors ${formErrors.password ? 'border-red-300' : 'border-gray-300'}`}
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
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 8 caracteres
              </p>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
          
            {/* Confirmar Contraseña */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Repite tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
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
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>
          
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-leather-800 text-white py-2.5 px-4 rounded font-medium hover:bg-leather-900 focus:outline-none focus:ring-2 focus:ring-leather-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>
        
          {/* Enlaces simples */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="text-leather-700 hover:text-leather-800 font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
          
          <div className="mt-4">
            <button 
              type="button"
              onClick={handleGoToLogin}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
            >
              Volver al Login
            </button>
          </div>
        </div>

        {/* Footer simple */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Al registrarte, aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;