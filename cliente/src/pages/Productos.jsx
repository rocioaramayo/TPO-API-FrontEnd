import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice';
import Footer from '../components/Footer';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import FilterTags from '../components/FilterTags';
import { useLocation } from 'react-router-dom';

const Productos = ({ user }) => {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  // Estados principales locales solo para filtros y UI
  const [categorias, setCategorias] = useState([]);
  const [tiposCuero, setTiposCuero] = useState([]);
  const [colores, setColores] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const location = useLocation();
  const [filtros, setFiltros] = useState(() => {
    const params = new URLSearchParams(location.search);
    const busqueda = params.get('busqueda') || '';
    return {
      nombre: busqueda,
      categoriaId: '',
      tipoCuero: '',
      color: '',
      precioMin: '',
      precioMax: '',
      ordenarPor: 'nombre',
      orden: 'asc',
    };
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const busqueda = params.get('busqueda') || '';
    setFiltros((prev) => {
      if (prev.nombre !== busqueda) {
        return { ...prev, nombre: busqueda };
      }
      return prev;
    });
  }, [location.search]);

  // Cargar categorías, tipos de cuero y colores al inicio
  useEffect(() => {
    fetch('http://localhost:8080/categories')
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error('Error al cargar categorías:', error));
    fetch('http://localhost:8080/productos/tipos-cuero')
      .then((response) => response.json())
      .then((data) => setTiposCuero(data))
      .catch((error) => console.error('Error al cargar tipos de cuero:', error));
    fetch('http://localhost:8080/productos/colores')
      .then((response) => response.json())
      .then((data) => setColores(data))
      .catch((error) => console.error('Error al cargar colores:', error));
  }, []);

  // Cargar productos (con filtros) usando Redux
  useEffect(() => {
    // Construir objeto de filtros para el thunk
    dispatch(fetchProducts(filtros));
  }, [dispatch, filtros]);

  // Manejar cambios en filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };
  const handleOrdenChange = (valor) => {
    const opcionesOrden = [
      { value: 'nombre_asc', ordenarPor: 'nombre', orden: 'asc' },
      { value: 'nombre_desc', ordenarPor: 'nombre', orden: 'desc' },
      { value: 'precio_asc', ordenarPor: 'precio', orden: 'asc' },
      { value: 'precio_desc', ordenarPor: 'precio', orden: 'desc' },
      { value: 'stock_desc', ordenarPor: 'stock', orden: 'desc' },
    ];
    const opcion = opcionesOrden.find((op) => op.value === valor);
    setFiltros((prev) => ({ ...prev, ordenarPor: opcion.ordenarPor, orden: opcion.orden }));
  };
  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      categoriaId: '',
      tipoCuero: '',
      color: '',
      precioMin: '',
      precioMax: '',
      ordenarPor: 'nombre',
      orden: 'asc',
    });
  };
  const filtrosActivos = Object.values(filtros).filter(
    (valor) => valor !== '' && valor !== 'nombre' && valor !== 'asc'
  ).length;

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-leather-900 mb-2">Productos</h1>
          <div className="flex items-center justify-between">
            <p className="text-leather-600">
              Encuentra el producto perfecto para ti
              {filtros.nombre && (
                <span className="ml-2 text-leather-800 font-medium">- Buscando: "{filtros.nombre}"</span>
              )}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-leather-600 text-sm">
                {loading
                  ? 'Cargando...'
                  : productos.length === 0
                  ? 'No se encontraron productos'
                  : `${productos.length} producto${productos.length > 1 ? 's' : ''} encontrado${productos.length > 1 ? 's' : ''}`}
              </span>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden bg-leather-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-80 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters
              filtros={filtros}
              onFiltroChange={handleFiltroChange}
              onOrdenChange={handleOrdenChange}
              onLimpiarFiltros={limpiarFiltros}
              categorias={categorias}
              tiposCuero={tiposCuero}
              colores={colores}
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