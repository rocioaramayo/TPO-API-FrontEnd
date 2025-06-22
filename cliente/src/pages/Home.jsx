import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import carrusel1 from '../assets/CARRUSEL_OFICIAL_1.jpg';
import artesano from '../assets/artesano-trabajando.jpg';
import heritageBannerImg from '../assets/fotos-bufalo_hombre-cartera.webp';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice';
import FeaturedProducts from '../components/FeaturedProducts';
import { useNavigate, Link } from 'react-router-dom';
import cueroFondo from '../assets/cuero-fondo.jpg';
import nubesConCarteras from '../assets/foto-de-nubes-concarteras.webp';
import Footer from '../components/Footer';
import cercaTextura from '../assets/cerca-en-la-textura-delicada.jpg';
import CategoryGrid from '../components/CategoryGrid';
import seleccionCuero from '../assets/cerca-en-la-textura-delicada.jpg';
import corteCuero from '../assets/fot-3carruseñ.jpg';
import costuraManual from '../assets/costuraManual-carruse_4.jpg';
import dividerBannerImg from '../assets/bufalo-homber campera.webp';
import staticDividerImg from '../assets/hombe-concarterita.webp';
import muchasCarteras from '../assets/muchascartera-jutnas.webp';

const heroImage = nubesConCarteras;

const Home = () => {
  const dispatch = useDispatch();
  const { items: productos, loading } = useSelector((state) => state.products);
  const [isVisible, setIsVisible] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const { isAuthenticated } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // el effect ponerle ligca=
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 300);
  }, []);

  // Auto-rotate craftsmanship steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
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

  const craftSteps = [
    { 
      title: "SELECCIÓN", 
      subtitle: "Cuero Premium", 
      desc: "Cuero argentino de grano completo, seleccionado a mano por su carácter y durabilidad.",
      img: seleccionCuero 
    },
    { 
      title: "MANUFACTURA", 
      subtitle: "Construcción Experta", 
      desc: "Cortado y moldeado por maestros artesanos utilizando técnicas tradicionales.",
      img: corteCuero 
    },
    { 
      title: "ACABADO", 
      subtitle: "Detalles Cosidos a Mano", 
      desc: "Cada puntada está reforzada para resistir toda una vida de uso rudo.",
      img: costuraManual 
    },
  ];

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

      {/* Collection Section */}
      <section 
        id="collection-highlight"
        data-animate
        className={`py-32 px-4 bg-white transition-all duration-1000 ${
          isVisible['collection-highlight'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-5xl font-light text-orange-950 leading-tight">
                Nada Dura Como el
                <span className="block font-serif italic text-amber-900">Cuero Genuino</span>
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-amber-400 mx-auto lg:mx-0"></div>
              <p className="text-xl text-orange-800 leading-relaxed font-light">
                Confort robusto y un atractivo atemporal. Creamos bolsos, carteras y accesorios con el mejor cuero argentino, construidos para acompañarte toda la vida.
              </p>
              <p className="text-orange-900/80 leading-relaxed">
                Nuestra colección es un homenaje a la durabilidad y al estilo que solo mejora con el tiempo. Cada pieza es una inversión en calidad y tradición.
              </p>
              <div>
                <button
                  onClick={() => navigate('/productos')}
                  className="group relative mt-4 px-8 py-3 bg-gradient-to-r from-orange-900 to-amber-900 text-white font-medium tracking-wide overflow-hidden transition-all duration-300 hover:from-orange-800 hover:to-amber-800 shadow-xl"
                >
                  <span className="relative z-10">Ver Colección</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative flex justify-center">
              <div className="aspect-[4/5] w-full max-w-md lg:max-w-none overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={muchasCarteras} 
                  alt="Colección de bolsos de cuero apilados"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <section
        className="h-80 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${dividerBannerImg})` }}
      >
        <div className="h-full w-full bg-black/20"></div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Static Divider */}
      <section
        className="h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${staticDividerImg})` }}
      >
        <div className="h-full w-full bg-black/10"></div>
      </section>

      {/* Craftsmanship Section */}
      <section 
        id="craftsmanship"
        data-animate
        className={`py-32 px-4 bg-white transition-all duration-1000 ${
          isVisible.craftsmanship ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-orange-950 mb-8">
              El Arte de
              <span className="block font-serif italic text-amber-900">Nuestra Artesanía</span>
            </h2>
            <p className="text-xl text-orange-800 leading-relaxed font-light max-w-3xl mx-auto">
              Tres pasos definen nuestra promesa de calidad: la selección del mejor cuero, una manufactura experta y un acabado impecable cosido a mano.
            </p>
            <div className="w-32 h-px bg-gradient-to-r from-orange-600 to-amber-400 mx-auto mt-8"></div>
          </div>

          {/* Interactive Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            {craftSteps.map((step, index) => (
              <div 
                key={index}
                className="text-center group"
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Image */}
                <div className="relative overflow-hidden mb-8 rounded-lg shadow-lg aspect-[4/3]">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-black/40 transition-all duration-500 ${activeStep === index ? 'opacity-0' : 'opacity-10'}`}></div>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 text-orange-900 text-2xl font-serif italic flex items-center justify-center rounded-full shadow-md">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-2xl text-orange-950 font-light tracking-wide uppercase">
                    {step.title}
                  </h3>
                  <h4 className="text-lg font-serif italic text-amber-800">
                    {step.subtitle}
                  </h4>
                  <p className="text-orange-900/80 font-light leading-relaxed pt-2">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Process indicator */}
          <div className="flex justify-center mt-20">
            <div className="flex space-x-4">
              {craftSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${
                    activeStep === index ? 'bg-amber-700 scale-125' : 'bg-orange-200 hover:bg-orange-300'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Banner */}
      <section 
        className="py-32 relative bg-fixed"
        style={{
          backgroundImage: `url(${heritageBannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-black/60"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-light text-white leading-tight drop-shadow-md mb-8">
            "Hecho para la Aventura.
            <span className="block font-serif italic text-amber-300 mt-2">Creado para Durar.</span>"
          </h2>
          <p className="text-xl text-orange-200 leading-relaxed max-w-3xl mx-auto mb-16 font-light">
            Cada pieza de nuestra colección honra el arte perdido de un oficio aprendido con esmero y el trabajo duro 
            de nuestras manos. Creamos artículos de cuero que te conectan con tus raíces e inspiran tu próxima aventura.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:border-r border-white/10 md:pr-8">
              <div className="text-4xl font-light text-amber-300 mb-3">Desde 1985</div>
              <div className="text-sm text-white uppercase tracking-widest">Marca con Historia</div>
            </div>
            <div className="text-center md:border-r border-white/10 md:pr-8">
              <div className="text-4xl font-light text-amber-300 mb-3">Cuero Genuino</div>
              <div className="text-sm text-white uppercase tracking-widest">Calidad Premium</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-amber-300 mb-3">Garantía</div>
              <div className="text-sm text-white uppercase tracking-widest">De por Vida</div>
            </div>
          </div>
        </div>
      </section>

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