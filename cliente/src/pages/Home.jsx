// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const Home = ({ user, logout }) => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleLogout = () => {
    logout();
  };

  // Datos de ejemplo para productos destacados
  useEffect(() => {
    setFeaturedProducts([
      {
        id: 1,
        name: "Cartera Artesanal Premium",
        price: 89500,
        image: "/api/placeholder/300/200",
        category: "Carteras",
        description: "Cartera de cuero vacuno premium con acabado artesanal"
      },
      {
        id: 2,
        name: "Cinturón Gaucho Tradicional",
        price: 45000,
        image: "/api/placeholder/300/200",
        category: "Cinturones",
        description: "Cinturón de cuero crudo con hebilla de alpaca"
      },
      {
        id: 3,
        name: "Billetera Minimalista",
        price: 32000,
        image: "/api/placeholder/300/200",
        category: "Billeteras",
        description: "Diseño minimalista en cuero flor"
      }
    ]);

    setCategories([
      { id: 1, name: "Carteras", count: 15, icon: "👜" },
      { id: 2, name: "Cinturones", count: 23, icon: "👔" },
      { id: 3, name: "Billeteras", count: 18, icon: "💳" },
      { id: 4, name: "Mochilas", count: 12, icon: "🎒" }
    ]);
  }, []);

  // Contenido para usuarios no autenticados
  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50">
        {/* Hero Section - Público */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-6xl font-serif font-bold text-leather-900 mb-6">
                Cuero
                <span className="block text-leather-700">Argentino</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-leather-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Tradición artesanal desde 1985. Cada pieza cuenta una historia de calidad y dedicación.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-leather-800 text-white hover:bg-leather-900 text-lg px-8 py-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Únete Ahora
                </button>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-leather-800 text-leather-800 hover:bg-leather-800 hover:text-white text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Acerca de nosotros */}
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
                    onClick={() => navigate('/register')}
                    className="bg-leather-800 text-white hover:bg-leather-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Explorar Productos
                  </button>
                  <button className="text-leather-700 hover:text-leather-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                    Nuestra Historia
                  </button>
                </div>
              </div>
              <div className="bg-cream-100 rounded-lg p-8">
                <img 
                  src="/api/placeholder/500/400" 
                  alt="Artesano trabajando cuero"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Productos destacados - Vista previa */}
        <section className="py-16 px-4 bg-cream-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-leather-900 mb-4">
                Nuestros Productos
              </h2>
              <p className="text-leather-600 text-lg max-w-2xl mx-auto">
                Descubre nuestra colección de productos artesanales de cuero premium
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="bg-cream-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <span className="text-sm text-leather-600 font-medium bg-leather-100 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    
                    <h3 className="font-serif text-xl font-bold text-leather-900 mb-2 mt-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-leather-600 text-sm mb-4">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-leather-700">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-leather-600 mb-4">
                ¿Quieres ver más productos y realizar compras?
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="bg-leather-800 text-white hover:bg-leather-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Crear una cuenta gratuita
              </button>
            </div>
          </div>
        </section>

        {/* CTA Final */}
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
        <Footer/>
      </div>
       
    );
   
  }

  

};

export default Home;