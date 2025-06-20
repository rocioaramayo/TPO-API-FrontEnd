import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaProductos from "./TablaProductos";
import FormCrearProducto from "./FormCrearProducto";
import { useSelector } from "react-redux";
import FormEditarProducto from "./FormEditarProducto";

const GestionProductos = () => {
  const [productos, setProductos] = useState(null);
  const [mostrarCrearProducto, setMostrarCrearProducto] = useState(false);
  const [mostrarEditarProducto, setMostrarEditarProducto] = useState(false);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);
  const navigate = useNavigate();

  const handleEditar = (producto) => {
    if (!producto.activo) {
      alert("No se puede editar un producto que está inactivo. Por favor, actívalo primero.");
      return;
    }
    setProductoSeleccionadoId(producto.id);
    setMostrarEditarProducto(true);
  };

  return (
    <div className="px-6 py-4 font-sans">
      {/* Encabezado estilo unificado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-leather-800">Gestión de Productos</h2>
          <p className="text-leather-600">Administrá los productos del catálogo</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            Volver al Dashboard
          </button>
          <button
            onClick={() => setMostrarCrearProducto(true)}
            className="bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-700 transition-colors"
          >
            + Nuevo Producto
          </button>
        </div>
      </div>
      {mostrarCrearProducto && (
        <FormCrearProducto setMostrarCrearProducto={setMostrarCrearProducto}/>
      )}

      {mostrarEditarProducto && (
        <FormEditarProducto 
          id={productoSeleccionadoId} 
          setMostrarEditarProducto={setMostrarEditarProducto}
        />
      )}

      <TablaProductos mostrarCrearProducto={mostrarCrearProducto} onEditar={handleEditar}/>
    </div>
  );
};

export default GestionProductos;
