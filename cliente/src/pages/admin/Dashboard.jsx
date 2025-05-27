import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulamos una llamada a la API
    fetch("http://localhost:8080/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.resumen);
        setVentasData(data.ventasPorDia);
      });
  }, []);
  const navigate = useNavigate();

  return (
    <>
        <h2 className="text-2l font-bold text-leather-800 px-6">Informacion General</h2>
        <div className="px-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Total facturado</h3>
                    <p className="text-xl font-semibold">${stats?.ingresosTotales || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Ventas del día</h3>
                    <p className="text-xl font-semibold">{stats?.ventasHoy || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Ventas del mes</h3>
                    <p className="text-xl font-semibold">{stats?.ventasMes || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Ventas del año</h3>
                    <p className="text-xl font-semibold">{stats?.ventasAno || 0}</p>
                </div>
            </div>
            <h2 className="text-xl font-bold text-leather-800 mb-6">Gestión de productos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: '+ Agregar nuevo producto', onClick: () => {navigate('/admin/productos')} },
                    { label: 'Editar producto', onClick: () => {} },
                    { label: 'Eliminar producto', onClick: () => {} },
                    { label: 'Actualizar stock de producto', onClick: () => {} },
                ].map((btn, index) => (
                    <button
                        onClick={btn.onClick}
                        className="bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-400 transition"
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
            <h2 className="text-xl font-bold text-leather-800 mb-6">Gestión de entregas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                <div>
                    <h3 className="text-l font-bold text-leather-800 mb-6">Metodo de entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: '+ Agregar metodo de entrega', onClick: () => {} },
                            { label: 'Editar metodo de entrega', onClick: () => {} },
                            { label: 'Eliminar metodo de entrega', onClick: () => {} },
                        ].map((btn, index) => (
                            <button
                                onClick={btn.onClick}
                                className="bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-400 transition"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-l font-bold text-leather-800 mb-6">Punto de entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: '+ Agregar punto de entrega', onClick: () => {} },
                            { label: 'Editar punto de entrega', onClick: () => {} },
                            { label: 'Eliminar punto de entrega', onClick: () => {} },
                        ].map((btn, index) => (
                            <button
                                onClick={btn.onClick}
                                className="bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-400 transition"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    </>
  );
};

export default Dashboard;
