const ReviewCard = ({ review }) => {
  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseInt(rating) || 0; // Asegurar que sea un número
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${i <= numRating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
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
    try {
      return new Date(fecha).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return fecha; // Si no se puede parsear, devolver la fecha original
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center">
              {renderStars(review.rating)}
            </div>
            <span className="font-medium text-orange-950">
              {review.nombreUsuario || 'Usuario verificado'}
            </span>
          </div>
          <p className="text-sm text-orange-800 font-light">
            {formatearFecha(review.fecha)}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Compra verificada</span>
        </div>
      </div>
      {review.titulo && review.titulo.trim() && (
        <h4 className="font-medium text-orange-950 mb-3 text-lg">
          {review.titulo}
        </h4>
      )}
      <p className="text-orange-800 leading-relaxed mb-6 font-light">
        {review.comentario}
      </p>
    </div>
  );
};

export default ReviewCard;