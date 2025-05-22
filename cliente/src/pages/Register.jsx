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
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando se modifica el campo
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
      role: 'COMPRADOR' // Por defecto, registramos como COMPRADOR
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
        // Manejamos las excepciones específicas
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
    
    // Omitimos confirmPassword antes de enviar
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
    <div className="min-h-screen bg-gradient-leather-light flex items-center justify-center px-4 py-12 relative">
      {/* Fondo con textura sutil */}
      <div className="absolute inset-0 bg-leather-texture opacity-20"></div>
      
      <div className="relative w-full max-w-2xl">
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
              Crear Cuenta
            </h1>
            <p className="text-leather-600 text-sm">
              Únete a la familia Cuero Argentino
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
            {/* Username */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-leather-800 mb-2"
              >
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className={`input-leather focus-leather ${formErrors.username ? 'border-red-500' : ''}`}
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
                className="block text-sm font-medium text-leather-800 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className={`input-leather focus-leather ${formErrors.email ? 'border-red-500' : ''}`}
                placeholder="tu@email.com"
                required
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
          
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="firstName" 
                  className="block text-sm font-medium text-leather-800 mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className={`input-leather focus-leather ${formErrors.firstName ? 'border-red-500' : ''}`}
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
                  className="block text-sm font-medium text-leather-800 mb-2"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className={`input-leather focus-leather ${formErrors.lastName ? 'border-red-500' : ''}`}
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
                className="block text-sm font-medium text-leather-800 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className={`input-leather focus-leather ${formErrors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                required
              />
              <p className="mt-1 text-xs text-leather-500">
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
                className="block text-sm font-medium text-leather-800 mb-2"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                className={`input-leather focus-leather ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                required
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>
          
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-leather w-full text-lg py-4"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner-leather mr-3"></div>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>
        
          {/* Enlaces */}
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <p className="text-leather-600 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  to="/login" 
                  className="link-leather font-medium"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          
            {/* Botón alternativo */}
            <button 
              type="button"
              onClick={handleGoToLogin}
              className="btn-soft-leather w-full"
            >
              Volver al Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-leather-500 text-xs">
            Al registrarte, aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;