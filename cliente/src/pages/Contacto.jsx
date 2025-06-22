import Footer from '../components/Footer';
import { useState } from 'react';
import heroImage from '../assets/hombe-concarterita.webp';

// Local SVG icon components
const EnvelopeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);
const MapPinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de envío real
    console.log("Formulario enviado:", form);
    setEnviado(true);
    // Resetear form después de un tiempo
    setTimeout(() => {
        setForm({ nombre: '', email: '', mensaje: '' });
        setEnviado(false);
    }, 5000);
  };

  return (
    <div className="bg-white text-orange-950">
       {/* Hero Section */}
       <section 
        className="relative h-[50vh] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl lg:text-6xl font-light mb-4">
            Contáctanos
          </h1>
          <p className="text-lg lg:text-xl font-light max-w-3xl leading-relaxed">
            Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos a la brevedad.
          </p>
        </div>
      </section>

      <div className="bg-orange-50/50">
        <div className="max-w-7xl mx-auto py-24 sm:py-32 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Info de contacto */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-light text-orange-950 leading-tight mb-4">Ponte en Contacto</h2>
                <p className="text-lg text-orange-800 leading-relaxed font-light">
                  ¿Tienes dudas, consultas o quieres personalizar un producto? Completa el formulario o utiliza nuestros canales de contacto directo.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <EnvelopeIcon className="w-8 h-8 text-orange-900/70" strokeWidth={1} />
                  <span className="text-lg text-orange-800 font-light">info@cueroargentino.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <PhoneIcon className="w-8 h-8 text-orange-900/70" strokeWidth={1} />
                  <span className="text-lg text-orange-800 font-light">+54 11 1234-5678</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPinIcon className="w-8 h-8 text-orange-900/70" strokeWidth={1} />
                  <span className="text-lg text-orange-800 font-light">Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg">
              {enviado ? (
                <div className="text-center">
                  <h3 className="text-2xl font-light text-orange-950 mb-3">¡Gracias por tu mensaje!</h3>
                  <p className="text-orange-800 leading-relaxed font-light">Hemos recibido tu consulta y nos pondremos en contacto contigo a la brevedad.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-orange-800 mb-2">Nombre</label>
                    <input type="text" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-light" placeholder="Tu nombre completo" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-orange-800 mb-2">Email</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-light" placeholder="tu@email.com" />
                  </div>
                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-orange-800 mb-2">Mensaje</label>
                    <textarea id="mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-light resize-none" placeholder="¿En qué podemos ayudarte?" />
                  </div>
                  <button type="submit" className="w-full bg-orange-950 text-white px-6 py-4 rounded-md hover:bg-orange-900 transition font-light text-lg tracking-wider shadow">
                    Enviar Mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contacto; 