import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ReviewForm = ({ productoId, onReviewSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { user, isAuthenticated } = useSelector(state => state.users);

  const [reviewData, setReviewData] = useState({
    rating: 0,
    titulo: '',
    comentario: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setReviewData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user || !user.token) {
      setError('Debes iniciar sesión para escribir una reseña');
      return;
    }

    if (reviewData.rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (!reviewData.comentario.trim()) {
      setError('Por favor escribe un comentario');
      return;
    }

    setLoading(true);
    setError(null);

    const requestBody = {
      productoId: parseInt(productoId),
      estrellas: reviewData.rating,
      titulo: reviewData.titulo.trim() || null, // Enviar título o null si está vacío
      comentario: reviewData.comentario
    };

    fetch('http://localhost:8080/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      return response.text().then(text => {
        let data = {};
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { message: text };
        }
        
        if (!response.ok) {
          let errorMessage = 'Error al enviar la reseña';
          
          switch (response.status) {
            case 403:
              errorMessage = 'No estás autorizado para dejar una reseña. Solo pueden opinar quienes compraron este producto.';
              break;
            case 404:
              if (text.includes('Usuario no encontrado')) {
                errorMessage = 'Usuario no encontrado';
              } else if (text.includes('Producto no encontrado')) {
                errorMessage = 'Producto no encontrado';
              } else {
                errorMessage = 'Recurso no encontrado';
              }
              break;
            case 400:
              errorMessage = data.message || text || 'Datos de la reseña inválidos';
              break;
            case 409:
              // Conflict - Ya dejó una reseña (usar el mensaje del servidor)
              errorMessage = data.message || text || 'Ya has dejado una reseña para este producto';
              break;
            default:
              if (data.message) {
                errorMessage = data.message;
              } else if (text) {
                errorMessage = text;
              } else if (response.statusText && response.statusText !== 'OK') {
                errorMessage = response.statusText;
              }
          }
          
          throw new Error(errorMessage);
        }
        
        return data;
      });
    })
    .then(() => {
      setSuccess(true);
      setError(null);
      setReviewData({ rating: 0, titulo: '', comentario: '' });
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    })
    .catch(error => {
      console.error('Error al enviar reseña:', error);
      setError(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const renderStars = (interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && handleRatingClick(i)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200`}
          disabled={!interactive}
        >
          <svg
            className={`w-6 h-6 ${i <= reviewData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-300' : ''}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    }
    return stars;
  };

  if (!isAuthenticated) {
    return (
      <div className="py-8 border-t border-leather-200">
        <div className="text-center">
          <h4 className="text-lg font-serif font-semibold text-leather-900 mb-2">
            ¿Has comprado este producto?
          </h4>
          <p className="text-leather-600 mb-4">
            Comparte tu experiencia con otros clientes
          </p>
          <div className="bg-leather-50 border border-leather-200 rounded-lg p-4">
            <p className="text-leather-700 mb-3">
              Para escribir una reseña necesitas tener una cuenta
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="bg-leather-800 text-white px-6 py-2 rounded-lg hover:bg-leather-900 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="border border-leather-800 text-leather-800 px-6 py-2 rounded-lg hover:bg-leather-800 hover:text-white transition-colors"
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 border-t border-leather-200">
      {!isOpen ? (
        <div className="text-center">
          <h4 className="text-lg font-serif font-semibold text-leather-900 mb-2">
            ¿Has comprado este producto?
          </h4>
          <p className="text-leather-600 mb-4">
            Comparte tu experiencia con otros clientes
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-leather-800 text-white px-8 py-3 rounded-lg hover:bg-leather-900 transition-colors font-medium"
          >
            Escribir Reseña
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-leather-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-serif font-semibold text-leather-900">
                Escribir Reseña
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-leather-400 hover:text-leather-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ¡Reseña enviada con éxito! Gracias por compartir tu experiencia.
                </div>
              </div>
            )}

            {/* Mensaje de error específico del backend */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-leather-700 mb-2">
                  Calificación *
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(true)}
                  {reviewData.rating > 0 && (
                    <span className="ml-2 text-leather-600">
                      {reviewData.rating} de 5 estrellas
                    </span>
                  )}
                </div>
              </div>

              {/* Título (opcional) */}
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-leather-700 mb-2">
                  Título de tu reseña (opcional)
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={reviewData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: Excelente calidad, muy recomendado"
                  className="w-full px-3 py-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  maxLength="100"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-leather-500">Máximo 100 caracteres</p>
                  <p className="text-xs text-leather-400">
                    {reviewData.titulo.length}/100
                  </p>
                </div>
              </div>

              {/* Comentario */}
              <div>
                <label htmlFor="comentario" className="block text-sm font-medium text-leather-700 mb-2">
                  Tu reseña *
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={reviewData.comentario}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos sobre tu experiencia con este producto. ¿Qué te gustó? ¿Cómo es la calidad? ¿Lo recomendarías?"
                  rows={5}
                  className="w-full px-3 py-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500 focus:border-leather-500 transition-colors resize-none"
                  maxLength="1000"
                  required
                />
                <p className="text-xs text-leather-500 mt-1">
                  {reviewData.comentario.length}/1000 caracteres
                </p>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-leather-800 text-white px-6 py-3 rounded-lg hover:bg-leather-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    'Publicar Reseña'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-leather-300 text-leather-700 px-6 py-3 rounded-lg hover:bg-leather-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;