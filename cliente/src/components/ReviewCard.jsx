const ReviewCard = ({ review }) => {
  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-leather-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="flex items-center">
              {renderStars(review.rating)}
            </div>
            <span className="font-semibold text-leather-900">
              {review.nombreUsuario || 'Usuario verificado'}
            </span>
          </div>
          <p className="text-sm text-leather-600">
            {formatearFecha(review.fecha)}
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Compra verificada</span>
        </div>
      </div>
      {review.titulo && (
        <h4 className="font-semibold text-leather-900 mb-2">
          {review.titulo}
        </h4>
      )}
      <p className="text-leather-700 leading-relaxed mb-4">
        {review.comentario}
      </p>
      <div className="border-t border-leather-100 pt-4">
        <div className="flex items-center justify-between text-sm text-leather-600">
          <span>¿Te resultó útil esta reseña?</span>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:text-leather-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v7a2 2 0 002 2h3.5l3.5 1z" />
              </svg>
              <span>Sí</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-leather-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326-.02.485-.06L17 4m-7 10v2a2 2 0 002 2v2a2 2 0 002 2h5a2 2 0 002-2v-7a2 2 0 00-2-2h-3.5l-3.5-1z" />
              </svg>
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 