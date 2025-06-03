import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';

const ReviewList = ({ productoId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productoId) {
      cargarReviews();
    }
  }, [productoId]);

  const cargarReviews = () => {
    setLoading(true);
    setError(null);
    const url = `http://localhost:8080/reviews/${productoId}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Reviews cargadas:', data); // Para debug
        setReviews(data);
      })
      .catch(error => {
        console.error('Error al cargar reviews:', error);
        setError(`No se pudieron cargar las reseñas: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calcularPromedioRating = () => {
    if (reviews.length === 0) return 0;
    const suma = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (suma / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-leather-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-leather-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 bg-leather-200 rounded w-20"></div>
                  <div className="h-4 bg-leather-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-leather-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-leather-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={cargarReviews}
            className="mt-2 px-4 py-2 bg-leather-800 text-white rounded-lg hover:bg-leather-900 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header con resumen */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-serif font-bold text-leather-900">
            Reseñas de clientes
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {/* Render de estrellas promedio */}
                {(() => {
                  const stars = [];
                  const rating = Math.round(parseFloat(calcularPromedioRating()));
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
                })()}
              </div>
              <span className="text-lg font-semibold text-leather-800">
                {calcularPromedioRating()}
              </span>
              <span className="text-leather-600">
                ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
          )}
        </div>
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-leather-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h4 className="text-xl font-bold text-leather-900 mb-2">Aún no hay reseñas</h4>
            <p className="text-leather-600">Sé el primero en compartir tu experiencia con este producto</p>
          </div>
        )}
      </div>
      {/* Lista de reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;