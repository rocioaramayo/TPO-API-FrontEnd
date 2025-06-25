import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, fetchAdminProducts } from '../../store/slices/productsSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';

const FormCrearProducto = ({ setMostrarCrearProducto }) => {
  const dispatch = useDispatch();
  const categorias = useSelector((state) => state.categories.items);
  const { user } = useSelector((state) => state.users);
  const { error } = useSelector((state) => state.products);
  const { success } = useSelector((state) => state.products);
  const { loading } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const [imagenes, setImagenes] = useState([]);

  const [producto, setProducto] = useState({
    nombre:"",
    descripcion:"",
    precio:"",
    stock:"",
    categoria:"",
    tipoCuero:"",
    grosor:"",
    acabado:"",
    color:"",
    textura:"",
    instrucciones:"",
    imagenes:[]
  })

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleChangeImagenes = (e) => {
    const archivos = Array.from(e.target.files);
    setImagenes(archivos); // Sobreescribe el array de imágenes
  };
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    // Validación rápida en frontend: Debe haber al menos una imagen
    if (imagenes.length === 0) {
      return alert("El producto debe tener al menos una imagen.");
    }
    
    const categoria = categorias.find(cat => cat.nombre == producto.categoria)
    
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('stock', producto.stock);
    formData.append('color', producto.color);
    formData.append('grosor', producto.grosor);
    formData.append('textura', producto.textura);
    formData.append('acabado', producto.acabado);
    formData.append('tipoCuero', producto.tipoCuero);
    formData.append('instruccionesCuidado', producto.instrucciones)
    formData.append('categoryId', categoria.id);

    // Agregar imágenes
    imagenes.forEach((imagen) => {
      formData.append('files', imagen);
    });
    try {
      const resultAction = await dispatch(createProduct({token: user.token,formData})).unwrap();
      // Limpiar formulario
      setProducto({
        nombre:"",
        descripcion:"",
        precio:"",
        stock:"",
        categoria:"",
        tipoCuero:"",
        grosor:"",
        acabado:"",
        color:"",
        textura:"",
        instrucciones:"",
        imagenes:[]
      });
      setImagenes([]);
      
      setTimeout(() => {
        setMostrarCrearProducto(false);
        dispatch(fetchAdminProducts(user.token));
      }, 2000);

    } catch(err){
      console.error('Error al crear producto:', err);
    }
  };

  // Permite eliminar imágenes seleccionadas antes de enviar el formulario
  const handleEliminarImagen = (idx) => {
    setImagenes(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className='flex justify-between items-center mb-6'>
            <h1 className="text-3xl font-serif font-semibold text-leather-800">
              Crear Producto
            </h1>
            <button 
              type="button"
              onClick={()=>setMostrarCrearProducto(false)}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-200 transition-colors">
              Volver
            </button>
          </div>

          {/* Mensaje de éxito */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ¡Producto creado exitosamente! Redirigiendo...
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
                {error}
              </div>
            </div>
          )}
        
          <form onSubmit={handleCrearProducto} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={producto.nombre} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="Nombre de tu producto"
                  required
                />
              </div>
             
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  step="any"
                  id="precio"
                  name="precio"
                  value={producto.precio}  
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="10000"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={producto.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="30"
                  required
                />
              </div>
            </div>
          
            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={producto.descripcion} 
                onChange={handleChange} 
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                placeholder="Descripción detallada del producto..."
                required
              />
            </div>
            
            {/* Categoría y características */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={producto.categoria}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.length > 0 && categorias.map(categoria =>(
                    <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
                  ))}
                </select>
              </div>
            
              <div>
                <label htmlFor="tipoCuero" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de cuero
                </label>
                <input
                  type="text"
                  id="tipoCuero"
                  name="tipoCuero"
                  value={producto.tipoCuero}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="Nobuck"
                />
              </div>
            
              <div>
                <label htmlFor="grosor" className="block text-sm font-medium text-gray-700 mb-2">
                  Grosor
                </label>
                <input
                  type="text"
                  id="grosor"
                  name="grosor"
                  value={producto.grosor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="Fino"
                />
              </div>
            </div>

            {/* Acabado, color y textura */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="acabado" className="block text-sm font-medium text-gray-700 mb-2">
                  Acabado
                </label>
                <input
                  type="text"
                  id="acabado"
                  name="acabado"
                  value={producto.acabado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="Vintage"
                />
              </div>
            
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={producto.color}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="Negro"
                />
              </div>
            
              <div>
                <label htmlFor="textura" className="block text-sm font-medium text-gray-700 mb-2">
                  Textura
                </label>
                <input
                  type="text"
                  id="textura"
                  name="textura"
                  value={producto.textura}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                  placeholder="Trenzado"
                />
              </div>
            </div>

            {/* Instrucciones de cuidado */}
            <div>
              <label htmlFor="instrucciones" className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones de cuidado
              </label>
              <textarea
                id="instrucciones"
                name="instrucciones"
                value={producto.instrucciones}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                placeholder="Mantener en lugar seco, limpiar con paño húmedo..."
              />
            </div>

            {/* Imágenes */}
            <div>
              <label htmlFor="imagenes" className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes del producto *
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
                  {imagenes.length === 0
                    ? 'Sin archivos seleccionados'
                    : `${imagenes.length} archivo${imagenes.length > 1 ? 's' : ''} seleccionados`}
                </span>
              </div>
              {/* Previsualización de imágenes seleccionadas */}
              {imagenes.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {imagenes.map((imagen, idx) => (
                    <div key={idx} className="relative flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => handleEliminarImagen(idx)}
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
              <p className="text-xs text-gray-500 mt-1">
                Selecciona una o más imágenes (PNG, JPEG, WEBP). Máximo 2MB por imagen.
              </p>
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-leather-800 text-white py-3 px-4 rounded font-medium hover:bg-leather-900 focus:outline-none focus:ring-2 focus:ring-leather-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creando producto...
                  </div>
                ) : (
                  'Crear Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormCrearProducto;