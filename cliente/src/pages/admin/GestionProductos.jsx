import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GestionProductos = () => {
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();
    const handleOnClick = (e) =>{
        e.preventDefault();
        navigate('/admin')
    }
    useEffect(() => {
    // Simulamos una llamada a la API
        fetch("http://localhost:8080/api/admin/dashboard")
            .then((res) => res.json())
            .then((data) => {
            setStats(data.resumen);
            setVentasData(data.ventasPorDia);
            });
    }, []);
  

  return (
    <div className="px-6 font-sans">
        <div id="flexPrueba">
            <h2 className="text-xl font-bold text-leather-800 ">Gestión de productos</h2>
            <button onClick={handleOnClick}>Volver al dashboard</button>
        </div>
            
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
            

        
    </div>
  );
};

export default GestionProductos;
