import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import fondoProductos from '../assets/cerca-en-la-textura-delicada.jpg';

const FeaturedProducts = () => {
  const { items: productos, loading } = useSelector((state) => state.products);
  const navigate = useNavigate();
  // Selecciono los 3 productos más recientes
  const featuredProducts = [...productos].sort((a, b) => b.id - a.id).slice(0, 3);
  // Si hay menos de 3, agrego placeholders
  const placeholders = Array.from({ length: 3 - featuredProducts.length });

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="products"
      className="py-32 px-4 bg-white relative"
      ref={sectionRef}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.85)), url(${fondoProductos})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-[1800ms] ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-6">
            <span className="text-xs font-medium text-orange-300 bg-orange-900/50 px-4 py-2 rounded-full tracking-widest uppercase">
              SELECCIÓN EXCLUSIVA
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
            Piezas <span className="font-serif italic text-amber-400">excepcionales</span>
          </h2>
          <div className="w-32 h-1 mx-auto mb-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 rounded-full animate-underline"></div>
          <p className="text-xl text-orange-200 max-w-3xl mx-auto leading-relaxed font-light">
            Piezas excepcionales, hechas con <span className="font-semibold text-amber-400">pasión</span>, <span className="font-semibold text-amber-400">dedicación</span> y el arte del cuero argentino.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredProducts.map((producto, i) => (
            <div
              key={producto.id}
              className={`transition-all duration-[1800ms] ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${400 + i * 200}ms` }}
            >
              <ProductCard {...producto} />
            </div>
          ))}
          {placeholders.map((_, i) => (
            <div
              key={`ph-${i}`}
              className={`bg-black/20 rounded-2xl aspect-square transition-all duration-[1800ms] ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${1000 + i * 200}ms` }}
            />
          ))}
        </div>
        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/productos')}
            className="group relative px-10 py-4 bg-gradient-to-r from-orange-900 to-amber-900 text-white font-medium tracking-wide overflow-hidden transition-all duration-300 hover:from-orange-800 hover:to-amber-800 shadow-lg"
          >
            <span className="relative z-10">Ver Colección Completa</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 