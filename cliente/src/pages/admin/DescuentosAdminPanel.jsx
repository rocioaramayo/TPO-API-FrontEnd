import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, getCategoryById } from '../../store/slices/categoriesSlice';
import { fetchDescuentos, createDescuento, updateDescuento, deleteDescuento, activarDescuento, desactivarDescuento, limpiarCreateSuccess } from '../../store/slices/descuentosSlice';

const DescuentosAdminPanel = ({ visible, onClose, fullPage }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const categorias = useSelector((state) => state.categories.items);
  const descuentos = useSelector((state) => state.descuentos.items);
  const loading = useSelector((state) => state.descuentos.loading);
  const error = useSelector((state) => state.descuentos.error);
  const createError = useSelector((state) => state.descuentos.createError);
  const createSuccess = useSelector((state) => state.descuentos.createSuccess);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    codigo: '',
    porcentaje: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    montoMinimo: '',
    categoriaId: ''
  });
  const [nuevo, setNuevo] = useState({
    codigo: '',
    porcentaje: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    montoMinimo: '',
    categoriaId: ''
  });
  const [categoriaPorId, setCategoriaPorId] = useState({});
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [descuentoAEliminar, setDescuentoAEliminar] = useState(null);
  const [filtroUnico, setFiltroUnico] = useState("todos");
  
  // LOG: Render principal
  console.log("RENDER PRINCIPAL", { showDeleteModal, descuentoAEliminar });

  useEffect(() => {
    console.log("useEffect [descuentos, categorias]");
    // Crear un objeto que mapee categoría ID a nombre usando las categorías ya cargadas
    const nuevoCategoriaPorId = {};
    descuentos.forEach(d => {
      if (d.categoriaId) {
        // Buscar la categoría en el estado de categorías
        const categoria = categorias.find(cat => cat.id === d.categoriaId);
        if (categoria) {
          nuevoCategoriaPorId[d.categoriaId] = categoria.nombre;
        } else {
          nuevoCategoriaPorId[d.categoriaId] = 'Sin categoría';
        }
      }
    });
    setCategoriaPorId(nuevoCategoriaPorId);
  }, [descuentos, categorias]);

  useEffect(() => {
    console.log("useEffect [visible, user, isAuthenticated, dispatch]");
    if (visible && isAuthenticated && user?.token) {
      dispatch(fetchDescuentos(user.token));
      dispatch(fetchCategories());
    }
  }, [visible, user, isAuthenticated, dispatch]);

  useEffect(() => {
    console.log("useEffect [createSuccess] (reset nuevo)");
    if (createSuccess) {
      setNuevo({
        codigo: '',
        porcentaje: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        montoMinimo: '',
        categoriaId: ''
      });
    }
  }, [createSuccess]);

  useEffect(() => {
    console.log("useEffect [createSuccess, dispatch] (limpiarCreateSuccess)");
    if (createSuccess) {
      const timeout = setTimeout(() => {
        dispatch(limpiarCreateSuccess());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [createSuccess, dispatch]);

  const handleActivar = (id) => {
    dispatch(activarDescuento({ token: user.token, id }));
  };

  const handleDesactivar = (id) => {
    dispatch(desactivarDescuento({ token: user.token, id }));
  };

  const handleEliminar = (id) => {
    console.log("ABRO MODAL ELIMINAR", id);
    setDescuentoAEliminar(id);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = () => {
    dispatch(deleteDescuento({ token: user.token, id: descuentoAEliminar }));
    setShowDeleteModal(false);
    setDescuentoAEliminar(null);
  };

  const cancelarEliminar = () => {
    setShowDeleteModal(false);
    setDescuentoAEliminar(null);
  };

  const handleEditClick = (d) => {
    setEditId(d.id);
    setEditData({
      codigo: d.codigo || '',
      porcentaje: d.porcentaje || '',
      descripcion: d.descripcion || '',
      fechaInicio: d.fechaInicio ? d.fechaInicio.slice(0,10) : '',
      fechaFin: d.fechaFin ? d.fechaFin.slice(0,10) : '',
      montoMinimo: d.montoMinimo || '',
      categoriaId: d.categoriaId || ''
    });
  };

  const handleEditSave = () => {
    // Validaciones
    const porcentajeNum = Number(editData.porcentaje);
    if (porcentajeNum < 1 || porcentajeNum > 100) {
      setFormError('El porcentaje debe estar entre 1 y 100');
      return;
    }
    if (editData.fechaFin && editData.fechaInicio && editData.fechaFin < editData.fechaInicio) {
      setFormError('La fecha fin no puede ser menor a la fecha inicio');
      return;
    }
    setFormError(null);

    // Formatear fechas agregando "T00:00:00" si corresponde
    let fechaInicioFormateada = editData.fechaInicio && editData.fechaInicio !== '' ? `${editData.fechaInicio}T00:00:00` : undefined;
    let fechaFinFormateada = editData.fechaFin && editData.fechaFin !== '' ? `${editData.fechaFin}T00:00:00` : undefined;

    // Armar el body para edición, solo incluir fechas si están presentes
    let bodyEditar = {
      codigo: editData.codigo.trim(),
      porcentaje: Number(editData.porcentaje),
      descripcion: editData.descripcion,
      montoMinimo: editData.montoMinimo ? Number(editData.montoMinimo) : 0,
      ...(fechaInicioFormateada && { fechaInicio: fechaInicioFormateada }),
      ...(fechaFinFormateada && { fechaFin: fechaFinFormateada }),
    };
    if (editData.categoriaId) bodyEditar.categoriaId = Number(editData.categoriaId);

    dispatch(updateDescuento({ token: user.token, id: editId, data: bodyEditar }));
        setEditId(null);
        // Reset editData para evitar residuos en el formulario
        setEditData({
          codigo: '',
          porcentaje: '',
          descripcion: '',
          fechaInicio: '',
          fechaFin: '',
          montoMinimo: '',
          categoriaId: ''
      });
  };

  const handleCrear = (e) => {
    e.preventDefault();
    const porcentajeNum = Number(nuevo.porcentaje);
    if (porcentajeNum < 1 || porcentajeNum > 100) {
      setFormError('El porcentaje debe estar entre 1 y 100');
      return;
    }
    if (nuevo.fechaFin && nuevo.fechaInicio && nuevo.fechaFin < nuevo.fechaInicio) {
      setFormError('La fecha fin no puede ser menor a la fecha inicio');
      return;
    }
    setFormError(null);

    // Formatear fechas agregando "T00:00:00" si corresponde
    let fechaInicioFormateada = nuevo.fechaInicio && nuevo.fechaInicio !== '' ? `${nuevo.fechaInicio}T00:00:00` : undefined;
    let fechaFinFormateada = nuevo.fechaFin && nuevo.fechaFin !== '' ? `${nuevo.fechaFin}T00:00:00` : undefined;

    // Solo armar el body con campos con valor
    let bodyCrear = {
      codigo: nuevo.codigo.trim(),
      porcentaje: porcentajeNum,
      descripcion: nuevo.descripcion.trim(),
    };
    if (nuevo.montoMinimo && nuevo.montoMinimo !== '') bodyCrear.montoMinimo = Number(nuevo.montoMinimo);
    if (fechaInicioFormateada) bodyCrear.fechaInicio = fechaInicioFormateada;
    if (fechaFinFormateada) bodyCrear.fechaFin = fechaFinFormateada;
    if (nuevo.categoriaId && nuevo.categoriaId !== '') bodyCrear.categoriaId = Number(nuevo.categoriaId);

    dispatch(createDescuento({ token: user.token, data: bodyCrear }));
  };

  const isVigente = (d) => {
    if (!d.activo) return false;
    const hoy = new Date();
    const inicio = d.fechaInicio ? new Date(d.fechaInicio) : null;
    const fin = d.fechaFin ? new Date(d.fechaFin) : null;

    if (inicio && hoy < inicio) return false;
    if (fin && hoy > fin) return false;
    return true;
  };

  // Filtrado y orden
  let descuentosFiltrados = descuentos;
  if (filtroUnico === "vigentes") {
    descuentosFiltrados = descuentos.filter(d => d.activo && isVigente(d)).sort((a, b) => a.codigo.localeCompare(b.codigo));
  } else if (filtroUnico === "no_vigentes") {
    descuentosFiltrados = descuentos.filter(d => d.activo && !isVigente(d)).sort((a, b) => a.codigo.localeCompare(b.codigo));
  } else if (filtroUnico === "inactivos") {
    descuentosFiltrados = descuentos.filter(d => !d.activo).sort((a, b) => a.codigo.localeCompare(b.codigo));
  } else if (filtroUnico === "mas_recientes") {
    descuentosFiltrados = [...descuentos].sort((a, b) => b.id - a.id);
  } else if (filtroUnico === "mas_antiguos") {
    descuentosFiltrados = [...descuentos].sort((a, b) => a.id - b.id);
  } else {
    descuentosFiltrados = [...descuentos].sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  if (!visible && !fullPage) return null;
  if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') return null;

  if (fullPage) {
    return (
      <>
        <div className="min-h-screen bg-cream-50 py-4 px-4">
          <div className="max-w-5xl mx-auto px-6 py-4 font-sans">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-2xl font-bold text-leather-800">Gestión de Descuentos</h2>
                <p className="text-leather-600">Administrá y configurá los descuentos aplicables</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
                >
                  Volver al Dashboard
                </button>
              </div>
            </div>

            <form onSubmit={handleCrear} className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-leather-800 mb-4">Crear Nuevo Descuento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-leather-700 mb-2">Código *</label>
                  <input 
                    type="text" 
                    value={nuevo.codigo} 
                    onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
                    required 
                    placeholder="Ej: DESC10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-leather-700 mb-2">Porcentaje (%) *</label>
                  <input 
                    type="number" 
                    value={nuevo.porcentaje} 
                    onChange={e => setNuevo(n => ({ ...n, porcentaje: e.target.value }))} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
                    required 
                    min="1" 
                    max="100"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-leather-700 mb-2">Monto Mínimo</label>
                  <input 
                    type="number" 
                    value={nuevo.montoMinimo} 
                    onChange={e => setNuevo(n => ({ ...n, montoMinimo: e.target.value }))} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-leather-700 mb-2">Descripción</label>
                  <input 
                    type="text" 
                    value={nuevo.descripcion} 
                    onChange={e => setNuevo(n => ({ ...n, descripcion: e.target.value }))} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-leather-500 focus:border-leather-500"
                    placeholder="Descripción del descuento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-leather-700 mb-2">Fecha Inicio</label>
                  <input 
                    type="date" 
                    value={nuevo.fechaInicio} 
                    onChange={e => setNuevo(n => ({ ...n, fechaInicio: e.target.value }))} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-leather-700 mb-2">Fecha Fin</label>
                  <input 
                    type="date" 
                    value={nuevo.fechaFin} 
                    onChange={e => setNuevo(n => ({ ...n, fechaFin: e.target.value }))} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-leather-700 mb-2">Categoría</label>
                  <select 
                    value={nuevo.categoriaId} 
                    onChange={e => setNuevo(n => ({ ...n, categoriaId: e.target.value }))} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-leather-500 focus:border-leather-500"
                  >
                    <option value="">-- Seleccionar --</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-leather-800 mb-1">Filtrar/Ordenar descuentos:</label>
                  <select
                    value={filtroUnico}
                    onChange={e => setFiltroUnico(e.target.value)}
                    className="border border-leather-200 rounded p-2 w-full md:w-80 focus:ring-2 focus:ring-leather-500 focus:border-leather-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="vigentes">Vigentes</option>
                    <option value="no_vigentes">No vigentes</option>
                    <option value="inactivos">Inactivos</option>
                    <option value="mas_recientes">Más recientes primero</option>
                    <option value="mas_antiguos">Más antiguos primero</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-leather-800 text-white px-6 py-3 rounded-md hover:bg-leather-900 font-medium disabled:opacity-50 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Descuento"}
                </button>
              </div>
            </form>
            <div className="mb-6 flex justify-end">
              <div>
                <label className="block text-sm font-medium text-leather-800 mb-1 text-right">Filtrar/Ordenar descuentos:</label>
                <select
                  value={filtroUnico}
                  onChange={e => setFiltroUnico(e.target.value)}
                  className="border border-leather-200 rounded p-2 w-full md:w-80 focus:ring-2 focus:ring-leather-500 focus:border-leather-500"
                >
                  <option value="todos">Todos</option>
                  <option value="vigentes">Vigentes</option>
                  <option value="no_vigentes">No vigentes</option>
                  <option value="inactivos">Inactivos</option>
                  <option value="mas_recientes">Más recientes primero</option>
                  <option value="mas_antiguos">Más antiguos primero</option>
                </select>
              </div>
            </div>
            {loading ? <p className="text-leather-600">Cargando...</p> : null}
            {formError && <div className="text-red-500 mb-2">{formError}</div>}
            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {typeof createError === 'string' ? createError : (createError?.message || 'Error al crear el descuento')}
              </div>
            )}
            {createSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {createSuccess}
              </div>
            )}
            <ul className="divide-y divide-leather-100 bg-white rounded-lg border border-leather-200 mb-8">
              {descuentosFiltrados.length === 0 && !loading && (
                <li className="py-4 text-leather-600 text-center">No hay descuentos registrados.</li>
              )}
              {descuentosFiltrados.map(d => {
                const vigente = isVigente(d);
                const categoriaNombre =
                  d.categoria && d.categoria !== ''
                    ? d.categoria
                    : d.categoriaId && categorias.length > 0
                    ? (categorias.find(cat => String(cat.id) === String(d.categoriaId))?.nombre ?? 'Sin categoría')
                    : 'Sin categoría';
                if (editId === d.id) {
                  return (
                    <li key={d.id} className="py-4 px-4 bg-white border border-leather-200 rounded mb-2">
                      <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                        <div>
                          <label className="block text-sm font-medium text-leather-800 mb-1">Código</label>
                          <input type="text" value={editData.codigo} onChange={e => setEditData(ed => ({ ...ed, codigo: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-leather-800 mb-1">%</label>
                          <input type="number" value={editData.porcentaje} onChange={e => setEditData(ed => ({ ...ed, porcentaje: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" min="1" max="100" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-leather-800 mb-1">Descripción</label>
                          <input type="text" value={editData.descripcion} onChange={e => setEditData(ed => ({ ...ed, descripcion: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-leather-800 mb-1">Fecha inicio</label>
                          <input type="date" value={editData.fechaInicio} onChange={e => setEditData(ed => ({ ...ed, fechaInicio: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-leather-800 mb-1">Fecha fin</label>
                          <input type="date" value={editData.fechaFin} onChange={e => setEditData(ed => ({ ...ed, fechaFin: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-leather-800 mb-1">Monto mínimo</label>
                          <input type="number" value={editData.montoMinimo} onChange={e => setEditData(ed => ({ ...ed, montoMinimo: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" min="0" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-leather-800 mb-1">Categoría</label>
                          <select value={editData.categoriaId} onChange={e => setEditData(ed => ({ ...ed, categoriaId: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500">
                            <option value="">-- Seleccionar --</option>
                            {categorias.map(c => (
                              <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2 flex gap-3 justify-end">
                          <button type="submit" className="text-green-700 font-bold hover:underline">Guardar</button>
                          <button type="button" onClick={() => setEditId(null)} className="text-leather-700 font-bold hover:underline">Cancelar</button>
                        </div>
                      </form>
                      {formError && <div className="text-red-500 mt-2">{formError}</div>}
                    </li>
                  );
                }
                return (
                  <li key={d.id} className="py-2 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <span className="font-mono text-leather-800 bg-leather-100 px-2 py-1 rounded mb-1 inline-block">{d.codigo}</span>
                      <span className="text-leather-700 text-sm mb-1 block">{d.descripcion}</span>
                      <div className="flex flex-wrap gap-2 text-xs mb-1">
                        {!d.activo && (
                          <span className="px-2 py-1 rounded w-fit bg-leather-200 text-leather-700">Inactivo</span>
                        )}
                        {d.activo && isVigente(d) && (
                          <span className="px-2 py-1 rounded w-fit bg-green-100 text-green-700">Vigente</span>
                        )}
                        {d.activo && !isVigente(d) && (
                          <span className="px-2 py-1 rounded w-fit bg-leather-200 text-leather-700">No vigente</span>
                        )}
                      </div>
                      <span className="text-leather-700 text-sm block">Porcentaje: {d.porcentaje}%</span>
                      <span className="text-leather-700 text-sm block">Fecha Inicio: {d.fechaInicio ? d.fechaInicio.slice(0,10) : '-'}</span>
                      <span className="text-leather-700 text-sm block">Fecha Fin: {d.fechaFin ? d.fechaFin.slice(0,10) : '-'}</span>
                      <span className="text-leather-700 text-sm block">Monto Mínimo: ${d.montoMinimo ?? 0}</span>
                      <span className="text-leather-700 text-sm block">
                        Categoría: <strong>{categoriaNombre}</strong>
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[80px] md:self-center">
                      <button onClick={() => handleEditClick(d)} className="text-blue-600 hover:underline">Editar</button>
                      {!d.activo && (
                        <button className="text-green-700 hover:underline text-sm" onClick={() => handleActivar(d.id)}>Activar</button>
                      )}
                      {d.activo && (
                        <button onClick={() => handleDesactivar(d.id)} className="text-yellow-700 hover:underline">Desactivar</button>
                      )}
                      <button onClick={() => handleEliminar(d.id)} className="text-red-600 hover:underline">Eliminar</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Modal de confirmación de eliminación para fullPage */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 text-center">
              <p className="mb-4 text-orange-900 text-base font-semibold">
                ¿Estás seguro de que querés eliminar este descuento?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmarEliminar}
                  className="px-4 py-2 bg-leather-800 text-white rounded-md hover:bg-leather-900 font-bold text-sm"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={cancelarEliminar}
                  className="px-4 py-2 bg-gray-200 text-leather-800 rounded-md hover:bg-gray-300 font-bold text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const panelClass = 'mx-auto my-auto w-full max-w-lg bg-white border border-leather-200 rounded-lg shadow-lg p-8 animate-fade-in';

  return (
    <div className={panelClass}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-leather-800">Administrar Descuentos</h3>
        <button onClick={onClose} className="text-leather-600 hover:text-leather-900 text-2xl font-bold">✕</button>
      </div>
      <form onSubmit={handleCrear} className="mb-6 bg-gray-50 p-4 rounded-lg border">
        <h4 className="text-base font-semibold text-leather-800 mb-3">Crear Nuevo Descuento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-leather-700 mb-1">Código *</label>
            <input 
              type="text" 
              value={nuevo.codigo} 
              onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
              required 
              placeholder="Ej: DESC10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-leather-700 mb-1">Porcentaje (%) *</label>
            <input 
              type="number" 
              value={nuevo.porcentaje} 
              onChange={e => setNuevo(n => ({ ...n, porcentaje: e.target.value }))} 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
              required 
              min="1" 
              max="100"
              placeholder="10"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-leather-700 mb-1">Descripción</label>
            <input 
              type="text" 
              value={nuevo.descripcion} 
              onChange={e => setNuevo(n => ({ ...n, descripcion: e.target.value }))} 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-leather-500 focus:border-leather-500"
              placeholder="Descripción del descuento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-leather-700 mb-1">Fecha Inicio</label>
            <input 
              type="date" 
              value={nuevo.fechaInicio} 
              onChange={e => setNuevo(n => ({ ...n, fechaInicio: e.target.value }))} 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-leather-700 mb-1">Fecha Fin</label>
            <input 
              type="date" 
              value={nuevo.fechaFin} 
              onChange={e => setNuevo(n => ({ ...n, fechaFin: e.target.value }))} 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-leather-700 mb-1">Monto Mínimo</label>
            <input 
              type="number" 
              value={nuevo.montoMinimo} 
              onChange={e => setNuevo(n => ({ ...n, montoMinimo: e.target.value }))} 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-leather-500 focus:border-leather-500" 
              min="0"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-leather-700 mb-1">Categoría</label>
            <select 
              value={nuevo.categoriaId} 
              onChange={e => setNuevo(n => ({ ...n, categoriaId: e.target.value }))} 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-leather-500 focus:border-leather-500"
            >
              <option value="">-- Seleccionar --</option>
              {categorias.length === 0 && (
                <option value="" disabled>No hay categorías disponibles</option>
              )}
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-leather-800 text-white px-4 py-2 rounded hover:bg-leather-900 font-medium disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Descuento"}
          </button>
        </div>
      </form>
      <div className="mb-6 flex justify-end">
        <div>
          <label className="block text-sm font-medium text-leather-800 mb-1 text-right">Filtrar/Ordenar descuentos:</label>
          <select
            value={filtroUnico}
            onChange={e => setFiltroUnico(e.target.value)}
            className="border border-leather-200 rounded p-2 w-full md:w-80 focus:ring-2 focus:ring-leather-500 focus:border-leather-500"
          >
            <option value="todos">Todos</option>
            <option value="vigentes">Vigentes</option>
            <option value="no_vigentes">No vigentes</option>
            <option value="inactivos">Inactivos</option>
            <option value="mas_recientes">Más recientes primero</option>
            <option value="mas_antiguos">Más antiguos primero</option>
          </select>
        </div>
      </div>
      {loading ? <p className="text-leather-600">Cargando...</p> : null}
      {formError && <div className="text-red-500 mb-2">{formError}</div>}
      {createError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {typeof createError === 'string' ? createError : (createError?.message || 'Error al crear el descuento')}
        </div>
      )}
      {createSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {createSuccess}
        </div>
      )}
      <ul className="divide-y divide-leather-100 bg-white rounded-lg border border-leather-200 mb-8">
        {descuentosFiltrados.length === 0 && !loading && (
          <li className="py-4 text-leather-600 text-center">No hay descuentos registrados.</li>
        )}
        {descuentosFiltrados.map(d => {
          const vigente = isVigente(d);
          const categoriaNombre =
            d.categoria && d.categoria !== ''
              ? d.categoria
              : d.categoriaId && categorias.length > 0
              ? (categorias.find(cat => String(cat.id) === String(d.categoriaId))?.nombre ?? 'Sin categoría')
              : 'Sin categoría';
          if (editId === d.id) {
            return (
              <li key={d.id} className="py-4 px-4 bg-white border border-leather-200 rounded mb-2">
                <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-leather-800 mb-1">Código</label>
                    <input type="text" value={editData.codigo} onChange={e => setEditData(ed => ({ ...ed, codigo: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-leather-800 mb-1">%</label>
                    <input type="number" value={editData.porcentaje} onChange={e => setEditData(ed => ({ ...ed, porcentaje: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" min="1" max="100" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-leather-800 mb-1">Descripción</label>
                    <input type="text" value={editData.descripcion} onChange={e => setEditData(ed => ({ ...ed, descripcion: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-leather-800 mb-1">Fecha inicio</label>
                    <input type="date" value={editData.fechaInicio} onChange={e => setEditData(ed => ({ ...ed, fechaInicio: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-leather-800 mb-1">Fecha fin</label>
                    <input type="date" value={editData.fechaFin} onChange={e => setEditData(ed => ({ ...ed, fechaFin: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-leather-800 mb-1">Monto mínimo</label>
                    <input type="number" value={editData.montoMinimo} onChange={e => setEditData(ed => ({ ...ed, montoMinimo: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500" min="0" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-leather-800 mb-1">Categoría</label>
                    <select value={editData.categoriaId} onChange={e => setEditData(ed => ({ ...ed, categoriaId: e.target.value }))} className="border border-leather-200 p-2 rounded w-full focus:ring-2 focus:ring-leather-500 focus:border-leather-500">
                      <option value="">-- Seleccionar --</option>
                      {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button type="submit" className="text-green-700 font-bold hover:underline">Guardar</button>
                    <button type="button" onClick={() => setEditId(null)} className="text-leather-700 font-bold hover:underline">Cancelar</button>
                  </div>
                </form>
                {formError && <div className="text-red-500 mt-2">{formError}</div>}
              </li>
            );
          }
          return (
            <li key={d.id} className="py-2 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <span className="font-mono text-leather-800 bg-leather-100 px-2 py-1 rounded mb-1 inline-block">{d.codigo}</span>
                <span className="text-leather-700 text-sm mb-1 block">{d.descripcion}</span>
                <div className="flex flex-wrap gap-2 text-xs mb-1">
                  {!d.activo && (
                    <span className="px-2 py-1 rounded w-fit bg-leather-200 text-leather-700">Inactivo</span>
                  )}
                  {d.activo && isVigente(d) && (
                    <span className="px-2 py-1 rounded w-fit bg-green-100 text-green-700">Vigente</span>
                  )}
                  {d.activo && !isVigente(d) && (
                    <span className="px-2 py-1 rounded w-fit bg-leather-200 text-leather-700">No vigente</span>
                  )}
                </div>
                <span className="text-leather-700 text-sm block">Porcentaje: {d.porcentaje}%</span>
                <span className="text-leather-700 text-sm block">Fecha Inicio: {d.fechaInicio ? d.fechaInicio.slice(0,10) : '-'}</span>
                <span className="text-leather-700 text-sm block">Fecha Fin: {d.fechaFin ? d.fechaFin.slice(0,10) : '-'}</span>
                <span className="text-leather-700 text-sm block">Monto Mínimo: ${d.montoMinimo ?? 0}</span>
                <span className="text-leather-700 text-sm block">
                  Categoría: <strong>{categoriaNombre}</strong>
                </span>
              </div>
              <div className="flex flex-col items-end gap-2 min-w-[80px] md:self-center">
                <button onClick={() => handleEditClick(d)} className="text-blue-600 hover:underline">Editar</button>
                {!d.activo && (
                  <button className="text-green-700 hover:underline text-sm" onClick={() => handleActivar(d.id)}>Activar</button>
                )}
                {d.activo && (
                  <button onClick={() => handleDesactivar(d.id)} className="text-yellow-700 hover:underline">Desactivar</button>
                )}
                <button onClick={() => handleEliminar(d.id)} className="text-red-600 hover:underline">Eliminar</button>
              </div>
            </li>
          );
        })}
      </ul>
      
      {/* Modal de confirmación de eliminación para panel */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 text-center">
            <p className="mb-4 text-orange-900 text-base font-semibold">
              ¿Estás seguro de que querés eliminar este descuento?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmarEliminar}
                className="px-4 py-2 bg-leather-800 text-white rounded-md hover:bg-leather-900 font-bold text-sm"
              >
                Sí, eliminar
              </button>
              <button
                onClick={cancelarEliminar}
                className="px-4 py-2 bg-gray-200 text-leather-800 rounded-md hover:bg-gray-300 font-bold text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescuentosAdminPanel;