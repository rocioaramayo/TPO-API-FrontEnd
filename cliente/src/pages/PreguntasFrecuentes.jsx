import Footer from '../components/Footer';
import { useState } from 'react';

const preguntas = [
  {
    pregunta: '¿Qué tipo de cuero utilizan?',
    respuesta: 'Utilizamos cuero argentino de la más alta calidad, seleccionado cuidadosamente para cada producto.'
  },
  {
    pregunta: '¿Realizan envíos a todo el país?',
    respuesta: 'Sí, realizamos envíos a todo el territorio argentino. También podemos coordinar envíos internacionales.'
  },
  {
    pregunta: '¿Puedo personalizar un producto?',
    respuesta: '¡Por supuesto! Contáctanos para conocer las opciones de personalización disponibles.'
  },
  {
    pregunta: '¿Cómo cuido los productos de cuero?',
    respuesta: 'Recomendamos limpiar el cuero con un paño suave y aplicar productos específicos para su cuidado periódicamente.'
  },
];

const PreguntasFrecuentes = () => {
  const [abierta, setAbierta] = useState(null);

  const toggle = (idx) => {
    setAbierta(abierta === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-serif font-bold text-leather-900 mb-8 text-center">Preguntas Frecuentes</h1>
        <div className="space-y-4">
          {preguntas.map((item, idx) => (
            <div key={idx} className="border border-leather-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-6 py-4 bg-cream-50 hover:bg-cream-100 focus:outline-none"
                onClick={() => toggle(idx)}
              >
                <span className="text-leather-800 font-medium">{item.pregunta}</span>
                <span className="text-leather-500">{abierta === idx ? '-' : '+'}</span>
              </button>
              {abierta === idx && (
                <div className="px-6 py-4 bg-white text-leather-700 border-t border-leather-100 animate-fade-in">
                  {item.respuesta}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PreguntasFrecuentes; 