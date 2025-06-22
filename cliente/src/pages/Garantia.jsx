import Footer from "../components/Footer";
import heroBgTexture from '../assets/cerca-en-la-textura-delicada.jpg';
import React from 'react';


const CalendarIcon = () => (
    <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const BanIcon = () => (
    <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);
const CogIcon = () => (
    <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const WrenchIcon = () => (
    <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 01.8 0l2.47 2.471a.563.563 0 010 .8l-2.47 2.471a.563.563 0 01-.8 0l-2.47-2.471a.563.563 0 010-.8zM3 21l6.83-6.83M21 3l-6.83 6.83" />
    </svg>
);


const Garantia = () => {
  const puntosGarantia = [
    {
      titulo: "Cobertura de 2 Años",
      descripcion: "Nuestros productos están garantizados por un período de dos años desde la fecha de compra contra defectos de fabricación y materiales. Esta garantía cubre problemas como costuras defectuosas, herrajes rotos o problemas con el cuero que no sean por desgaste normal.",
      icono: <CalendarIcon />
    },
    {
      titulo: "Lo que no está Cubierto",
      descripcion: "La garantía no cubre daños causados por accidentes, cuidado inadecuado, negligencia, desgaste normal por el uso, o la degradación natural de los colores y materiales con el tiempo. Tampoco cubre daños por agua o exposición a químicos.",
      icono: <BanIcon />
    },
    {
      titulo: "Proceso de Reclamación",
      descripcion: "Para hacer un reclamo, contacta a nuestro servicio de atención al cliente con tu comprobante de compra y fotos del defecto. Nuestro equipo evaluará el caso para determinar si el problema está cubierto por la garantía.",
      icono: <CogIcon />
    },
    {
      titulo: "Resolución",
      descripcion: "Si el reclamo es aprobado, procederemos a reparar el artículo sin costo. Si la reparación no es posible, ofreceremos un producto de reemplazo idéntico o de valor similar. Nuestra meta es tu satisfacción total con la artesanía que recibes.",
      icono: <WrenchIcon />
    }
  ];


  return (
    <div className="bg-[#F7F3E9]">
      <div className="relative pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBgTexture}
            alt="Textura de cuero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2C1810] opacity-80"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl lg:text-5xl font-thin text-[#F7F3E9] leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Nuestra Garantía
          </h1>
          <p className="mt-4 text-lg text-[#F7F3E9]/80 max-w-2xl mx-auto">
            Estamos orgullosos de la calidad de nuestra artesanía. Cada pieza es un testimonio de nuestro compromiso con la excelencia, y respaldamos cada una de ellas con una garantía sólida y transparente.
          </p>
        </div>
      </div>


      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {puntosGarantia.map((punto) => (
              <div key={punto.titulo} className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mb-4">
                  {punto.icono}
                </div>
                <h3 className="text-xl font-semibold text-[#2C1810] mb-3">{punto.titulo}</h3>
                <p className="text-[#2C1810]/80 font-light text-sm leading-relaxed">{punto.descripcion}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center border-t border-[#8B4513]/20 pt-10">
            <h4 className="text-lg font-semibold text-[#2C1810]">¿Tienes alguna pregunta?</h4>
            <p className="text-[#2C1810]/70 mt-2">No dudes en <a href="/contacto" className="text-[#8B4513] underline hover:text-[#2C1810]">contactarnos</a>. Estamos aquí para ayudarte.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default Garantia;

