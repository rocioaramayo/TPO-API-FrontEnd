import Footer from '../components/Footer';
import { useState } from 'react';
import heroImage from '../assets/cerca-en-la-textura-delicada.jpg'; // Reutilizamos una imagen de textura

// Iconos para el acordeón
const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);


const preguntas = [
  {
    pregunta: '¿Qué tipo de cuero utilizan?',
    respuesta: 'Utilizamos exclusivamente cuero argentino de grano completo, la más alta calidad disponible, seleccionado a mano por nuestros artesanos para garantizar una durabilidad, textura y carácter excepcionales en cada pieza.'
  },
  {
    pregunta: '¿Cuál es el tiempo y costo de envío?',
    respuesta: 'Realizamos envíos a todo el territorio argentino. El tiempo de entrega estándar es de 3 a 7 días hábiles. El costo se calcula automáticamente en el checkout según tu ubicación. Ofrecemos envío gratuito en compras superiores a $50.000.'
  },
  {
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta: 'Aceptamos todas las principales tarjetas de crédito y débito (Visa, MasterCard, American Express), así como pagos a través de Mercado Pago para tu comodidad y seguridad. También ofrecemos planes de cuotas sin interés.'
  },
  {
    pregunta: '¿Cómo puedo realizar el seguimiento de mi pedido?',
    respuesta: 'Una vez que tu pedido es despachado, recibirás un correo electrónico de confirmación con un número de seguimiento y un enlace para que puedas ver el estado de tu envío en tiempo real.'
  },
  {
    pregunta: '¿Puedo devolver o cambiar un producto?',
    respuesta: 'Sí, tienes 30 días desde la recepción de tu compra para solicitar un cambio o devolución. El producto debe estar sin uso y en su embalaje original. Por favor, consulta nuestra página de Política de Devoluciones para más detalles.'
  },
  {
    pregunta: '¿Los productos tienen garantía?',
    respuesta: 'Absolutamente. Todos nuestros productos cuentan con una garantía de 2 años que cubre cualquier defecto de fabricación o de materiales. Tu satisfacción y confianza son nuestra máxima prioridad.'
  },
  {
    pregunta: '¿Cómo cuido mis artículos de cuero?',
    respuesta: 'Recomendamos limpiar tus productos con un paño suave y seco. Para un cuidado más profundo, utiliza cremas o bálsamos especializados para cuero. Visita nuestra sección "Cuidado del Cuero" para guías detalladas.'
  },
];

const PreguntasFrecuentes = () => {
  const [abierta, setAbierta] = useState(null);

  const toggle = (idx) => {
    setAbierta(abierta === idx ? null : idx);
  };

  return (
    <div className="bg-white text-orange-950">
      {/* Hero Section */}
      <section 
        className="relative h-[40vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl lg:text-6xl font-light mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg lg:text-xl font-light max-w-2xl leading-relaxed">
            Resolvemos tus dudas para que compres con total confianza.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto py-24 sm:py-32 px-4">
        <div className="space-y-6">
          {preguntas.map((item, idx) => (
            <div key={idx} className="border-b border-orange-200/80 last:border-b-0">
              <button
                className="w-full flex justify-between items-center py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                onClick={() => toggle(idx)}
              >
                <span className="text-xl font-light text-orange-950">{item.pregunta}</span>
                <div className="flex-shrink-0 ml-4">
                  {abierta === idx 
                    ? <MinusIcon className="w-6 h-6 text-amber-800" /> 
                    : <PlusIcon className="w-6 h-6 text-orange-950" />}
                </div>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${abierta === idx ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
              >
                <div className="text-orange-800/90 font-light leading-relaxed pr-8">
                  {item.respuesta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PreguntasFrecuentes; 