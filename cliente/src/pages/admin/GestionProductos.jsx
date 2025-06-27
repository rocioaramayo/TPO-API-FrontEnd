import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaProductos from "./TablaProductos";
import FormCrearProducto from "./FormCrearProducto";
import { useSelector } from "react-redux";
import FormEditarProducto from "./FormEditarProducto";

const SimpleModal = ({ open, onClose, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4 text-leather-800">No se puede editar</h2>
        <p className="mb-6 text-leather-700">{message}</p>
        <button
          onClick={onClose}
          className="bg-leather-600 text-white px-6 py-2 rounded hover:bg-leather-700 transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

const GestionProductos = () => {
  const [productos, setProductos] = useState(null);
  const [mostrarCrearProducto, setMostrarCrearProducto] = useState(false);
  const [mostrarEditarProducto, setMostrarEditarProducto] = useState(false);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const navigate = useNavigate();

  const handleEditar = (producto) => {
    if (!producto.activo) {
      setShowInactiveModal(true);
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

      <TablaProductos mostrarCrearProducto={mostrarCrearProducto} mostrarEditarProducto={mostrarEditarProducto} onEditar={handleEditar}/>
      <SimpleModal 
        open={showInactiveModal} 
        onClose={() => setShowInactiveModal(false)} 
        message="No se puede editar un producto que está inactivo. Por favor, actívalo primero." 
      />
    </div>
  );
};

export default GestionProductos;
