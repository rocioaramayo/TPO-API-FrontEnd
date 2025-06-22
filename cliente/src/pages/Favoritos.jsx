import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavoritosCompletos, removeFavorito } from '../store/slices/favoritosSlice';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Favoritos = () => {
    const dispatch = useDispatch();
    const { items: favoritos, loading, error } = useSelector(state => state.favoritos);
    const { isAuthenticated } = useSelector(state => state.users);

    useEffect(() => {
        dispatch(fetchFavoritosCompletos());
    }, [dispatch]);

    const handleRemoveFavorito = (productoId) => {
        dispatch(removeFavorito(productoId));
    };

    // Placeholder handlers for cart functionality
    const handleCartClick = () => {
        console.log('Cart clicked from Favoritos');
    };

    const handleAuthRequired = () => {
        console.log('Auth required from Favoritos');
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver tus favoritos</h2>
                <Link to="/login" className="text-blue-500 hover:underline">Iniciar Sesión</Link>
            </div>
        );
    }
    
    if (loading) {
        return <div className="text-center py-20">Cargando favoritos...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mis Favoritos</h1>
                        <p className="mt-2 text-lg text-gray-600">Productos que has marcado para ver más tarde.</p>
                    </div>

                    {favoritos.length === 0 ? (
                        <div className="text-center bg-white p-12 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes favoritos aún</h3>
                            <p className="text-gray-600 mb-6">Explora nuestros productos y guarda los que más te gusten.</p>
                            <Link to="/productos" className="bg-leather-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-leather-900 transition-all duration-300">
                                Ver Productos
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="text-sm text-gray-600 mb-4">
                                {favoritos.length} producto{favoritos.length !== 1 ? 's' : ''} en favoritos
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {favoritos.map((favorito) => (
                                    <ProductCard
                                        key={favorito.id}
                                        product={favorito.producto}
                                        onFavoriteClick={() => handleRemoveFavorito(favorito.producto.id)}
                                        onCartClick={handleCartClick}
                                        onAuthRequired={handleAuthRequired}
                                        isFavorite={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Favoritos;