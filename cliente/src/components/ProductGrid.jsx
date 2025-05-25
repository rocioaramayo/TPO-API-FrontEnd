import ProductCard from './ProductCard';

const ProductGrid = ({ productos, loading, onLimpiarFiltros }) => {
  
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-square bg-leather-100"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-leather-100 rounded w-1/2"></div>
              <div className="h-6 bg-leather-100 rounded w-3/4"></div>
              <div className="h-4 bg-leather-100 rounded w-full"></div>
              <div className="h-6 bg-leather-100 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Estado sin productos
  if (productos.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-24 h-24 text-leather-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="text-xl font-bold text-leather-900 mb-2">No se encontraron productos</h3>
        <p className="text-leather-600 mb-4">Intenta ajustar los filtros o buscar algo diferente</p>
        <button
          onClick={onLimpiarFiltros}
          className="bg-leather-800 text-white px-6 py-2 rounded-lg hover:bg-leather-900 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  // Grid normal de productos
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard 
          key={producto.id}
          id={producto.id}
          nombre={producto.nombre}
          descripcion={producto.descripcion}
          precio={producto.precio}
          stock={producto.stock}
          categoria={producto.categoria}
          fotos={producto.fotos}
          tipoCuero={producto.tipoCuero}
          color={producto.color}
          pocoStock={producto.pocoStock}
        />
      ))}
    </div>
  );
};

export default ProductGrid;