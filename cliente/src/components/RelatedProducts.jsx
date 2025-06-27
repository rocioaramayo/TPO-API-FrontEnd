import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRelatedProducts } from '../store/slices/productsSlice';
import ProductCard from './ProductCard';
import { addFavorito, removeFavorito } from '../store/slices/favoritosSlice';

const RelatedProducts = ({ categoriaId, excludeProductId, onCartClick, onAuthRequired }) => {
  const dispatch = useDispatch();
  const { relatedProducts, relatedProductsLoading, relatedProductsError } = useSelector((state) => state.products);
  const { ids: favoritos } = useSelector((state) => state.favoritos);
  const categorias = useSelector((state) => state.categories.items);

  useEffect(() => {
    if (categoriaId && excludeProductId) {
      dispatch(fetchRelatedProducts({ categoriaId, excludeProductId }));
    }
  }, [categoriaId, excludeProductId, dispatch]);

  const handleFavoriteClick = (productId) => {
    const isCurrentlyFavorite = favoritos.includes(productId);
    
    if (isCurrentlyFavorite) {
      dispatch(removeFavorito(productId));
    } else {
      dispatch(addFavorito(productId));
    }
  };

  // Si no hay productos relacionados, no mostrar nada
  if (!relatedProductsLoading && (!relatedProducts || relatedProducts.length === 0)) {
    return null;
  }

  // Si solo hay 1 producto y es el mismo que el actual, tampoco mostrar
  if (!relatedProductsLoading && relatedProducts.length === 1 && relatedProducts[0].id === excludeProductId) {
    return null;
  }

  return (
    <section className="py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-orange-950 mb-4">
            Productos Relacionados
          </h2>
          <p className="text-gray-600 font-light">
            Descubre más productos de la misma categoría
          </p>
        </div>

        {relatedProductsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-leather-800 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-leather-600">Cargando productos relacionados...</span>
          </div>
        ) : relatedProductsError ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error al cargar productos relacionados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => {
              const categoriaObj = categorias.find(c => c.nombre === product.categoria);
              return (
                <ProductCard
                  key={product.id}
                  product={{ ...product, categoria: categoriaObj }}
                  isFavorite={favoritos.includes(product.id)}
                  onFavoriteClick={handleFavoriteClick}
                  onCartClick={onCartClick}
                  onAuthRequired={onAuthRequired}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedProducts; 