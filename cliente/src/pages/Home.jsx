import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import carrusel1 from '../assets/CARRUSEL_OFICIAL_1.jpg';
import artesano from '../assets/artesano-trabajando.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice';
import FeaturedProducts from '../components/FeaturedProducts';
import { useNavigate, Link } from 'react-router-dom';
import cueroFondo from '../assets/cuero-fondo.jpg';
import Footer from '../components/Footer';
import cercaTextura from '../assets/cerca-en-la-textura-delicada.jpg';
import CategoryGrid from '../components/CategoryGrid';

const heroImage = cueroFondo;

const Home = () => {
  const dispatch = useDispatch();
  const { items: productos, loading } = useSelector((state) => state.products);
  const [isVisible, setIsVisible] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const { isAuthenticated } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);



  // el effect ponerle ligca=
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 300);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleFavoriteClick = (productoId) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para usar favoritos.');
      return;
    }
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productoId)) {
        newFavorites.delete(productoId);
      } else {
        newFavorites.add(productoId);
      }
      return newFavorites;
    });
  };

  const handleProductClick = (id) => {
    alert(`Navegando al producto ${id}`);
  };

  const handleNavigation = (path) => {
    alert(`Navegando a: ${path}`);
  };

  // Selecciono los 3 productos más recientes (por id descendente)
  const featuredProducts = [...productos].sort((a, b) => b.id - a.id).slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-orange-100 to-amber-100">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            zIndex: 1
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={heroRef}
              className={`max-w-3xl mx-auto sticky top-0 transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <h1 className="text-7xl lg:text-8xl font-light text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] mb-8 leading-none tracking-tight">
  Cuero
  <span className="block font-serif italic text-orange-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
    Argentino
  </span>
</h1>

              <div className="w-32 h-1 mx-auto mb-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 rounded-full animate-pulse"></div>
              <p className="text-xl lg:text-2xl text-orange-200 mb-6 leading-relaxed font-light max-w-2xl mx-auto">
                Cada pieza cuenta una historia de 40 años de experiencia
              </p>
              <p className="text-2xl font-serif italic text-amber-400 mb-12 animate-fadeIn delay-300">
                Descubrí la pasión y el arte en cada pieza de cuero
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => navigate('/productos')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-900 to-amber-900 text-white font-medium tracking-wide overflow-hidden transition-all duration-300 hover:from-orange-800 hover:to-amber-800 shadow-lg"
                >
                  <span className="relative z-10">Explorar Colección</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                {!isAuthenticated && (
                  <button
  onClick={() => navigate('/register')}
  className="px-8 py-4 border border-white text-white font-light tracking-wider bg-transparent hover:bg-white hover:text-black transition duration-300 rounded"

>
  Crear Cuenta
</button>

                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section 
        id="philosophy" 
        data-animate
        className={`py-32 px-4 transition-all duration-1000 ${
          isVisible.philosophy ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.8)), url(${artesano})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-xs font-medium text-orange-300 bg-orange-900/50 px-4 py-2 rounded-full tracking-widest uppercase">
                    Desde 1985
                  </span>
                </div>
                
                <h2 className="text-5xl lg:text-6xl font-light text-white leading-tight">
                  Tradición que
                  <span className="block font-serif italic text-amber-400">trasciende</span>
                </h2>
              </div>
              
              <div className="w-32 h-px bg-gradient-to-r from-orange-500 to-amber-300"></div>
              
              <div className="space-y-6">
                <p className="text-lg text-orange-200 leading-relaxed font-light">
                  En cada puntada reside el alma de la artesanía argentina. 
                  Cuatro décadas perfeccionando el arte del cuero, creando piezas 
                  que trascienden tendencias y perduran en el tiempo.
                </p>
                
                <p className="text-orange-300 leading-relaxed">
                  Nuestros maestros artesanos transforman materiales nobles en 
                  objetos de deseo, donde cada imperfección cuenta una historia 
                  y cada detalle habla de excelencia.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-x-8 gap-y-4 pt-6 border-t border-white/10">
                <Link to="/garantia" className="text-amber-300 hover:text-white transition duration-300 flex items-center gap-2 group text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span>Nuestra Garantía</span>
                </Link>
                <Link to="/cuidado-del-cuero" className="text-amber-300 hover:text-white transition duration-300 flex items-center gap-2 group text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  <span>Cuidado del Cuero</span>
                </Link>
              </div>

              <div className="flex space-x-8 pt-8">
                <div>
                  <div className="text-3xl font-light text-white mb-2">40+</div>
                  <div className="text-sm text-orange-300 uppercase tracking-wide">Años de experiencia</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white mb-2">100%</div>
                  <div className="text-sm text-orange-300 uppercase tracking-wide">Artesanal</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white mb-2">∞</div>
                  <div className="text-sm text-orange-300 uppercase tracking-wide">Durabilidad</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M11 7.343V10a1 1 0 001 1h2.657" />
                      </svg>
                    </div>
                    <div className="text-white font-medium text-xl mb-2">Maestros Artesanos</div>
                    <div className="text-orange-200 text-sm">Creando belleza desde 1985</div>
                  </div>
                </div>
              </div>
              
              {/* Floating element */}
              <div className="absolute -bottom-8 -left-8 bg-black/40 p-8 rounded-2xl shadow-2xl max-w-xs backdrop-blur-lg border border-white/10">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-white">Certificación Artesanal</h4>
                  <p className="text-sm text-orange-200">Cada pieza lleva el sello de autenticidad de nuestros maestros.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Testimonials */}
      <section 
        id="testimonials" 
        data-animate
        className={`py-24 px-4 transition-all duration-1000 ${
          isVisible.testimonials ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(255, 247, 237, 0.9), rgba(255, 250, 245, 0.95)), url(${cercaTextura})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-orange-950 mb-8">
              Voces de
              <span className="block font-serif italic text-amber-900">excelencia</span>
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-orange-600 to-amber-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                text: "La calidad del cuero es excepcional. Después de dos años de uso diario, mi cartera se ve aún mejor que el primer día.",
                author: "María Elena Rodríguez",
                role: "Arquitecta"
              },
              {
                text: "Cada detalle refleja el amor por el oficio. Es reconfortante saber que existen artesanos que mantienen viva la tradición.",
                author: "Carlos Mendoza",
                role: "Coleccionista"
              },
              {
                text: "Más que un accesorio, es una obra de arte funcional. La inversión vale cada peso gastado.",
                author: "Ana Sofía Torres",
                role: "Empresaria"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/60 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20">
                <div className="mb-6">
                  <svg className="w-8 h-8 text-orange-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                <p className="text-orange-800 leading-relaxed mb-6 font-light">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-orange-200 pt-6">
                  <div className="font-medium text-orange-950">{testimonial.author}</div>
                  <div className="text-sm text-orange-700">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Destacadas debajo de reviews */}
      {(() => {
        const { items: categorias } = useSelector((state) => state.categories);
        // Si hay menos de 6, completar con placeholders visuales
        const placeholders = Array.from({ length: Math.max(0, 6 - categorias.length) }, (_, i) => ({
          nombre: '',
          img: '',
          key: `ph-${i}`
        }));
        // Usar el nombre real de la categoría
        const categoriasGrid = [
          ...categorias.map((cat, idx) => ({
            nombre: cat.nombre || cat.name,
            img: '', // Las imágenes se asignan en el componente
            key: cat.id || cat.nombre || cat.name || idx
          })),
          ...placeholders
        ].slice(0, 6);
        return <CategoryGrid categories={categoriasGrid} />;
      })()}

      <Footer />
    </div>
  );
};

export default Home;