import Footer from "../components/Footer";
import heroImage from '../assets/cerca-en-la-textura-delicada.jpg';

// Local SVG icon components
const SparklesIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456z" />
    </svg>
);
const BeakerIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.21 1.002L7.5 15.25m5.25-12.146v5.714a2.25 2.25 0 00.21 1.002l2.04 5.441m-5.48-3.085a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm5.48 3.085a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);
const ShieldCheckIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036V21" />
    </svg>
);
const ArchiveBoxIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);
const ScaleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.354-6.044-.994m-6.044-.994c-3.44-1.12-6.552-3.193-8.66-5.83M3 16.5c.527 1.517 1.24 2.953 2.13 4.254m-2.13-4.254c.39-.192.79-.372 1.19-.546" />
    </svg>
);
const HandRaisedIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0-1.105.895-2 2-2s2 .895 2 2-2 4-4 4-1.125-1.5-1.125-2.062z" />
    </svg>
);

const consejosCuidado = [
  {
    titulo: "Limpieza Regular",
    descripcion: "Utiliza un paño suave y seco para quitar el polvo. Para una limpieza más profunda, humedece ligeramente el paño con agua destilada y un jabón neutro específico para cuero. Frota suavemente y deja secar al aire.",
    icon: SparklesIcon,
  },
  {
    titulo: "Hidratación y Acondicionamiento",
    descripcion: "Aplica un acondicionador de cuero de alta calidad cada 3-6 meses. Esto nutre el material, previene la sequedad y las grietas, y mantiene su flexibilidad. Usa una pequeña cantidad y aplícala con un paño limpio.",
    icon: BeakerIcon,
  },
  {
    titulo: "Protección contra el Agua",
    descripcion: "Si bien nuestros productos tienen cierta resistencia, el cuero no es impermeable. Si se moja, sécalo inmediatamente con un paño suave. No uses secadores de pelo. Para protección adicional, aplica un spray especializado.",
    icon: ShieldCheckIcon,
  },
  {
    titulo: "Almacenamiento Adecuado",
    descripcion: "Guarda tus artículos en un lugar fresco, seco y ventilado, lejos de la luz solar directa. Usa la bolsa de tela que proveemos para protegerlo del polvo y evitar rasguños. No lo guardes en plástico.",
    icon: ArchiveBoxIcon,
  },
  {
    titulo: "Evitar la Sobrecarga",
    descripcion: "No sobrecargues tus bolsos o billeteras. El exceso de peso puede deformar el cuero y forzar las costuras. Mantén solo lo esencial para preservar la forma y la integridad estructural del producto.",
    icon: ScaleIcon,
  },
  {
    titulo: "Manejo de Rasguños",
    descripcion: "Para rasguños menores, frota suavemente el área con un dedo limpio. El calor y los aceites naturales de tu piel pueden ayudar a disminuir la marca. Para arañazos más profundos, consulta a un profesional.",
    icon: HandRaisedIcon,
  }
];

const CuidadoDelCuero = () => {
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
            Cuidado del Cuero
          </h1>
          <p className="text-lg lg:text-xl font-light max-w-3xl leading-relaxed">
            Consejos para que tus piezas de cuero no solo duren, sino que embellezcan con el tiempo.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-light text-orange-950 leading-tight">
            Un Legado que
            <span className="block font-serif italic text-amber-900 mt-2">Mejora con los Años</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-amber-400 mx-auto my-8"></div>
          <p className="text-lg sm:text-xl text-orange-800 leading-relaxed font-light">
            Nuestros productos están diseñados para ser compañeros de por vida. Con el cuidado adecuado, el cuero desarrolla una pátina única que refleja tus experiencias. Aquí te mostramos cómo preservar la belleza y la durabilidad de tu pieza.
          </p>
        </div>
      </section>

      {/* Consejos Grid */}
      <section className="bg-orange-50/50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {consejosCuidado.map((consejo) => (
              <div key={consejo.titulo} className="text-center p-8 bg-white/60 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-center items-center mb-6">
                  <consejo.icon className="w-12 h-12 text-orange-900" strokeWidth={0.75} />
                </div>
                <h3 className="text-2xl font-light text-orange-950 mb-3">{consejo.titulo}</h3>
                <p className="text-orange-800 leading-relaxed font-light">{consejo.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CuidadoDelCuero;

