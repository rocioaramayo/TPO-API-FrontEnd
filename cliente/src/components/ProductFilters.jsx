const ProductFilters = ({ 
  filtros, 
  onFiltroChange, 
  onOrdenChange, 
  onLimpiarFiltros, 
  categorias, 
  filtrosActivos 
}) => {
  
  const tiposCuero = ['Nobuck', 'Plena flor', 'Flor corregida', 'Ante'];
  const colores = ['Negro', 'Marrón', 'Cognac', 'Café', 'Natural'];
  const opcionesOrden = [
    { value: 'nombre_asc', label: 'Nombre A-Z' },
    { value: 'nombre_desc', label: 'Nombre Z-A' },
    { value: 'precio_asc', label: 'Precio menor a mayor' },
    { value: 'precio_desc', label: 'Precio mayor a menor' },
    { value: 'stock_desc', label: 'Mayor stock' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-leather-200 p-6 sticky top-4">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-leather-900">Filtros</h2>
        {filtrosActivos > 0 && (
          <button
            onClick={onLimpiarFiltros}
            className="text-leather-600 hover:text-leather-800 text-sm underline"
          >
            Limpiar ({filtrosActivos})
          </button>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-leather-700 mb-2">
            Buscar producto
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ej: cartera, cinturón..."
              value={filtros.nombre}
              onChange={(e) => onFiltroChange('nombre', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-leather-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-medium text-leather-700 mb-2">
            Ordenar por
          </label>
          <select
            value={`${filtros.ordenarPor}_${filtros.orden}`}
            onChange={(e) => onOrdenChange(e.target.value)}
            className="w-full p-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500"
          >
            {opcionesOrden.map(opcion => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-leather-700 mb-2">
            Categoría
          </label>
          <select
            value={filtros.categoriaId}
            onChange={(e) => onFiltroChange('categoriaId', e.target.value)}
            className="w-full p-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Cuero */}
        <div>
          <label className="block text-sm font-medium text-leather-700 mb-2">
            Tipo de Cuero
          </label>
          <select
            value={filtros.tipoCuero}
            onChange={(e) => onFiltroChange('tipoCuero', e.target.value)}
            className="w-full p-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500"
          >
            <option value="">Todos los tipos</option>
            {tiposCuero.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-leather-700 mb-2">
            Color
          </label>
          <select
            value={filtros.color}
            onChange={(e) => onFiltroChange('color', e.target.value)}
            className="w-full p-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500"
          >
            <option value="">Todos los colores</option>
            {colores.map(color => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de Precio */}
        <div>
          <label className="block text-sm font-medium text-leather-700 mb-2">
            Rango de Precio
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Mín"
                value={filtros.precioMin}
                onChange={(e) => onFiltroChange('precioMin', e.target.value)}
                className="w-full p-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Máx"
                value={filtros.precioMax}
                onChange={(e) => onFiltroChange('precioMax', e.target.value)}
                className="w-full p-2 border border-leather-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leather-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductFilters;