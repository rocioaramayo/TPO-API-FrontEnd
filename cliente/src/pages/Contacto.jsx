import Footer from '../components/Footer';
import { useState } from 'react';

const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto py-16 px-4 flex flex-col md:flex-row gap-12">
        {/* Info de contacto */}
        <div className="md:w-1/2 flex flex-col justify-center mb-8 md:mb-0">
          <h1 className="text-4xl font-serif font-bold text-leather-900 mb-6">Contacto</h1>
          <p className="text-leather-700 mb-6 text-lg">¿Tenés dudas, consultas o querés personalizar un producto? ¡Escribinos!</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-leather-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-leather-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <span className="text-leather-800 font-medium">info@cueroargentino.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-leather-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-leather-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <span className="text-leather-800 font-medium">+54 11 1234-5678</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-leather-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-leather-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <span className="text-leather-800 font-medium">Buenos Aires, Argentina</span>
            </div>
          </div>
        </div>
        {/* Formulario */}
        <div className="md:w-1/2">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            {enviado ? (
              <div className="bg-green-100 text-green-800 p-4 rounded mb-6 text-center font-medium">
                ¡Gracias por tu mensaje! Nos pondremos en contacto pronto.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-leather-700 mb-2 font-medium">Nombre</label>
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border border-leather-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-leather-400 bg-cream-50" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-leather-700 mb-2 font-medium">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-leather-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-leather-400 bg-cream-50" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-leather-700 mb-2 font-medium">Mensaje</label>
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required rows={4} className="w-full border border-leather-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-leather-400 bg-cream-50" placeholder="¿En qué podemos ayudarte?" />
                </div>
                <button type="submit" className="w-full bg-leather-800 text-white px-6 py-3 rounded-lg hover:bg-leather-900 transition font-semibold text-lg shadow">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contacto; 