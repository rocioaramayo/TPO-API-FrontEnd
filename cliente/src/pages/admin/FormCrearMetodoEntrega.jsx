import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FormCrearMetodoEntrega = ({setMostrarCrearMetodo}) => {
    const location = useLocation();
    const user = location.state?.user || {};
    const navigate = useNavigate();
    // const [metodosEntrega,setMetodosEntrega] = useState({});
    // const [metodoEntrega,setMetodoEntrega] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [metodo, setMetodo] = useState({
        nombre:"",  
        descripcion:"",
        costoBase:"",
        tiempoEstimadoDias:"",
        requiereDireccion:"",
        requierePuntoRetiro:"",
        activo: true
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(metodo)
        setMetodo(prev => ({
        ...prev,
        [name]: value
        }));
    };
    const handleCrearMetodo = (e) => {
    e.preventDefault();
    // Validación rápida en frontend: Debe haber al menos una imagen
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // const categoria = categorias.find(cat => cat.nombre == producto.categoria) VER ESTO COMO HACERLO
    if (!user?.token || user.token.split('.').length !== 3) {
            alert("Token inválido o no disponible. Iniciá sesión de nuevo.");
            return;
    }
    
    fetch('http://127.0.0.1:8080/entregas/metodos', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`,
      },
      body:  JSON.stringify(metodo)
    })
    .then(response => {
      return response.text().then(text => {
        let data = {};
        try { data = JSON.parse(text); } catch (e) { data = { message: text }; }
        if (!response.ok) {
          let errorMessage = 'Error al crear punto de entrega';
          switch (response.status) {
            case 404:
              errorMessage = 'No encontrado';
              break;
            case 400:
              errorMessage = 'Datos del punto de entrega inválidos';
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
      });
    })
    .then(data => {
      console.log('Metodo creado con éxito:', data);
      setSuccess(true);
      setError(null);
      
      // Limpiar formulario
      setMetodo({
        nombre:"",  
        descripcion:"",
        costoBase:"",
        tiempoEstimadoDias:"",
        requiereDireccion:"",
        requierePuntoRetiro:"",
        activo: true 
      });
      
      // Opcional: redirigir después de unos segundos
      setTimeout(() => {
        navigate('/admin/');
      }, 3000);
    })
    .catch(error => {
      console.error('Error al crear producto:', error);
      setError(error.message);
      setSuccess(false);
    })
    .finally(() => {
      setLoading(false);
    });
    };
    return(
        <>
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className="text-3xl font-serif font-semibold text-leather-800">
                            Crear metodo de entrega
                        </h1>
                        <button 
                            type="button"
                            onClick={()=> setMostrarCrearMetodo(false)}
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
                            ¡Metodo de entrega creado exitosamente! Redirigiendo...
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
                    <form onSubmit={handleCrearMetodo} className="space-y-6">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del metodo de entrega *
                                </label>
                                <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={metodo?.nombre} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                                placeholder="Nombre de tu metodo de entrega"
                                required
                                />
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                                Descripcion *
                                </label>
                                <input
                                type="text"
                                id="descripcion"
                                name="descripcion"
                                value={metodo?.descripcion}  
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                                placeholder="Descripcion de tu metodo de entrega"
                                required
                                />
                            </div>
                            <div>
                                <label htmlFor="costoBase" className="block text-sm font-medium text-gray-700 mb-2">
                                Costo base *
                                </label>
                                <input
                                type="number"
                                id="costoBase"
                                name="costoBase"
                                value={metodo.costoBase}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                                placeholder="Costo base..."
                                required
                                />
                            </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="tiempoEstimadoDias" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiempo estimado en días *
                                    </label>
                                    <input
                                    type="number"
                                    id="tiempoEstimadoDias"
                                    name="tiempoEstimadoDias"
                                    value={metodo.tiempoEstimadoDias}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                                    placeholder="Tiempo estimado en días..."
                                    required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="requiereDireccion" className="block text-sm font-medium text-gray-700 mb-2">
                                    Requiere direccion *
                                    </label>
                                    <select
                                    id="requiereDireccion"
                                    name="requiereDireccion"
                                    value={metodo.requiereDireccion}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                                    required
                                    >
                                        <option value="">Seleccionar opción</option>
                                        <option value={true}>Si</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="requierePuntoRetiro" className="block text-sm font-medium text-gray-700 mb-2">
                                    Requiere punto de retiro *
                                    </label>
                                    <select
                                    id="requierePuntoRetiro"
                                    name="requierePuntoRetiro"
                                    value={metodo.requierePuntoRetiro}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                                    required
                                    >
                                        <option value="">Seleccionar opción</option>
                                        <option value={true}>Si</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>                                
                            </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    Creando metodo...
                                </div>
                                ) : (
                                'Crear punto'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
    ) 
}

export default FormCrearMetodoEntrega;

/*
{mostrarAlertaDesactivar && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
                <p className="text-sm mb-6">¿Queres desactivar el producto?</p>
                
                <div className="flex justify-between">
                    <button
                    onClick={() => setMostrarAlertaDesactivar(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleDesactivar}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                    Desactivar
                    </button>
                </div>
                </div>
            </div>
        )}
            */