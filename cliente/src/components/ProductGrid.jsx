import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavoritos, addFavorito, removeFavorito } from '../store/slices/favoritosSlice';

const ProductGrid = ({ productos, categorias, loading, onLimpiarFiltros, onAddToCart }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.users);
  const { ids: favoritos } = useSelector((state) => state.favoritos);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    setCurrentPage(1);
  }, [productos]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoritos());
    }
  }, [isAuthenticated, dispatch]);

  const handleFavoriteClick = (productoId) => {
    if (!isAuthenticated) return;
    const esFavorito = favoritos.includes(productoId);
    if (esFavorito) {
      dispatch(removeFavorito(productoId));
    } else {
      dispatch(addFavorito(productoId));
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductos = productos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage - half < 1) {
      end = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center gap-2">
        {start > 1 && (
          <>
            <button onClick={() => setCurrentPage(1)} className="px-3 py-1 rounded-md text-sm hover:bg-gray-100">1</button>
            <span className="px-2">...</span>
          </>
        )}
        {pageNumbers.map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === num ? 'bg-orange-950 text-white' : 'hover:bg-gray-100'}`}
          >
            {num}
          </button>
        ))}
        {end < totalPages && (
          <>
            <span className="px-2">...</span>
            <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 rounded-md text-sm hover:bg-gray-100">{totalPages}</button>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-md overflow-hidden animate-pulse">
            <div className="aspect-[4/5] bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-20 border-t border-gray-200 mt-12">
        <h3 className="text-2xl font-light text-orange-950 mb-2">No se encontraron productos</h3>
        <p className="text-gray-500 mb-6">Prueba a cambiar o eliminar algunos filtros para ver más resultados.</p>
        <button
          onClick={onLimpiarFiltros}
          className="bg-orange-950 text-white px-6 py-2 rounded-md hover:bg-orange-900 transition-colors text-sm font-light tracking-wider"
        >
          Limpiar todos los filtros
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {currentProductos.map((producto) => {
          const categoriaObj = categorias.find(c => c.nombre === producto.categoria);

          return (
            <ProductCard 
              key={producto.id}
              {...producto}
              categoria={categoriaObj}
              isFavorite={favoritos.includes(producto.id)}
              onFavoriteClick={handleFavoriteClick}
              onAddToCart={() => onAddToCart(producto)}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 pt-8 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Anterior
          </button>
          {renderPagination()}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;