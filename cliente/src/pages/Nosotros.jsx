// cliente/src/pages/Nosotros.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import artesano from "../assets/artesano-trabajando.jpg";

const Nosotros = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const procesoSlides = [
    {
      titulo: "Selección del Cuero",
      descripcion: "Elegimos cuidadosamente los mejores cueros argentinos, priorizando la calidad y origen sustentable.",
      imagen: "./assets/CARRUSEL_OFICIAL_1.jpg", // Placeholder temporal
    },
    {
      titulo: "Diseño y Patrones",
      descripcion: "Cada pieza se diseña a mano, creando patrones únicos que respetan la tradición artesanal.",
      imagen: "/api/placeholder/600/400",
    },
    {
      titulo: "Corte Artesanal",
      descripcion: "Con herramientas tradicionales, cortamos cada pieza con precisión y dedicación.",
      imagen: "/api/placeholder/600/400",
    },
    {
      titulo: "Costura Manual",
      descripcion: "Nuestros artesanos cosen cada puntada a mano, garantizando durabilidad y belleza.",
      imagen: artesano, // Tu foto existente
    },
    {
      titulo: "Acabado Premium",
      descripcion: "Aplicamos tintes, ceras y acabados naturales que realzan la textura y protegen el cuero.",
      imagen: "/api/placeholder/600/400",
    }
  ];

  // Funciones del carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % procesoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + procesoSlides.length) % procesoSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      
      {/* Section hombre*/}
      <section className="relative h-screen bg-cover bg-center bg-fixed" 
               style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${artesano})`}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              Nuestra Historia
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Más de 40 años creando productos de cuero artesanales que combinan 
              tradición argentina con calidad excepcional
            </p>
            <button 
              onClick={() => navigate('/productos')}
              className="bg-leather-800 text-white hover:bg-leather-900 text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg"
            >
              Conoce Nuestros Productos
            </button>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-leather-900 mb-6">
              Una Tradición Familiar
            </h2>
            <p className="text-leather-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Desde 1985, nuestra familia ha mantenido viva la tradición artesanal 
              del cuero argentino, combinando técnicas ancestrales con innovación contemporánea.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-leather-200"></div>
            
            <div className="space-y-12">
              {/* 1985 */}
              <div className="flex items-center justify-between">
                <div className="w-5/12">
                  <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-leather-800">
                    <h3 className="text-xl font-bold text-leather-900 mb-2">1985 - Los Comienzos</h3>
                    <p className="text-leather-600">
                      Don Carlos Rodríguez funda el taller familiar con la visión de preservar 
                      las técnicas tradicionales de marroquinería argentina.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-leather-800 rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-5/12"></div>
              </div>

              {/* 1995 */}
              <div className="flex items-center justify-between">
                <div className="w-5/12"></div>
                <div className="w-8 h-8 bg-leather-800 rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-5/12">
                  <div className="bg-white p-6 rounded-lg shadow-sm border-r-4 border-leather-800">
                    <h3 className="text-xl font-bold text-leather-900 mb-2">1995 - Expansión</h3>
                    <p className="text-leather-600">
                      La segunda generación se incorpora al negocio, expandiendo la producción 
                      sin perder la esencia artesanal.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2010 */}
              <div className="flex items-center justify-between">
                <div className="w-5/12">
                  <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-leather-800">
                    <h3 className="text-xl font-bold text-leather-900 mb-2">2010 - Innovación</h3>
                    <p className="text-leather-600">
                      Incorporamos nuevas técnicas de curtido ecológico y diseños contemporáneos 
                      manteniendo la calidad tradicional.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-leather-800 rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-5/12"></div>
              </div>

              {/* 2025 */}
              <div className="flex items-center justify-between">
                <div className="w-5/12"></div>
                <div className="w-8 h-8 bg-leather-800 rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-5/12">
                  <div className="bg-white p-6 rounded-lg shadow-sm border-r-4 border-leather-800">
                    <h3 className="text-xl font-bold text-leather-900 mb-2">2025 - Era Digital</h3>
                    <p className="text-leather-600">
                      Llevamos nuestra tradición al mundo digital, manteniendo la calidad 
                      artesanal en cada producto que sale de nuestro taller.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso Artesanal - Carrusel */}
      <section className="py-20 bg-leather-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-leather-900 mb-6">
              Nuestro Proceso Artesanal
            </h2>
            <p className="text-leather-600 text-lg max-w-3xl mx-auto">
              Cada producto pasa por un cuidadoso proceso de 5 etapas, 
              donde la tradición y la perfección se encuentran.
            </p>
          </div>

          {/* Carrusel */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {procesoSlides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-96">
                      {/* Imagen */}
                      <div className="bg-cover bg-center" 
                           style={{backgroundImage: `url(${slide.imagen})`}}>
                      </div>
                      
                      {/* Contenido */}
                      <div className="p-8 flex flex-col justify-center">
                        <div className="mb-4">
                          <span className="text-leather-600 text-sm font-medium">
                            Paso {index + 1} de {procesoSlides.length}
                          </span>
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-leather-900 mb-4">
                          {slide.titulo}
                        </h3>
                        <p className="text-leather-600 text-lg leading-relaxed">
                          {slide.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles del carrusel */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-leather-800 text-white p-3 rounded-full hover:bg-leather-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-leather-800 text-white p-3 rounded-full hover:bg-leather-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicadores */}
            <div className="flex justify-center mt-6 space-x-2">
              {procesoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    currentSlide === index ? 'bg-leather-800' : 'bg-leather-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-leather-900 mb-6">
              Nuestros Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Calidad */}
            <div className="text-center">
              <div className="w-16 h-16 bg-leather-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-leather-900 mb-3">Calidad Premium</h3>
              <p className="text-leather-600 leading-relaxed">
                Utilizamos solo los mejores cueros y materiales, asegurando durabilidad 
                y belleza en cada producto.
              </p>
            </div>

            {/* Tradición */}
            <div className="text-center">
              <div className="w-16 h-16 bg-leather-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-leather-900 mb-3">Tradición Artesanal</h3>
              <p className="text-leather-600 leading-relaxed">
                Preservamos técnicas ancestrales transmitidas de generación en generación, 
                manteniendo viva la cultura del cuero argentino.
              </p>
            </div>

            {/* Sustentabilidad */}
            <div className="text-center">
              <div className="w-16 h-16 bg-leather-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-leather-900 mb-3">Compromiso Sustentable</h3>
              <p className="text-leather-600 leading-relaxed">
                Trabajamos con proveedores responsables y utilizamos procesos 
                ecológicos que respetan el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-leather-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            ¿Listo para descubrir la calidad artesanal?
          </h2>
          <p className="text-cream-100 text-lg mb-8 max-w-2xl mx-auto">
            Cada producto cuenta una historia de dedicación y pasión. 
            Descubre la diferencia de lo hecho a mano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/productos')}
              className="bg-white text-leather-700 hover:bg-gray-200 px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Ver Productos
            </button>
            <button 
              className="border-2 border-white text-white hover:bg-white hover:text-leather-700 px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Contactanos
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Nosotros;