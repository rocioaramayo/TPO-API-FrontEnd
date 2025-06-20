import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProductGrid = ({ productos, loading, onLimpiarFiltros }) => {
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const [favoritos, setFavoritos] = useState([]);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  // Resetear a página 1 cuando cambien los productos (por filtros)
  useEffect(() => {
    setCurrentPage(1);
  }, [productos]);

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      console.log('Cargando favoritos para:', user.email);
      
      fetch('http://localhost:8080/api/v1/favoritos', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Response favoritos:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Favoritos cargados:', data);
          const ids = data.map(f => f.producto.id);
          setFavoritos(ids);
        })
        .catch(error => {
          console.error('Error al cargar favoritos:', error);
        });
    } else {
      setFavoritos([]);
    }
  }, [user, isAuthenticated]);

  const handleFavoriteClick = (productoId) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para usar favoritos.');
      return;
    }

    const esFavorito = favoritos.includes(productoId);
    const method = esFavorito ? 'DELETE' : 'POST';
    const url = esFavorito
      ? `http://localhost:8080/api/v1/favoritos/${productoId}`
      : `http://localhost:8080/api/v1/favoritos`;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      ...(method === 'POST' && {
        body: JSON.stringify({ productoId })
      })
    };

    console.log('Haciendo request favorito:', method, productoId);

    fetch(url, options)
      .then(response => {
        console.log('Response favorito:', response.status);
        if (response.ok) {
          if (method === 'DELETE') {
            return { success: true };
          } else {
            return response.json();
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then(() => {
        console.log('Favorito actualizado exitosamente');
        if (esFavorito) {
          setFavoritos(prev => prev.filter(id => id !== productoId));
        } else {
          setFavoritos(prev => [...prev, productoId]);
        }
      })
      .catch(error => {
        console.error('Error al actualizar favorito:', error);
        alert('Error: ' + error.message);
      });
  }

  // Calcular productos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductos = productos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(productos.length / itemsPerPage);

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

  return (
    <div>
      {/* Información de productos */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-leather-600">
          Mostrando {startIndex + 1}-{Math.min(endIndex, productos.length)} de {productos.length} productos
        </p>
        {totalPages > 1 && (
          <p className="text-leather-600 text-sm">
            Página {currentPage} de {totalPages}
          </p>
        )}
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProductos.map((producto) => (
          <ProductCard 
            key={producto.id}
            {...producto}
            isFavorite={favoritos.includes(producto.id)}
            onFavoriteClick={handleFavoriteClick}
          />
        ))}
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-leather-300 rounded-lg text-leather-700 hover:bg-leather-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          {/* Números de página */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Mostrar solo algunas páginas alrededor de la actual
                const delta = 2;
                return page === 1 || page === totalPages || 
                       (page >= currentPage - delta && page <= currentPage + delta);
              })
              .map((page, index, array) => {
                // Agregar "..." si hay saltos
                const elements = [];
                if (index > 0 && array[index - 1] < page - 1) {
                  elements.push(
                    <span key={`dots-${page}`} className="px-2 py-1 text-leather-500">
                      ...
                    </span>
                  );
                }
                
                elements.push(
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-leather-800 text-white'
                        : 'text-leather-700 hover:bg-leather-100'
                    }`}
                  >
                    {page}
                  </button>
                );
                
                return elements;
              })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-leather-300 rounded-lg text-leather-700 hover:bg-leather-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;