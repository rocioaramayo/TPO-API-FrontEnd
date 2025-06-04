import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import artesano from '../assets/artesano-trabajando.jpg';
import carrusel1 from '../assets/CARRUSEL_OFICIAL_1.jpg';
import carrusel2 from '../assets/CARRUSEL_OFICIAL_FOTO2.jpg';
import carrusel3 from '../assets/CARRUSEL_OFICIAL_FOTO52.jpg';
import costura from '../assets/costuraManual-carruse_4.jpg';
import foto3 from '../assets/fot-3carruseñ.jpg';

const carruselImages = [
  { src: carrusel1, alt: "Cartera artesanal" },
  { src: carrusel2, alt: "Detalle costura" },
  { src: carrusel3, alt: "Portadocumentos" },
  { src: costura,   alt: "Costura manual" },
  { src: foto3,     alt: "Taller" },
  { src: artesano,  alt: "Artesano trabajando" }
];

const CarruselHero = ({ user }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // ✅ Estado React simple
  const navigate = useNavigate();

  // Autoplay con React state - sin manipulación DOM
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrent((prev) => (prev + 1) % carruselImages.length);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]); // ✅ Depende del estado React

  // Handlers simples para pausar/reanudar
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="relative w-full h-[680px] md:h-[900px] rounded-b-3xl overflow-hidden shadow-lg mb-10 select-none group"
      onMouseEnter={handleMouseEnter} //  Evento React nativo
      onMouseLeave={handleMouseLeave} // Evento React nativo
    >
      {/* Imágenes + transición suave */}
      {carruselImages.map((img, idx) => (
        <img
          key={idx}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out
            ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          draggable="false"
        />
      ))}

      {/* Overlay degradado para contraste */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-4">
        <h1 className="text-3xl md:text-6xl font-serif font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-4 transition-all duration-700">
          Cuero <span className="block text-leather-100">Argentino</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] transition-all duration-700">
          Tradición artesanal desde 1985. Cada pieza cuenta una historia de calidad y dedicación.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/productos')}
            className="bg-leather-800 text-white hover:bg-leather-900 hover:scale-105 transition-all duration-200 shadow-lg text-lg px-8 py-4 rounded-lg font-medium"
          >
            Ver Productos
          </button>
          {user ? (
            <button
              onClick={() => navigate('/nosotros')}
              className="border-2 border-white text-white hover:bg-leather-800 hover:text-white hover:scale-105 text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg"
            >
              Nuestra Historia
            </button>
          ) : (
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-white text-white hover:bg-leather-800 hover:text-white hover:scale-105 text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg"
            >
              Registrarse
            </button>
          )}
        </div>
        {/* Link de login para usuarios no logueados */}
        {!user && (
          <div className="mt-4">
            <p className="text-leather-50 text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => navigate('/login')}
                className="underline font-medium hover:text-white"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Flechas (visibles siempre en desktop, al hover en mobile) */}
      <button
        onClick={() => setCurrent((current - 1 + carruselImages.length) % carruselImages.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-leather-900 hover:scale-110 rounded-full p-2 shadow-xl z-30 transition-all duration-200 text-2xl"
        tabIndex={-1}
        aria-label="Anterior"
        style={{ minWidth: 40, minHeight: 40 }}
      >‹</button>
      <button
        onClick={() => setCurrent((current + 1) % carruselImages.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-leather-900 hover:scale-110 rounded-full p-2 shadow-xl z-30 transition-all duration-200 text-2xl"
        tabIndex={-1}
        aria-label="Siguiente"
        style={{ minWidth: 40, minHeight: 40 }}
      >›</button>

      {/* Dots modernos */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carruselImages.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border border-white transition-all duration-300
              ${idx === current ? "bg-leather-800 scale-125 shadow-lg" : "bg-white/60 hover:bg-leather-400"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
            tabIndex={-1}
            style={{ outline: "none" }}
          />
        ))}
      </div>
    </div>
  );
};

export default CarruselHero;