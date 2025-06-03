import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaProductos from "./TablaProductos";
import FormCrearProducto from "./FormCrearProducto";

const GestionProductos = ({user}) => {
  const [productos, setProductos] = useState(null);
  const [mostrarCrearProducto, setMostrarCrearProducto] = useState(false);
  const navigate = useNavigate();

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
        <FormCrearProducto user={user}  setMostrarCrearProducto={setMostrarCrearProducto}/>
      )}

      <TablaProductos mostrarCrearProducto={mostrarCrearProducto} user={user}/>
    </div>
  );
};

export default GestionProductos;
