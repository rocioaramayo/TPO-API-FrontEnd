const FilterInput = ({ label, children }) => (
  <div>
    <label className="block text-sm font-light text-orange-950/80 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const ProductFilters = ({ 
  filtros, 
  onFiltroChange, 
  onLimpiarFiltros, 
  categorias, 
  tiposCuero,
  colores,
}) => {
  const inputStyles = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-800 focus:border-amber-800 transition-colors text-sm";
  const filtrosActivos = Object.entries(filtros).filter(([key, value]) => 
    value !== '' && !['ordenarPor', 'orden', 'nombre'].includes(key)
  ).length;
  
  return (
    <div className="space-y-6">
      <FilterInput label="Buscar producto">
        <div className="relative">
          <input
            type="text"
            placeholder="Ej: cartera, cinturón..."
            value={filtros.nombre}
            onChange={(e) => onFiltroChange('nombre', e.target.value)}
            className={`${inputStyles} pl-10`}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </FilterInput>

      <FilterInput label="Categoría">
        <select
          value={filtros.categoriaId}
          onChange={(e) => onFiltroChange('categoriaId', e.target.value)}
          className={inputStyles}
        >
          <option value="">Todas</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </FilterInput>

      <FilterInput label="Tipo de Cuero">
        <select
          value={filtros.tipoCuero}
          onChange={(e) => onFiltroChange('tipoCuero', e.target.value)}
          className={inputStyles}
        >
          <option value="">Todos</option>
          {tiposCuero.map(tipo => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </FilterInput>

      <FilterInput label="Color">
        <select
          value={filtros.color}
          onChange={(e) => onFiltroChange('color', e.target.value)}
          className={inputStyles}
        >
          <option value="">Todos</option>
          {colores.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </FilterInput>

      <FilterInput label="Rango de Precio">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={filtros.precioMin}
            onChange={(e) => onFiltroChange('precioMin', e.target.value)}
            className={inputStyles}
          />
          <input
            type="number"
            placeholder="Máx"
            value={filtros.precioMax}
            onChange={(e) => onFiltroChange('precioMax', e.target.value)}
            className={inputStyles}
          />
        </div>
      </FilterInput>

      {filtrosActivos > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onLimpiarFiltros}
            className="w-full bg-orange-950 text-white py-2 rounded-md hover:bg-orange-900 transition-colors text-sm font-light tracking-wider"
          >
            Limpiar Filtros ({filtrosActivos})
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;