import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createReview, clearCreateReviewStatus } from '../store/slices/reviewSlice';

const ReviewForm = ({ productoId, onReviewSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    titulo: '',
    comentario: ''
  });
  const [localError, setLocalError] = useState({ rating: '', comentario: '' });

  const { user, isAuthenticated } = useSelector(state => state.users);
  const { createLoading, createError, createSuccess } = useSelector(state => state.reviews);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'comentario' && value.trim()) {
      setLocalError(prev => ({ ...prev, comentario: '' }));
    }
  };

  const handleRatingClick = (rating) => {
    setReviewData(prev => ({
      ...prev,
      rating
    }));
    if (rating > 0) {
      setLocalError(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    let newError = { rating: '', comentario: '' };
    if (reviewData.rating === 0) {
      newError.rating = 'Por favor, seleccioná una calificación.';
      hasError = true;
    }
    if (!reviewData.comentario.trim()) {
      newError.comentario = 'Por favor, escribí tu reseña.';
      hasError = true;
    }
    setLocalError(newError);
    if (hasError) return;
    if (!user || !user.token) {
      return;
    }
    const requestBody = {
      productoId: parseInt(productoId),
      estrellas: reviewData.rating,
      titulo: reviewData.titulo.trim() || null,
      comentario: reviewData.comentario
    };
    dispatch(createReview({ token: user.token, data: requestBody }));
  };

  // Limpiar y cerrar modal cuando la review se crea con éxito
  useEffect(() => {
    if (createSuccess) {
      setReviewData({ rating: 0, titulo: '', comentario: '' });
      if (onReviewSubmitted) onReviewSubmitted();
      const timeout = setTimeout(() => {
        setIsOpen(false);
        dispatch(clearCreateReviewStatus());
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [createSuccess, dispatch, onReviewSubmitted]);

  const handleOpen = () => {
    setIsOpen(true);
    setReviewData({ rating: 0, titulo: '', comentario: '' });
    setLocalError({ rating: '', comentario: '' });
    dispatch(clearCreateReviewStatus());
  };

  const handleClose = () => {
    setIsOpen(false);
    setReviewData({ rating: 0, titulo: '', comentario: '' });
    setLocalError({ rating: '', comentario: '' });
    dispatch(clearCreateReviewStatus());
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
            className={`w-6 h-6 ${i <= reviewData.rating ? 'text-amber-400 fill-current' : 'text-gray-300'} ${interactive ? 'hover:text-amber-300' : ''}`}
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
      <div className="py-12 border-t border-gray-200">
        <div className="text-center">
          <h4 className="text-2xl font-light text-orange-950 mb-3">
            ¿Has comprado este producto?
          </h4>
          <p className="text-orange-800 mb-6 font-light">
            Comparte tu experiencia con otros clientes
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-orange-800 mb-4 font-light">
              Para escribir una reseña necesitas tener una cuenta
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="bg-orange-950 text-white px-6 py-3 rounded-md hover:bg-orange-900 transition-colors font-light"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="border border-orange-950 text-orange-950 px-6 py-3 rounded-md hover:bg-orange-950 hover:text-white transition-colors font-light"
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
    <div className="py-12 border-t border-gray-200">
      {!isOpen ? (
        <div className="text-center">
          <h4 className="text-2xl font-light text-orange-950 mb-3">
            ¿Has comprado este producto?
          </h4>
          <p className="text-orange-800 mb-6 font-light">
            Comparte tu experiencia con otros clientes
          </p>
          <button
            onClick={handleOpen}
            className="bg-orange-950 text-white px-8 py-3 rounded-md hover:bg-orange-900 transition-colors font-light"
          >
            Escribir Reseña
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-light text-orange-950">
                Escribir Reseña
              </h4>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mensaje de éxito */}
            {createSuccess && (
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
            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {createError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-3">
                  Calificación *
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(true)}
                  {reviewData.rating > 0 && (
                    <span className="ml-3 text-orange-700 font-light">
                      {reviewData.rating} de 5 estrellas
                    </span>
                  )}
                </div>
                {localError.rating && (
                  <p className="text-xs text-red-600 mt-1">{localError.rating}</p>
                )}
              </div>

              {/* Título (opcional) */}
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-orange-800 mb-2">
                  Título de tu reseña (opcional)
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={reviewData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: Excelente calidad, muy recomendado"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors font-light"
                  maxLength="100"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 font-light">Máximo 100 caracteres</p>
                  <p className="text-xs text-gray-400">
                    {reviewData.titulo.length}/100
                  </p>
                </div>
              </div>

              {/* Comentario */}
              <div>
                <label htmlFor="comentario" className="block text-sm font-medium text-orange-800 mb-2">
                  Tu reseña *
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={reviewData.comentario}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos sobre tu experiencia con este producto. ¿Qué te gustó? ¿Cómo es la calidad? ¿Lo recomendarías?"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none font-light"
                  maxLength="1000"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 font-light">Máximo 1000 caracteres</p>
                  <p className="text-xs text-gray-400">
                    {reviewData.comentario.length}/1000
                  </p>
                </div>
                {localError.comentario && (
                  <p className="text-xs text-red-600 mt-1">{localError.comentario}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="bg-orange-950 text-white px-8 py-3 rounded-md hover:bg-orange-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-light"
                >
                  {createLoading ? (
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
                  onClick={handleClose}
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors font-light"
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