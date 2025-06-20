import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FavoriteNotification from '../components/FavoriteNotification';

const Favoritos = ({ onFavoritesUpdate }) => {
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    isAdded: false,
    productName: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    cargarFavoritos();
  }, [isAuthenticated, navigate]);

  function cargarFavoritos() {
    setLoading(true);
    
    fetch('http://localhost:8080/api/v1/favoritos', {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Favoritos cargados:', data);
        setFavoritos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar favoritos:', error);
        setLoading(false);
      });
  }

  function handleFavoritoEliminado(productoId) {
    console.log('Eliminando favorito:', productoId);
    
    // ✅ CAPTURAR EL NOMBRE DEL PRODUCTO ANTES DEL FETCH
    const favorito = favoritos.find(f => f.producto.id === productoId);
    const nombreProducto = favorito?.producto?.nombre || 'Producto';
    
    console.log('Nombre del producto a eliminar:', nombreProducto);
    
    // Eliminar el favorito del backend
    fetch(`http://localhost:8080/api/v1/favoritos/${productoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          console.log('Favorito eliminado exitosamente');
          
          // Actualizar estado local inmediatamente
          const nuevosFavoritos = favoritos.filter(f => f.producto.id !== productoId);
          setFavoritos(nuevosFavoritos);
          
          // ✅ MOSTRAR NOTIFICACIÓN
          setNotificationData({
            isAdded: false,
            productName: nombreProducto
          });
          
          setTimeout(() => {
            setShowNotification(true);
          }, 100);
          
          // ✅ NOTIFICAR AL COMPONENTE PADRE SIN MANIPULAR DOM
          if (onFavoritesUpdate) {
            onFavoritesUpdate(nuevosFavoritos);
          }
        } else {
          console.error('Error al eliminar favorito');
        }
      })
      .catch(error => {
        console.error('Error al eliminar favorito:', error);
      });
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-leather-900 mb-2">
            Mis Favoritos
          </h1>
          <p className="text-leather-600">
            Productos que has marcado como favoritos
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-leather-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-leather-600">Cargando favoritos...</p>
          </div>
        ) : favoritos.length === 0 ? (
          /* Sin favoritos */
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-leather-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-bold text-leather-900 mb-2">No tienes favoritos aún</h3>
            <p className="text-leather-600 mb-6">Explora nuestros productos y agrega los que más te gusten</p>
            <button
              onClick={() => navigate('/productos')}
              className="bg-leather-800 text-white px-6 py-2 rounded-lg hover:bg-leather-900 transition-colors"
            >
              Explorar productos
            </button>
          </div>
        ) : (
          /* Grid de favoritos */
          <>
            <div className="mb-6">
              <p className="text-leather-600">
                {favoritos.length} producto{favoritos.length !== 1 ? 's' : ''} en favoritos
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoritos.map((favorito) => (
                <ProductCard 
                  key={favorito.producto.id}
                  {...favorito.producto}
                  user={user}
                  isFavorite={true} // En la página de favoritos, todos son favoritos
                  onFavoriteClick={handleFavoritoEliminado}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <FavoriteNotification
        isVisible={showNotification}
        isAdded={notificationData.isAdded}
        productName={notificationData.productName}
        onClose={() => setShowNotification(false)}
      />
      
      <Footer />
    </div>
  );
};

export default Favoritos;