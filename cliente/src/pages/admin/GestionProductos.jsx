import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaProductos from "./TablaProductos";

const GestionProductos = () => {
    const [productos, setProductos] = useState(null);
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
            console.log(data)
            setProductos(data);
            });
    }, []);
  

  return (
    <div className="px-6 py-4 font-sans">
        <div className="flex">
            <h2 className="text-xl font-bold text-leather-800 ">Gestión de productos</h2>
            <button className="py-2" onClick={handleOnClick}>Volver al dashboard</button>
        </div>
        <TablaProductos/>
            
                <button onClick={navigate('/admin/productos')} className="mt-4 bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-400 transition">
                    + Agregar nuevo producto
                </button>
            
            

        
    </div>
  );
};

export default GestionProductos;
