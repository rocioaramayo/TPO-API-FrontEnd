import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, getCategoryById, clearSelectedCategory, createCategory } from '../../store/slices/categoriesSlice';

const GestionCategorias = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const categorias = useSelector((state) => state.categories.items);
  const selectedCategory = useSelector((state) => state.categories.selectedCategory);
  const loading = useSelector((state) => state.categories.loading);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const navigate = useNavigate();

  // Cargar categorías usando Redux
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear nueva categoría
  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      await dispatch(createCategory({
        nombre: formData.nombre,
        descripcion: formData.descripcion
      })).unwrap();
  
      setSuccess('Categoría creada exitosamente');
      setFormData({ nombre: '', descripcion: '' });
      setShowCreateForm(false);
      dispatch(fetchCategories()); // Recargar la lista
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Error al crear la categoría');
    }
  };
  // Ver detalles de una categoría
  const verDetalleCategoria = (id) => {
    dispatch(getCategoryById(id))
      .unwrap()
      .catch(error => {
        setError(error.message || 'Error al cargar la categoría');
      });
  };

  return (
    <div className="px-6 py-4 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-leather-800">Gestión de Categorías</h2>
          <p className="text-leather-600">Administra las categorías de productos</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/admin')}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            Volver al Dashboard
          </button>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-leather-600 text-white py-2 px-4 rounded hover:bg-leather-700 transition-colors"
          >
            {showCreateForm ? 'Cancelar' : '+ Nueva Categoría'}
          </button>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Formulario para crear categoría */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">   
          <h3 className="text-lg font-semibold text-leather-800 mb-4">Crear Nueva Categoría</h3>
          <form onSubmit={handleCrearCategoria} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500"
                  placeholder="Nombre de la categoría"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-leather-500 focus:border-leather-500"
                  placeholder="Descripción de la categoría"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-leather-800 text-white py-2 px-4 rounded font-medium hover:bg-leather-900 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creando...' : 'Crear Categoría'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ nombre: '', descripcion: '' });
                }}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="bg-white rounded-lg shadow-sm border border-leather-200">
        <div className="px-6 py-4 border-b border-leather-200">
          <h3 className="text-lg font-semibold text-leather-800">
            Categorías Existentes ({categorias.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-leather-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-leather-600">Cargando categorías...</p>
          </div>
        ) : categorias.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay categorías creadas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-leather-200">
              <thead className="bg-leather-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leather-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leather-700 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leather-700 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-leather-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-leather-100">
                {categorias.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-leather-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {categoria.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {categoria.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {categoria.descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => verDetalleCategoria(categoria.id)}
                        className="text-leather-600 hover:text-leather-800 mr-3"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para detalles de categoría */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-leather-800">
                Detalles de la Categoría
              </h3>
              <button
                onClick={() => dispatch(clearSelectedCategory())}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="text-gray-900">{selectedCategory.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-gray-900">{selectedCategory.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <p className="text-gray-900">{selectedCategory.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => dispatch(clearSelectedCategory())}
                className="bg-leather-800 text-white py-2 px-4 rounded font-medium hover:bg-leather-900 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCategorias;