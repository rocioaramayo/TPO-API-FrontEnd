import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, getCategoryById } from '../../store/slices/categoriesSlice';
import { fetchDescuentos, createDescuento, updateDescuento, deleteDescuento, activarDescuento, desactivarDescuento } from '../../store/slices/descuentosSlice';

const DescuentosAdminPanel = ({ visible, onClose, fullPage }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const categorias = useSelector((state) => state.categories.items);
  const descuentos = useSelector((state) => state.descuentos.items);
  const loading = useSelector((state) => state.descuentos.loading);
  const error = useSelector((state) => state.descuentos.error);
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
  
  useEffect(() => {
    descuentos.forEach(d => {
      if (d.categoriaId && !categoriaPorId[d.categoriaId]) {
        dispatch(getCategoryById(d.categoriaId))
          .unwrap()
          .then(cat => setCategoriaPorId(prev => ({
            ...prev,
            [d.categoriaId]: cat.nombre
          })))
          .catch(() => setCategoriaPorId(prev => ({
            ...prev,
            [d.categoriaId]: 'Sin categoría'
          })));
      }
    });
    // eslint-disable-next-line
  }, [descuentos, dispatch]);

  useEffect(() => {
    if (visible && isAuthenticated && user?.token) {
      dispatch(fetchDescuentos(user.token));
      dispatch(fetchCategories());
    }
  }, [visible, user, isAuthenticated, dispatch]);

  const handleActivar = (id) => {
    dispatch(activarDescuento({ token: user.token, id }));
  };

  const handleDesactivar = (id) => {
    dispatch(desactivarDescuento({ token: user.token, id }));
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Eliminar este descuento?')) return;
    dispatch(deleteDescuento({ token: user.token, id }));
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
    setNuevo({
      codigo: '',
      porcentaje: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      montoMinimo: '',
      categoriaId: ''
    });
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

  if (!visible && !fullPage) return null;
  if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') return null;

  if (fullPage) {
    return (
      <div className="min-h-screen bg-cream-50 py-12 px-4">
        <div className="max-w-5xl mx-auto px-6 py-4 font-sans">
          <div className="flex justify-between items-center mb-6">
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

          <form onSubmit={handleCrear} className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs text-leather-700 mb-1">Código</label>
              <input type="text" value={nuevo.codigo} onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} className="w-full border p-1 rounded" required />
            </div>
            <div>
              <label className="block text-xs text-leather-700 mb-1">%</label>
              <input type="number" value={nuevo.porcentaje} onChange={e => setNuevo(n => ({ ...n, porcentaje: e.target.value }))} className="w-full border p-1 rounded" required min="1" max="100" />
            </div>
            <div>
              <label className="block text-xs text-leather-700 mb-1">Descripción</label>
              <input type="text" value={nuevo.descripcion} onChange={e => setNuevo(n => ({ ...n, descripcion: e.target.value }))} className="w-full border p-1 rounded" />
            </div>
            <div>
              <label className="block text-xs text-leather-700 mb-1">Fecha Inicio</label>
              <input type="date" value={nuevo.fechaInicio} onChange={e => setNuevo(n => ({ ...n, fechaInicio: e.target.value }))} className="w-full border p-1 rounded" />
            </div>
            <div>
              <label className="block text-xs text-leather-700 mb-1">Fecha Fin</label>
              <input type="date" value={nuevo.fechaFin} onChange={e => setNuevo(n => ({ ...n, fechaFin: e.target.value }))} className="w-full border p-1 rounded" />
            </div>
            <div>
              <label className="block text-xs text-leather-700 mb-1">Monto Mínimo</label>
              <input type="number" value={nuevo.montoMinimo} onChange={e => setNuevo(n => ({ ...n, montoMinimo: e.target.value }))} className="w-full border p-1 rounded" min="0" />
            </div>
            <div>
              <label className="block text-xs text-leather-700 mb-1">Categoría</label>
              <select value={nuevo.categoriaId} onChange={e => setNuevo(n => ({ ...n, categoriaId: e.target.value }))} className="w-full border p-1 rounded">
                <option value="">-- Seleccionar --</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} (ID: {c.id})</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-leather-800 text-white px-3 py-1 rounded hover:bg-leather-900 text-sm font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear"}
              </button>
            </div>
          </form>
          {loading ? <p className="text-leather-600">Cargando...</p> : null}
          {formError && <div className="text-red-500 mb-2">{formError}</div>}
          <ul className="divide-y divide-leather-100 bg-white rounded-lg border border-leather-200 mb-8">
            {descuentos.length === 0 && !loading && (
              <li className="py-4 text-leather-600 text-center">No hay descuentos registrados.</li>
            )}
            {descuentos.map(d => {
              const vigente = isVigente(d);
              const categoriaNombre =
                d.categoria && d.categoria !== ''
                  ? d.categoria
                  : d.categoriaId && categorias.length > 0
                  ? (categorias.find(cat => String(cat.id) === String(d.categoriaId))?.nombre ?? 'Sin categoría')
                  : 'Sin categoría';
              return (
                <li key={d.id} className="py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 px-4">
                  {editId === d.id ? (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                        <div className="flex flex-col">
                          <label className="text-xs text-leather-700 mb-1">Código</label>
                          <input className="border p-1 rounded w-24 bg-gray-200 cursor-not-allowed" value={editData.codigo} disabled />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-leather-700 mb-1">%</label>
                          <input className="border p-1 rounded w-16" type="number" value={editData.porcentaje} onChange={e => setEditData(ed => ({ ...ed, porcentaje: e.target.value }))} min="1" max="100" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-leather-700 mb-1">Descripción</label>
                          <input className="border p-1 rounded" value={editData.descripcion} onChange={e => setEditData(ed => ({ ...ed, descripcion: e.target.value }))} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-leather-700 mb-1">Fecha Inicio</label>
                          <input className="border p-1 rounded" type="date" value={editData.fechaInicio} onChange={e => setEditData(ed => ({ ...ed, fechaInicio: e.target.value }))} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-leather-700 mb-1">Fecha Fin</label>
                          <input className="border p-1 rounded" type="date" value={editData.fechaFin} onChange={e => setEditData(ed => ({ ...ed, fechaFin: e.target.value }))} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-leather-700 mb-1">Monto Mínimo</label>
                          <input className="border p-1 rounded w-24" type="number" min="0" value={editData.montoMinimo} onChange={e => setEditData(ed => ({ ...ed, montoMinimo: e.target.value }))} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-leather-700 mb-1">Categoría</label>
                          <select className="border p-1 rounded" value={editData.categoriaId} onChange={e => setEditData(ed => ({ ...ed, categoriaId: e.target.value }))}>
                            <option value="">-- Seleccionar --</option>
                            {categorias.map(c => (
                              <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <button className="text-green-700 font-bold hover:underline" onClick={handleEditSave}>Guardar</button>
                        <button className="text-leather-600 hover:underline" onClick={() => setEditId(null)}>Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col flex-1">
                        <span className="font-mono text-leather-800 bg-leather-100 px-2 py-1 rounded mb-1">{d.codigo}</span>
                        <span className="text-leather-700 text-sm mb-1">{d.descripcion}</span>
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
                        <span className="text-leather-700 text-sm">Porcentaje: {d.porcentaje}%</span>
                        <span className="text-leather-700 text-sm">Fecha Inicio: {d.fechaInicio ? d.fechaInicio.slice(0,10) : '-'}</span>
                        <span className="text-leather-700 text-sm">Fecha Fin: {d.fechaFin ? d.fechaFin.slice(0,10) : '-'}</span>
                        <span className="text-leather-700 text-sm">Monto Mínimo: ${d.montoMinimo ?? 0}</span>
                        <span className="text-leather-700 text-sm">
                          Categoría: <strong>
                            {
                              d.categoria
                                ? d.categoria
                                : d.categoriaId
                                  ? (categoriaPorId[d.categoriaId] || `ID: ${d.categoriaId}`)
                                  : 'Sin categoría'
                            }
                          </strong>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <button className="text-blue-700 hover:underline text-sm" onClick={() => handleEditClick(d)}>Editar</button>
                        {!d.activo && <button className="text-green-700 hover:underline text-sm" onClick={() => handleActivar(d.id)}>Activar</button>}
                        {d.activo && <button className="text-yellow-700 hover:underline text-sm" onClick={() => handleDesactivar(d.id)}>Desactivar</button>}
                        <button className="text-red-700 hover:underline text-sm" onClick={() => handleEliminar(d.id)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  const panelClass = 'mx-auto my-auto w-full max-w-lg bg-white border border-leather-200 rounded-lg shadow-lg p-8 animate-fade-in';

  return (
    <div className={panelClass}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-leather-800">Administrar Descuentos</h3>
        <button onClick={onClose} className="text-leather-600 hover:text-leather-900 text-2xl font-bold">✕</button>
      </div>
      <form onSubmit={handleCrear} className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs text-leather-700 mb-1">Código</label>
          <input type="text" value={nuevo.codigo} onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} className="w-full border p-1 rounded" required />
        </div>
        <div>
          <label className="block text-xs text-leather-700 mb-1">%</label>
          <input type="number" value={nuevo.porcentaje} onChange={e => setNuevo(n => ({ ...n, porcentaje: e.target.value }))} className="w-full border p-1 rounded" required min="1" max="100" />
        </div>
        <div>
          <label className="block text-xs text-leather-700 mb-1">Descripción</label>
          <input type="text" value={nuevo.descripcion} onChange={e => setNuevo(n => ({ ...n, descripcion: e.target.value }))} className="w-full border p-1 rounded" />
        </div>
        <div>
          <label className="block text-xs text-leather-700 mb-1">Fecha Inicio</label>
          <input type="date" value={nuevo.fechaInicio} onChange={e => setNuevo(n => ({ ...n, fechaInicio: e.target.value }))} className="w-full border p-1 rounded" />
        </div>
        <div>
          <label className="block text-xs text-leather-700 mb-1">Fecha Fin</label>
          <input type="date" value={nuevo.fechaFin} onChange={e => setNuevo(n => ({ ...n, fechaFin: e.target.value }))} className="w-full border p-1 rounded" />
        </div>
        <div>
          <label className="block text-xs text-leather-700 mb-1">Monto Mínimo</label>
          <input type="number" value={nuevo.montoMinimo} onChange={e => setNuevo(n => ({ ...n, montoMinimo: e.target.value }))} className="w-full border p-1 rounded" min="0" />
        </div>
        <div>
          <label className="block text-xs text-leather-700 mb-1">Categoría</label>
          <select value={nuevo.categoriaId} onChange={e => setNuevo(n => ({ ...n, categoriaId: e.target.value }))} className="w-full border p-1 rounded">
            <option value="">-- Seleccionar --</option>
            {categorias.length === 0 && (
              <option value="" disabled>No hay categorías disponibles</option>
            )}
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            className="bg-leather-800 text-white px-3 py-1 rounded hover:bg-leather-900 text-sm font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>
      {loading ? <p className="text-leather-600">Cargando...</p> : null}
      {formError && <div className="text-red-500 mb-2">{formError}</div>}
      <ul className="divide-y divide-leather-100 bg-white rounded-lg border border-leather-200 mb-8">
        {descuentos.length === 0 && !loading && (
          <li className="py-4 text-leather-600 text-center">No hay descuentos registrados.</li>
        )}
        {descuentos.map(d => {
          const vigente = isVigente(d);
          const categoriaNombre =
            d.categoria && d.categoria !== ''
              ? d.categoria
              : d.categoriaId && categorias.length > 0
              ? (categorias.find(cat => String(cat.id) === String(d.categoriaId))?.nombre ?? 'Sin categoría')
              : 'Sin categoría';
          return (
            <li key={d.id} className="py-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              {editId === d.id ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                    <div className="flex flex-col">
                      <label className="text-xs text-leather-700 mb-1">Código</label>
                      <input className="border p-1 rounded w-24 bg-gray-200 cursor-not-allowed" value={editData.codigo} disabled />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-leather-700 mb-1">%</label>
                      <input className="border p-1 rounded w-16" type="number" value={editData.porcentaje} onChange={e => setEditData(ed => ({ ...ed, porcentaje: e.target.value }))} min="1" max="100" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-leather-700 mb-1">Descripción</label>
                      <input className="border p-1 rounded" value={editData.descripcion} onChange={e => setEditData(ed => ({ ...ed, descripcion: e.target.value }))} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-leather-700 mb-1">Fecha Inicio</label>
                      <input className="border p-1 rounded" type="date" value={editData.fechaInicio} onChange={e => setEditData(ed => ({ ...ed, fechaInicio: e.target.value }))} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-leather-700 mb-1">Fecha Fin</label>
                      <input className="border p-1 rounded" type="date" value={editData.fechaFin} onChange={e => setEditData(ed => ({ ...ed, fechaFin: e.target.value }))} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-leather-700 mb-1">Monto Mínimo</label>
                      <input className="border p-1 rounded w-24" type="number" min="0" value={editData.montoMinimo} onChange={e => setEditData(ed => ({ ...ed, montoMinimo: e.target.value }))} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-leather-700 mb-1">Categoría</label>
                      <select className="border p-1 rounded" value={editData.categoriaId} onChange={e => setEditData(ed => ({ ...ed, categoriaId: e.target.value }))}>
                        <option value="">-- Seleccionar --</option>
                        {categorias.length === 0 && (
                          <option value="" disabled>No hay categorías disponibles</option>
                        )}
                        {categorias.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre} (ID: {c.id})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <button className="text-green-700 font-bold hover:underline" onClick={handleEditSave}>Guardar</button>
                    <button className="text-leather-600 hover:underline" onClick={() => setEditId(null)}>Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col flex-1">
                    <span className="font-mono text-leather-800 bg-leather-100 px-2 py-1 rounded mb-1">{d.codigo}</span>
                    <span className="text-leather-700 text-sm mb-1">{d.descripcion}</span>
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
                    <span className="text-leather-700 text-sm">Porcentaje: {d.porcentaje}%</span>
                    <span className="text-leather-700 text-sm">Fecha Inicio: {d.fechaInicio ? d.fechaInicio.slice(0,10) : '-'}</span>
                    <span className="text-leather-700 text-sm">Fecha Fin: {d.fechaFin ? d.fechaFin.slice(0,10) : '-'}</span>
                    <span className="text-leather-700 text-sm">Monto Mínimo: ${d.montoMinimo ?? 0}</span>
                    <span className="text-leather-700 text-sm">
                      Categoría: <strong>
                        {
                          d.categoria
                            ? d.categoria
                            : d.categoriaId
                              ? (categoriaPorId[d.categoriaId] || `ID: ${d.categoriaId}`)
                              : 'Sin categoría'
                        }
                      </strong>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <button className="text-blue-700 hover:underline text-sm" onClick={() => handleEditClick(d)}>Editar</button>
                    {!d.activo && <button className="text-green-700 hover:underline text-sm" onClick={() => handleActivar(d.id)}>Activar</button>}
                    {d.activo && <button className="text-yellow-700 hover:underline text-sm" onClick={() => handleDesactivar(d.id)}>Desactivar</button>}
                    <button className="text-red-700 hover:underline text-sm" onClick={() => handleEliminar(d.id)}>Eliminar</button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DescuentosAdminPanel; 