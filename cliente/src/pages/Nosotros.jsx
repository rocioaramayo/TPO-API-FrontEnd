// cliente/src/pages/Nosotros.jsx
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import heroImage from '../assets/artesano-trabajando.jpg';
import philosophyImage from '../assets/hombre-tarje.usandolether2.webp';
import seleccionCuero from '../assets/cerca-en-la-textura-delicada.jpg';
import corteCuero from '../assets/fot-3carruseñ.jpg';
import costuraManual from '../assets/costuraManual-carruse_4.jpg';

// Local SVG icon components
const SparklesIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456z" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const ShieldCheckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036V21" />
  </svg>
);

const timelineEvents = [
  { year: "1985", title: "Los Comienzos", description: "Don Carlos Rodríguez funda el taller familiar con la visión de preservar las técnicas tradicionales de marroquinería argentina.", alignment: "left" },
  { year: "1995", title: "Expansión", description: "La segunda generación se incorpora al negocio, expandiendo la producción sin perder la esencia artesanal que nos define.", alignment: "right" },
  { year: "2010", title: "Innovación", description: "Incorporamos nuevas técnicas de curtido ecológico y diseños contemporáneos, manteniendo la calidad tradicional.", alignment: "left" },
  { year: "2025", title: "Era Digital", description: "Llevamos nuestra tradición al mundo digital, compartiendo la calidad artesanal con una audiencia global.", alignment: "right" }
];

const values = [
  { icon: SparklesIcon, title: "Calidad Premium", description: "Solo utilizamos cuero argentino de grano completo, seleccionado por su durabilidad y carácter único." },
  { icon: BriefcaseIcon, title: "Artesanía Tradicional", description: "Cada pieza está hecha a mano por maestros artesanos, honrando técnicas transmitidas por generaciones." },
  { icon: ShieldCheckIcon, title: "Garantía de por Vida", description: "Confiamos tanto en nuestro trabajo que cada producto está garantizado para durar toda la vida." }
];

const processSteps = [
    { 
      title: "Selección", 
      subtitle: "Cuero Premium", 
      desc: "Cuero argentino de grano completo, seleccionado a mano por su carácter y durabilidad.",
      img: seleccionCuero 
    },
    { 
      title: "Manufactura", 
      subtitle: "Construcción Experta", 
      desc: "Cortado y moldeado por maestros artesanos utilizando técnicas tradicionales.",
      img: corteCuero 
    },
    { 
      title: "Acabado", 
      subtitle: "Detalles Cosidos a Mano", 
      desc: "Cada puntada está reforzada para resistir toda una vida de uso rudo.",
      img: costuraManual 
    },
  ];

const Nosotros = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-orange-950">
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center 30%' 
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-6xl lg:text-7xl font-light mb-4">
            Nuestra Historia
          </h1>
          <p className="text-xl lg:text-2xl font-light max-w-3xl leading-relaxed">
            Más de 40 años creando artículos de cuero que combinan la tradición argentina con una calidad excepcional.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-16 items-center">
            
            {/* Text Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-5xl font-light text-orange-950 leading-tight">
                Nuestra Filosofía
                <span className="block font-serif italic text-amber-900">Diseño y Durabilidad</span>
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-amber-400 mx-auto lg:mx-0"></div>
              <p className="text-xl text-orange-800 leading-relaxed font-light">
                Creemos que el verdadero lujo reside en la artesanía y en materiales que resisten el paso del tiempo. Cada diseño es una declaración: funcional, elegante y construido para ser parte de tu historia.
              </p>
              <p className="text-orange-900/80 leading-relaxed">
                No seguimos tendencias pasajeras. Nos enfocamos en crear piezas atemporales que combinan la robustez del cuero argentino con una estética refinada, perfectas para el profesional moderno.
              </p>
            </div>

            {/* Image */}
            <div className="flex justify-center">
                <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl">
                    <img 
                    src={philosophyImage} 
                    alt="Hombre con traje usando un producto de cuero"
                    className="w-full h-full object-cover"
                    />
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-orange-50/50 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center px-4 mb-20">
          <h2 className="text-4xl sm:text-5xl font-light text-orange-950 leading-tight">
            Una Tradición Familiar Forjada en
            <span className="block font-serif italic text-amber-900 mt-2">Cuero y Pasión</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-amber-400 mx-auto my-8"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-orange-200 hidden lg:block" aria-hidden="true"></div>
            
            <div className="space-y-16 lg:space-y-0">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12 items-center ${index > 0 ? 'mt-16 lg:mt-0' : ''}`}>
                  {event.alignment === 'left' ? (
                    <>
                      <div className="text-center lg:text-right">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 inline-block max-w-md">
                          <p className="text-2xl font-serif italic text-amber-800 mb-2">{event.year}</p>
                          <h3 className="text-2xl font-light text-orange-950 mb-3">{event.title}</h3>
                          <p className="text-orange-800 font-light leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                      <div className="hidden lg:block w-8 h-8 bg-white rounded-full border-4 border-orange-200 shadow-md mx-auto my-4 lg:my-0"></div>
                      <div></div>
                    </>
                  ) : (
                    <>
                      <div></div>
                      <div className="hidden lg:block w-8 h-8 bg-white rounded-full border-4 border-orange-200 shadow-md mx-auto my-4 lg:my-0"></div>
                      <div className="text-center lg:text-left">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 inline-block max-w-md">
                           <p className="text-2xl font-serif italic text-amber-800 mb-2">{event.year}</p>
                           <h3 className="text-2xl font-light text-orange-950 mb-3">{event.title}</h3>
                           <p className="text-orange-800 font-light leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-orange-950 mb-8">
              Nuestro Proceso
              <span className="block font-serif italic text-amber-900">Paso a Paso</span>
            </h2>
            <p className="text-xl text-orange-800 leading-relaxed font-light max-w-3xl mx-auto">
              Tres pasos definen nuestra promesa de calidad: la selección del mejor cuero, una manufactura experta y un acabado impecable cosido a mano.
            </p>
            <div className="w-32 h-px bg-gradient-to-r from-orange-600 to-amber-400 mx-auto mt-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative overflow-hidden mb-8 rounded-lg shadow-lg aspect-[4/3]">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 text-orange-900 text-2xl font-serif italic flex items-center justify-center rounded-full shadow-md">
                    {index + 1}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl text-orange-950 font-light tracking-wide uppercase">{step.title}</h3>
                  <h4 className="text-lg font-serif italic text-amber-800">{step.subtitle}</h4>
                  <p className="text-orange-900/80 font-light leading-relaxed pt-2">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="bg-orange-50/50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
             <h2 className="text-5xl font-light text-orange-950 mb-4">Nuestros Valores</h2>
             <p className="text-xl text-orange-800 leading-relaxed font-light max-w-3xl mx-auto">
               Los pilares que sostienen cada pieza que creamos.
             </p>
             <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-amber-400 mx-auto mt-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8">
                <value.icon className="w-12 h-12 mx-auto text-orange-900 mb-6" strokeWidth={0.75} />
                <h3 className="text-2xl text-orange-950 font-light mb-3">{value.title}</h3>
                <p className="text-orange-800 leading-relaxed font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Nosotros;