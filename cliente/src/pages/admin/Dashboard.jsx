import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({user}) => {
  const [stats, setStats] = useState();
  const [ingresosDiarios, setIngresosDiarios] = useState(0);
  const [ingresosMensuales, setIngresosMensuales] = useState(0);
  const [cantidadVentasDia, setCantidadVentasDia] = useState(0);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [cantUsuarios, setCantUsuarios] = useState(0);
  const [productos,setProductos] = useState([]);
  const [productosPocoStock, setProductosPocoStock] = useState(0);
  const [productosActivos, setProductosActivos] = useState(0);
  const [productosInactivos, setProductosInactivos] = useState(0);

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
            setStats(data);
        });
    },[]);
    useEffect(() => {

        let anual = 0;
        let diario = 0;
        let mensuales = 0;
        let cantDiarias = 0;

        stats?.forEach((venta) => {
            anual += venta.total;
            const fechaVenta = venta.fecha.slice(0,10)
            const [anio, mes, dia] = fechaVenta.split('-');
            const fechaLocal = `${dia}/${parseInt(mes)}/${anio}`;
            let fechaHoy = new Date().toLocaleDateString();
            if (fechaLocal == fechaHoy) {
                cantDiarias++
                diario += venta.total

            }
            if(fechaLocal.slice(2) == fechaHoy.slice(2)){
                mensuales += venta.total;
            }
            
        });

        setIngresosTotales(anual);
        setIngresosDiarios(diario);
        setIngresosMensuales(mensuales);
        setCantidadVentasDia(cantDiarias);
    }, [stats]);
    useEffect(()=>{
        fetch('http://127.0.0.1:8080/api/v1/users',{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setUsuarios(data);
        })
    },[])
    useEffect(()=>{
        let cantidad = 0
        usuarios?.forEach((u)=>{
            if(u.role != "ADMIN")cantidad++;
        })
        setCantUsuarios(cantidad);
    },[usuarios])
    useEffect(() => {
        fetch("http://localhost:8080/productos/admin")
            .then((res) => res.json())
            .then((data) => {
                setProductos(data.productos);        
            });
    }, []);
    useEffect(()=>{
        let pocoStock = 0;
        let activos = 0;
        let inactivos = 0;
        productos?.forEach((p)=>{
            p.pocoStock ? pocoStock++ : pocoStock
            p.activo ? activos++ : inactivos++            
        })
        setProductosPocoStock(pocoStock)
        setProductosActivos(activos)
        setProductosInactivos(inactivos)
    },[productos])
    
  
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
                    <p className="text-xl font-semibold">${ingresosMensuales || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Facturado en el dia</h3>
                    <p className="text-xl font-semibold">${ingresosDiarios || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Ventas del dia</h3>
                    <p className="text-xl font-semibold">{cantidadVentasDia || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Usuarios activos</h3>
                    <p className="text-xl font-semibold">{cantUsuarios || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Productos con poco stock</h3>
                    <p className="text-xl font-semibold">{productosPocoStock || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Productos activos</h3>
                    <p className="text-xl font-semibold">{productosActivos || 0}</p>
                </div>
                <div className="bg-leather-200 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500">Productos inactivos</h3>
                    <p className="text-xl font-semibold">{productosInactivos || 0}</p>
                </div>
            </div>
            <h2 className="text-xl font-bold text-leather-800 mb-6">Gestión de productos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
                {[
                    { label: 'Gestionar productos', onClick: () => {navigate('/admin/productos', { state: { user } })}},
                    { label: 'Gestionar categorías', onClick: () => {navigate('/admin/categorias')} },
                    { label: 'Gestionar descuentos', onClick: () => {navigate('/admin/descuentos')} },
                    { label: 'Gestionar puntos de entrega', onClick: () => {navigate('/admin/entregas',{ state: { user } })} },
                    { label: 'Gestionar usuarios', onClick: () => {navigate('/admin/usuarios')} },
                    { label: 'Ver todas las compras', onClick: () => {navigate('/admin/compras')} }


                ].map((btn, index) => (
                    <button
                        key={index}
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
