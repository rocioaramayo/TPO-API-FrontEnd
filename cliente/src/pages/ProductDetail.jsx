import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
const ProductDetail=() =>{
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const URL = `http://localhost:8080/productos/detalle/${id}`;

    useEffect(() => {  
        console.log("Haciendo fetch a:", URL); // Debug
        
        fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            setProducto(data);
            console.log("Producto cargado:", data);
        })
        .catch((error) => {
            console.error("Error al cargar el producto:", error);
        });
    }, [id]);
// función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };
  // Si no hay producto, mostrar loading
  if (!producto) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-leather-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-leather-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb, es tipo para q el usaurio pueda volver atras y se localice */}
      <div className="bg-white border-b border-leather-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <button 
              onClick={() => navigate('/')}
              className="text-leather-600 hover:text-leather-800"
            >
              Inicio
            </button>
            <span className="mx-2 text-leather-400">/</span>
            <button 
              onClick={() => navigate('/productos')}
              className="text-leather-600 hover:text-leather-800"
            >
              Productos
            </button>
            <span className="mx-2 text-leather-400">/</span>
            <span className="text-leather-800 font-medium">{producto.nombre}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Galería */}
          <div>
            {/* Imagen principal */}
            <div className="aspect-square bg-cream-100 rounded-lg mb-4 relative overflow-hidden">
              {producto.fotos && producto.fotos.length > 0 ? (
                <>
                  <img
                    src={producto.fotos[selectedPhoto].contenidoBase64}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                  {/*stock bajo */}
                  {producto.pocoStock && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded">
                        ¡Poco stock!
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-leather-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {producto.fotos && producto.fotos.length > 1 && (
              <div className="flex space-x-2">
                {producto.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedPhoto === index ? 'border-leather-800' : 'border-leather-200'
                    }`}
                  >
                    <img
                      src={foto.contenidoBase64}
                      alt={`${producto.nombre} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info producto */}
          <div>
            <span className="inline-block bg-leather-100 text-leather-700 text-sm font-medium px-3 py-1 rounded mb-4">
              {producto.categoria}
            </span>
            <h1 className="text-3xl font-serif font-bold text-leather-900 mb-4">
              {producto.nombre}
            </h1>
            <div className="mb-6">
              <span className="text-4xl font-bold text-leather-800">
                {formatPrice(producto.precio)}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-leather-900 mb-2">Descripción</h3>
              <p className="text-leather-600 leading-relaxed">
                {producto.descripcion}
              </p>
            </div>

            {(producto.tipoCuero || producto.color || producto.acabado) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-leather-900 mb-3">Características</h3>
                <div className="grid grid-cols-2 gap-4">
                  {producto.tipoCuero && (
                    <div>
                      <span className="text-sm text-leather-600">Tipo de cuero:</span>
                      <p className="font-medium text-leather-800">{producto.tipoCuero}</p>
                    </div>
                  )}
                  {producto.color && (
                    <div>
                      <span className="text-sm text-leather-600">Color:</span>
                      <p className="font-medium text-leather-800">{producto.color}</p>
                    </div>
                  )}
                  {producto.acabado && (
                    <div>
                      <span className="text-sm text-leather-600">Acabado:</span>
                      <p className="font-medium text-leather-800">{producto.acabado}</p>
                    </div>
                  )}
                  {producto.grosor && (
                    <div>
                      <span className="text-sm text-leather-600">Grosor:</span>
                      <p className="font-medium text-leather-800">{producto.grosor}</p>
                    </div>
                  )}
                  {producto.textura && (
                    <div>
                      <span className="text-sm text-leather-600">Textura:</span>
                      <p className="font-medium text-leather-800">{producto.textura}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <span className="text-sm text-leather-600">Stock disponible:</span>
              <p className="font-medium text-leather-800">{producto.stock} unidades</p>
            </div>

            {/* Instrucciones de cuidado */}
            {producto.instruccionesCuidado && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-leather-900 mb-2">Cuidado del producto</h3>
                <p className="text-leather-600 text-sm leading-relaxed bg-cream-100 p-4 rounded-lg">
                  {producto.instruccionesCuidado}
                </p>
              </div>
            )}

            {/* Botones  */}
            <div className="space-y-4">
              <button 
                className="w-full bg-leather-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-leather-900 transition-colors"
                onClick={() => alert('Funcionalidad de carrito próximamente')}
              >
                Agregar al carrito
              </button>
              
              <button 
                onClick={() => navigate('/productos')}
                className="w-full border-2 border-leather-800 text-leather-800 py-3 px-6 rounded-lg font-medium hover:bg-leather-800 hover:text-white transition-all"
              >
                Volver a productos
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};


export default ProductDetail