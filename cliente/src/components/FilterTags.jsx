const FilterTags = ({ filtros, categorias, onFiltroChange }) => {
  
  const tags = [];

  // Tag de búsqueda
  if (filtros.nombre) {
    tags.push({
      label: `Buscar: "${filtros.nombre}"`,
      onRemove: () => onFiltroChange('nombre', '')
    });
  }

  // Tag de categoría
  if (filtros.categoriaId) {
    const categoria = categorias.find(c => c.id === parseInt(filtros.categoriaId));
    tags.push({
      label: `Categoría: ${categoria?.nombre}`,
      onRemove: () => onFiltroChange('categoriaId', '')
    });
  }

  // Tag de tipo de cuero
  if (filtros.tipoCuero) {
    tags.push({
      label: filtros.tipoCuero,
      onRemove: () => onFiltroChange('tipoCuero', '')
    });
  }

  // Tag de color
  if (filtros.color) {
    tags.push({
      label: filtros.color,
      onRemove: () => onFiltroChange('color', '')
    });
  }

  // Tag de precio
  if (filtros.precioMin || filtros.precioMax) {
    tags.push({
      label: `$${filtros.precioMin || '0'} - $${filtros.precioMax || '∞'}`,
      onRemove: () => {
        onFiltroChange('precioMin', '');
        onFiltroChange('precioMax', '');
      }
    });
  }

  // No mostrar nada si no hay tags
  if (tags.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="bg-leather-100 text-leather-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
          >
            <span>{tag.label}</span>
            <button 
              onClick={tag.onRemove}
              className="ml-1 hover:text-leather-900 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;