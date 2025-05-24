const ProductCard = ({ id, nombre, descripcion, precio, stock, categoria, fotos, tipoCuero, color, pocoStock }) => {
  
  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
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
        
        {/* stock bajo */}
        {pocoStock && (
          <div className="absolute top-2 left-2">
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
          
          {/* solo un botón visual (no funcional xq no usamos localhosts) */}
          <button 
            className="bg-leather-800 text-white px-3 py-2 rounded text-sm hover:bg-leather-900 transition-colors"
            onClick={() => alert('Funcionalidad de carrito próximamente')}
          >
            Ver detalles
          </button>
        </div>
        
        <div className="mt-2 text-xs text-leather-500">
          Stock: {stock} unidades
        </div>
      </div>
    </div>
  );
};

export default ProductCard;