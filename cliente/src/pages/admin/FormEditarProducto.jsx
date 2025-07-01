import { useEffect, useState } from 'react';
import { data, Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { fetchAdminProducts, fetchProductById, updateProduct, deleteProductPhoto } from '../../store/slices/productsSlice';

// Deducir tipo mime a partir del nombre del archivo (si existe)
function guessMimeType(foto) {
  if (foto?.nombre) {
    const ext = foto.nombre.split('.').pop().toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
  }
  // Si empieza con "/9j/" probablemente es JPEG
  if (foto?.image && foto.image.startsWith("/9j/")) return "image/jpeg";
  // Default
  return "image/jpeg";
}

const FormEditarProducto = ({ setMostrarEditarProducto, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.users);
  const categorias = useSelector((state) => state.categories.items);
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [producto, setProducto] = useState(null);
  const [fotosActuales, setFotosActuales] = useState([]);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [success, setSuccess] = useState(false);
  const [internalError, setInternalError] = useState(null);
  const [deletePhotoMessage, setDeletePhotoMessage] = useState(null);
  const [deletePhotoSuccess, setDeletePhotoSuccess] = useState(false);
  const [fotoAEliminar, setFotoAEliminar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fotosAEliminar, setFotosAEliminar] = useState([]);

  // Cargar datos del producto desde Redux
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // Poblar el estado local cuando los datos de Redux estén listos
  useEffect(() => {
    if (selectedProduct) {
      setProducto(selectedProduct);
      setFotosActuales(selectedProduct.fotos || []);
      setImagenesNuevas([]);
    }
  }, [selectedProduct]);

  // Cargar categorías
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handler para eliminar una foto actual del producto
  const handleEliminarFoto = (fotoId) => {
    dispatch(deleteProductPhoto({ id, fotoId, token: user.token }));
    // El feedback se maneja en useEffect observando el estado global
  };

  // Handler para eliminar una imagen nueva antes de enviar
  const handleEliminarImagenNueva = (idx) => {
    setImagenesNuevas(prev => prev.filter((_, i) => i !== idx));
  };

  // Handler para agregar nuevas imágenes
  const handleChangeImagenes = (e) => {
    const archivos = Array.from(e.target.files);
    setImagenesNuevas(prev => [...prev, ...archivos]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(producto)
  };

  // Handler para marcar una foto actual para eliminar (no elimina en backend todavía)
  const handleMarcarFotoParaEliminar = (fotoId) => {
    setFotosAEliminar(prev => [...prev, fotoId]);
    setFotosActuales(prev => prev.filter(f => f.id !== fotoId));
  };

  const handleEditarProducto = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!user?.token || user.token.split('.').length !== 3) {
      alert("Token inválido o no disponible. Iniciá sesión de nuevo.");
      return;
    }

    const categoria = categorias.find(cat => cat.nombre == producto.categoria)
    
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('stock', producto.stock);
    formData.append('color', producto.color);
    formData.append('grosor', producto.grosor);
    formData.append('acabado', producto.acabado);
    formData.append('textura', producto.textura);
    formData.append('tipoCuero', producto.tipoCuero);
    formData.append('instruccionesCuidado', producto.instrucciones)
    formData.append('categoryId', categoria.id);
    // Agregar las fotos actuales (no eliminadas) como Blob
    fotosActuales.forEach(foto => {
      const byteString = atob(foto.file);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const mimeType = guessMimeType(foto);
      const blob = new Blob([ab], { type: mimeType });
      formData.append('files', blob, foto.nombre || `foto-actual-${foto.id}.jpg`);
    });
    // Agregar imágenes nuevas
    if (imagenesNuevas.length > 0) {
      imagenesNuevas.forEach((imagen) => {
        formData.append('files', imagen);
      });
    }
    // Agregar los IDs de fotos a eliminar
    if (fotosAEliminar.length > 0) {
      fotosAEliminar.forEach(fotoId => {
        formData.append('fotosAEliminar', fotoId);
      });
    }
    try {
      const resultAction = await dispatch(updateProduct({token: user.token, formData, id}));
      if (updateProduct.fulfilled.match(resultAction)) {
        setSuccess(true);
        setTimeout(() => {
          setMostrarEditarProducto(false)
          dispatch(fetchAdminProducts(user.token))
          setSuccess(false)
        },3000);
      }
      // Si fue rejected, el error se maneja por Redux y no se muestra éxito ni se cierra el modal
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };  

  // Feedback visual para eliminar foto usando el estado global de Redux
  const { loading: productsLoading, error: productsError, success: productsSuccess } = useSelector((state) => state.products);

  useEffect(() => {
    if (productsSuccess) {
      setFotosActuales(prev => prev.filter(f => f.id !== fotoAEliminar));
    }
    // Si hay error, no mostrar nada
    // eslint-disable-next-line
  }, [productsSuccess, productsError]);

  // Limpiar el estado de éxito si ocurre un error
  useEffect(() => {
    if (error) {
      setSuccess(false);
    }
  }, [error]);

  // Modal visual de confirmación para eliminar foto
  const confirmDeleteModal = showConfirmModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">¿Seguro que querés eliminar esta foto?</h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              handleEliminarFoto(fotoAEliminar);
              setShowConfirmModal(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {confirmDeleteModal}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Card minimalista */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className='flex'>
              <button 
                  type="button"
                  onClick={()=> setMostrarEditarProducto(false)}
                  className="w-sm bg-gray-100 text-gray-700 py-2.5 px-4 rounded font-medium hover:bg-gray-200 transition-colors">
                  Volver
              </button>
            </div>
            {/* Header simple */}
            <div className="text-center mb-8 flex justify-center">
              <h1 className="text-3xl font-serif font-semibold text-leather-800 mb-2">
                Editar Producto
              </h1>
            </div>
            {success && !error && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ¡Producto editado exitosamente! Redirigiendo...
                </div>
              </div>
            )}

            {/* Mensaje de error específico del backend */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error.includes("ProductoSinImagenesException") || error.toLowerCase().includes("foto") || error.toLowerCase().includes("imagen")
                    ? "Debe quedar al menos una foto en el producto."
                    : error}
                </div>
              </div>
            )}
          
          
          
            {/* Formulario limpio */}
            <form onSubmit={handleEditarProducto} className="space-y-5">
              {/* Nombre producto */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label 
                    htmlFor="nombreProducto" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de Producto
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={producto?.nombre} 
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                    placeholder="Nombre de tu producto"
                    required
                  />
                </div>
               {/* Precio y stock */}
              
                <div>
                  <label 
                    htmlFor="precio" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Precio
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="precio"
                    name="precio"
                    value={producto?.precio}  
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                    placeholder="10000"
                    required
                  />
                </div>
              </div>
            
            
              {/* Descripcion */}
              <div>
                <label
                  htmlFor="descripcion" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Descripcion
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={producto?.descripcion} 
                  onChange={handleChange} 
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                  placeholder="Tu descripcion..."
                  required
                />
              </div>
            
              
              {/* Categoria */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label 
                    htmlFor="categoria" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Categoria
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={producto?.categoria}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                    required
                  >
                    <option value="">{producto?.categoria}</option>
                    {categorias?.map(categoria =>(
                      <option value={categoria.nombre}>{categoria.nombre}</option>
                    ))}
                  </select>
                  
                </div>
              
                {/* Tipo de cuero */}
                <div>
                  <label 
                    htmlFor="tipoCuero" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de cuero
                  </label>
                  <input
                      type="text"
                      id="tipoCuero"
                      name="tipoCuero"
                      value={producto?.tipoCuero}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                      placeholder="Nobuck"
                      required
                    />
                </div>
              {/* Grosor */}
                <div>
                  <label 
                    htmlFor="grosor" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Grosor
                  </label>
                  <input
                      type="text"
                      id="grosor"
                      name="grosor"
                      value={producto?.grosor}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                      placeholder="Fino"
                      required
                    />
                </div>
              </div>
              {/* Acabado */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label 
                    htmlFor="acabado" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Acabado
                  </label>
                  <input
                      type="text"
                      id="acabado"
                      name="acabado"
                      value={producto?.acabado}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                      placeholder="Vintage"
                      required
                    />
                </div>
              {/**Color y textura */}
              
                {/*  Color */}
                <div>
                  <label 
                    htmlFor="color" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Color
                  </label>
                  <input
                      type="text"
                      id="color"
                      name="color"
                      value={producto?.color}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors`}
                      placeholder="Negro"
                      required
                    />
                </div>
              {/* Textura */}
                <div>
                  <label 
                    htmlFor="textura" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Textura
                  </label>
                  <input
                      type="text"
                      id="textura"
                      name="textura"
                      value={producto?.textura}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                      placeholder="Trenzado"
                      required
                    />
                </div>
              </div>
              {/**Instrucciones */}
              <div>
                  <label 
                    htmlFor="instruccionesCuidado" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Instrucciones de cuidado
                  </label>
                  <input
                      type="text"
                      id="instruccionesCuidado"
                      name="instruccionesCuidado"
                      value={producto?.instruccionesCuidado}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                      placeholder="Mantener en lugar..."
                      required
                    />
                </div>
              {/* Imágenes actuales */}
              {fotosActuales.length > 0 && (
                <div className="mb-3">
                  <div className="font-semibold mb-1">Imágenes actuales:</div>
                  <div className="flex gap-3 flex-wrap">
                    {fotosActuales.map((foto, idx) => {
                      const mimeType = guessMimeType(foto);
                      return (
                        <div key={foto.id} className="relative inline-block mr-2 mb-2">
                          <img
                            src={`data:${mimeType};base64,${foto.file}`}
                            alt={`Foto ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleMarcarFotoParaEliminar(foto.id)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                            title="Eliminar foto"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <span className="block text-xs text-gray-500 mt-1">
                    Si no eliminás una imagen, se mantendrá. Podés sumar nuevas abajo.
                  </span>
                </div>
              )}

              <label htmlFor="imagenes" className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes nuevas
              </label>
              <div className="flex flex-col items-start gap-2">
                <label
                  htmlFor="imagenes"
                  className="inline-block px-6 py-2 bg-white border border-leather-400 rounded cursor-pointer font-medium text-leather-800 hover:bg-cream-100 transition-colors"
                  tabIndex={0}
                >
                  Elegir archivos
                  <input
                    id="imagenes"
                    name="imagenes"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    onChange={handleChangeImagenes}
                    className="hidden"
                  />
                </label>
                <span className="text-sm font-medium text-gray-700 ml-1 select-none">
                  {imagenesNuevas.length === 0
                    ? 'No seleccionaste nuevas imágenes. Se mantendrán las actuales.'
                    : `Vas a subir ${imagenesNuevas.length} nueva${imagenesNuevas.length > 1 ? 's' : ''} imagen${imagenesNuevas.length > 1 ? 'es' : ''}. Se sumarán a las actuales.`}
                </span>
                {/* Previsualización de nuevas imágenes seleccionadas */}
                {imagenesNuevas.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {imagenesNuevas.map((imagen, idx) => (
                      <div key={idx} className="relative flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => handleEliminarImagenNueva(idx)}
                          className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-red-500 hover:bg-red-100 shadow-sm z-10"
                          aria-label="Eliminar imagen"
                          tabIndex={0}
                        >
                          ×
                        </button>
                        <img
                          src={URL.createObjectURL(imagen)}
                          alt={`preview-${idx}`}
                          className="h-24 w-24 object-cover rounded shadow border"
                        />
                        <span className="text-xs mt-1">{imagen.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                // disabled={loading}
                className="w-full bg-leather-800 text-white py-2.5 px-4 rounded font-medium hover:bg-leather-900 focus:outline-none focus:ring-2 focus:ring-leather-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Editando producto...
                  </div>
                ) : (
                  'Editar Producto'
                )}
              </button>
            </div>
            </form>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default FormEditarProducto;