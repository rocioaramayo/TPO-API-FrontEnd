import CarruselHero from '../components/CarruselHero';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import artesano from "../assets/artesano-trabajando.jpg";
import ProductCard from '../components/ProductCard';

const Home = ({ logout }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);

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

  // Cargar favoritos del usuario
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      fetch('http://localhost:8080/api/v1/favoritos', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(data => {
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

  // Manejar click en favoritos
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

    fetch(url, options)
      .then(response => {
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

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <CarruselHero />

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

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-leather-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-leather-600">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {featuredProducts.map((producto) => (
                <ProductCard 
                  key={producto.id}
                  {...producto}
                  isFavorite={favoritos.includes(producto.id)}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button 
              onClick={() => navigate('/productos')}
              className="bg-leather-800 text-white hover:bg-leather-900 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Ver todos los productos
            </button>
            {!isAuthenticated && (
              <p className="text-leather-600 mt-4 text-sm">
                💡 Regístrate para agregar productos a favoritos y realizar compras
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final - SOLO para usuarios NO logueados */}
      {!isAuthenticated && (
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
