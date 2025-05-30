import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({user}) => {
  const [stats, setStats] = useState();
  const [ingresosDiarios, setIngresosDiarios] = useState(0);
  const [ingresosMensuales, setIngresosMensuales] = useState(0);
  const [cantidadVentasDia, setCantidadVentasDia] = useState(0);
  const [ingresosTotales, setIngresosTotales] = useState(0);

    useEffect(() => {
    // Simulamos una llamada a la API
        fetch("http://localhost:8080/compras",{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${user.token}`
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setStats(data);
        });
    },[]);
    useEffect(() => {
        if (!stats) return;

        let anual = 0;
        let diario = 0;
        let mensuales = 0;
        let cantDiarias = 0;

        stats.forEach((venta) => {
            anual += venta.total;
            const fechaVenta = venta.fecha.slice(0,9)
            let fechaHoy = new Date().toISOString().slice(0,9);
            if (fechaVenta == fechaHoy) {
                cantDiarias++
                diario += venta.total

            }
            if(fechaVenta.slice(0,6) == fechaHoy.slice(0,6)){
                mensuales += venta.total;
            }
            
        });

        setIngresosTotales(anual);
        setIngresosDiarios(diario);
        setIngresosMensuales(mensuales);
        setCantidadVentasDia(cantDiarias);
        }, [stats]);
    
  
    const navigate = useNavigate();

    return (
    <>
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold text-leather-800 " >Dashboard</h1>
        </div>
        <h2 className="text-2l font-bold text-leather-800 px-6">Informacion General</h2>
        <div className="px-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Facturado en el año</h3>
                    <p className="text-xl font-semibold">${ingresosTotales || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Facturado en el mes</h3>
                    <p className="text-xl font-semibold">{ingresosMensuales || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Facturado en el dia</h3>
                    <p className="text-xl font-semibold">{ingresosDiarios || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Ventas del dia</h3>
                    <p className="text-xl font-semibold">{cantidadVentasDia || 0}</p>
                </div>
            </div>
            <h2 className="text-xl font-bold text-leather-800 mb-6">Gestión de productos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Gestionar productos', onClick: () => {navigate('/admin/productos')} },
                    { label: 'Gestionar descuentos', onClick: () => {navigate('/admin/descuentos')} },
                    { label: 'Gestionar metodos de entrega', onClick: () => {navigate('/admin/metodosEntrega')} },
                    { label: 'Gestionar puntos de entrega', onClick: () => {navigate('/admin/puntosEntrega')} },
                    { label: 'Gestionar usuarios', onClick: () => {navigate('/admin/usuarios')} },
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
    </>
  );
};

export default Dashboard;
