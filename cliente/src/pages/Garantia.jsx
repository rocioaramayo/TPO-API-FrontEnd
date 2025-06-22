import Footer from "../components/Footer";
import heroImage from '../assets/bufalo-homber campera.webp'; 
import { Link } from 'react-router-dom';

// Local SVG icon components
const CalendarDaysIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
  </svg>
);
const NoSymbolIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);
const CogIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" />
  </svg>
);
const WrenchScrewdriverIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 01.8 0l2.47 2.471a.563.563 0 010 .8l-2.47 2.471a.563.563 0 01-.8 0l-2.47-2.471a.563.563 0 010-.8zM3 21l6.83-6.83M21 3l-6.83 6.83" />
  </svg>
);
const QuestionMarkCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const puntosGarantia = [
  {
    titulo: "Cobertura de 2 Años",
    descripcion: "Nuestros productos están garantizados por dos años contra defectos de fabricación y materiales, como costuras o herrajes defectuosos.",
    icon: CalendarDaysIcon
  },
  {
    titulo: "Lo que no está Cubierto",
    descripcion: "La garantía no cubre daños por accidentes, cuidado inadecuado, negligencia, o el desgaste y la degradación natural de los materiales con el tiempo.",
    icon: NoSymbolIcon
  },
  {
    titulo: "Proceso de Reclamación",
    descripcion: "Para un reclamo, contacta a nuestro servicio al cliente con tu comprobante de compra y fotos del defecto. Nuestro equipo evaluará tu caso.",
    icon: CogIcon
  },
  {
    titulo: "Resolución",
    descripcion: "Si el reclamo es aprobado, repararemos el artículo sin costo. Si no es posible, ofreceremos un reemplazo idéntico o de valor similar.",
    icon: WrenchScrewdriverIcon
  }
];

const Garantia = () => {
  return (
    <div className="bg-white text-orange-950">
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl lg:text-6xl font-light mb-4">
            Nuestra Garantía
          </h1>
          <p className="text-lg lg:text-xl font-light max-w-3xl leading-relaxed">
            Un compromiso de por vida con la calidad y la artesanía.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-light text-orange-950 leading-tight">
            Hecho para Durar,
            <span className="block font-serif italic text-amber-900 mt-2">Respaldado por Nosotros</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-amber-400 mx-auto my-8"></div>
          <p className="text-lg sm:text-xl text-orange-800 leading-relaxed font-light">
            Estamos orgullosos de la calidad de nuestro trabajo. Cada pieza es un testimonio de nuestro compromiso con la excelencia, y respaldamos cada una de ellas con una garantía sólida y transparente para tu total tranquilidad.
          </p>
        </div>
      </section>

      {/* Garantía Grid */}
      <section className="bg-orange-50/50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {puntosGarantia.map((punto) => (
              <div key={punto.titulo} className="flex flex-col items-center p-8">
                <div className="flex justify-center items-center mb-6">
                  <punto.icon className="w-14 h-14 text-orange-900" strokeWidth={0.75} />
                </div>
                <h3 className="text-2xl font-light text-orange-950 mb-3">{punto.titulo}</h3>
                <p className="text-orange-800 leading-relaxed font-light">{punto.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-orange-300 mb-6" strokeWidth={0.75} />
          <h3 className="text-3xl font-light text-orange-950 mb-4">
            ¿Tienes alguna pregunta sobre la garantía?
          </h3>
          <p className="text-lg text-orange-800 leading-relaxed font-light mb-8">
            Nuestro equipo está aquí para ayudarte. No dudes en ponerte en contacto.
          </p>
          <Link
            to="/contacto"
            className="group relative inline-block px-8 py-4 bg-gradient-to-r from-orange-900 to-amber-900 text-white font-medium tracking-wide overflow-hidden transition-all duration-300 hover:from-orange-800 hover:to-amber-800 shadow-lg"
          >
            <span className="relative z-10">Contáctanos</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Garantia;

