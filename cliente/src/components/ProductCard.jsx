import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AuthMessage from './AuthMessage';

const ProductCard = ({ 
  id, 
  nombre, 
  descripcion, 
  precio, 
  stock, 
  categoria, 
  fotos, 
  tipoCuero, 
  color, 
  pocoStock,
  user,
  isFavorite,
  onFavoriteClick
}) => {
  
  const navigate = useNavigate();
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  
  // formatear precio
  function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  }

  // funcion para ir al detalle
  function handleClick() {
    navigate(`/productos/${id}`);
  }

  function handleFavoriteClick(e) {
    e.stopPropagation();
    
    if (!user) {
      setShowAuthMessage(true);
      return;
    }
    
    onFavoriteClick(id);
  }

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
        onClick={handleClick} 
      >
        {/* Imagen del producto */}
        <div className="aspect-square bg-cream-100 relative">
          {fotos && fotos.length > 0 ? (
            <img
              src={fotos[0].contenidoBase64}  
              alt={nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Error cargando imagen:", e);
                console.log("URL intentada:", e.target.src);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-leather-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Ícono de favorito */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
            title={!user ? 'Regístrate para agregar a favoritos' : isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <svg 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite 
                  ? 'text-red-500 fill-current' 
                  : user 
                    ? 'text-gray-400 hover:text-red-400' 
                    : 'text-gray-300'
              }`} 
              fill={isFavorite ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={isFavorite ? 0 : 2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>

          {/* Badge de stock bajo */}
          {pocoStock && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                Poco stock
              </span>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <span className="inline-block bg-leather-100 text-leather-700 text-xs font-medium px-2 py-1 rounded mb-2">
            {categoria}
          </span>
          
          <h3 className="font-serif text-lg font-semibold text-leather-900 mb-2 line-clamp-2">
            {nombre}
          </h3>
          
          <p className="text-leather-600 text-sm mb-3 line-clamp-2">
            {descripcion}
          </p>
          
          {tipoCuero && (
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="text-xs bg-cream-100 text-leather-600 px-2 py-1 rounded">
                {tipoCuero}
              </span>
              {color && (
                <span className="text-xs bg-cream-100 text-leather-600 px-2 py-1 rounded">
                  {color}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-leather-800">
              {formatPrice(precio)}
            </span>
          </div>
          
          <div className="mt-2 text-xs text-leather-500">
            Stock: {stock} unidades
          </div>
        </div>
      </div>

      {/* mensaje de autenticación */}
      <AuthMessage 
        isOpen={showAuthMessage}
        onClose={() => setShowAuthMessage(false)}
      />
    </>
  );
};

export default ProductCard;