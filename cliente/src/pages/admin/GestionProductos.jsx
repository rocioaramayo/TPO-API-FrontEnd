import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaProductos from "./TablaProductos";

const GestionProductos = () => {
    const [productos, setProductos] = useState(null);
    const navigate = useNavigate();
    const handleOnClickVolver = (e) =>{
        e.preventDefault();
        navigate('/admin')
    }
    
    const handleOnClickCrear = (e) =>{
        e.preventDefault();
        navigate('/admin/productos/crear')
    }
  

  return (
    <div className="px-6 py-4 font-sans">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-leather-800">Gestión de productos</h2>
            <button className="py-2 text-leather-800 hover:underline" onClick={() => navigate('/admin')}>Volver al dashboard</button>
          </div>
        <TablaProductos />
            
                <button onClick={handleOnClickCrear} className="mt-4 bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-400 transition">
                    + Agregar nuevo producto
                </button>
            
            

        
    </div>
  );
};

export default GestionProductos;
