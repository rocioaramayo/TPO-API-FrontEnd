import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormCrearMetodoEntrega from "./FormCrearMetodoEntrega";
import FormCrearPuntoEntrega from "./FormCrearPuntoEntrega";
import { useDispatch, useSelector } from "react-redux";
import { fetchMetodoEntrega } from "../../store/slices/metodoEntregaSlice";
import { fetchPuntoEntrega } from "../../store/slices/puntoEntregaSlice";

export default function GestionEntregas() {
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const metodosEntrega = useSelector(state => state.metodoEntrega.itemsAdmin);
  const puntosEntrega = useSelector(state => state.puntoEntrega.itemsAdmin);
  const [mostrarAlertaDesactivarMetodo, setMostrarAlertaDesactivarMetodo] = useState(false);
  const [mostrarAlertaDesactivarPunto, setMostrarAlertaDesactivarPunto] = useState(false);
  const [mostrarAlertaActivarMetodo, setMostrarAlertaActivarMetodo] = useState(false);
  const [mostrarAlertaActivarPunto, setMostrarAlertaActivarPunto] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState({});
  const [puntoSeleccionado, setPuntoSeleccionado] = useState({});
  const [mostrarCrearMetodo, setMostrarCrearMetodo] = useState(false);
  const [mostrarCrearPunto, setMostrarCrearPunto] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // cargar metodos de entrega
  useEffect(() => {
    dispatch(fetchMetodoEntrega());
  }, [dispatch]);
 // cargar puntos de entrega
  useEffect(() => {
    dispatch(fetchPuntoEntrega());
  }, [dispatch]);

  const [currentPagePuntos, setCurrentPagePuntos] = useState(1);
  const itemsPerPagePuntos = 4;
  const startIndexPuntos = (currentPagePuntos - 1) * itemsPerPagePuntos;
  const endIndexPuntos = startIndexPuntos + itemsPerPagePuntos;
  const currentPuntosEntrega = puntosEntrega?.slice(startIndexPuntos, endIndexPuntos);
  const totalPagesPuntos = Math.ceil(puntosEntrega.length / itemsPerPagePuntos);
 
  const [currentPageMetodos, setCurrentPageMetodos] = useState(1);
  const itemsPerPageMetodos = 4;
  const startIndexMetodos = (currentPageMetodos - 1) * itemsPerPageMetodos;
  const endIndexMetodos = startIndexMetodos + itemsPerPageMetodos;
  const currentMetodosEntrega = metodosEntrega?.slice(startIndexMetodos, endIndexMetodos);
  const totalPagesMetodos = Math.ceil(metodosEntrega.length / itemsPerPageMetodos);

  const handleDesactivarMetodo = (e) => {
    e.preventDefault();
    const id = metodoSeleccionado?.id;
    if (!user?.token || user.token.split('.').length !== 3) {
      alert("Token inválido o no disponible. Iniciá sesión de nuevo.");
      return;
    }
    fetch(`http://localhost:8080/entregas/metodos/${id}` ,{
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` },
    })
    .then(() => {
      setMostrarAlertaDesactivarMetodo(false);
      setMetodoSeleccionado({});
      setSuccess("Método desactivado correctamente.");
      setTimeout(() => setSuccess(null), 3000);
    })
    .catch(() => {
      setError("Error al desactivar método.");
      setTimeout(() => setError(null), 3000);
    });
  };

  const handleActivarMetodo = (e) => {
    e.preventDefault();
    const id = metodoSeleccionado?.id;
    if (!user?.token || user.token.split('.').length !== 3) {
      alert("Token inválido o no disponible. Iniciá sesión de nuevo.");
      return;
    }
    fetch(`http://localhost:8080/entregas/metodos/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${user.token}` },
    })
    .then(() => {
      setMostrarAlertaActivarMetodo(false);
      setMetodoSeleccionado({});
      setSuccess("Método activado correctamente.");
      setTimeout(() => setSuccess(null), 3000);
    })
    .catch(() => {
      setError("Error al activar método.");
      setTimeout(() => setError(null), 3000);
    });
  };

  const handleDesactivarPunto = (e) => {
    e.preventDefault();
    const id = puntoSeleccionado?.id;
    if (!user?.token || user.token.split('.').length !== 3) {
      alert("Token inválido o no disponible. Iniciá sesión de nuevo.");
      return;
    }
    fetch(`http://localhost:8080/entregas/puntos/${id}` ,{
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` },
    })
    .then(() => {
      setMostrarAlertaDesactivarPunto(false);
      setPuntoSeleccionado({});
      setSuccess("Punto desactivado correctamente.");
      setTimeout(() => setSuccess(null), 3000);
    })
    .catch(() => {
      setError("Error al desactivar punto.");
      setTimeout(() => setError(null), 3000);
    });
  };

  const handleActivarPunto = (e) => {
    e.preventDefault();
    const id = puntoSeleccionado?.id;
    if (!user?.token || user.token.split('.').length !== 3) {
      alert("Token inválido o no disponible. Iniciá sesión de nuevo.");
      return;
    }
    fetch(`http://localhost:8080/entregas/puntos/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${user.token}` },
    })
    .then(() => {
      setMostrarAlertaActivarPunto(false);
      setMetodoSeleccionado({});
      setSuccess("Punto activado correctamente.");
      setTimeout(() => setSuccess(null), 3000);
    })
    .catch(() => {
      setError("Error al activar punto.");
      setTimeout(() => setError(null), 3000);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <div>
          <h2 className="text-2xl font-bold text-leather-800">Gestión de Entregas</h2>
          <p className="text-leather-600">Administrá los métodos y puntos de entrega</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setMostrarCrearPunto(true)} className="bg-leather-800 text-white py-2 px-4 rounded hover:bg-leather-900 transition">
            + Agregar nuevo punto de Entrega
          </button>
          <button onClick={() => setMostrarCrearMetodo(true)} className="bg-leather-800 text-white py-2 px-4 rounded hover:bg-leather-900 transition">
            + agregar nuevo método de Entrega
          </button>
          <button onClick={() => navigate('/admin')} className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition">
            Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Mensajes de éxito / error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 mx-4">
          {success}
        </div>
      )}
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
                        console.log(punto)
                        setPuntoSeleccionado(punto)
                        setMostrarAlertaDesactivarPunto(true);
                    }}>🗑️</button>
                    <button className="px-1" value={punto.id} onClick={()=>{
                        setPuntoSeleccionado(punto)
                        setMostrarAlertaActivarPunto(true)
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
        {mostrarAlertaDesactivarMetodo && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
                <p className="text-sm mb-6">¿Queres desactivar el metodo de entrega?</p>
                
                <div className="flex justify-between">
                    <button
                    onClick={() => {
                        setMostrarAlertaDesactivarMetodo(false)
                        setPuntoSeleccionado()}
                    }
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleDesactivarMetodo}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                    Desactivar
                    </button>
                </div>
                </div>
            </div>
        )}
        {mostrarAlertaDesactivarPunto && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
                <p className="text-sm mb-6">¿Queres desactivar el metodo de entrega?</p>
                
                <div className="flex justify-between">
                    <button
                    onClick={() => setMostrarAlertaDesactivarPunto(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleDesactivarPunto}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                    Desactivar
                    </button>
                </div>
                </div>
            </div>
        )}
        {mostrarAlertaActivarMetodo && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
                <p className="text-sm mb-6">¿Queres activar el metodo de entrega?</p>
                
                <div className="flex justify-between">
                    <button
                    onClick={() => setMostrarAlertaActivarMetodo(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleActivarMetodo}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                    Activar
                    </button>
                </div>
                </div>
            </div>
        )}
        {mostrarAlertaActivarPunto && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
                <p className="text-sm mb-6">¿Queres activar el punto de entrega?</p>
                
                <div className="flex justify-between">
                    <button
                    onClick={() => setMostrarAlertaActivarPunto(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleActivarPunto}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                    Activar
                    </button>
                </div>
                </div>
            </div>
        )}
        {mostrarCrearMetodo && (
   <FormCrearMetodoEntrega
     setMostrarCrearMetodo={(valor) => {
       setMostrarCrearMetodo(valor);
       if (!valor) {
         dispatch(fetchMetodoEntrega()); // 👈 se actualiza cuando se cierra el modal
       }
     }}
   />
)}

        {mostrarCrearPunto && (
           <FormCrearPuntoEntrega user={user} setMostrarCrearPunto={setMostrarCrearPunto}/>
        )}
        <div className="flex justify-center mt-4 gap-2">
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPagePuntos((prev) => Math.max(prev - 1, 1))}
                disabled={currentPagePuntos === 1}
            >
                ← Anterior
            </button>
            <span className="text-sm text-gray-600">
                Página {currentPagePuntos} de {totalPagesPuntos}
            </span>
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPagePuntos((prev) => Math.min(prev + 1, totalPagesPuntos))}
                disabled={currentPagePuntos === totalPagesPuntos}
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
            {currentMetodosEntrega.map((punto) => (
                <tr key={punto.id} className="hover:bg-leather-50 transition ">
                <td className="px-4 py-3">
                    <button className="px-1 text-red-600 hover:text-red-800" value={punto.id} onClick={()=>{
                        setMetodoSeleccionado(punto)
                        setMostrarAlertaDesactivarMetodo(true);
                    }}>🗑️</button>
                    <button className="px-1" value={punto.id} onClick={()=>{
                        setMetodoSeleccionado(punto)
                        setMostrarAlertaActivarMetodo(true)
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
        <div className="flex justify-center mt-4 gap-2">
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPageMetodos((prev) => Math.max(prev - 1, 1))}
                disabled={currentPageMetodos === 1}
            >
                ← Anterior
            </button>
            <span className="text-sm text-gray-600">
                Página {currentPageMetodos} de {totalPagesMetodos}
            </span>
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPageMetodos((prev) => Math.min(prev + 1, totalPagesMetodos))}
                disabled={currentPageMetodos === totalPagesMetodos}
            >
                Siguiente →
            </button>
        </div>
    </>
  );
}