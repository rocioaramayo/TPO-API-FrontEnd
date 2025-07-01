import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import AuthMessage from './AuthMessage';
import FavoriteNotification from './FavoriteNotification';

// Definición de guessMimeType antes de cualquier uso
const guessMimeType = (foto) => {
  if (foto?.nombre) {
    const ext = foto.nombre.split('.').pop().toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
  }
  if (foto?.file && foto.file.startsWith("/9j/")) return "image/jpeg";
  return "image/jpeg";
};

const ProductCard = ({ 
  product,
  isFavorite,
  onFavoriteClick,
  onCartClick,
  onAuthRequired
}) => {
  // Log para debug de productos relacionados
  // eslint-disable-next-line no-console
  console.log('ProductCard: producto recibido', product);

  const { id, nombre, descripcion, precio, stock, categoria, fotos } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({ isAdded: false, productName: '' });
  const [fotoIndex, setFotoIndex] = useState(0);
  const user = useSelector((state) => state.users.user);


  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);

  const handleClick = () => {
    navigate(`/productos/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    dispatch(addToCart(product));
    if (onCartClick) {
      onCartClick();
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    const willBeAdded = !isFavorite;
    setNotificationData({ isAdded: willBeAdded, productName: nombre });
    if (onFavoriteClick) {
      onFavoriteClick(id);
    }
    setTimeout(() => setShowNotification(true), 100);
  };

  const foto = fotos && fotos.length > 0 ? fotos[fotoIndex % fotos.length] : null;
  const mimeType = guessMimeType(foto);
  const fotoPrincipal =
    foto && (foto.file || foto.contenidoBase64)
      ? `data:${mimeType};base64,${foto.file || foto.contenidoBase64}`
      : null;

  return (
    <>
      <div
        className="group relative flex flex-col h-full bg-white transition-shadow duration-300 overflow-hidden cursor-pointer border border-transparent hover:border-gray-200"
        onClick={handleClick}
      >
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {fotoPrincipal ? (
            <img
              src={fotoPrincipal}
              alt={nombre}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Image Navigation & Favorite Button (Appear on hover) */}
          <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {fotos?.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFotoIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
                  }}
                  className="bg-white/80 hover:bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-md"
                >
                  <span className="text-xl text-orange-950">‹</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFotoIndex((prev) => (prev + 1) % fotos.length);
                  }}
                  className="bg-white/80 hover:bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-md"
                >
                  <span className="text-xl text-orange-950">›</span>
                </button>
              </>
            )}
          </div>
          
          {user?.role?.toLowerCase() !== 'admin' && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <svg
                className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-400'}`}
                viewBox="0 0 24 24"
              >
                <path
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}

          {stock > 0 && stock < 10 && (
            <div className="absolute top-3 left-3 bg-red-800 text-white text-[10px] font-semibold px-2 py-1 rounded-full tracking-wider uppercase">
              Poco Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-grow p-4 text-center flex flex-col">
          <div className="flex-grow">
            <h3 className="text-base font-light text-orange-950 mb-1 tracking-wide">
              {nombre}
            </h3>
            <p className="font-serif italic text-sm text-amber-900 mb-3">
              {typeof categoria === 'string' ? categoria : categoria?.nombre || 'Sin categoría'}
            </p>
          </div>
          <div className="mt-auto">
            <span className="text-lg font-medium text-orange-950">{formatPrice(precio)}</span>
            {user?.role?.toLowerCase() !== 'admin' && (
                <button
                    onClick={handleAddToCart}
                    className="mt-3 w-full bg-transparent border border-orange-900 text-orange-950 py-2 text-sm font-light tracking-wider
               hover:bg-orange-950 hover:text-white transition-all duration-300"
                >
                  Añadir al Carrito
                </button>
            )}
          </div>
        </div>
      </div>

      <FavoriteNotification
        isVisible={showNotification}
        isAdded={notificationData.isAdded}
        productName={notificationData.productName}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default ProductCard;
