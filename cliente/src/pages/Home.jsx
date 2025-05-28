// cliente/src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import artesano from "../assets/artesano-trabajando.jpg";
import ProductCard from '../components/ProductCard';

const Home = ({ user, logout }) => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener productos REALES del backend
  useEffect(() => {
    const URL = "http://localhost:8080/productos";
    
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        // Tomar solo los primeros 3 productos para destacados
        const destacados = data.productos ? data.productos.slice(0, 3) : [];
        setFeaturedProducts(destacados);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      });
  }, []);

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      
      {/* Hero Section - IGUAL PARA TODOS */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            
            {/* Saludo personalizado SI hay usuario */}
            {user && (
              <div className="mb-6">
                <p className="text-leather-600 text-lg">
                  ¡Hola, {user.email.split('@')[0]}! 👋
                </p>
              </div>
            )}

            <h1 className="text-3xl md:text-6xl font-serif font-bold text-leather-900 mb-6">
              Cuero
              <span className="block text-leather-700">Argentino</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-leather-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Tradición artesanal desde 1985. Cada pieza cuenta una historia de calidad y dedicación.
            </p>
            
            {/* Botones principales */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/productos')}
                className="bg-leather-800 text-white hover:bg-leather-900 text-lg px-8 py-4 rounded-lg font-medium transition-colors duration-200"
              >
                Ver Productos
              </button>
              
              {/* Botones adicionales según usuario */}
              {user ? (
                <button 
                  onClick={() => navigate('/nosotros')}
                  className="border-2 border-leather-800 text-leather-800 hover:bg-leather-800 hover:text-white text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200"
                >
                  Nuestra Historia
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/register')}
                  className="border-2 border-leather-800 text-leather-800 hover:bg-leather-800 hover:text-white text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200"
                >
                  Registrarse
                </button>
              )}
            </div>

            {/* Link de login para usuarios no logueados */}
            {!user && (
              <div className="mt-4">
                <p className="text-leather-600">
                  ¿Ya tienes cuenta?{' '}
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-leather-800 hover:text-leather-900 underline font-medium"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Acerca de nosotros - IGUAL PARA TODOS */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-leather-900 mb-6">
                Artesanía que perdura
              </h2>
              <p className="text-leather-700 text-lg mb-6 leading-relaxed">
                Durante más de 40 años, hemos perfeccionado el arte de trabajar el cuero, 
                creando piezas únicas que combinan la tradición argentina con diseños contemporáneos.
              </p>
              <p className="text-leather-600 mb-8">
                Cada producto es cuidadosamente elaborado por artesanos expertos que 
                ponen su corazón en cada puntada, garantizando durabilidad y belleza.
              </p>
              
              <div className="flex space-x-4">
                {/* TODOS pueden ver productos */}
                <button 
                  onClick={() => navigate('/productos')}
                  className="bg-leather-800 text-white hover:bg-leather-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Ver Productos
                </button>
                
                <button 
                  onClick={() => navigate('/nosotros')}
                  className="text-leather-700 hover:text-leather-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Nuestra Historia
                </button>
              </div>
            </div>
            
            <div className="bg-cream-100 rounded-lg p-8">
              <img
                src={artesano}
                alt="Artesano trabajando cuero"
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados - TODOS pueden verlos */}
      <section className="py-16 px-4 bg-cream-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-leather-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-leather-600 text-lg max-w-2xl mx-auto">
              Descubre nuestra colección de productos artesanales de cuero premium
            </p>
          </div>

          {/* Loading de productos */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-leather-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-leather-600">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {featuredProducts.map((producto) => (
                //uso el componente ProductCard para mostrar cada producto
                <ProductCard 
                  key={producto.id}
                  {...producto}
                  user={user}
                  isFavorite={false}
                  onFavoriteClick={() => {}}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            {/* TODOS pueden ver todos los productos */}
            <button 
              onClick={() => navigate('/productos')}
              className="bg-leather-800 text-white hover:bg-leather-900 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Ver todos los productos
            </button>
            
            {/* Mensaje  solo para usuarios NO logueados */}
            {!user && (
              <p className="text-leather-600 mt-4 text-sm">
                💡 Regístrate para agregar productos a favoritos y realizar compras
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final - SOLO para usuarios NO logueados */}
      {!user && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-leather-800 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-serif font-bold mb-4">
                ¿Listo para descubrir la calidad argentina?
              </h2>
              
              <p className="text-cream-100 text-lg mb-8 max-w-2xl mx-auto">
                Únete a miles de clientes satisfechos y descubre la diferencia 
                de los productos de cuero artesanales argentinos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-leather-700 hover:bg-gray-200 px-8 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Registrarse Gratis
                </button>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-white text-white hover:bg-white hover:text-leather-700 px-8 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Ya tengo cuenta
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer/>
    </div>
  );
};

export default Home;