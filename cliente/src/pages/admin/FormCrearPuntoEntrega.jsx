import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FormCrearPuntoEntrega = ({setMostrarCrearPunto}) => {
    const location = useLocation();
    const user = location.state?.user || {};
    const navigate = useNavigate();
    const [metodosEntrega,setMetodosEntrega] = useState({});
    const [metodoEntrega,setMetodoEntrega] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [punto, setPunto] = useState({
        nombre:"",  
        descripcion:"",
        direccion:"",
        localidad:"",
        provincia:"",
        codigoPostal:"",
        horarioAtencion:"",
        telefono:"",
        email:"",
        metodoEntregaId: metodoEntrega?.id, //esto ver
        coordenadas: " ",
        activo: true
    });

    useEffect(() => {
        fetch("http://localhost:8080/entregas/metodos")
        .then(res => res.json())
        .then(data => {
            setMetodosEntrega(data);
            const metodo = data.find(m => m.requierePuntoRetiro);
            if (metodo) setMetodoEntrega(metodo);
        })
    },[])
    useEffect(() => {
        if (metodoEntrega?.id) {
            setPunto(prev => ({ ...prev, metodoEntregaId: metodoEntrega.id }));
            console.log("Actualizado punto con método:", metodoEntrega.id);
        }
    }, [metodoEntrega]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(punto)
        setPunto(prev => ({
        ...prev,
        [name]: value
        }));
    };


    const handleCrearPunto = (e) => {
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
    
    fetch('http://127.0.0.1:8080/entregas/puntos', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`,
      },
      body:  JSON.stringify(punto)
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
      console.log('Punto de entrega creado con éxito:', data);
      setSuccess(true);
      setError(null);
      
      // Limpiar formulario
      setPunto({
        nombre:"",
        descripcion:"",
        direccion:"",
        localidad:"",
        provincia:"",
        codigoPostal:"",
        horarioAtencion:"",
        telefono:"",
        email:"",
        metodoEntregaId:"", //esto ver
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="w-full max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className='flex justify-between items-center mb-6'>
                    <h1 className="text-3xl font-serif font-semibold text-leather-800">
                        Crear punto de entrega
                    </h1>
                    <button 
                        type="button"
                        onClick={() => setMostrarCrearPunto(false)}
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
                        ¡Punto de entrega creado exitosamente! Redirigiendo...
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
                <form onSubmit={handleCrearPunto} className="space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del punto de entrega *
                            </label>
                            <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={punto?.nombre} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Nombre de tu punto de entrega"
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
                            value={punto?.descripcion}  
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Descripcion de tu punto de entrega"
                            required
                            />
                        </div>
                        <div>
                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                            Direccion *
                            </label>
                            <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={punto.direccion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Direccion..."
                            required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="localidad" className="block text-sm font-medium text-gray-700 mb-2">
                            Localidad *
                            </label>
                            <input
                            type="text"
                            id="localidad"
                            name="localidad"
                            value={punto.localidad}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Localidad..."
                            required
                            />
                        </div>
                        <div>
                            <label htmlFor="provincia" className="block text-sm font-medium text-gray-700 mb-2">
                            Provincia *
                            </label>
                            <input
                            type="text"
                            id="provincia"
                            name="provincia"
                            value={punto.provincia}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Provincia..."
                            required
                            />
                        </div>
                        <div>
                            <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-2">
                            CodigoPostal *
                            </label>
                            <input
                            type="number"
                            id="codigoPostal"
                            name="codigoPostal"
                            value={punto.codigoPostal}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="CodigoPostal..."
                            required
                            />
                        </div>
                        
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="horarioAtencion" className="block text-sm font-medium text-gray-700 mb-2">
                            Horario de Atencion *
                            </label>
                            <input
                            type="text"
                            id="horarioAtencion"
                            name="horarioAtencion"
                            value={punto.horarioAtencion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Horario de Atencion..."
                            required
                            />
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                            Telefono *
                            </label>
                            <input
                            type="text"
                            id="telefono"
                            name="telefono"
                            value={punto.telefono}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Telefono..."
                            required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                            </label>
                            <input
                            type="email"
                            id="email"
                            name="email"
                            value={punto.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500 transition-colors"
                            placeholder="Email..."
                            required
                            />
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
                                Creando punto...
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
    
  )

}

export default FormCrearPuntoEntrega;