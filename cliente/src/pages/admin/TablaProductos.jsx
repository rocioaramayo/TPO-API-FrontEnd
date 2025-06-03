import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormEditarProducto from "./FormEditarProducto";

export default function TablaProductos({}) {
  const location = useLocation();
  const user = location.state?.user || {};
  const navigate = useNavigate()
  const [productos,setProductos] = useState([]);
  const [mostrarAlertaDesactivar, setMostrarAlertaDesactivar] = useState(false);
  const [mostrarAlertaActivar, setMostrarAlertaActivar] = useState(false);
  const [mostrarAgregarStock, setMostrarAgregarStock] = useState(false);
  const [mostrarEditarProducto, setMostrarEditarProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [id, setId] = useState(null);
  const [stock, setStock] = useState(0);
  useEffect(() => {
      fetch("http://localhost:8080/productos/admin")
          .then((res) => res.json())
          .then((data) => {
          setProductos(data.productos);
          });
  }, [mostrarAlertaDesactivar,mostrarAgregarStock,mostrarAlertaActivar]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Cambiá este número si querés mostrar más/menos por página

    // Calcular los productos visibles
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProductos = productos?.slice(startIndex, endIndex);
    // Calcular el total de páginas
    const totalPages = Math.ceil(productos.length / itemsPerPage);
    const handleEdit = (e) => {
      e.preventDefault();
      navigate(`/admin/productos/editar/${e.target.value}`)
    }
    const handleDesactivar = (e) => {
        e.preventDefault();
        const id = productoSeleccionado.id;
        fetch(`http://localhost:8080/productos/${id}`,{
            method:'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
        })
        .then(()=>{
            setMostrarAlertaDesactivar(false)
            setProductoSeleccionado({})
        })  
    }
    const handleChangeStock = (e) => {
        setStock(e.target.value);
        console.log(stock)
    }
    const handleAgregarStock = (e) =>{
        e.preventDefault();
        const id = productoSeleccionado.id;
        fetch( `http://127.0.0.1:8080/productos/stock/${id}`,{
            method: "PUT",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify({ stock: stock }) 
        })
        .then(()=>{
            setMostrarAgregarStock(false)
            setProductoSeleccionado({})
        })
    }
    const handleActivarProducto = (e) =>{
        e.preventDefault();
        const id = productoSeleccionado.id;
        fetch(`http://localhost:8080/productos/activar/${id}`,{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            },
        })
        .then(()=>{
            setMostrarAlertaActivar(false);
            setProductoSeleccionado({});
        })  
    }
  return (
    <>
        <div className="overflow-x-auto shadow-cognac rounded-lg border border-leather-200">
        <table className="min-w-full divide-y divide-leather-200 text-sm text-gray-700">
            <thead className="bg-leather-100 text-left text-cognac-700 font-semibold">
            <tr>
                <th></th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Grosor</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Textura</th>
                <th className="px-4 py-3">Tipo de Cuero</th>
                <th className="px-4 py-3">Categoría</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-leather-100">
            {currentProductos.map((prod) => (
                <tr key={prod.id} className="hover:bg-leather-50 transition ">
                <td className="px-4 py-3">
                    <button className="px-1" value={prod.id} onClick={()=>{
                        setMostrarEditarProducto(true)
                        setId(prod.id)
                        }}>✏️</button>
                    <button className="px-1 text-red-600 hover:text-red-800" value={prod.id} onClick={()=>{
                        setProductoSeleccionado(prod); // o ID del producto
                        setMostrarAlertaDesactivar(true);
                    }}>🗑️</button>
                    <button className="px-1" value={prod.id} onClick={()=>{
                        setProductoSeleccionado(prod); // o ID del producto
                        setMostrarAgregarStock(true);
                    }}>📦</button>
                    <button className="px-1" value={prod.id} onClick={()=>{
                        setProductoSeleccionado(prod);
                        setMostrarAlertaActivar(true)
                    }}>✔️</button>
                </td>
                <td className="px-4 py-3">{prod.id}</td>
                <td className="px-4 py-3">{prod.nombre}</td>
                <td className="px-4 py-3">
                    <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        prod.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                    {prod.activo ? "Sí" : "No"}
                    </span>
                </td>
                <td className="px-4 py-3">{prod.color}</td>
                <td className="px-4 py-3">{prod.descripcion.length > 25 ? prod.descripcion.slice(0,25)+"..." : prod.descripcion}</td>
                <td className="px-4 py-3">{prod.grosor}</td>
                <td className="px-4 py-3">{prod.precio}</td>
                <td className={`px-4 py-3 ${prod.pocoStock ? "bg-red-200" : ""}`}>{prod.stock}</td>
                <td className="px-4 py-3">{prod.textura}</td>
                <td className="px-4 py-3">{prod.tipoCuero}</td>
                <td className="px-4 py-3">{prod.categoria}</td>
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
                <p className="text-sm mb-6">¿Queres activar el producto {productoSeleccionado.nombre}?</p>
                
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
        {mostrarAgregarStock && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-lg font-bold mb-4">¿Agregar stock?</h2>
                <p className="text-sm mb-6">¿Cuantas unidades de {productoSeleccionado.nombre} quieres agregar?</p>
                
                <div className="flex justify-between">
                    <button
                    onClick={() => setMostrarAgregarStock(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                    <input className="" type="number" onChange={handleChangeStock} placeholder="Stock" />
                    <button
                    onClick={handleAgregarStock}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                    Agregar
                    </button>
                </div>
                </div>
            </div>
        )}
        {mostrarEditarProducto && (
            <FormEditarProducto id={id} setMostrarEditarProducto={setMostrarEditarProducto}/>
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
    </>
  );
}