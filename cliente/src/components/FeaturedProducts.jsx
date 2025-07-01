import { useSelector, useDispatch } from 'react-redux';
import { addFavorito, removeFavorito } from '../store/slices/favoritosSlice';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const FeaturedProducts = ({ onCartClick, onAuthRequired }) => {
  const { items: productos, loading } = useSelector((state) => state.products);
  const favoritos = useSelector((state) => state.favoritos.ids);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Selecciono los 3 productos más recientes
  const featuredProducts = [...productos].sort((a, b) => b.id - a.id).slice(0, 3);
  // Si hay menos de 3, agrego placeholders
  const placeholders = Array.from({ length: 3 - featuredProducts.length });

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Handler para toggle de favoritos
  const handleFavoriteClick = (id) => {
    if (favoritos.includes(id)) {
      dispatch(removeFavorito(id));
    } else {
      dispatch(addFavorito(id));
    }
  };

  return (
    <section
      id="products"
      className="py-32 px-4 bg-white"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-[1800ms] ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl font-light text-orange-950 mb-6">
            Nuestros Productos <span className="font-serif italic text-amber-900">Destacados</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-orange-600 to-amber-400 mx-auto mb-8"></div>
          <p className="text-xl text-orange-800 max-w-3xl mx-auto leading-relaxed font-light">
            Descubre las piezas más codiciadas de nuestra colección, donde la calidad y el diseño hablan por sí mismos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredProducts.map((producto, i) => (
            <div
              key={producto.id}
              className={`transition-all duration-[1800ms] ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${400 + i * 200}ms` }}
            >
              <ProductCard 
                product={producto}
                isFavorite={favoritos.includes(producto.id)}
                onFavoriteClick={handleFavoriteClick}
                onCartClick={onCartClick}
                onAuthRequired={onAuthRequired}
              />
            </div>
          ))}
          {placeholders.map((_, i) => (
            <div
              key={`ph-${i}`}
              className={`bg-gray-100 rounded-2xl aspect-square transition-all duration-[1800ms] ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${1000 + i * 200}ms` }}
            />
          ))}
        </div>
        <div className="text-center mt-20">
          <button 
            onClick={() => navigate('/productos')}
            className="text-amber-800 hover:text-orange-950 font-light tracking-widest border-b border-amber-700 hover:border-orange-900 pb-1 transition-colors duration-300"
          >
            VER TODOS LOS PRODUCTOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 