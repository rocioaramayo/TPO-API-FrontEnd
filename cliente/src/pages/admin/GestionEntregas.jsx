import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GestionEntregas({}) {
  const location = useLocation();
  const user = location.state?.user || {};
  const navigate = useNavigate()
  const [metodosEntrega,setMetodosEntrega] = useState([]);
  const [puntosEntrega,setPuntosEntrega] = useState([]);
  const [mostrarAlertaDesactivar, setMostrarAlertaDesactivar] = useState(false);
  const [mostrarAlertaActivar, setMostrarAlertaActivar] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/entregas/metodos/activos")
      .then(res => res.json())
      .then(data => setMetodosEntrega(data));
  }, []);
  useEffect(() => {
    fetch(`http://localhost:8080/entregas/puntos/metodo/1`)
        .then(res => res.json())
        .then(setPuntosEntrega)
        .catch(err => console.error("Error al obtener puntos:", err));
  }, [])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Cambiá este número si querés mostrar más/menos por página

    // Calcular los productos visibles
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPuntosEntrega = puntosEntrega?.slice(startIndex, endIndex);
    // Calcular el total de páginas
    const totalPages = Math.ceil(puntosEntrega.length / itemsPerPage);

    const handleDesactivar = (e) => {
        e.preventDefault();
        
        fetch(`http://localhost:8080/productos/${id}`,{
            method:'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
        })
        .then(()=>{
            setMostrarAlertaDesactivar(false)
            set({})
        })  
    }
    
    const handleActivarProducto = (e) =>{
        e.preventDefault();
        
        fetch(`http://localhost:8080/productos/activar/${id}`,{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            },
        })
        .then(()=>{
            setMostrarAlertaActivar(false);
            set({});
        })  
    }
  return (
    <>
        <div className="flex items-center justify-between p-2">
            <h2 className="text-2xl font-bold text-leather-800">Puntos de entrega</h2>
            <button className="py-2 text-leather-800 hover:underline" onClick={() => navigate('/admin')}>Volver al dashboard</button>
        </div>
        <div className="overflow-x-auto shadow-cognac rounded-lg border border-leather-200">
        <table className="min-w-full divide-y divide-leather-200 text-sm text-gray-700">
            <thead className="bg-leather-100 text-left text-cognac-700 font-semibold">
            <tr>
                <th></th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Direccion</th>
                <th className="px-4 py-3">Localidad</th>
                <th className="px-4 py-3">Provincia</th>
                <th className="px-4 py-3">Codigo postal</th>
                <th className="px-4 py-3">Horario</th>
                <th className="px-4 py-3">Telefono</th>
                <th className="px-4 py-3">Email</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-leather-100">
            {currentPuntosEntrega.map((punto) => (
                <tr key={punto.id} className="hover:bg-leather-50 transition ">
                <td className="px-4 py-3">
                    <button className="px-1 text-red-600 hover:text-red-800" value={punto.id} onClick={()=>{
                        set(punto);
                        setMostrarAlertaDesactivar(true);
                    }}>🗑️</button>
                    <button className="px-1" value={punto.id} onClick={()=>{
                        set(punto);
                        setMostrarAlertaActivar(true)
                    }}>✔️</button>
                </td>
                <td className="px-4 py-3">{punto.nombre}</td>
                <td className="px-4 py-3">
                    <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        punto.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                    {punto.activo ? "Sí" : "No"}
                    </span>
                </td>
                <td className="px-4 py-3">{punto.descripcion.length > 25 ? punto.descripcion.slice(0,25)+"..." : punto.descripcion}</td>
                <td className="px-4 py-3">{punto.direccion}</td>
                
                <td className="px-4 py-3">{punto.localidad}</td>
                <td className="px-4 py-3">{punto.provincia}</td>
                <td className="px-4 py-3">{punto.codigoPostal}</td>
                <td className="px-4 py-3">{punto.horarioAtencion}</td>
                <td className="px-4 py-3">{punto.telefono}</td>
                <td className="px-4 py-3">{punto.email}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
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
        {mostrarAlertaActivar && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
                <p className="text-sm mb-6">¿Queres activar el punto de entrega?</p>
                
                <div className="flex justify-between">
                    <button
                    onClick={() => setMostrarAlertaActivar(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleActivarProducto}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                    Activar
                    </button>
                </div>
                </div>
            </div>
        )}
        <div className="flex justify-center mt-4 gap-2">
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                ← Anterior
            </button>
            <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
            </span>
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Siguiente →
            </button>
        </div>
        <div className="flex items-center justify-between p-2">
            <h2 className="text-xl font-bold text-leather-800">Metodos de entrega</h2>
        </div>
        <table className="min-w-full divide-y divide-leather-200 text-sm text-gray-700">
            <thead className="bg-leather-100 text-left text-cognac-700 font-semibold">
            <tr>
                <th></th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Costo base</th>
                <th className="px-4 py-3">Tiempo estimado</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-leather-100">
            {metodosEntrega.map((punto) => (
                <tr key={punto.id} className="hover:bg-leather-50 transition ">
                <td className="px-4 py-3">
                    <button className="px-1 text-red-600 hover:text-red-800" value={punto.id} onClick={()=>{
                        set(punto);
                        setMostrarAlertaDesactivar(true);
                    }}>🗑️</button>
                    <button className="px-1" value={punto.id} onClick={()=>{
                        set(punto);
                        setMostrarAlertaActivar(true)
                    }}>✔️</button>
                </td>
                <td className="px-4 py-3">{punto.nombre}</td>
                <td className="px-4 py-3">
                    <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        punto.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                    {punto.activo ? "Sí" : "No"}
                    </span>
                </td>
                <td className="px-4 py-3">{punto.descripcion.length > 25 ? punto.descripcion.slice(0,25)+"..." : punto.descripcion}</td>
                <td className="px-4 py-3">{punto.costoBase}</td>
                
                <td className="px-4 py-3">{punto.tiempoEstimadoDias} dia/s</td>
                </tr>
            ))}
            </tbody>
        </table>
    </>
  );
}