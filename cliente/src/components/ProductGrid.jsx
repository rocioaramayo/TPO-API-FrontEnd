import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';

const ProductGrid = ({ productos, loading, onLimpiarFiltros, user }) => {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (user && user.token) {
      // AGREGAR headers de Authorization
      fetch('http://localhost:8080/api/v1/favoritos', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Favoritos cargados:', data); // Debug
          const ids = data.map(f => f.producto.id);
          setFavoritos(ids);
        })
        .catch(error => {
          console.error('Error al cargar favoritos:', error);
        });
    }
  }, [user]);

  const handleFavoriteClick = (productoId) => {
    if (!user) {
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
        'Authorization': `Bearer ${user.token}` // ← ESTO ES CLAVE
      },
      ...(method === 'POST' && {
        body: JSON.stringify({ productoId })
      })
    };

    console.log('Haciendo request:', method, url); // Debug
    console.log('Con token:', user.token ? 'SÍ' : 'NO'); // Debug

    fetch(url, options)
      .then(response => {
        console.log('Response status:', response.status); // Debug
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
        console.log('Favorito actualizado exitosamente'); // Debug
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
  };

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard 
          key={producto.id}
          {...producto}
          user={user}
          isFavorite={favoritos.includes(producto.id)}
          onFavoriteClick={handleFavoriteClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;