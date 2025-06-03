import { useEffect, useState } from 'react';
import { data, Link, useNavigate, useParams } from 'react-router-dom';

const FormEditarProducto = ({ user , setMostrarEditarProducto, id }) => {
  const [categorias,setCategorias] = useState([])
  const navigate = useNavigate();
  const [producto,setProducto] = useState() ;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  useEffect(()=>{
    fetch(`http://localhost:8080/productos/detalle/${id}`)
    .then(response => response.json())
    .then(data => setProducto(data))
    .catch(error => console.error('Error al cargar productos:', error));
  },[]);

  useEffect(() => {
      fetch('http://localhost:8080/categories')
        .then(response => response.json())
        .then(data => setCategorias(data))
        .catch(error => console.error('Error al cargar categorías:', error));
    }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(producto)
  };
  const handleChangeImagenes = (e) =>{
    const {name} = e.target;
    const archivos = Array.from(e.target.files);
    setImagenes(prev => [...prev, ...archivos])
    setProducto(prev =>({
      ...prev,
      [name]: producto.imagenes
    }))
  }
  const handleEditarProducto = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
    // Agregar imágenes
    producto.fotos.forEach((imagen) => {
      formData.append('files', imagen); // el backend espera 'fotos'
    });
    
    fetch(`http://127.0.0.1:8080/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      body: formData
    })
    .then(response =>{
      return response.text().then(text =>{
        let data = {};
        try{data = json.parse(text);}
        catch(e){ data = {message: text}; }
        if (!response.ok) {
          let errorMessage = 'Error al editar producto';
          switch (response.status) {
            case 404:
              if (text.includes('ProductoNoEncontradoException')) errorMessage = 'Producto no encontrado.';
              else errorMessage = 'No encontrado';
              break;
            case 400:
              if (text.includes('CategoriaNoEncontradaException')) errorMessage = 'Categoría no encontrada.';
              else if (text.includes('ImagenRequeridaException')) errorMessage = 'El producto debe tener al menos una imagen.';
              else if (text.includes('ImagenDemasiadoGrandeException')) errorMessage = 'La imagen es demasiado grande. El límite es de 2MB.';
              else if (data.message) errorMessage = data.message;
              else errorMessage = 'Datos del producto inválidos';
              break;
            case 403:
              errorMessage = 'No tienes permisos para crear productos';
              break;
            default:
              if (data.message) errorMessage = data.message;
              else if (response.statusText && response.statusText !== 'OK') errorMessage = response.statusText;
          }
          throw new Error(errorMessage);
        }
        return data;
      })
    })
    .then(data => {
      console.log('Producto creado con éxito:', data);
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setMostrarEditarProducto(false)
      },2000);
    })
    .catch (error => {
      console.error('Error al crear producto:', error);
      setError(error.message);
      setSuccess(false);
    })
    .finally(() => {
      setLoading(false);
    });
  };
return (
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
            {/*Imagenes */}
            <label 
              htmlFor="imagenes" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Imágenes
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
              {/* Previsualización de imágenes seleccionadas */}
              {imagenes.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {imagenes.map((imagen, idx) => (
                    <div key={idx} className="relative flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setImagenes(prev => prev.filter((_, i) => i !== idx))}
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
  );
};

export default FormEditarProducto;