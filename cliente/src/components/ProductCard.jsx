import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AuthMessage from './AuthMessage';
import FavoriteNotification from './FavoriteNotification'; 

function guessMimeType(foto) {
  if (foto?.nombre) {
    const ext = foto.nombre.split('.').pop().toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
  }
  if (foto?.file && foto.file.startsWith("/9j/")) return "image/jpeg";
  return "image/jpeg";
}

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
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    isAdded: false,
    productName: ''
  });

  const [fotoIndex, setFotoIndex] = useState(0); // nuevo estado

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

  const handleClick = () => navigate(`/productos/${id}`);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) return setShowAuthMessage(true);
    const willBeAdded = !isFavorite;
    setNotificationData({ isAdded: willBeAdded, productName: nombre });
    onFavoriteClick(id);
    setTimeout(() => setShowNotification(true), 100);
    setTimeout(() => {
      window.dispatchEvent(new Event("favoritosActualizados"));
    }, 200);
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
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        {/* Imagen del producto */}
        <div className="aspect-square bg-cream-100 relative">
          {fotoPrincipal ? (
            <img
              src={fotoPrincipal}
              alt={nombre}
              className="w-full h-full object-cover"
              onError={(e) => console.error("Error cargando imagen:", e.target.src)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-leather-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Flechas de navegación */}
          {fotos?.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFotoIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
                }}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFotoIndex((prev) => (prev + 1) % fotos.length);
                }}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow"
              >
                ›
              </button>
            </>
          )}

          {/* Ícono de favorito */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-gray-50 shadow-sm"
            title={!user ? 'Regístrate para agregar a favoritos' : isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : user ? 'text-gray-400 hover:text-red-400' : 'text-gray-300'}`}
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

          {pocoStock && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">Poco stock</span>
            </div>
          )}
        </div>

        {/* Info producto */}
        <div className="p-4">
          <span className="inline-block bg-leather-100 text-leather-700 text-xs font-medium px-2 py-1 rounded mb-2">
            {categoria}
          </span>
          <h3 className="font-serif text-lg font-semibold text-leather-900 mb-2 line-clamp-2">
            {nombre}
          </h3>
          <p className="text-leather-600 text-sm mb-3 line-clamp-2">{descripcion}</p>
          {tipoCuero && (
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="text-xs bg-cream-100 text-leather-600 px-2 py-1 rounded">{tipoCuero}</span>
              {color && (
                <span className="text-xs bg-cream-100 text-leather-600 px-2 py-1 rounded">{color}</span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-leather-800">{formatPrice(precio)}</span>
          </div>
          <div className="mt-2 text-xs text-leather-500">Stock: {stock} unidades</div>
        </div>
      </div>

      <AuthMessage isOpen={showAuthMessage} onClose={() => setShowAuthMessage(false)} />
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
