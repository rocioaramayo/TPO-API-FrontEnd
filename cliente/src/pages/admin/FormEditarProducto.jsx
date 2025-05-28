import { useEffect, useState } from 'react';
import { data, Link, useNavigate, useParams } from 'react-router-dom';

const FormEditarProducto = ({ user, setUser, loading, setLoading, error, setError }) => {
  const [categorias,setCategorias] = useState([])
  const navigate = useNavigate();
  const [producto,setProducto] = useState() ;
  const id = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [imagenes, setImagenes] = useState([]);
  useEffect(()=>{
    fetch(`http://localhost:8080/productos/detalle/${id["*"]}`)
    .then(response => response.json())
    .then(data => setProducto(data))
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
    
    // if (formErrors[name]) {
    //   setFormErrors(prev => ({
    //     ...prev,
    //     [name]: ''
    //   }));
    // }
  };
  const handleChangeImagenes = (e) =>{
    const {name} = e.target;
    const archivos = Array.from(e.target.files);
    setImagenes(prev => [...prev, ...archivos])
    setProducto(prev =>({
      ...prev,
      [name]: imagenes
    }))
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    const response = await fetch(`http://127.0.0.1:8080/productos/${id["*"]}`,{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(producto)
      
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Actualizado con éxito:', data);
    } else {
      console.error('Error al actualizar',data);
    }
  };
return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-l">
        {/* Card minimalista */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className='flex'>
            <button 
                type="button"
                onClick={()=>navigate('/admin/productos')}
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
          <div className="mt-4">
            
          </div>
        
          {/* Error message minimalista */}
          {/* {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )} */}
        
          {/* Formulario limpio */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                {/* {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )
                }  */}
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
                 {/* {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                )} */}
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
              {/* {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )} */}
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
                {/* {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )} */}
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
                {/* {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )} */}
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
                {/* {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )} */}
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
                {/* {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )} */}
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
                {/* {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )} */}
              </div>
            </div>
            {/**Instrucciones */}
            <div>
                <label 
                  htmlFor="instrucciones" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Instrucciones
                </label>
                <input
                    type="text"
                    id="instrucciones"
                    name="instrucciones"
                    value={producto?.instruccionesCuidado}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors `}
                    placeholder="Mantener en lugar..."
                    required
                  />
                {/* {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )} */}
              </div>
            {/*Imagenes */}
            <label 
                  htmlFor="imagenes" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Imagenes
              </label>
              <input 
                name='imagenes'
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleChangeImagenes} 
                />

            {/* Submit Button */}
            <button
              type="submit"
              // disabled={loading}
              className="w-full bg-leather-800 text-white py-2.5 px-4 rounded font-medium hover:bg-leather-900 focus:outline-none focus:ring-2 focus:ring-leather-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando producto...
                </div>
              ) : (
                'Editar Producto'
              )}
            </button>
          </form>
        </div>

        
      </div>
    </div>
  );
};

export default FormEditarProducto;