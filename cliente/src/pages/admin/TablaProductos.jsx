import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminProducts, deleteProduct, updateProductStock, activateProduct } from "../../store/slices/productsSlice";
import FormEditarProducto from "./FormEditarProducto";

export default function TablaProductos({ onEditar }) {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.products.adminProducts) || [];
  const user = useSelector((state) => state.users.user);
  const loading = useSelector((state) => state.products.loading);
  const [mostrarAlertaDesactivar, setMostrarAlertaDesactivar] = useState(false);
  const [mostrarAlertaActivar, setMostrarAlertaActivar] = useState(false);
  const [mostrarAgregarStock, setMostrarAgregarStock] = useState(false);
  const [errorStock, setErrorStock] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    dispatch(fetchAdminProducts(user.token));
  }, [dispatch]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductos = Array.isArray(productos) ? productos.slice(startIndex, endIndex) : [];
  const totalPages = Math.ceil((productos?.length || 0) / itemsPerPage);

  // Log para depuración
  console.log('Productos en tabla admin:', productos);

  const handleDesactivar = (e) => {
    e.preventDefault();
    dispatch(deleteProduct({ id: productoSeleccionado.id, token: user.token }))
      .then(() => {
        setMostrarAlertaDesactivar(false);
        setProductoSeleccionado({});
      });
  };
  const handleChangeStock = (e) => {
    setStock(e.target.value);
  };
  const handleAgregarStock = (e) => {
    e.preventDefault();
    if (productoSeleccionado.stock + parseInt(stock) < 0) {
      setErrorStock(true);
    } else {
      dispatch(updateProductStock({ id: productoSeleccionado.id, stock: parseInt(stock), token: user.token }))
        .then(() => {
          setMostrarAgregarStock(false);
          setErrorStock(false);
          setProductoSeleccionado({});
          setStock(0);
        });
    }
  };
  const handleActivarProducto = (e) => {
    e.preventDefault();
    dispatch(activateProduct({ id: productoSeleccionado.id, token: user.token }))
      .then(() => {
        setMostrarAlertaActivar(false);
        setProductoSeleccionado({});
      });
  };
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
                    <button className="px-1" value={prod.id} onClick={() => onEditar(prod)}>✏️</button>
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
                    <h2 className="text-lg font-bold mb-4">Agregar o quitar Stock</h2>
                    <h3 className='text-sm mb-2'>Vas a cambiar el stock de {productoSeleccionado.nombre}</h3>
                    <p className='text-sm mb-6'>Stock actual: {productoSeleccionado.stock}</p>
                    <form className="space-y-4" onSubmit={handleAgregarStock}>
                        <div className="flex flex-col">
                        <label htmlFor="stock" className="mb-2 text-sm font-medium">Cantidad a agregar o quitar</label>
                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            value={stock}
                            onChange={handleChangeStock}
                            className="p-2 border border-gray-300 rounded"
                        />
                        {errorStock && <p className='text-red-500'>El stock no puede ser negativo</p>}
                        </div>
                        <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => setMostrarAgregarStock(false)}
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Aceptar
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        <div className="flex justify-center mt-4">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Anterior
            </button>
            <span className='px-4 py-2 mx-1'>Página {currentPage} de {totalPages}</span>
            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Siguiente
            </button>
        </div>
    </>
  );
}