import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaProductos from "./TablaProductos";

const GestionProductos = () => {
  const [productos, setProductos] = useState(null);
  const navigate = useNavigate();

  const handleOnClickVolver = () => navigate('/admin');
  const handleOnClickCrear = () => navigate('/admin/productos/crear');

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
            onClick={handleOnClickVolver}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            Volver al Dashboard
          </button>
          <button
            onClick={handleOnClickCrear}
            className="bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-700 transition-colors"
          >
            + Nuevo Producto
          </button>
        </div>
      </div>

      <TablaProductos />
    </div>
  );
};

export default GestionProductos;
