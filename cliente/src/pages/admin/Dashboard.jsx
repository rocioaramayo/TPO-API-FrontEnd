import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({user}) => {
  const [stats, setStats] = useState([]);
  const [ingresosDiarios, setIngresosDiarios] = useState(0);
  const [ingresosMensuales, setIngresosMensuales] = useState(0);
  const [ingresosAnuales, setIngresosAnuales] = useState(0);
  const [cantidadVentasDia, setCantidadVentasDia] = useState(0);
  const [cantidadVentasMes, setCantidadVentasMes] = useState(0);
  const [cantidadVentasAnio, setCantidadVentasAnio] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [cantUsuarios, setCantUsuarios] = useState(0);
  const [productos, setProductos] = useState([]);
  const [productosPocoStock, setProductosPocoStock] = useState(0);
  const [productosActivos, setProductosActivos] = useState(0);
  const [productosInactivos, setProductosInactivos] = useState(0);

  useEffect(() => {
    if (!user || !user.token) return;
    // Cargar compras
    fetch("http://localhost:8080/compras", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('Compras cargadas:', data);
      setStats(data);
    })
    .catch((error) => {
      console.error('Error al cargar compras:', error);
    });
  }, [user]);

  useEffect(() => {
    if (!stats || stats.length === 0) return;

    // Obtener fechas actuales
    const hoy = new Date();
    const diaActual = hoy.getDate();
    const mesActual = hoy.getMonth() + 1; // getMonth() retorna 0-11
    const anioActual = hoy.getFullYear();

    let totalAnual = 0;
    let totalMensual = 0;
    let totalDiario = 0;
    let ventasDia = 0;
    let ventasMes = 0;
    let ventasAnio = 0;

    stats.forEach((venta) => {
      // Parsear la fecha de la venta (asumiendo formato ISO: "2024-12-02T15:30:00")
      const fechaVenta = new Date(venta.fecha);
      
      if (isNaN(fechaVenta.getTime())) {
        console.warn('Fecha inválida en venta:', venta.fecha);
        return;
      }

      const diaVenta = fechaVenta.getDate();
      const mesVenta = fechaVenta.getMonth() + 1;
      const anioVenta = fechaVenta.getFullYear();

      // Total anual
      if (anioVenta === anioActual) {
        totalAnual += venta.total || 0;
        ventasAnio++;

        // Total mensual
        if (mesVenta === mesActual) {
          totalMensual += venta.total || 0;
          ventasMes++;

          // Total diario
          if (diaVenta === diaActual) {
            totalDiario += venta.total || 0;
            ventasDia++;
          }
        }
      }
    });

    setIngresosAnuales(totalAnual);
    setIngresosMensuales(totalMensual);
    setIngresosDiarios(totalDiario);
    setCantidadVentasDia(ventasDia);
    setCantidadVentasMes(ventasMes);
    setCantidadVentasAnio(ventasAnio);

  }, [stats]);

  useEffect(() => {
    if (!user || !user.token) return;
    // Cargar usuarios
    fetch('http://127.0.0.1:8080/api/v1/users', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setUsuarios(data);
    })
    .catch((error) => {
      console.error('Error al cargar usuarios:', error);
    });
  }, [user]);

  useEffect(() => {
    if (!user || !user.token) return;
    // Contar usuarios activos (no admin y con estado activo)
    let cantidad = 0;
    usuarios?.forEach((u) => {
      if (u.role !== "ADMIN" && u.activo === true) {
        cantidad++;
      }
    });
    setCantUsuarios(cantidad);
  }, [user, usuarios]);

  useEffect(() => {
    if (!user || !user.token) return;
    // Cargar productos
    fetch("http://localhost:8080/productos/admin", {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.productos || []);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
      });
  }, [user]);

  useEffect(() => {
    if (!user || !user.token) return;
    // Calcular estadísticas de productos
    let pocoStock = 0;
    let activos = 0;
    let inactivos = 0;
    
    productos?.forEach((p) => {
      if (p.pocoStock) pocoStock++;
      if (p.activo) {
        activos++;
      } else {
        inactivos++;
      }
    });
    
    setProductosPocoStock(pocoStock);
    setProductosActivos(activos);
    setProductosInactivos(inactivos);
  }, [user, productos]);

  const navigate = useNavigate();

  // Función para formatear montos
  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  return (
    <>
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold text-leather-800">Dashboard</h1>
      </div>
      
      <h2 className="text-xl font-bold text-leather-800 px-6">Información General</h2>
      
      <div className="px-6 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Tarjetas de ingresos */}
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Facturado en el año</h3>
            <p className="text-xl font-semibold">{formatearMonto(ingresosAnuales)}</p>
            <p className="text-xs text-gray-600">{cantidadVentasAnio} ventas</p>
          </div>
          
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Facturado en el mes</h3>
            <p className="text-xl font-semibold">{formatearMonto(ingresosMensuales)}</p>
            <p className="text-xs text-gray-600">{cantidadVentasMes} ventas</p>
          </div>
          
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Facturado en el día</h3>
            <p className="text-xl font-semibold">{formatearMonto(ingresosDiarios)}</p>
            <p className="text-xs text-gray-600">{cantidadVentasDia} ventas</p>
          </div>
          
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Ventas del día</h3>
            <p className="text-xl font-semibold">{cantidadVentasDia}</p>
          </div>

          {/* Tarjetas de usuarios y productos */}
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Usuarios activos</h3>
            <p className="text-xl font-semibold">{cantUsuarios}</p>
          </div>
          
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Productos con poco stock</h3>
            <p className="text-xl font-semibold text-red-600">{productosPocoStock}</p>
          </div>
          
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Productos activos</h3>
            <p className="text-xl font-semibold text-green-600">{productosActivos}</p>
          </div>
          
          <div className="bg-leather-200 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Productos inactivos</h3>
            <p className="text-xl font-semibold text-gray-600">{productosInactivos}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-leather-800 mb-6">Gestión de productos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
          {[
            { 
              label: 'Gestionar productos', 
              onClick: () => navigate('/admin/productos', { state: { user } }),
              color: 'bg-leather-600 hover:bg-leather-700'
            },
            { 
              label: 'Gestionar categorías', 
              onClick: () => navigate('/admin/categorias'),
              color: 'bg-leather-600 hover:bg-leather-700'
            },
            { 
              label: 'Gestionar descuentos', 
              onClick: () => navigate('/admin/descuentos'),
              color: 'bg-leather-600 hover:bg-leather-700'
            },
            { 
              label: 'Gestionar puntos de entrega', 
              onClick: () => navigate('/admin/entregas', { state: { user } }),
              color: 'bg-leather-600 hover:bg-leather-700'
            },
            { 
              label: 'Gestionar usuarios', 
              onClick: () => navigate('/admin/usuarios'),
              color: 'bg-leather-600 hover:bg-leather-700'
            },
            { 
              label: 'Ver todas las compras', 
              onClick: () => navigate('/admin/compras'),
              color: 'bg-blue-600 hover:bg-blue-700'
            }
          ].map((btn, index) => (
            <button
              key={index}
              onClick={btn.onClick}
              className={`${btn.color} text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium text-sm`}
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