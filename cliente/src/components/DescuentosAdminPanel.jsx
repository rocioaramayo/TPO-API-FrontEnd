import { useEffect, useState } from 'react';

const DescuentosAdminPanel = ({ user, visible, onClose, fullPage }) => {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ codigo: '', porcentaje: '' });
  const [nuevo, setNuevo] = useState({ codigo: '', porcentaje: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (visible && user?.token) {
      setLoading(true);
      fetch('http://localhost:8080/descuentos', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setDescuentos(data))
        .catch(() => setError('Error al cargar descuentos'))
        .finally(() => setLoading(false));
    }
  }, [visible, user]);

  const handleActivar = (id) => {
    fetch(`http://localhost:8080/descuentos/${id}/activar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al activar descuento');
        setDescuentos(descs => descs.map(d => d.id === id ? { ...d, activo: true } : d));
      })
      .catch(e => setError(e.message));
  };

  const handleDesactivar = (id) => {
    fetch(`http://localhost:8080/descuentos/${id}/desactivar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al desactivar descuento');
        setDescuentos(descs => descs.map(d => d.id === id ? { ...d, activo: false } : d));
      })
      .catch(e => setError(e.message));
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Eliminar este descuento?')) return;
    fetch(`http://localhost:8080/descuentos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar descuento');
        setDescuentos(descs => descs.filter(d => d.id !== id));
      })
      .catch(e => setError(e.message));
  };

  const handleEditClick = (d) => {
    setEditId(d.id);
    setEditData({ codigo: d.codigo, porcentaje: d.porcentaje });
  };

  const handleEditSave = () => {
    fetch(`http://localhost:8080/descuentos/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(editData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al editar descuento');
        setDescuentos(descs => descs.map(d => d.id === editId ? { ...d, ...editData } : d));
        setEditId(null);
      })
      .catch(e => setError(e.message));
  };

  const handleCrear = (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    fetch('http://localhost:8080/descuentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(nuevo)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al crear descuento');
        return res.json();
      })
      .then(creado => {
        setDescuentos(descs => [creado, ...descs]);
        setNuevo({ codigo: '', porcentaje: '' });
      })
      .catch(e => setError(e.message))
      .finally(() => setCreating(false));
  };

  if (!visible && !fullPage) return null;
  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  const panelClass = fullPage
    ? 'w-full max-w-2xl mx-auto bg-white border border-leather-200 rounded-lg shadow-lg p-8 animate-fade-in'
    : 'mx-auto my-auto w-full max-w-lg bg-white border border-leather-200 rounded-lg shadow-lg p-8 animate-fade-in';

  return (
    <div className={panelClass}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-leather-800">Administrar Descuentos</h3>
        <button onClick={onClose} className="text-leather-600 hover:text-leather-900 text-2xl font-bold">✕</button>
      </div>
      <form onSubmit={handleCrear} className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs text-leather-700 mb-1">Código</label>
          <input type="text" value={nuevo.codigo} onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} className="w-full border p-1 rounded" required />
        </div>
        <div className="w-20">
          <label className="block text-xs text-leather-700 mb-1">%</label>
          <input type="number" value={nuevo.porcentaje} onChange={e => setNuevo(n => ({ ...n, porcentaje: e.target.value }))} className="w-full border p-1 rounded" required min="1" max="100" />
        </div>
        <button type="submit" disabled={creating} className="bg-leather-800 text-white px-3 py-1 rounded hover:bg-leather-900 text-sm font-medium disabled:opacity-50">{creating ? 'Creando...' : 'Crear'}</button>
      </form>
      {loading ? <p className="text-leather-600">Cargando...</p> : null}
      {error ? <p className="text-red-600 text-sm mb-2">{error}</p> : null}
      <ul className="divide-y divide-leather-100 max-h-64 overflow-y-auto">
        {descuentos.length === 0 && !loading && (
          <li className="py-4 text-leather-600 text-center">No hay descuentos registrados.</li>
        )}
        {descuentos.map(d => (
          <li key={d.id} className="py-2 flex items-center justify-between gap-2">
            {editId === d.id ? (
              <>
                <input className="border p-1 rounded mr-2 w-24" value={editData.codigo} onChange={e => setEditData(ed => ({ ...ed, codigo: e.target.value }))} />
                <input className="border p-1 rounded mr-2 w-16" type="number" value={editData.porcentaje} onChange={e => setEditData(ed => ({ ...ed, porcentaje: e.target.value }))} />
                <button className="text-green-700 font-bold mr-2 hover:underline" onClick={handleEditSave}>Guardar</button>
                <button className="text-leather-600 hover:underline" onClick={() => setEditId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <div className="flex flex-col flex-1">
                  <span className="font-mono text-leather-800 bg-leather-100 px-2 py-1 rounded mb-1">{d.codigo}</span>
                  <span className="text-leather-700 text-sm">{d.porcentaje}%</span>
                  <span className={`text-xs px-2 py-1 rounded w-fit mt-1 ${d.activo ? 'bg-green-100 text-green-700' : 'bg-leather-200 text-leather-700'}`}>{d.activo ? 'Activo' : 'Inactivo'}</span>
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
        ))}
      </ul>
    </div>
  );
};

export default DescuentosAdminPanel; 