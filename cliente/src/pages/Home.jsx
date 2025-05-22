// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = ({ user, logout }) => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  return (
    <div className="min-h-screen bg-gradient-leather-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-leather-light py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-leather-texture opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-responsive-3xl font-serif font-bold text-leather-900 mb-6 animate-fade-in">
              Cuero
              <span className="block text-cognac-700">Argentino</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-leather-700 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Tradición artesanal desde 1985. Cada pieza cuenta una historia de calidad y dedicación.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <button 
                onClick={() => navigate('/productos')}
                className="btn-leather text-lg px-8 py-4"
              >
                Explorar Productos
              </button>
              
              <button 
                onClick={() => navigate('/nosotros')}
                className="btn-outline-leather text-lg px-8 py-4"
              >
                Nuestra Historia
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-cognac-200 rounded-full opacity-20" style={{animation: 'pulse 2s infinite'}}></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-leather-200 rounded-full opacity-20" style={{animation: 'pulse 2s infinite 0.5s'}}></div>
      </section>

      {/* Welcome Message */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-leather">
            <h2 className="text-2xl font-serif font-bold text-leather-800 mb-4">
              ¡Bienvenido, {user.email.split('@')[0]}!
            </h2>
            <p className="text-leather-600 text-lg">
              Descubre nuestra colección de productos de cuero artesanales, 
              cada uno creado con la máxima dedicación y calidad.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-leather-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-leather-600 text-lg max-w-2xl mx-auto">
              Selección exclusiva de nuestras piezas más apreciadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="card-leather overflow-hidden group-hover:transform group-hover:scale-105">
                  <div className="bg-cream-100 rounded-lg mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cognac-600 font-medium bg-cognac-100 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <button className="text-leather-400 hover:text-cognac-600 transition-colors p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-leather-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-leather-600 text-sm mb-4">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cognac-700">
                        ${product.price.toLocaleString()}
                      </span>
                      
                      <button className="btn-leather px-4 py-2 text-sm">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-cream-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-leather-900 mb-4">
              Categorías
            </h2>
            <p className="text-leather-600 text-lg">
              Explora nuestra amplia gama de productos artesanales
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="group cursor-pointer">
                <div className="card-leather text-center group-hover:transform group-hover:scale-105">
                  <div className="text-4xl mb-4">
                    {category.icon}
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-leather-900 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-leather-600">
                    {category.count} productos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-leather-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-leather text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-cognac-600 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-leather-700 mb-4 italic">
                "Excelente calidad y atención al detalle. Mi cartera ha durado años y sigue perfecta."
              </p>
              <p className="text-leather-600 font-medium">— María González</p>
            </div>

            <div className="card-leather text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-cognac-600 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-leather-700 mb-4 italic">
                "Artesanía tradicional con diseños modernos. Recomiendo totalmente."
              </p>
              <p className="text-leather-600 font-medium">— Carlos Ruiz</p>
            </div>

            <div className="card-leather text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-cognac-600 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-leather-700 mb-4 italic">
                "El mejor cuero que he comprado. Vale cada peso invertido."
              </p>
              <p className="text-leather-600 font-medium">— Ana Martín</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-leather rounded-2xl p-12 text-white shadow-leather-lg">
            <h2 className="text-3xl font-serif font-bold mb-4">
              ¿Listo para encontrar tu pieza perfecta?
            </h2>
            
            <p className="text-cream-100 text-lg mb-8 max-w-2xl mx-auto">
              Cada producto está hecho a mano con materiales de la más alta calidad. 
              Descubre la diferencia de la artesanía argentina.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/productos')}
                className="bg-white text-leather-700 hover:text-cognac-700 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl active:transform active:scale-95"
              >
                Ver Todos los Productos
              </button>
              
              <button 
                onClick={handleLogout}
                className="border-2 border-white text-white hover:bg-white hover:text-leather-700 px-8 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;