import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Productos = () => {
  // Estados para manejar los datos
  const [productos, setProductos] = useState([]);
  const URL = "http://localhost:8080/productos";

  // Cargar productos cuando se monta el componente 
  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        // El back devuelve un ProductPageResponse 
        setProductos(data.productos || []);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-leather-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-serif font-bold text-leather-900 mb-2">
            Nuestros Productos
          </h1>
          <p className="text-leather-600">
            Descubre nuestra colección de productos artesanales de cuero argentino
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard 
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              stock={producto.stock}
              categoria={producto.categoria}
              fotos={producto.fotos}
              tipoCuero={producto.tipoCuero}
              color={producto.color}
              pocoStock={producto.pocoStock}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Productos;

