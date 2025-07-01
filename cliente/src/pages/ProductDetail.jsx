// Deducir tipo mime a partir del nombre del archivo (si existe)
function guessMimeType(foto) {
  if (foto?.nombre) {
    const ext = foto.nombre.split('.').pop().toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
  }
  // Si empieza con "/9j/" probablemente es JPEG
  if (foto?.file && foto.file.startsWith("/9j/")) return "image/jpeg";
  // Default
  return "image/jpeg";
}
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../store/slices/productsSlice';
import { addFavorito, removeFavorito, fetchFavoritos } from '../store/slices/favoritosSlice';
import { addToCart } from '../store/slices/cartSlice';
import Footer from '../components/Footer';
import AuthMessage from '../components/AuthMessage';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import FavoriteNotification from '../components/FavoriteNotification';
import RelatedProducts from '../components/RelatedProducts';

const AccordionItem = ({ title, children, isOpen, onClick }) => (
  <div className="border-b border-gray-200 py-6">
    <button onClick={onClick} className="w-full flex justify-between items-center text-left">
      <span className="text-lg font-light text-orange-950">{title}</span>
      <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <div className="prose prose-sm font-light text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const ProductDetail = ({ onCartClick, onAuthRequired }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Leer desde el estado de Redux
    const { user, isAuthenticated } = useSelector((state) => state.users);
    const { selectedProduct: producto, loading, error } = useSelector((state) => state.products);
    const { ids: favoritos } = useSelector((state) => state.favoritos);
    
    const [stockLimite, setStockLimite] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const [showAuthMessage, setShowAuthMessage] = useState(false);
    const [reviewsKey, setReviewsKey] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({
      isAdded: false,
      productName: ''
    });
    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState('descripcion');
    
    // Usar Redux para cargar el producto
    useEffect(() => {  
        if (id) {
            dispatch(fetchProductById(id));
            if (isAuthenticated) {
                dispatch(fetchFavoritos());
            }
        }
    }, [id, dispatch, isAuthenticated]);

    useEffect(() => {
        if (producto) {
            setSelectedPhoto(0); // Reset photo on product change
            setIsFavorite(favoritos.includes(producto.id));
        }
    }, [producto, favoritos]);

    // Manejar toggle de favoritos
    const handleFavoriteToggle = () => {
        if (!isAuthenticated) {
            if (onAuthRequired) {
                onAuthRequired();
            }
            return;
        }
        if (!producto) return;

        const currentlyFavorite = favoritos.includes(producto.id);

        if (currentlyFavorite) {
            dispatch(removeFavorito(producto.id));
            setNotificationData({ isAdded: false, productName: producto.nombre });
        } else {
            dispatch(addFavorito(producto.id));
            setNotificationData({ isAdded: true, productName: producto.nombre });
        }
        setShowNotification(true);
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            if (onAuthRequired) {
                onAuthRequired();
            }
            return;
        }
        if (!producto) return;

        // Añadimos el producto con la cantidad seleccionada
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart(producto));
        }
        if (onCartClick) {
            onCartClick(); // Abrimos el sidebar del carrito
        }
    };

    // función para formatear precio
    function formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    }

    // Si no hay producto, mostrar loading o error
    if (loading) {
        return (
            <div className="min-h-screen bg-cream-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-leather-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-leather-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error) {
      return (
            <div className="min-h-screen bg-cream-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-serif text-red-700 mb-4">Error</h2>
                    <p className="text-leather-600">No se pudo cargar el producto.</p>
                    <p className="text-sm text-gray-500 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (!producto) {
        return null; // O un mensaje de "Producto no encontrado"
    }

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="py-6 text-sm">
                    <button onClick={() => navigate('/')} className="hover:text-amber-800">Inicio</button>
                    <span className="mx-2 text-gray-400">/</span>
                    <button onClick={() => navigate('/productos')} className="hover:text-amber-800">Productos</button>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="font-medium text-orange-950">{producto.nombre}</span>
                </nav>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 pb-24">
                    {/* Gallery */}
                    <section className="space-y-4">
                        <div className="aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden">
                            {producto.fotos?.length > 0 && (
                                <img
                                    src={`data:${guessMimeType(producto.fotos[selectedPhoto])};base64,${producto.fotos[selectedPhoto].file || producto.fotos[selectedPhoto].contenidoBase64}`}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        
                        {/* Thumbnails below main image */}
                        {producto.fotos && producto.fotos.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {producto.fotos.map((foto, index) => (
                                    <button
                                        key={foto.id || index}
                                        onClick={() => setSelectedPhoto(index)}
                                        className={`flex-shrink-0 aspect-square w-20 rounded-md overflow-hidden border-2 transition-colors ${selectedPhoto === index ? 'border-amber-800' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img
                                            src={`data:${guessMimeType(foto)};base64,${foto.file || foto.contenidoBase64}`}
                                            alt={`${producto.nombre} - thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Product Info */}
                    <section className="py-8 lg:py-0">
                        <h1 className="text-4xl font-light text-orange-950 leading-tight">{producto.nombre}</h1>
                        <p className="text-3xl font-medium text-amber-900 mt-4">{formatPrice(producto.precio)}</p>
                        
                        <div className="mt-6 flex items-center gap-4">
                            {/* Solo mostrar si el usuario no es admin */}
                            {(!user || user.role !== "ADMIN") && (
                                <>
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button onClick={() => {
                                            setQuantity(q => Math.max(1, q - 1))
                                            setStockLimite(false)
                                        }} className="px-4 py-3 text-lg hover:bg-gray-100 rounded-l-md transition-colors">-</button>
                                        <span className="px-5 py-3 text-base font-medium">{quantity}</span>
                                        <button onClick={() => {
                                            setQuantity(q => Math.min(producto.stock, q + 1))
                                            if(producto.stock == quantity) setStockLimite(true)
                                        }} className="px-4 py-3 text-lg hover:bg-gray-100 rounded-r-md transition-colors">+</button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-orange-950 text-white py-3 px-6 rounded-md font-light tracking-wider hover:bg-orange-900 transition-colors uppercase text-sm"
                                    >
                                        Añadir al Carrito
                                    </button>
                                    <button
                                        onClick={handleFavoriteToggle}
                                        className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                                        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                    >
                                        <svg className={`w-6 h-6 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24">
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        {stockLimite ? <p className="bg-red-50 border border-red-200 text-red-700 px-2 mt-4 py-2 rounded text-xs w-fit" >¡Ups! No hay mas unidades en stock. No puedes agregar mas por el momento.</p>:null}
                        {/* Mostrar stock solo si el usuario no es admin */}
                        {(!user || user.role !== "ADMIN") && (
                          <p className="mt-4 text-sm text-gray-500">{producto.stock > 0 ? `Disponible - ${producto.stock} unidades en stock` : 'Agotado'}</p>
                        )}

                        <div className="mt-10">
                            <AccordionItem title="Descripción" isOpen={openAccordion === 'descripcion'} onClick={() => setOpenAccordion('descripcion')}>
                                <p>{producto.descripcion}</p>
                                <ul className="list-disc pl-5 mt-4 space-y-1">
                                    <li>Tipo de Cuero: {producto.tipoCuero}</li>
                                    <li>Color: {producto.color}</li>
                                    <li>Categoría: {producto.categoria}</li>
                                </ul>
                            </AccordionItem>
                            <AccordionItem title="Envíos y Devoluciones" isOpen={openAccordion === 'envios'} onClick={() => setOpenAccordion('envios')}>
                                <p>Ofrecemos envío gratuito a todo el país en compras superiores a $50.000. Las devoluciones son gratuitas dentro de los 30 días posteriores a la compra.</p>
                            </AccordionItem>
                            <AccordionItem title="Cuidado del Cuero" isOpen={openAccordion === 'cuidado'} onClick={() => setOpenAccordion('cuidado')}>
                                <p>Para mantener tu producto en las mejores condiciones, evita la exposición prolongada al sol y al agua. Limpia con un paño seco y suave y usa acondicionadores de cuero de calidad periódicamente.</p>
                            </AccordionItem>
                        </div>
                    </section>
                </main>
                
                <section className="pb-24">
                    <ReviewList key={producto.id} productoId={producto.id} />
                    {isAuthenticated && <ReviewForm productoId={producto.id} />}
                </section>

                {/* Productos Relacionados */}
                {producto.categoriaId && (
                    <RelatedProducts 
                        categoriaId={producto.categoriaId}
                        excludeProductId={producto.id}
                        onCartClick={onCartClick}
                        onAuthRequired={onAuthRequired}
                    />
                )}
            </div>
            
            <AuthMessage isOpen={false} />
            <FavoriteNotification isVisible={showNotification} isAdded={notificationData.isAdded} productName={notificationData.productName} onClose={() => setShowNotification(false)} />
            <Footer />
        </div>
    );
};

export default ProductDetail