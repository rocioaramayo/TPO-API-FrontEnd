import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import FilterTags from '../components/FilterTags';
import { useLocation } from 'react-router-dom';

const Productos = ({ user }) => {
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    categoriaId: '',
    tipoCuero: '',
    color: '',
    precioMin: '',
    precioMax: '',
    ordenarPor: 'nombre',
    orden: 'asc'
  });

  const location = useLocation();

  // En Productos.jsx, después de recibir user como prop
  useEffect(() => {
    console.log('Usuario en Productos:', user);
    console.log('¿Tiene token?', user?.token ? 'SÍ' : 'NO');
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const busqueda = params.get('busqueda') || '';
    setFiltros(prev => ({
      ...prev,
      nombre: busqueda
    }));
  }, [location.search]);

  // Opciones para ordenamiento
  const opcionesOrden = [
    { value: 'nombre_asc', label: 'Nombre A-Z', ordenarPor: 'nombre', orden: 'asc' },
    { value: 'nombre_desc', label: 'Nombre Z-A', ordenarPor: 'nombre', orden: 'desc' },
    { value: 'precio_asc', label: 'Precio menor a mayor', ordenarPor: 'precio', orden: 'asc' },
    { value: 'precio_desc', label: 'Precio mayor a menor', ordenarPor: 'precio', orden: 'desc' },
    { value: 'stock_desc', label: 'Mayor stock', ordenarPor: 'stock', orden: 'desc' }
  ];

  // Cargar categorías al inicio
  useEffect(() => {
    fetch('http://localhost:8080/categories')
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Error al cargar categorías:', error));
  }, []);

  // Cargar productos (con filtros)
  useEffect(() => {
    setLoading(true);
    
    // Construir URL con parámetros 
    const params = new URLSearchParams();
    
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
    if (filtros.tipoCuero) params.append('tipoCuero', filtros.tipoCuero);
    if (filtros.color) params.append('color', filtros.color);
    if (filtros.precioMin) params.append('precioMin', filtros.precioMin);
    if (filtros.precioMax) params.append('precioMax', filtros.precioMax);
    params.append('ordenarPor', filtros.ordenarPor);
    params.append('orden', filtros.orden);
    params.append('size', '50');

    const URL = `http://localhost:8080/productos/filtrar?${params}`;
    
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        setProductos(data.content || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      });
  }, [filtros]);

  // Manejar cambios en filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Manejar cambio de ordenamiento
  const handleOrdenChange = (valor) => {
    const opcion = opcionesOrden.find(op => op.value === valor);
    setFiltros(prev => ({
      ...prev,
      ordenarPor: opcion.ordenarPor,
      orden: opcion.orden
    }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      categoriaId: '',
      tipoCuero: '',
      color: '',
      precioMin: '',
      precioMax: '',
      ordenarPor: 'nombre',
      orden: 'asc'
    });
  };

  // Contar filtros activos
  const filtrosActivos = Object.values(filtros).filter(valor => 
    valor !== '' && valor !== 'nombre' && valor !== 'asc'
  ).length;

  return (
    <div className="min-h-screen bg-cream-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-leather-900 mb-2">
            Productos
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-leather-600">
              Encuentra el producto perfecto para ti
            </p>
            
            {/* Contador de productos */}
            <div className="flex items-center space-x-4">
              <span className="text-leather-600 text-sm">
                {loading
                  ? 'Cargando...'
                  : productos.length === 0
                    ? 'No se encontraron productos'
                    : `${productos.length} producto${productos.length > 1 ? 's' : ''} encontrado${productos.length > 1 ? 's' : ''}`
                }
              </span>
              
              {/* Toggle filtros en móvil */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden bg-leather-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                <span>Filtros</span>
                {filtrosActivos > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {filtrosActivos}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar de Filtros */}
          <div className={`lg:w-80 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters
              filtros={filtros}
              onFiltroChange={handleFiltroChange}
              onOrdenChange={handleOrdenChange}
              onLimpiarFiltros={limpiarFiltros}
              categorias={categorias}
              filtrosActivos={filtrosActivos}
            />
          </div>

          <div className="flex-1">
            
            <FilterTags
              filtros={filtros}
              categorias={categorias}
              onFiltroChange={handleFiltroChange}
            />

           <ProductGrid
            productos={productos}
            loading={loading}
            onLimpiarFiltros={limpiarFiltros}
            user={user}
            />

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Productos;