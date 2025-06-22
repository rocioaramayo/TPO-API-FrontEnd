import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, fetchTiposCuero, fetchColores } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import FilterTags from '../components/FilterTags';
import heroBanner from '../assets/alguien-conmapoa.webp';

const Productos = ({ onCartClick, onAuthRequired }) => {
  const dispatch = useDispatch();
  const { items: productos, loading, tiposCuero, colores } = useSelector((state) => state.products);
  const { items: categorias } = useSelector((state) => state.categories);
  const location = useLocation();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtros, setFiltros] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      nombre: params.get('busqueda') || '',
      categoriaId: params.get('categoriaId') || '',
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
    const categoriaId = params.get('categoria') ? categorias.find(c => c.nombre === params.get('categoria'))?.id || '' : '';
    setFiltros(prev => ({ ...prev, nombre: busqueda, categoriaId }));
  }, [location.search, categorias]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTiposCuero());
    dispatch(fetchColores());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filtros));
  }, [dispatch, filtros]);

  const handleFiltroChange = (campo, valor) => setFiltros(prev => ({ ...prev, [campo]: valor }));
  
  const handleOrdenChange = (valor) => {
    const [ordenarPor, orden] = valor.split('_');
    setFiltros(prev => ({ ...prev, ordenarPor, orden }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '', categoriaId: '', tipoCuero: '', color: '',
      precioMin: '', precioMax: '', ordenarPor: 'nombre', orden: 'asc',
    });
  };

  const filtrosActivos = Object.entries(filtros).filter(([key, value]) => 
    value !== '' && !['ordenarPor', 'orden', 'nombre'].includes(key)
  ).length;
  
  const categoriaActual = categorias.find(cat => cat.id === parseInt(filtros.categoriaId))?.nombre;

  return (
    <div className="bg-white text-orange-950">
      {/* Hero Banner */}
      <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${heroBanner})` }}>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl lg:text-7xl font-light drop-shadow-lg">
              {categoriaActual || 'Nuestra Colección'}
            </h1>
            <p className="font-serif italic text-2xl text-amber-300 mt-4">
              {categoriaActual ? `Explora nuestros productos de ${categoriaActual}` : 'Diseños para cada aventura'}
            </p>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Sorting Bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 text-sm font-medium hover:text-amber-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path></svg>
            <span>Filtros {filtrosActivos > 0 && `(${filtrosActivos})`}</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {loading ? 'Cargando...' : `${productos.length} resultados`}
            </span>
            <select
              onChange={(e) => handleOrdenChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-amber-800 focus:border-amber-800"
            >
              <option value="nombre_asc">Ordenar: Alfabéticamente (A-Z)</option>
              <option value="nombre_desc">Ordenar: Alfabéticamente (Z-A)</option>
              <option value="precio_asc">Ordenar: Precio (Menor a Mayor)</option>
              <option value="precio_desc">Ordenar: Precio (Mayor a Menor)</option>
            </select>
          </div>
        </div>

        {/* Filter Tags */}
        <FilterTags filtros={filtros} categorias={categorias} onFiltroChange={handleFiltroChange} />

        {/* Products Grid */}
        <ProductGrid 
          productos={productos} 
          categorias={categorias}
          loading={loading} 
          onLimpiarFiltros={limpiarFiltros} 
          onCartClick={onCartClick}
          onAuthRequired={onAuthRequired}
        />
      </main>

      {/* Filters Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${filtersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-light">Filtros</h2>
            <button onClick={() => setFiltersOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-grow pr-2">
            <ProductFilters
              filtros={filtros}
              onFiltroChange={handleFiltroChange}
              onOrdenChange={handleOrdenChange}
              onLimpiarFiltros={limpiarFiltros}
              categorias={categorias}
              tiposCuero={tiposCuero}
              colores={colores}
            />
          </div>
        </div>
      </aside>
      {filtersOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setFiltersOpen(false)}></div>}

      <Footer />
    </div>
  );
};

export default Productos;