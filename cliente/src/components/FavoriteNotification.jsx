import { useEffect } from 'react';

const FavoriteNotification = ({ 
  isVisible, 
  isAdded, 
  productName, 
  onClose 
}) => {
  
  useEffect(() => {
    if (isVisible) {
      // Auto-cerrar después de 3 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`rounded-lg shadow-lg border-l-4 p-4 bg-white max-w-sm ${
        isAdded 
          ? 'border-l-green-500' 
          : 'border-l-red-500'
      }`}>
        <div className="flex items-center">
          {/* Icono */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isAdded 
              ? 'bg-green-100' 
              : 'bg-red-100'
          }`}>
            {isAdded ? (
              // Corazón relleno para "agregado"
              <svg 
                className="w-5 h-5 text-red-500 fill-current" 
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : (
              // Corazón roto para "eliminado"
              <svg 
                className="w-5 h-5 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            )}
          </div>
          
          {/* Contenido */}
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              isAdded 
                ? 'text-green-800' 
                : 'text-red-800'
            }`}>
              {isAdded ? '¡Agregado a favoritos!' : 'Eliminado de favoritos'}
            </p>
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
              {productName}
            </p>
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full ${
              isAdded ? 'bg-green-500' : 'bg-red-500'
            } animate-progress`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteNotification;